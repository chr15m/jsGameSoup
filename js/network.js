/** provides simple abstract network interfaces for Javascript games. */
network = {};

/** Make a single ajax request. The caller object should support the callback methods network_request_complete(response, http_request) and network_timeout(http_request), where http_request is the standard xml http request object. The default timeout is 30000 milliseconds. */
network.makeRequest = function(url, caller, type, data, timeout) {
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
					if (caller.network_request_complete)
						caller.network_request_complete(response, http_request);
				}
				requestComplete = true;
			}
		} else {
			http_request = false;
			requestComplete = true;
		}
	};
	
	// asynchronous request
	http_request.open(type, url, true);
	
	// if this is a post, send required headers
	if (type == "POST") {
		http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http_request.setRequestHeader("Content-length", data.length);
	}
	
	http_request.send(data);
	
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

/** Loads an array of urls and calls progresscallback(urls_left, received) each time a file has finished loading. The value in urls_left is the number of urls still to be loaded, whilst received is an associative array where the key is the url, and the value is the content at that url. */
network.bulkLoad = function(urls, progresscallback, timeoutcallback, timeout) {
	var loadcount = urls.length - 1;
	var received = {};
	for (var i=0; i<urls.length; i++) {
		network.makeRequest(urls[i], {
			"network_request_complete": function (response) {
				received[urls[i]] = response;
				loadcount -= 1;
				if (progresscallback)
					progresscallback(urls.length - loadcount - 1, received);
			},
			"network_timeout": timeoutcallback,
		}, timeout);
	}
}

// cross platform JSON.parse() support (could be dangerous on platforms without json)
// TODO: find a less dangerous way to do this on platforms without it
if (!JSON) {
	var JSON = {
		"parse": function(xxx) {
			var json=null;
			eval("json = " + xxx);
			return json;
		},
		"stringify": function(xxx) {
			return "" + xxx;
		}
	}
}

/** Register some objects to send and receive network data and events automatically, as fast as they will go. Entities should push data to the server by calling the send(data) method to queue up messages for the server, or else the state(state_id, data) to maintain some state information on the server side. In both cases data is arbitrary and serialiseable as JSON, and state_id is a unique ID which identifies the particular state (might be the entity's own internal id for example).
	
	@param url is the location to make the network calls to.
	@param entities is an array that contains the entities who want to send and receive their network data.
	@param failcallback gets called if there is a network timeout when connecting to the url.
	@param errorcallback gets called if the server sends through an error in JSON format.
*/

network.serverConnection = function(url, entities, failcallback, errorcallback) {
	// whether or not the connection is running
	var run = true;
	// if a request is in progress or not
	var request_in_progress = false;
	// closure version of me for the callbacks
	var cls = this;
	// message queue which we will use to store data to be sent to the server
	var queue = [];
	// list of entity states
	var states = {};
	// whether to print out all traffic
	this.debug = false;
	
	/** start the request loop - happens automatically */
	this.go = function() {
		request_in_progress = true;
		// assemble the outgoing data by pushing all state data into the send queue
		for (var e in states) {
			if (states.hasOwnProperty(e)) {
				queue.push(states[e]);
			}
		}
		// make the actual ajax request
		network.makeRequest(url, this, "POST", "data=" + escape(JSON.stringify(queue)), 10000);
		// reset the send queue and states dictionary
		queue = [];
		states = {};
	}
	
	/** This method should be called repeatedly in order to maintain the server connection. This will happen if you add it as a jsGameSoup entity. */
	this.update = function() {
		if (!request_in_progress && run) {
			console.log('hi');
			this.go();
		}
	}
	
	// when the request comes back we want to initiate another one asap to keep the information flowing
	this.network_request_complete = function(response) {
		if (run) {
			// parse the response and deal with the incoming data
			var result = JSON.parse(response);
			// debug - print out results
			if (this.debug && result && result.length) console.log(result);
			// if this is a special debug error message, pass to errorcallback()
			if (result.error && errorcallback) {
				errorcallback(result.error);
				run = false;
			} else {
				// array of packets
				for (p in result) {
					var packet = result[p];
					// find the entities who are filtering for this packet
					for (e in entities) {
						// look through each filter of the current entity
						for (f in entities[e].network_filter) {
							// if the filter matches, send this data to the entity
							if (packet[f] == entities[e].network_filter[f]) {
								// if the packet contains a method directive, use that
								// otherwise use the generic network_data(packet) method
								if (packet.method) {
									entities[e][packet.method](packet);
								} else {
									entities[e].network_data(packet);
								}
							}
						}
					}
				}
			}
		}
		request_in_progress = false;
	}
	
	// callback happens when there is a network timeout
	this.network_timeout = function() {
		run = false;
		failcallback();
	}
	
	/** stop the ajax request loop */
	this.stop = function() {
		run = false;
	}
	
	/** Call this to queue up data to be sent down the pipe. */
	this.send = function(data) {
		queue.push(data);
	}
	
	/** Call this to update the states table */
	this.state = function(state_id, data) {
		states[state_id] = data;
	}
}
