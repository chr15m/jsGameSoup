jsGameSoup v120
--------------

A Free Software framework for making games for the web using Javascript and HTML5. Abstract away some of the complexity of developing Javascript games for multiple browsers. Currently runs under new versions of Firefox (Gecko), Safari/Chrome (WebKit), IE 6.0 and higher. Doesn't depend on any proprietary technologies like Flash or Silverlight.

[Download jsGameSoup v120](jsGameSoup-v120.zip)

![FallingGame screenshot](screenshots/FallingGame.png)

 * [Blog](http://mccormick.cx/news/tags/jsgamesoup)
 * [Mailing list](http://groups.google.com/group/jsgamesoup)

Copyright Chris McCormick, 2009-2011, and is LGPL licensed. Please see the file [COPYING](COPYING) for details.

Batteries included
------------------

 * Cross browser event handling (keyboard, mouse, touch)
 * Game entity management
 * Rudimentary polygon, box, circle collision detection [collisions.js](js/js/collisions.js)
 * Sprite management [sprite.js](js/js/sprite.js)
 * Fast, deterministic random number generator [random.js](js/js/random.js)
 * Networking (ajax) abstraction layer [network.js](js/js/network.js)
 * Basic cookie management [cookies.js](js/js/cookies.js)
 * Auto-init to launch code attached to a specific HTML canvas

![AsteroidsTNG screenshot](screenshots/AsteroidsTNG.png)

Download
--------

[Zipfile of jsGameSoup v120](jsGameSoup-v120.zip)

You probably also want one of the following for Internet Explorer compatability:

 * [excanvas.js](http://explorercanvas.googlecode.com/svn/trunk/excanvas.js) from the [excanvas homepage](http://code.google.com/p/explorercanvas/) for pure Javascript compatability, but it's a bit slower
 * [FlashCanvas](http://flashcanvas.net/download) which provides better speed but depends upon the proprietary Flash plugin.

Documentation
-------------

 * [Simple jsGameSoup example game](jsdocs/symbols/src/example-game.js.html)
 * [Reference implementation of a jsGameSoup entity](jsdocs/symbols/ExampleEntity.html)
 * [All jsGameSoup API documentation](jsdocs)

 * [Sprite class](jsdocs/symbols/Sprite.html)
 * [JSGameSoup game management class](jsdocs/symbols/JSGameSoup.html)
 * [Seedable random number generator](jsdocs/symbols/SeedableRandom.html)
 * [Collision API](jsdocs/symbols/collide.html)
 * [Cookie handling](jsdocs/symbols/cookies.html)
 * [Network/ajax API](jsdocs/symbols/network.html)

 * [Canvas cheatsheet](http://www.nihilogic.dk/labs/canvas_sheet/HTML5_Canvas_Cheat_Sheet.png)
 * [Canvas tag documentation](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#the-canvas-element)

Demos
-----

 * [AsteroidsTNG](http://mccormick.cx/dev/blogref/AsteroidsTNG/)
 * [FallingGame](http://mccormick.cx/dev/blogref/FallingGame/)
 * [Demos page here](demos)
 * [Not very well maintained test suite](tests)

Quick Start
-----------

The main component of the framework is the `JSGameSoup()` object, which is the engine of the system. When the jsgamesoup.js script is loaded, it will attach a `new JSGameSoup()` engine to every canvas tag which has an attribute 'jsgs'. The attribute 'jsgs' specifies the name of the function which should be called to launch the game script associated with that canvas. The 'fps' attribute specifies the desired frame rate of the game engine for that canvas.

Once the jsGameSoup engine has been attached to the canvas it starts running immediately. The jsGameSoup engine keeps a list of objects to update and draw every frame. In order to make things happen in your game, you should create objects and add them to the engine with the `addEntity()` method.

Here is some example code to get you going. You should be able to paste this into an HTML document with jsgamesoup.js and excanvas.js installed in the correct subdirectories.

	<!--[if IE]><script src="js/explorercanvas/excanvas.js"></script><![endif]-->
	<script src='js/jsgamesoup.js'></script>
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
	<canvas id='mygame' jsgs='startGame' fps="25"></canvas>

Source code
-----------

Contribute or get the latest version of the code using [bazaar](http://bazaar-vcs.org/):

	bzr co http://mccormick.cx/dev/jsgamesoup/

Or check the [Google Code page](http://code.google.com/p/jsgamesoup/) for the SVN repository.

[Patches welcome](mailto:chris@mccormick.cx)!
