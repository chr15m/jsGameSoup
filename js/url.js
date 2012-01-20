/**
	@class Parse URLs and query strings
	@param url is the URL you would like to extract information from.
*/

/*
	PHP style:

    [scheme] => http
    [host] => hostname
    [port] => 2344
    [user] => username
    [pass] => password
    [path] => /path
    [query] => arg=value
    [fragment] => anchor
*/
function URL(url) {
	// inspired by some of the RegExp found here: http://rodneyrehm.de/t/url-regex.html
	// The raw array of data extracted from the URL passed in.
	var exploded = (new RegExp(/^(.*):\/\/((.*?)(:(.*?))@){0,1}([^/$.?#].[^\s]*?){0,1}(:(\d+)){0,1}([\/].*?){0,1}([\?].*?){0,1}([#](.*)){0,1}$/i)).exec(url);
	
	/** Object containing an associative array of the components extracted from the URL (scheme, host, port, user, pass, path, hash, (raw) querystring). */
	this.components = {
		"scheme": exploded[1] || null,
		"host": exploded[6] || null,
		"port": exploded[8] ? parseInt(exploded[8]) : null,
		"user": exploded[3] || null,
		"pass": exploded[5] || null,
		"path": exploded[9] || null,
		"hash": exploded[12] || null,
		"querystring": exploded[10] || null
	}
	
	// make the components accessible on the URL object
	var c  = this.components;
	/** URL scheme - "http", "https", "ftp", etc. */
	this.scheme = c["scheme"];
	/** Host domain of the URL - "google.com", "jsgamesoup.net" etc. */
	this.host = c["host"];
	/** Port the URL is accessing - 80, 8080, etc. */
	this.port = c["port"];
	/** HTTP auth username accessing this URL. */
	this.user = c["user"];
	/** HTTP auth password accessing this URL. */
	this.pass = c["pass"];
	/** Full path to the resource at the server - "/my/document/here.html" */
	this.path = c["path"];
	/** Hash anchor tag appended to this URL. - "myanchor" */
	this.hash = c["hash"];
	/** Raw query string. Use the get() method on the URL object to retrive individual values. */
	this.querystring = c["querystring"];
	
	// perform the extraction of the query string
	// query string key value store
	var qs = {};
	// original idea & RegExp from here:
	// http://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
	if (exploded[10]) {
		exploded[10].replace(
			new RegExp("([^?=&]+)(=([^&]*))?", "g"),
			function(whole, k, inc, v) {
				var val = unescape(v);
				// we already have this key defined
				if (qs[k]) {
					// is it already an array? just add our new element
					if (typeof(qs[k]) == typeof([])) {
						qs[k].push(val);
					} else {
						// create the array with our old and new values
						qs[k] = [qs[k], val];
					}
				} else {
					qs[k] = val;
				}
			}
		);
	}
	
	/** Key/value store of the parsed query string. Multiple keys of the same value will result in an array. */
	this.query = qs;
	
	/** @method
		Returns the parsed query string value for a particular key.
		@param key is the key to search on.
		@return the value corresponding to that key. If there are multiple values for any key this will yield and array.
	*/
	this.get = function(key) {
		if (key in qs) {
			return qs[key];
		} else {
			return null;
		}
	}
}
