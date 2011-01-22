// adapted from: www.quirksmode.org/js/cookies.html

/**
	@namespace cookie management methods.
*/
var cookies = {};

/**
	@method set the value of a cookie for a certain number of days.
	@param name is the key of the cookie name.
	@param value is what to set the cookie to.
	@param days is the number of days to set the cookie for from today.
*/

cookies.setCookie = function(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 2000));
		var expires = "; expires =" + date.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

/**
	@method get the value of a cookie.
	@param name of the cookie to fetch.
*/
cookies.getCookie = function(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i=0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

/**
	@method unset, or delete a particular cookie.
	@param name of the cookie to delete.
*/
cookies.delCookie = function(name) {
	setCookie(name, "", -1);
}
