jsGameSoup v173
--------------

A Free Software framework for making games for the web using Javascript and HTML5. Abstract away some of the complexity of developing Javascript games for multiple browsers. Currently runs under new versions of Firefox (Gecko), Safari/Chrome (WebKit), and Internet Explorer 6 and higher. Does not require any proprietary technologies like Flash or Silverlight.

[Download jsGameSoup v173](http://mccormick.cx/projects/jsGameSoup/jsGameSoup-v173.zip) - jump down to the quickstart section to dive in.

![FallingGame screenshot](http://mccormick.cx/projects/jsGameSoup/screenshots/FallingGame.png)

 * [Blog](http://mccormick.cx/news/tags/jsgamesoup)
 * [Mailing list](http://groups.google.com/group/jsgamesoup)

Copyright Chris McCormick, 2009-2011, and is LGPL licensed. Please see the file [COPYING](http://mccormick.cx/projects/jsGameSoup/COPYING) for details.

[Using jsGameSoup for your game? Hire me as a consultant.](mailto:chris@mccormickit.com)

Batteries included
------------------

 * Cross browser event handling (keyboard, mouse, touch)
 * Game entity management
 * Sprite management [sprite.js](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/Sprite.html)
 * Sound effects playback with [audio.js](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/AudioManager.html)
 * Rudimentary polygon, box, circle collision detection [collisions.js](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/collide.html)
 * Fast, deterministic random number generator [random.js](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/SeedableRandom.html)
 * Simple AJAX and bulk data loading with [network.js](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/network.html)
 * Basic cookie management [cookies.js](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/cookies.html)
 * Optional auto-init to launch code attached to HTML canvases

Suggested companion libraries
-----------------------------

In an effort to keep this library minimal and focused on making games, here are some excellent 3rd party libraries and frameworks providing functionality you might need that is not included in jsGameSoup. Wherever possible these are single-file Javascript libraries that can just be dropped into your project along side jsGameSoup.

 * Vector and matrix math - [sylvester.js](http://sylvester.jcoglan.com/) (see the demo below)
 * Server side and/or multiplayer code [Node.js + socket.io](http://socket.io/)
 * 2D physics - [box2d.js](http://box2d-js.sourceforge.net/) (see the demo below)
 * Basic Ajax/network calls - [XMLHttpRequest.js](http://code.google.com/p/xmlhttprequest/)
 * Cookie management - [cookies-js](http://code.google.com/p/cookie-js/source/browse/trunk/cookie.js) or [roll your own](http://www.quirksmode.org/js/cookies.html)

![AsteroidsTNG screenshot](http://mccormick.cx/projects/jsGameSoup/screenshots/AsteroidsTNG.png)

Download
--------

[Zipfile of jsGameSoup v173](http://mccormick.cx/projects/jsGameSoup/jsGameSoup-v173.zip)

You probably also want one of the following for Internet Explorer compatibility:

 * [excanvas.js](http://explorercanvas.googlecode.com/svn/trunk/excanvas.js) from the [excanvas homepage](http://code.google.com/p/explorercanvas/) for pure Javascript compatibility, but it's a bit slower.
 * [FlashCanvas](http://flashcanvas.net/download) which provides better performance but depends upon the proprietary Flash plugin.

See the Internet Explorer compatability section below for instructions on getting your jsGameSoup game to work in Internet Explorer 6 and higher.

Source code
-----------

Contribute or get the latest version of the code using [bazaar](http://bazaar-vcs.org/):

	bzr co http://mccormick.cx/dev/jsgamesoup/

Or check the [Google Code page](http://code.google.com/p/jsgamesoup/) for the SVN repository.

Or check the [Github page](https://github.com/chr15m/jsGameSoup) for the git repository.


[Patches welcome](mailto:chris@mccormick.cx)!

Documentation
-------------

 * [All jsGameSoup API documentation](http://mccormick.cx/projects/jsGameSoup/jsdocs)
   * [Sprite class](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/Sprite.html)
   * [AudioManager class](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/AudioManager.html)
   * [Collision API](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/collide.html)
   * [Seedable random number generator](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/SeedableRandom.html)
   * [Cookie handling](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/cookies.html)
   * [Network/ajax/bulkLoad request API](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/network.html)
 * [JSGameSoup engine class](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/JSGameSoup.html)
 * [Reference implementation of a jsGameSoup entity](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/ExampleEntity.html)
 * [Simple jsGameSoup example game](http://mccormick.cx/projects/jsGameSoup/jsdocs/symbols/src/example-game.js.html)
 * [Canvas cheatsheet](http://www.nihilogic.dk/labs/canvas_sheet/HTML5_Canvas_Cheat_Sheet.png)
 * [Canvas tag documentation](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#the-canvas-element)

Demos
-----

 * [AsteroidsTNG](http://mccormick.cx/dev/blogref/AsteroidsTNG/)
 * [FallingGame](http://mccormick.cx/dev/blogref/FallingGame/)
 * [Box2d.js physics demo](http://mccormick.cx/projects/jsGameSoup/demos/box2d)
 * [sylvester.js vector demo](http://mccormick.cx/projects/jsGameSoup/demos/vector-math-sylvester)
 * [Playing audio](http://mccormick.cx/projects/jsGameSoup/demos/audio.html)
 * [Demos page here](http://mccormick.cx/projects/jsGameSoup/demos)
 * [Not very well maintained test suite](http://mccormick.cx/projects/jsGameSoup/tests)

![FallingGame screenshot](http://mccormick.cx/projects/jsGameSoup/screenshots/Numbeat.png)

Quick Start
-----------

Start in an empty working directoy. First get the jsGameSoup source in a sub-directory called 'jsGameSoup'.

Now create a file called index.html that will contain a basic HTML page, with a window-filling div tag that will become our game canvas.

	<html>
	<head>
		<script src="jsGameSoup/js/jsgamesoup.js"></script>
		<script src="main.js"></script>
	</head>
	<style>
		html, body {
			margin: 0px;
			padding: 0px;
			overflow: hidden;
		}
		div {
			width: 100%;
			height: 100%;
			position: absolute;
			top: -1px;
			left: -1px;
		}
	</style>
	<body onload='startGame()'>
		<div id='surface'></div>
	</body>
	</html>

Now edit main.js with a little test code to get you started:

	function Dot(gs) {
		var x = gs.width * 0.5;
		var y = gs.height * 0.5;
		var r = gs.width * 0.1;
		
		this.update = function() {
			x += gs.width * 0.01 * (Math.random() - 0.5);
			y += gs.height * 0.01 * (Math.random() - 0.5);
		}
		
		this.draw = function(c) {
			c.fillRect(x - r / 2, y - r / 2, r, r);
		}
	}
	
	function startGame() {
		var surface = document.getElementById("surface");
		var gs = new JSGameSoup(surface, 30);
		gs.addEntity(new Dot(gs));
		gs.launch();
	}

When you visit index page now you should see a black square wiggling about. The main component of the framework is the `JSGameSoup()` object, which is the engine of the system. You add your game entities to it with the `addEntity()` method as above. Entities should have an `update()` method and a `draw()` method, which accepts a canvas context as an argument. You can use the canvas context to draw your entities.

### Internet Explorer compatibility ###

To make your jsGameSoup game run under Internet Explorer 6 and above, you can use the ExplorerCanvas library (pure Javascript) or the FlashCanvas library (uses the proprietary Flash plugin) to emulate the `<canvas>` tag. These libraries have both been tested with jsGameSoup on Internet Explorer 6 and work fine, with the FlashCanvas library providing better performance than excanvas. You should get the source code for the project you want and then put the respective line for loading the library inside the `<head>` tag, before any other `<script>` tags.

To use ExplorerCanvas:

	<!--[if IE]><script src="explorercanvas/excanvas.js"></script><![endif]-->

To use FlashCanvas:

	<!--[if IE]><script src="flashcanvas/bin/flashcanvas.js"></script><![endif]-->

See the Download section above for links to these libraries.

One final gotcha under IE6 is that Javascript datastructures should not contain a trailing comma on the last element. E.g. `t = [1, 2, 3];` not `t = [1, 2, 3,];` This is a quirk of the browser that seems to trip people up. If you are finding debugging under old versions of Internet Explorer frustrating, one thing you can do to help is [install the Microsoft Script Debugger](http://www.microsoft.com/download/en/details.aspx?displaylang=en&id=22185). You'll also want to enable debugging in the advanced options of the browser.

### Auto-launching your games ###

Auto-launching is useful if you have pages with multiple game canvases and you don't want to write the launch code for every instance. You do this by simply creating `<canvas>` tags in your html document with an attribute "jsgs":

	<html>
		<head>
			<script src='jsGameSoup/jsgamesoup.js'></script>
			<script>
				function startGame(gs) {
					// our demo game entity
					function Thingy() {
						this.draw = function(c, gs) {
							c.moveTo(10, 10);
							c.lineTo(10 + 10 * Math.sin(), 10 + 10 * Math.cos());
						}
					}
					gs.addEntity(new Thingy());
				}
			</script>
		</head>
		<body>
			<canvas id='mygame' jsgs='startGame' fps="25"></canvas>
		</body>
	</html>

When the page is loaded, jsGameSoup will attach a `new JSGameSoup()` object to every canvas tag with the 'jsgs' attribute. This specifies the name of the function which should be called to launch the game script associated with that canvas. The 'fps' attribute specifies the desired frame rate of the game engine for that canvas. Once the jsGameSoup engine has been attached to the canvas it starts running immediately.

