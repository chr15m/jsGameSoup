jsGameSoup
----------

A Free Software framework for making games using Javascript and open web technologies.

 * Free and Open Source.
 * Modular - component javascript files also work standalone.
 * Uses Open web technologies like Canvas and HTML5.
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

Batteries included
------------------

 * Cross browser event handling (keyboard, mouse, touch) [jsgamesoup.js](http://jsgamesoup.net/jsdocs/symbols/JSGameSoup.html)
 * Game entity management [jsgamesoup.js](http://jsgamesoup.net/jsdocs/symbols/JSGameSoup.html)
 * Sprite management [sprite.js](http://jsgamesoup.net/jsdocs/symbols/Sprite.html)
 * Sound effects playback with [audio.js](http://jsgamesoup.net/jsdocs/symbols/AudioManager.html)
 * Rudimentary polygon, AABB-box, circle collision detection [collisions.js](http://jsgamesoup.net/jsdocs/symbols/collide.html)
 * Fast, deterministic random number generator [random.js](http://jsgamesoup.net/jsdocs/symbols/SeedableRandom.html)
 * Simple AJAX and bulk data loading with [network.js](http://jsgamesoup.net/jsdocs/symbols/network.html)
 * Basic cookie management [cookies.js](http://jsgamesoup.net/jsdocs/symbols/cookies.html)
 * Simple finite state machine [statemachine.js](http://jsgamesoup.net/jsdocs/symbols/statemachine.html)
 * AStar path finding on a 2d board of squares [a_star.js](http://jsgamesoup.net/jsdocs/symbols/AStar.html)
 * Simplex and Perlin noise algorithms [noise.js](http://jsgamesoup.net/jsdocs/symbols/noise.SimplexNoise.html)
 * URL and querystring parsing [url.js](http://jsgamesoup.net/jsdocs/symbols/URL.html)
 * Fast, in-place vector library for Javascript arrays [vectorize.js](http://jsgamesoup.net/jsdocs/symbols/vectorize.html)
 * Isometric to screen space helper library [isometric.js](http://jsgamesoup.net/jsdocs/symbols/Isometric.html)

![FallingGame screenshot](http://jsgamesoup.net/website/screenshots/FallingGame.png)

Documentation
-------------

 * [All jsGameSoup API documentation](http://jsgamesoup.net/jsdocs)
 * [Reference implementation of a jsGameSoup entity](http://jsgamesoup.net/jsdocs/symbols/ExampleEntity.html)
 * [Simple jsGameSoup example game](http://jsgamesoup.net/jsdocs/symbols/src/example-game.js.html)
 * [Canvas cheatsheet](http://www.nihilogic.dk/labs/canvas_sheet/HTML5_Canvas_Cheat_Sheet.png)
 * [Canvas tag documentation](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#the-canvas-element)
 * [Some tests](http://jsgamesoup.net/tests)
 * [Some demos](http://jsgamesoup.net/demos)

Copyright Chris McCormick, 2009-2011, and LGPL licensed. Please see the file [COPYING.txt](http://jsgamesoup.net/COPYING.txt) for details. Basically you can use this in a commercial product but if you make modifications to the library itself you should publish them.

[Using jsGameSoup for your game? Hire me as a consultant.](mailto:chris@mccormickit.com)

![AsteroidsTNG screenshot](http://jsgamesoup.net/website/screenshots/AsteroidsTNG.png)

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

![Numbeat screenshot](http://jsgamesoup.net/website/screenshots/Numbeat.png)

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

