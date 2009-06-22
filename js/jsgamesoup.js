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
	// set the cursor to the pointer for IE to stop the flickering text cursor problem
	this.canvas.style.cursor = "default";
	this.ctx = this.canvas.getContext('2d');
	// stop the bug where lines on whole integers are blurred (processingjs fix)
	this.ctx.translate(0.5, 0.5);
	// we need a variable we can access from inside callbacks etc.
	var JSGS = this;
	// give us easy access to some variables
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	
	/******************************
	 	Graphics helpers
	 ******************************/
	
	this.clear = function clear() {
		// clear the frame (happens automatically before each frame drawn)
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	this.polygon = function polygon(poly) {
		// draw a polygon - list of 2-element lists (x,y)
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.moveTo(poly[0][0], poly[0][1]);
		for (n = 0; n < poly.length; n++) {
			this.ctx.lineTo(poly[n][0], poly[n][1]);
		}
		this.ctx.lineTo(poly[0][0], poly[0][1]);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.restore();
	}
	
	this.background = function background(color) {
		// fill in the background with a particular color
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.restore();
	}
	
	/******************************
	 	Math helpers
	 ******************************/
	
	this.random = function random(start, end) {
		// get a random number (non-int) between start and end
		return Math.random() * (end - start) + start;
	}
	
	/***************************
	 	Event handling
	 ***************************/
	
	// TODO: queue up the events rather than firing the methods right as they happen (synchronous)
	
	// event state variables
	this.heldKeys = {};
	
	// helper function to attach events in a cross platform way
	this.attachEvent = function attachEvent(name) {
		if ( document.addEventListener ) {
			document.addEventListener(name, this["on" + name], false);
		} else if ( document.attachEvent ) {
			document.attachEvent("on" + name, this["on" + name]);
		} else {
			this.canvas["on" + name] = this["on" + name];
		}
	}
	
	// helper function to cancel an event
	this.cancelEvent = function cancelEvent(ev) {
		if (ev.stopPropagation)
			ev.stopPropagation();
		// otherwise set the cancelBubble property of the original event to true (IE)
		ev.cancelBubble = true; 
	}
	
	// TODO: add key isheld "event"
	
	/*** Actual event handlers ***/
	
	// mouse button pressed event
	this.onmousedown = function onmousedown(ev) {
		var ev = (ev) ? ev : window.event;
		
		// Get the mouse position relative to the canvas element.
		if (ev.layerX || ev.layerX == 0) { // Firefox
			mouseX = ev.layerX - canvas.offsetLeft;
			mouseY = ev.layerY - canvas.offsetTop;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera
			mouseX = ev.offsetX;
			mouseY = ev.offsetY;
		} else {
			mouseX = ev.clientX - canvas.offsetLeft + scrollX;
			mouseY = ev.clientY - canvas.offsetTop + scrollY;
		}
		JSGS.pointInEntitiesCall([mouseX, mouseY], "mouseDown");
	}
	this.attachEvent("mousedown");
	
	// TODO: add mouseup event
	
	// TODO: add mousemove event
	
	// TODO: add mouse ispressed "event"
	
	// TODO: add key down event
	this.onkeydown = function onkeydown(ev) {
		var ev = (ev) ? ev : window.event;
		// call keyDown on entities who are listening
		if (!JSGS.heldKeys[ev.keyCode]) {
			JSGS.entitiesCall("keyDown", ev.keyCode);
			JSGS.entitiesCall("keyDown_" + ev.keyCode);
			JSGS.heldKeys[ev.keyCode] = true;
		}
		JSGS.cancelEvent(ev);
	}
	this.attachEvent("keydown");
	
	// TODO: add key up event
	this.onkeyup = function onkeyup(ev) {
		var ev = (ev) ? ev : window.event;
		// call keyUp on entities who are listening
		if (JSGS.heldKeys[ev.keyCode]) {
			JSGS.entitiesCall("keyUp", ev.keyCode);
			JSGS.entitiesCall("keyUp_" + ev.keyCode);
			JSGS.heldKeys[ev.keyCode] = false;
		}
		JSGS.cancelEvent(ev);
	}
	this.attachEvent("keyup");
	
	/***************************
	 	Entity helpers
	 ***************************/
	
	// any entity which wants to be run every frame
	// must implement an .update() method
	// any entity which wants to be drawn, must implement
	// a .draw() method
	// a collisionPoly() method should return a list of points which
	// define where the object is on the screen for things like mouseclicks
	// if 'priority' is defined in the entity, it will be used to order the update/draw
	// greater priority will be run first
	// TODO: different types of collisions:
	//	circle, box, polygon
	// 	for pointer
	//	for entity-entity
	var entities = [];
	var addEntities = [];
	var delEntities = [];
	
	// different specialist lists
	var entitiesKeyHeld = [];
	
	this.addEntity = function addEntity(e) {
		// add this game entity to our pool of entities (will happen after update())
		addEntities.push(e);
	}
	
	this.delEntity = function delEntity(e) {
		// remove this entity from our pool of entities (will happen after update())
		delEntities.push(e);
	}
	
	this.addEntityToSpecialistLists = function addEntityToSpecialistLists(e) {
		for (method in e) {
			if (method.indexOf("keyHeld") == 0 && entitiesKeyHeld.indexOf(e) < 0) {
				entitiesKeyHeld.push(e);
			}
		}
	}
	
	this.removeEntityFromSpecialistLists = function removeEntityFromSpecialistLists(e) {
		entitiesKeyHeld.remove(e);
	}
	
	/**********************
	 	Main loop
	 **********************/
	
	// any entity which can collide with other entities
	// should provide a .getBoundingBox() method and can
	// possibly provide a .getPoly() method for finer grained collisions
	// .getBoundingBox() should return an array which looks like [x, y, width, height]
	// .getPoly() should return an array which looks like [(x1, y1), (x2, y2), (x3, y3), ....]
	// var colliders = [];
	// TODO: add RDC/collision loop to this
	
	// this is our main game loop
	this.gameSoupLoop = function gameSoupLoop() {
		// run .update() on every entity in our list
		for (o in entities) {
			if (entities[o].update) {
				entities[o].update(this);
			}
		}
		
		// test for held keys and send them to listening entities
		for (o in entitiesKeyHeld) {
			var hasHeld = false;
			for (k in this.heldKeys) {
				if (this.heldKeys[k]) {
					this.callAll(entitiesKeyHeld, "keyHeld_" + k);
					hasHeld = true;
				}
			}
			if (hasHeld)
				this.callAll(entitiesKeyHeld, "keyHeld");
		}
		
		// add any new entities which the user has added
		for (o in addEntities) {
			// TODO: sort entities by priority
			// TODO: make sublists of drawables to make the loops tighter
			// TODO: make sublists of updateables to make the loops tighter
			// TODO: make sublists of event handling entities
			entities.push(addEntities[o]);
			this.addEntityToSpecialistLists(addEntities[o]);
			if (addEntities[o].update) {
				addEntities[o].update(this);
			}
		}
		addEntities = [];
		
		// delete any entities the user has asked to remove
		for (o in delEntities) {
			entities.remove(delEntities[o]);
			this.removeEntityFromSpecialistLists(o);
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
		var GS = this;
		// launch our custom loop
		looping = setInterval(function() {
			try {
				GS.gameSoupLoop()
			} catch(e) {
				clearInterval(looping);
				if (console)
					console.log(e);
				throw(e);
			}
		}, 1000 / this.framerate);
	}
	
	// TODO: use canvas isPointInPath instead, when it's supported by excanvas
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
	
	/*****************************************
	 	Make calls on entity methods
	 *****************************************/
	
	// call a method on an entity if the point is inside the entity's polygon
	// used in mouse events to send mouseDown and mouseUp events into the entity
	this.pointInEntitiesCall = function pointInEntitiesCall(pos, fn) {
		for (e in entities) {
			if (entities[e].collisionPoly && entities[e][fn] && this.pointInPoly(pos, entities[e].collisionPoly()))
				entities[e][fn]();
		}
	}
	
	// call a method on each entity for which that method exists
	// used for key events etc.
	this.entitiesCall = function entitiesCall(fn, arg) {
		this.callAll(entities, fn, arg);
	}
	
	// generalised form of entitiesCall which can be applied on any array of entities
	this.callAll = function callAll(arr, fn, arg) {
		for (e in arr) {
			if (arr[e][fn]) {
				arr[e][fn](arg);
			}
		}
	}
}

	/*******************************************
	 	Cross platform launching stuff
		(outside JSGameSoup definition)
	 *******************************************/

/*
 *	Finds all canvas tags in the document:
 *	> calls the function named in the attribute 'jsgs'
 *	> passes a new JSGameSoup instance to that function
 *	> fps is set in the attribute called 'fps'
 *
 *	Modified version of processingjs' init.js example script.
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
		if (launchfn) {
			var gs = new JSGameSoup(canvases[i], launchfps);
			this[launchfn](gs);
			gs.launch();
		}
	}
}

// Crossplatform document.ready from here:
// http://dean.edwards.name/weblog/2006/06/again/#comment335794
function JSGS_init() {
  if (arguments.callee.done) return;
  arguments.callee.done = true;
  // MAIN LAUNCH
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

/*
 *	Random stuff to support IE.
 */
// this is from here:
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

/* Python style remove function */
if (!Array.prototype.remove) {
	Array.prototype.remove = function(el) {
		if (el in this) {
			this.splice(this.indexOf(el), 1);
		}
	}
}

