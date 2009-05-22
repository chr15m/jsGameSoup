/*
 *	The function of this code is to periodically check for and load
 *      javascript code from external URLs which are sitting in a queue.
 *	This is in order to inject code into an already running JS engine.
 */

function CodeRefresher()
// the queue of URLs from where we should fetch new code
this.refreshCodeQueue = [];
// number of milliseconds between checks for new code URLs to load from
this.refreshCodeTimeout = 10000;

// regularly fetch new code from our remote location, to run
this.update = function update() {
	try {
		while (refreshCode.length) {
			$.getScript("http://txtfish.mccormick.cx/view/cQSvTI/", function(){
				setTimeout("refreshCode();", refreshCodeTimeout);
			});
		}
	} catch(err) {
		log(err);
	}
}

