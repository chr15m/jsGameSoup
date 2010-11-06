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
	JSON = {
		"parse": function(xxx) {
			var json=null;
			eval("json = " + xxx);
			return json;
		}
	}
}

/** Register some objects to send and receive network data and events automatically, as fast as they will go.
	@param url is the location to make the network calls to.
	@param entities is an array that contains the entities who want to send and receive their network data.
	@param failcallback gets called if there is a network timeout when connecting to the url.
*/
network.serverConnection = function(url, entities, failcallback) {
	// whether or not the connection is running
	var run = true;
	// closure version of me for the callbacks
	var cls = this;
	
	this.go = function() {
		// assemble the outgoing data
		network.makeRequest(url, this, "POST", "data=[1]", 10000);
	}
	
	this.network_request_complete = function(response) {
		if (run) {
			// parse the response and deal with the incoming data
			console.log(response);
			cls.go();
		}
	}
	
	this.network_timeout = function() {
		run = false;
		failcallback();
	}
	
	this.stop = function() {
		run = false;
	}
	
	// launch the very first request
	this.go();
}
