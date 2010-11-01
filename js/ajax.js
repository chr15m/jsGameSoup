function MakeRequest(url, caller, timeout)
{
	var http_request = false;
	var requestComplete = false;
	if (typeof(timeout) == "undefined") timeout=30;
	
	// Create the XML RPC object
	if (window.XMLHttpRequest) // Free browsers
	{
		http_request = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) // Internet explorer
	{
		http_request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	// When we receive a message back from an XML RPC request
	http_request.onreadystatechange = function()
	{
		if (typeof http_request != "undefined")
		{
			// reponse 4 = 'request complete'
			if (http_request.readyState == 4)
			{
				response = http_request.responseText
				if (response != "")
				{
					caller.ajaxcomplete(response, http_request);
				}
				requestComplete = true;
			}
		}
		else
		{
			http_request = false;
			requestComplete = true;
		}
	};
	
	// asynchronous request
	http_request.open("GET", url, true);
	http_request.send(null);
	
	// make sure we cancel everything if we reach the timeout
	setTimeout(function() {
		if (http_request.readyState != 4) {
			http_request = false;
			requestComplete = true;
			caller.ajaxtimeout();
		}
	}, timeout);
};

