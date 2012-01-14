/*
 *	jsGameSoup Multiplayer Client
 *	Copyright 2009-2011 Chris McCormick
 *	
 *	AGPL version 3 (see COPYING for details)
 * 
 * 	Note: this depends upon json2.js on platforms that don't have JSON.stringify()
 *	
 */

// check for JSON and barf if not found. Probably you will be using IE if this happens.
if (typeof(JSON) == "undefined" || typeof(JSON.stringify) == "undefined" || typeof(JSON.parse) == "undefined") {
	alert("JSON.stringify() not found. Try https://raw.github.com/douglascrockford/JSON-js/master/json2.js");
};

var isIE = navigator.userAgent.indexOf("MSIE") != -1;
/** Client side code for the multiplayer server. **/

var multiplayer = {
	"connect": function(seturl) {
		var _mlt = new this.MultiplayerClient();
		_mlt.connect(seturl);
		return _mlt;
	}
}

multiplayer.MultiplayerClient = function() {
	var url = null;
	var id = null;
	var me = this;
	var callbacks = {};
	
	/** Start up a new connection to the server. */
	this.connect = function(seturl) {
		// default URL is where our server is
		url = seturl || document.location.href.split("/").slice(0, -1).join("/") + "/c";
		
		var me = this;
		// make the ID request first
		multiplayer.makeRequest(url + "/id", function(data) {
			// now we have a unique client ID
			id = data;
			// success callback - now start polling
			me.call("connected");
			// start the long-polling loop
			me.poll();
		}, function() {
			// timeout callback - initial connection failed
			me.timeout();
		});
		
		return this;
	}
	
	this.disconnected = function() {
		url = null;
		id = null;
		this.call("disconnected");
	}
	
	this.timeout = function() {
		url = null;
		id = null;
		this.call("timeout");
	}
	
	this.get_id = function() {
		return id;
	}
	
	// close, timeout, connect
	this.on = function(name, callback) {
		callbacks[name] = callback;
	}
	
	/** Broadcast some data to all other connected clients. */
	this.broadcast = function(tag, data, callback, failcallback) {
		if (id && url) {
			var me = this;
			// make a POST request to send some data
			multiplayer.makeRequest(url + "/broadcast/" + id, function(received) {
				if (received == "true") {
					// run the success callback if they gave us one
					if (callback) callback();
				} else {
					if (failcallback) failcallback(received);
					me.disconnected();
				}
			}, function() {
				// our send timed out
				me.timeout();
			}, "POST", "p=" + JSON.stringify({"tag": tag, "payload": data}));
		} else {
			this.disconnected();
		}
	}
	
	this.set_state = function(state, callback, failcallback) {
		if (id && url) {
			var me = this;
			// make a POST request to send some data
			multiplayer.makeRequest(url + "/state/" + id, function(received) {
				if (received == "true") {
					// run the success callback if they gave us one
					if (callback) callback();
				} else {
					if (failcallback) failcallback(received);
					me.disconnected();
				}
			}, function() {
				// our send timed out
				me.timeout();
			}, "POST", "p=" + JSON.stringify(state));
		} else {
			this.disconnected();
		}
	}
	
	this.call = function(name, args) {
		if (typeof(callbacks[name]) != "undefined") {
			callbacks[name](args);
		}
	}
	
	// continually long-polls the server for new data
	this.poll = function() {
		if (id && url) {
			var me = this;
			// make the ID request first
			multiplayer.makeRequest(url + "/poll/" + id, function(data) {
				//console.log("POLL: " + data);
				if (data == "false") {
					// the server told us we have an invalid clientID - start again
					me.disconnected();
				} else {
					var raw = JSON.parse(data);
					if (raw) {
						for (var p=0; p<raw.length; p++) {
							//console.log("RAW:");
							//console.log(raw[p].id);
							//console.log(raw[p]);
							// if this message didn't come from us originally
							if (raw[p] && raw[p].id != id) {
								if (raw[p].type == "broadcast") {
									// call the method of each signature from the array of incoming data
									me.call(raw[p].tag, {"id": raw[p].id, "payload": raw[p].payload});
								} else if (raw[p].type == "client_state") {
									me.call("client_state", raw[p]);
								} else if (raw[p].type == "client_disconnected") {
									me.call("client_disconnected", raw[p].id);
								} else if (raw[p].type == "client_left") {
									me.call("client_left", raw[p].id);
								} else {
									console.log("Dropped message: " + raw[p]);
								}
							}
						}
					}
					// start a new poll - doing it in a setTimeout prevents stackoverflow on IE
					setTimeout(function() { me.poll(); }, 0);
				}
			}, function() {
				// timeout callback - initial connection failed
				me.timeout();
			});
		} else {
			console.log("poll - Not connected, discontinuing.");
		}
	}
}

/**
	Make a single ajax request. Returns the request object. The default timeout is 30000 milliseconds. 
	@param url is where to fetch data from.
	@param callback gets called when the data arrives, taking arguments (response_data, http_request)
	@param type is GET or POST (note that this may default to POST if any data is passed)
	@param data is an associative array of data to send
	@param timeout is how long in milliseconds to wait before registering a network request as failed.
	@param timeout_callback gets called when
*/
multiplayer.makeRequest = function(url, callback, timeout_callback, type, data, timeout) {
	var http_request = false;
	var requestComplete = false;
	if (!timeout) timeout=30000;
	if (!type) type = "GET";
	if (!data) data = null;
	
	// Create the XML RPC object
	if (window.XMLHttpRequest) {
		http_request = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {
		// Internet explorer
		http_request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	// When we receive a message back from an XML RPC request
	http_request.onreadystatechange = function() {
		if (typeof http_request != "undefined")	{
			// reponse 4 = 'request complete'
			if (http_request.readyState == 4) {
				response = http_request.responseText
				if (response != "") {
					if (callback)
						callback(response, http_request);
				}
				requestComplete = true;
			}
		} else {
			http_request = false;
			requestComplete = true;
		}
	};
	
	// annoying hack to make IE not cache stuff stupidly, gah i hate you IE
	if (isIE) {
		url += ((url.indexOf("?") == -1 ? "?" : "&") + "uniq=" + Math.random());
	}
	// asynchronous request
	http_request.open(type, url, true);
	
	// if this is a post, send required headers
	if (type == "POST") {
		http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	
	// ie6 will default to post if any argument is passed
	if (data) {
		http_request.send("" + data);
	} else {
		http_request.send();
	}
	
	// make sure we cancel everything if we reach the timeout
	setTimeout(function() {
		if (http_request.readyState != 4) {
			if (caller.network_timeout)
				caller.network_timeout(http_request, this);
			http_request = false;
			requestComplete = true;
		}
	}, timeout);
};
