function JSGameSoup(canvas, framerate) {
	// number of frames that the app has been running for
	this.frameCount = 0;
	// how fast we run
	this.framerate = framerate;
	// where we will output the graphics
	if (typeof canvas == "string")
		this.canvas = document.getElementById(canvas);
	else
		this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.ctx.translate(0.5, 0.5);
	
	/*
	 *	Graphics assistance routines.
	 */
	this.clear = function clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = 'rgba(0,0,0,0.4)';
		this.ctx.strokeStyle = 'rgba(0,153,255,0.4)';
	}
	
	this.init = function init() {
		
	}
	
	// TODO: get canvas size like processingjs
	
	// TODO: attach event callbacks to our canvas
	
	//this.pointInEntitiesCall([mouseX, mouseY], "mousePressed");
	//pointInEntitiesCall([mouseX, mouseY], "mouseReleased");
	
	// any entity which wants to be run every frame
	// must implement an .update() method
	// any entity which wants to be drawn, must implement
	// a .draw() method
	// a collisionPoly() method should return a list of points which
	// define where the object is on the screen for things like mouseclicks
	// if 'priority' is defined in the entity, it will be used to order the update/draw
	// greater priority will be run first
	// TODO: sort entities according to e.priority after adding or removing
	var entities = [];
	var addEntities = [];
	var delEntities = [];
	
	this.addEntity = function addEntity(e) {
		addEntities.push(e);
	}
	
	this.delEntity = function delEntity(e) {
		delEntities.push(e);
	}
	
	// any entity which can collide with other entities
	// should provide a .getBoundingBox() method and can
	// possibly provide a .getPoly() method for finer grained collisions
	// .getBoundingBox() should return an array which looks like [x, y, width, height]
	// .getPoly() should return an array which looks like [(x1, y1), (x2, y2), (x3, y3), ....]
	// var colliders = [];
	// TODO: add RDC to this
	
	// this is our custom loop
	this.gameSoupLoop = function gameSoupLoop() {
		// run .update() on every entity in our list
		for (o in entities) {
			if (entities[o].update) {
				entities[o].update(this);
			}
		}
		
		// add any new entities which the user has added
		for (o in addEntities) {
			entities.push(addEntities[o]);
		}
		addEntities = [];
		
		// delete any entities the user has asked to remove
		for (o in delEntities) {
			entities.splice(entities.indexOf(delEntities[o]), 1);
		}
		delEntities = [];
		
		// clear the background
		this.clear();
		// run .draw() on every entity in our list
		for (o in entities) {
			if (entities[o].draw) {
				this.ctx.save();
				entities[o].draw(this.ctx, this);
				this.ctx.restore();
			}
		}
		
		this.frameCount += 1;
	}
	
	// launch our game
	this.launch = function launch() {
		GS = this;
		// launch our custom loop
		looping = setInterval(function() {
			try {
				GS.gameSoupLoop()
			} catch(e) {
				clearInterval(looping);
				throw e;
			}
		}, 1000 / this.framerate);
	}
	
	// detect whether a point is inside a polygon (list of points) or not
	this.pointInPoly = function pointInPoly(pos, poly) {
		/* This code is patterned after [Franklin, 2000]
		http://www.geometryalgorithms.com/Archive/algorithm_0103/algorithm_0103.htm
		Tells us if the point is in this polygon */
		cn = 0
		pts = poly.slice();
		pts.push([poly[0][0], poly[0][1]]);
		for (i=0; i<poly.length; i++)
			if (((pts[i][1] <= pos[1]) && (pts[i+1][1] > pos[1])) || ((pts[i][1] > pos[1]) && (pts[i+1][1] <= pos[1])))
				if (pos[0] < pts[i][0] + (pos[1] - pts[i][1]) / (pts[i+1][1] - pts[i][1]) * (pts[i+1][0] - pts[i][0]))
		cn += 1
		return cn % 2
	}
	
	// call an entity on a method if the point is inside the entity's polygon
	// used in mouse events to send mouseDown and mouseUp events into the entity
	pointInEntitiesCall = function pointInEntitiesCall(pos, fn) {
		for (e in entities) {
			if (entities[e].collisionPoly && entities[e][fn] && pointInPoly(pos, entities[e].collisionPoly()))
				entities[e][fn]();
		}
	}
}

/*
 *	Finds all canvas tags in the document:
 *	> calls the function named in the attribute 'jsgs'
 *	> passes a new JSGameSoup instance to that function
 *	> fps is set in the attribute called 'fps'
 *
 */

function FindAndLaunchCanvasJSGS() {
	var canvases = document.getElementsByTagName("canvas");
	for ( var i = 0; i < canvases.length; i++ ) {
		var launchfn = null;
		var launchfps = 15;
		if (canvases[i].getAttribute) {
			if (canvases[i].getAttribute('jsgs'))
				launchfn = canvases[i].getAttribute('jsgs');
			if (canvases[i].getAttribute('fps'))
				launchfps = canvases[i].getAttribute('fps');
		} else {
			if (canvases[i].jsgs)
				launchfn = canvases[i].jsgs;
			if (canvases[i].fps)
				launchfps = canvases[i].fps;
		}
		if (launchfn)
			this[launchfn](new JSGameSoup(canvases[i], launchfps));
	}
}

// Crossplatform document.ready from here:
// http://dean.edwards.name/weblog/2006/06/again/#comment335794
function JSGS_init() {
  if (arguments.callee.done) return;
  arguments.callee.done = true;
  // do your thing
  FindAndLaunchCanvasJSGS();
}
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', JSGS_init, false);
}
(function() {
  /*@cc_on
  if (document.body) {
    try {
      document.createElement('div').doScroll('left');
      return JSGS_init();
    } catch(e) {}
  }
  /*@if (false) @*/
  if (/loaded|complete/.test(document.readyState)) return JSGS_init();
  /*@end @*/
  if (!JSGS_init.done) setTimeout(arguments.callee, 50);
})();
_prevOnload = window.onload;
window.onload = function() {
  if (typeof _prevOnload === 'function') _prevOnload();
  JSGS_init();
};

// cross platform multiple onload event attach as a last resort
// from http://simonwillison.net/2004/May/26/addLoadEvent/
var oldonload = window.onload;
if (typeof window.onload != 'function') {
	window.onload = func;
} else {
	window.onload = function() {
		if (oldonload) {
			oldonload();
		}
		JSGS_init();
	}
}

