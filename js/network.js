/** 
	@namespace
	Provides an interface for making ajax requests, and for bulk loading data from a set of URLs, e.g. level or tile data.
*/
network = {};

/**
	Make a single ajax request. Returns the request object. The default timeout is 30000 milliseconds. 
	@param url is where to fetch data from.
	@param callback gets called when the data arrives, taking arguments (response_data, http_request).
	@param timeout_callback gets called when the request times out.
	@param type is GET or POST (note that this may default to POST on some platforms if data is passed).
	@param data is an associative array of data to send (optional).
	@param timeout is how long in milliseconds to wait before registering a network request as failed (and calling timeout_callback).
*/
network.makeRequest = function(url, callback, timeout_callback, type, data, timeout) {
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
	
	// asynchronous request
	http_request.open(type, url, true);
	
	// if this is a post, send required headers
	if (type == "POST") {
		http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http_request.setRequestHeader("Content-length", ("" + data).length);
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
			if (timeout_callback)
				timeout_callback(http_request, this);
			http_request = false;
			requestComplete = true;
		}
	}, timeout);
};

/**
	Bulk load data, e.g. tile or level data, from urls. Loads an array of urls and calls progresscallback(number_of_urls_left, data_received, url, all_data_loaded_from_all_calls) each time a url has finished loading. The value in number_of_urls_left is the number of urls still to be loaded, whilst data_received is the actual data loaded from a url, and url is that url. Finally, received is an associative array where the key is the url, and the value is the content at that url.
	@param urls is an array of urls to fetch
	@param progresscallback is called each time a url is successfully fetched - see above for the meaning of the arguments.
	@param timeoutcallback is called if a request times out.
	@param timeout is the number of milliseconds to wait before timing out the request.
*/
network.bulkLoad = function(urls, progresscallback, timeoutcallback, timeout) {
	var loadcount = 0;
	var received = {};
	for (var i=0; i<urls.length; i++) {
		// construct the closure protected version of the callback function
		var callbackfunc = function(inc) {
			return function (response) {
				received[urls[inc]] = response;
				loadcount += 1;
				if (progresscallback)
					progresscallback(urls.length - loadcount, response, urls[inc], received);
			}
		}(i);
		network.makeRequest(urls[i], callbackfunc, timeoutcallback, timeout);
	}
}

