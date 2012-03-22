jsGameSoup
----------

A Free Software framework for making games using Javascript and open web technologies.

 * Free and Open Source.
 * Modular - component javascript files also work standalone.
 * Uses Open web technologies like Canvas.
 * Runs on Firefox (Gecko), Safari/Chrome (WebKit), Internet Explorer 6+, and Android + iOS browsers.

<!-- TODO: icon set showing browser support -->

<span id='demos'>
[![FallingGame demo][FallingGame-thumbnail]][FallingGame]
[![AsteroidsTNG demo][AsteroidsTNG-thumbnail]][AsteroidsTNG]
[![SoupBox - box2d.js physics demo][SoupBox-thumbnail]][SoupBox]
[![Audio demo][AudioDemo-thumbnail]][AudioDemo]
[![Sylvester.js vector math demo][Sylvester-thumbnail]][Sylvester]
</span>

[FallingGame]: http://mccormick.cx/dev/blogref/FallingGame/
[FallingGame-thumbnail]: http://jsgamesoup.net/website/screenshots/FallingGame-thumbnail.png

[AsteroidsTNG]: http://mccormick.cx/dev/blogref/AsteroidsTNG/
[AsteroidsTNG-thumbnail]: http://jsgamesoup.net/website/screenshots/AsteroidsTNG-thumbnail.png

[SoupBox]: http://jsgamesoup.net/demos/box2d
[SoupBox-thumbnail]: http://jsgamesoup.net/website/screenshots/SoupBox-thumbnail.png

[AudioDemo]: http://jsgamesoup.net/demos/audio.html
[AudioDemo-thumbnail]: http://jsgamesoup.net/website/screenshots/AudioDemo-thumbnail.png

[Sylvester]: http://jsgamesoup.net/demos/vector-math-sylvester
[Sylvester-thumbnail]: http://jsgamesoup.net/website/screenshots/Sylvester-thumbnail.png

Copyright Chris McCormick, 2009-2011, and LGPL licensed. Please see the file [COPYING.txt](http://jsgamesoup.net/COPYING.txt) for details. Basically you can use this in a commercial product but if you make modifications to the library itself you should publish them.

[Using jsGameSoup for your game? Hire me as a consultant.](mailto:chris@mccormickit.com)

Batteries included
------------------

 * Cross browser event handling (keyboard, mouse, touch)
 * Game entity management
 * Sprite management [sprite.js](http://jsgamesoup.net/jsdocs/symbols/Sprite.html)
 * Sound effects playback with [audio.js](http://jsgamesoup.net/jsdocs/symbols/AudioManager.html)
 * Rudimentary polygon, AABB-box, circle collision detection [collisions.js](http://jsgamesoup.net/jsdocs/symbols/collide.html)
 * Fast, deterministic random number generator [random.js](http://jsgamesoup.net/jsdocs/symbols/SeedableRandom.html)
 * Simple AJAX and bulk data loading with [network.js](http://jsgamesoup.net/jsdocs/symbols/network.html)
 * Basic cookie management [cookies.js](http://jsgamesoup.net/jsdocs/symbols/cookies.html)
 * Simple finite state machine [statemachine.js](http://jsgamesoup.net/jsdocs/symbols/statemachine.html)
 * AStar path finding on a 2d board of squares [a_star.js](http://jsgamesoup.net/jsdocs/symbols/AStar.html)
 * Ken Perlin's noise algorithms [noise.js](http://jsgamesoup.net/jsdocs/symbols/noise.SimplexNoise.html)
 * URL and querystring parsing [url.js](http://jsgamesoup.net/website/jsdocs/symbols/URL.html)
 * Optional auto-init to launch code attached to HTML canvases

![FallingGame screenshot](http://jsgamesoup.net/website/screenshots/FallingGame.png)

Documentation
-------------

 * [All jsGameSoup API documentation](http://jsgamesoup.net/jsdocs)
 * [JSGameSoup engine class](http://jsgamesoup.net/jsdocs/symbols/JSGameSoup.html)
 * [Reference implementation of a jsGameSoup entity](http://jsgamesoup.net/jsdocs/symbols/ExampleEntity.html)
 * [Simple jsGameSoup example game](http://jsgamesoup.net/jsdocs/symbols/src/example-game.js.html)

 * [Canvas cheatsheet](http://www.nihilogic.dk/labs/canvas_sheet/HTML5_Canvas_Cheat_Sheet.png)
 * [Canvas tag documentation](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#the-canvas-element)

 * [Some tests](http://jsgamesoup.net/tests)
 * [Some demos](http://jsgamesoup.net/demos)

Download
--------

[Visit the download page](http://jsgamesoup.net/download.php)

You probably also want one of the following for Internet Explorer compatibility:

 * [excanvas.js](http://explorercanvas.googlecode.com/svn/trunk/excanvas.js) from the [excanvas homepage](http://code.google.com/p/explorercanvas/) for pure Javascript compatibility, but it's a bit slower.
 * [FlashCanvas](http://flashcanvas.net/download) which provides better performance but depends upon the proprietary Flash plugin.

See the Internet Explorer compatability section below for instructions on getting your jsGameSoup game to work in Internet Explorer 6 and higher.

![AsteroidsTNG screenshot](http://jsgamesoup.net/website/screenshots/AsteroidsTNG.png)

Suggested companion libraries
-----------------------------

In an effort to keep this library minimal and focused on making games, here are some excellent 3rd party libraries and frameworks providing functionality you might need that is not included in jsGameSoup. Wherever possible these are single-file Javascript libraries that can just be dropped into your project along side jsGameSoup.

 * Vector and matrix math - [sylvester.js](http://sylvester.jcoglan.com/) (see the demo below)
 * Server side and/or multiplayer code [Node.js + socket.io](http://socket.io/)
 * 2D physics - [box2d.js](http://box2d-js.sourceforge.net/) (see the demo below)

Free game resources
-------------------

 * [SFXR sound effects tool](http://www.drpetter.se/project_sfxr.html) - also [BFXR in your browser](http://www.bfxr.net/)
 * [Dan Cook's free game graphics](http://lunar.lostgarden.com/labels/free%20game%20graphics.html)
 * [Oryx's LOFI fantasy tiles and sprites](http://forums.tigsource.com/index.php?topic=8970.0)
 * [WidgetWorx SpriteLib](http://www.widgetworx.com/widgetworx/portfolio/spritelib.html)
 * [Philipp Lenssen's free sprites](http://blogoscoped.com/archive/2006-08-08-n51.html)
 * [HasGraphics game graphics](http://hasgraphics.com/)
 * [Reiner`s Tilesets](http://www.reinerstilesets.de/2d-grafiken/2d-environment/)
 * [Freesound archive](http://www.freesound.org/)

Source code
-----------

Contribute or get the latest version of the code using [bazaar](http://bazaar-vcs.org/):

	bzr co http://jsgamesoup.net/

Or check the [Github page](https://github.com/chr15m/jsGameSoup) for the git repository.

Or check the [Google Code page](http://code.google.com/p/jsgamesoup/) for the SVN repository.

[Patches welcome](mailto:chris@mccormick.cx)!

![Numbeat screenshot](http://jsgamesoup.net/website/screenshots/Numbeat.png)

Quick Start
-----------

Start in an empty working directory. First get the jsGameSoup source in a sub-directory called 'jsGameSoup'.

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
		var gs = new JSGameSoup("surface", 30);
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

### Performance tips ###

 * Generally the larger screen area your game fills the slower it will draw. Try using window.open to launch your game in it's own window of fixed size.

 * If you have an operation drawing lots of repeating shapes on Canvas, do them inside one big c.beginPath() and c.closePath() instead of lots of little ones.

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

