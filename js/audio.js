/**	@class Provides a way to load and play back .wav file sound effects.
	@description Load chunks of audio and play them by name. Only .wav files are really supported on all browsers. You could try .mp3 or .ogg but they probably won't work on all browsers. There is no way to get progress feedback on whether sounds are loaded yet, sorry, so use short sounds. Google 'sfxr' for an excellent sound effects generator.
*/
//	http://stackoverflow.com/questions/3652005/hearing-an-echo-while-playing-mp3
function AudioManager() {
	var samples = {};
	
	/**
		Load a sample to play later.
		@param url is the path to the file to load.
		@param name is optional and is used to identify your sample for playing. If not supplied the filename minus the extension will be used.
	*/
	this.load = function(url, name) {
		if (arguments.length == 1) {
			name = url.split("/").slice(-1)[0].split(".").slice(0, -1).join(".");
		}
		if (typeof Audio == "undefined") {
			var em = document.createElement('embed');
			if( em != null ) {
				// var embed=document.createElement('object');
				// embed.setAttribute('type','audio/wav');
				// embed.setAttribute('data', 'c:\test.wav');
				// embed.setAttribute('autostart', true);
				//document.getElementsByTagName('body')[0].appendChild(embed);
				
				// TODO:
				// .addEventListener('load',foo,false);
				// .attachEvent('load',foo,false);
				
				em.setAttribute("width","0");
				em.setAttribute("height","0");
				em.setAttribute("hidden","true");
				em.setAttribute("autostart", false);
				em.setAttribute("enablejavascript", true);
				// argh none of these work in IE6 :(
				//em.setAttribute("onload", function() { alert('hi'); });
				//em.onload = function() { alert("loaded: " + url);};
				//em.onloadeddata = function() { alert("loaded: " + url);};
				//em.attachEvent("onload", function() { alert("xxx"); });
				em.setAttribute("src", url);
				em._play = function() { em.Play(); };
				document.body.appendChild(em);
				samples[name] = em;
			}
		// see if phonegap is available to play sound on Android
		} else if (window["PhoneGap"] && window["device"] && device.platform == "Android") {
			var au = new Media("/android_asset/www/" + url);
			au._play = function() {	au.play(); };
			samples[name] = au;
		} else {
			var au = new Audio();
			/*console.log(au.canPlayType("audio/mpeg"));
			console.log(au.canPlayType("audio/ogg"));
			console.log(au.canPlayType("audio/wav"));*/
			
			// argh none of these work in webkit :(
			// firefox works fine though
			
			// TODO: try "loaded" and "load" as event names
			
			//au.onload = function() { alert("onload: " + url);};
			//au.onloadeddata = function() { alert('onloadeddata: ' + url); };
			//au.oncanplay = function() { alert('oncanplay: ' + url); };
			//au.addEventListener("onloadeddata", function() { alert('yes'); }, false);
			//au.addEventListener("onload", function() { alert('yes'); }, false);
			//au.onreadystatechange = function() { alert('p'); };
			au.src = url;
			//au.load();
			// sneaky multi-channel playing hack
			au._play = function() {
				var x = new Audio();
				x.src = au.src;
				x.play();
			};
			samples[name] = au;
		}
	}
	
	/**
		Play a sound.
		@param name identifies which sound to play.
	*/
	this.play = function(name) {
		if (samples[name]) {
			samples[name]._play();
		} else {
			if (typeof console != "undefined") {
				console.log("No such sound: " + name);
			} else {
				alert("No such sound: " + name);
			}
		}
	}
}
