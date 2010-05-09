// from http://ajaxpatterns.org/On-Demand_Javascript

/** Include an external javascript file. **/
function include(url, callback) {
	var callback = callback;
	var head = document.getElementsByTagName("head")[0];
	script = document.createElement('script');
	// script.id = '';
	script.type = 'text/javascript';
	script.src = url;
        script.onload = function () { callback(url); }
	head.appendChild(script);
}
