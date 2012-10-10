/*
 *	jsGameSoup - Copyright 2009-2012 Chris McCormick
 *	
 *	LGPL version 3 (see COPYING for details)
 *	
 */


/**	@class The core jsGameSoup library for entity and event management. You can either pass your own canvas like this: var gs = new JSGameSoup(mycanvas, 30); myGameFunction(gs); gs.launch(); or else when the jsgamesoup.js script is loaded, it will attach a `new JSGameSoup()` instantiation to every canvas tag which has an attribute 'jsgs'. The attribute 'jsgs' specifies the name of the function which should be called to launch the game script associated with that canvas. The 'fps' attribute specifies the desired frame rate of the game engine for that canvas. Once the jsGameSoup engine has been attached to the canvas it starts running immediately. The jsGameSoup engine keeps a list of objects to update and draw every frame. In order to make things happen in your game, you should create objects and add them to the engine with the addEntity() method.
	@param canvas can be a canvas element object, or the ID of the canvas element which this instance of JSGameSoup should attach itself to. If you pass another type of object, for example a <div> tag, a canvas of the same size will be created automatically.
	@param framerate The number of frames per second the game will try to run at on this canvas.
*/
function JSGameSoup(canvas, framerate) {
	/** The number of frames that the app has been running for */
	this.frameCount = 0;
	/** How fast we are running in FPS */
	this.framerate = framerate;
	/** The current/last position of the pointer */
	this.pointerPosition = [0, 0];
	/** The current/last pointer up/down status */
	this.pointerDown = false;
	// where we will output the graphics
	if (typeof canvas == "string") {
		// the caller has supplied the ID of a canvas
		canvas = document.getElementById(canvas);
	}
	
	// attach new styles to our container or canvas object for android and iOS devices
	/* disable callout sheet */
	// canvas.style["-webkit-touch-callout"] = "none";
	/* disable highlighting links when tapped */
	// canvas.style["-webkit-tap-highlight-color"] = "rgba(0,0,0,0)";
	/* prevent automatic resizing of text */
	// canvas.style["-webkit-text-size-adjust"] = "none";
	/* disable copy paste */
	// canvas.style["-webkit-user-select"] = "none";
	if (canvas.tagName.toLowerCase() == "canvas") {
		// they have supplied their own canvas element
		this.canvas = canvas;
	} else {
		// they have passed a container element
		// insert a canvas of the same size inside it
		var container = canvas;
		canvas = document.createElement("canvas");
		// set the width and height of our canvas to be the same as the container element
		canvas.style.width = canvas.width = (container.offsetWidth + 1);
		canvas.style.height = canvas.height = (container.offsetHeight + 1);
		// empty out the container before appending our new canvas to it
		container.innerHTML = "";
		container.appendChild(canvas);
		this.canvas = canvas;
	}
	
	// apply IE fix
	if (typeof(G_vmlCanvasManager) != "undefined") {
		G_vmlCanvasManager.initElement(canvas);
		// set the cursor to the pointer for IE to stop the flickering text cursor problem
		this.canvas.style.cursor = "default";
	}
	if (this.canvas && this.canvas.getContext) {
		this.ctx = this.canvas.getContext('2d');
	} else {
		alert("You are on a platform that does not support Canvas.\nTry ExplorerCanvas or FlashCanvas, maybe?");
		// avoid errors by populating with empty function signatures.
		this.width = 0;
		this.height = 0;
		this.random = this.nullfunc;
		this.addEntity = this.nullfunc;
		this.launch = this.nullfunc;
		return;
	}
	// stop the bug where lines on whole integers are blurred (processingjs fix)
	//this.ctx.translate(0.5, 0.5);
	// we need a variable we can access from inside callbacks etc.
	var JSGS = this;
	// give us easy access to some variables
	this.width = parseInt(this.canvas.width);
	this.height = parseInt(this.canvas.height);
	// access the offset position of the canvas
	this.pageOffset = null;
	
	/*******************************
		External includes
	 *******************************/

	/**
		Include an external javascript file.
		This is used internally to add functionality from separate files but you can also use it: JSGS.include("myjavascript.js", function(url){ alert(url + 'loaded'); });
		Pinched from http://ajaxpatterns.org/On-Demand_Javascript
	**/
	this.include = function(url, callback) {
		var callback = callback;
		var head = document.getElementsByTagName("head")[0];
		script = document.createElement('script');
		// script.id = '';
		script.type = 'text/javascript';
		script.src = url;
		if (callback) {
			script.onload = function () { callback(url); }
		}
		head.appendChild(script);
	}
	
	// figure out the baseurl of where javascript lives
	//var scripts = document.getElementsByTagName("script");
	//var mysrc = scripts[scripts.length-1].src;
	//var parts = mysrc.split("/");
	//var baseurl = parts.slice(0, -1).join("/");
	
	// load the fast random number generator
	//this.include(baseurl + "/jsGameSoup/js/random.js");
	// load the sprite manager
	//this.include(baseurl + "/jsGameSoup/js/sprite.js");

	/* ****************************
	 	General helpers
	 ******************************/
	/** @namespace helpers */
	
	/** Schedule a callback to be run after some number of frames.
		@param frames is the number of frames to wait before running this callback. Must be > 1.
		@param callback is the callback to be run when the given number of frames has elapsed.
	*/
	this.schedule = function(frames, callback) {
		if (frames > 0) {
			var when = this.frameCount + frames;
			if (!(when in scheduled)) {
				scheduled[when] = [];
			}
			scheduled[when].push(callback);
		}
	}
	// store our scheduled callbacks
	var scheduled = {};
	
	/** A null function to assign non-implemented callbacks to. */
	this.nullfunc = function() {};
	
	/* ****************************
	 	Graphics helpers
	 ******************************/
	/** @namespace graphics */
	
	/** clear the frame. This is called automatically before each frame is drawn. */
	this.clear = function clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	/** 	Draw a polygon
		@param poly A list of 2-element lists (x,y) like [[x1, y1,], [x2, y2]...]
		@param open Whether this polygon is closed or not
		@tag graphics
	*/
	this.polygon = function polygon(poly, open) {
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.moveTo(poly[0][0], poly[0][1]);
		for (var n = 0; n < poly.length; n++) {
			this.ctx.lineTo(poly[n][0], poly[n][1]);
		}
		if (open)
			this.ctx.lineTo(poly[0][0], poly[0][1]);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.restore();
	}
	
	/**	Fill in the background
		@param color Should be specified like a normal canvas color
		@tag graphics
	*/
	this.background = function background(color) {
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.restore();
	}
	
	/* ****************************
	 	Math helpers
	 ******************************/
	/** @namespace math */
	
	/**
		Returns a random real number between start and end. You should use the random.js with seedable random numbers instead.
		@param start The lower bound of the real number to be chosen.
		@param end The upper bound of the real number to be chosen.
		@tag math
	*/
	this.random = function random(start, end) {
		return Math.random() * (end - start) + start;
	}
	
	/**
		Returns the distance between two points (two element arrays)
		@param a The first point.
		@param b The second point.
		@tag math
	*/
	this.distance = function distance(a, b) {
		return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
	}
	
	/* *************************
	 	Event handling
	 ***************************/
	
	// TODO: optimise this so that there are separate lists of entities for each type of event they listen to
	// event state variables
	this.heldKeys = {};
	
	// helper function to attach events in a cross platform way
	this.attachEvent = function attachEvent(name) {
		var boss = this.canvas;
		// for some reason key events don't work on the canvas in firefox
		if (name.indexOf("key") == 0)
			boss = document;
		if ( boss.addEventListener ) {
			boss.addEventListener(name, this["on" + name], false);
		} else if ( boss.attachEvent ) {
			boss.attachEvent("on" + name, this["on" + name]);
		} else {
			boss["on" + name] = this["on" + name];
		}
	}
	
	// we want to allow right clicks on the canvas without popping up a stupid menu
	this.oncontextmenu = function oncontextmenu(ev) {
		JSGS.cancelEvent(ev);
		return false;
	}
	this.attachEvent("contextmenu");
	
	// helper function to cancel an event
	this.cancelEvent = function cancelEvent(ev) {
		if (ev.stopPropagation)
			ev.stopPropagation();
		if (ev.preventDefault)
			ev.preventDefault();
		// otherwise set the cancelBubble property of the original event to true (IE)
		ev.cancelBubble = true; 
	}
	
	// test whether the browser handles the touch events instead of mousing
	// we'll use touch events instead because they are generally faster
	this.isTouchDevice = function isTouchDevice() {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	}
	
	/**
	 * Utility to get the page offset position of the canvas element
	 * which allows for positioning of our game within a positioning parent
	 * other than the body.
	 * @private
	 */
	this._getCanvasPageOffset = function() {
		if (!JSGS.pageOffset) {
			// Thanks to jQuery for this code!
			var w = window;
			var d = document;
			var box = canvas.getBoundingClientRect();
			var clientTop  = d.documentElement.clientTop  || d.body.clientTop  || 0;
			var clientLeft = d.documentElement.clientLeft || d.body.clientLeft || 0;
			var scrollTop  = w.pageYOffset || d.documentElement.scrollTop;
			var scrollLeft = w.pageXOffset || d.documentElement.scrollLeft;
			var canvasTop  = box.top  + scrollTop  - clientTop;
			var canvasLeft = box.left + scrollLeft - clientLeft;
			// TODO: refresh this on resize
			JSGS.pageOffset = { top: Math.round(canvasTop), left: Math.round(canvasLeft) };
		}
		return JSGS.pageOffset;
	};
	
	// get the position of the triggered event
	this.getSetPointerPosition = function(ev) {
		var mouseX, 
			mouseY, 
			touch,
			canvasOffset = this._getCanvasPageOffset();

		// was this a touch?
		if (ev.touches && ev.touches.length) {
			touch = ev.touches[0];
			mouseX = touch.pageX - canvasOffset.left;
			mouseY = touch.pageY - canvasOffset.top;
		} 
		else {
			// Correct pageX/pageY if necessary.
			if (ev.pageX === undefined) {
				ev.pageX = ev.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
				ev.pageY = ev.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
			}
  
			// Get the mouse position relative to the canvas element.
			mouseX = ev.pageX - canvasOffset.left;
			mouseY = ev.pageY - canvasOffset.top;
		}
		this.pointerPosition = [mouseX, mouseY];
		return this.pointerPosition;
	};

	/* ** Actual event handlers ** */
	
	// these are the pointer events. if we have ontouchstart we use that
	this.ontouchstart = function ontouchstart(ev) {
		var ev = (ev) ? ev : window.event;
		JSGS.pointInEntitiesCall(JSGS.getSetPointerPosition(ev), "pointerDown", ev.touches.length);
		JSGS.cancelEvent(ev);
		JSGS.pointerDown = true;
		return false;
	}
	this.attachEvent("touchstart");
	
	this.ontouchend = function ontouchend(ev) {
		var ev = (ev) ? ev : window.event;
		JSGS.pointInEntitiesCall(JSGS.getSetPointerPosition(ev), "pointerUp", ev.touches.length);
		JSGS.cancelEvent(ev);
		JSGS.pointerDown = false;
		return false;
	}
	this.attachEvent("touchend");
	
	this.onmove = function onmove(ev, idx) {
		var ev = (ev) ? ev : window.event;
		JSGS.pointInEntitiesCall(JSGS.getSetPointerPosition(ev), "pointerMove", idx);
		JSGS.cancelEvent(ev);
		return false;
	}
	
	this.ontouchmove = function ontouchmove(ev) {
		JSGS.onmove(ev, ev.touches.length);
	}
	this.attachEvent("touchmove");
	
	// pointer pressed event
	this.onmousedown = function onmousedown(ev) {
		var ev = (ev) ? ev : window.event;
		JSGS.pointInEntitiesCall(JSGS.getSetPointerPosition(ev), "pointerDown", ev.button);
		JSGS.cancelEvent(ev);
		JSGS.pointerDown = true;
		return false;
	}
	this.attachEvent("mousedown");
	
	// pointer released event
	this.onmouseup = function onmouseup(ev) {
		var ev = (ev) ? ev : window.event;
		JSGS.pointInEntitiesCall(JSGS.getSetPointerPosition(ev), "pointerUp", ev.button);
		JSGS.cancelEvent(ev);
		JSGS.pointerDown = false;
		return false;
	}
	this.attachEvent("mouseup");
	
	// TODO: make this only check for entities which are listening with pointerMove().
	this.onmousemove = function onmousemove(ev) {
		JSGS.onmove(ev, ev.button);
	}
	this.attachEvent("mousemove");
	
	// TODO: add mouse ispressed "event"
	
	// TODO: pointer over event
	
	// TODO: pointer out event
	
	// key down event
	this.onkeydown = function onkeydown(ev) {
		var ev = (ev) ? ev : window.event;
		// call keyDown on entities who are listening
		if (!JSGS.heldKeys[ev.keyCode]) {
			JSGS.entitiesCall("keyDown", ev.keyCode);
			JSGS.entitiesCall("keyDown_" + ev.keyCode);
			JSGS.heldKeys[ev.keyCode] = true;
		}
		JSGS.cancelEvent(ev);
		return false;
	}
	this.attachEvent("keydown");
	
	// key up event
	this.onkeyup = function onkeyup(ev) {
		var ev = (ev) ? ev : window.event;
		// call keyUp on entities who are listening
		if (JSGS.heldKeys[ev.keyCode]) {
			JSGS.entitiesCall("keyUp", ev.keyCode);
			JSGS.entitiesCall("keyUp_" + ev.keyCode);
			JSGS.heldKeys[ev.keyCode] = false;
		}
		JSGS.cancelEvent(ev);
		return false;
	}
	this.attachEvent("keyup");
	
	/* *************************
	 	Entity helpers
	 ***************************/
	
	// any entity which wants to be run every frame
	// must implement an .update() method
	// any entity which wants to be drawn, must implement
	// a .draw() method
	// 
	// a pointerPoly() method can be defined which returns a list of points which
	// define where the object is on the screen for things like mouse clicks or finger touches
	// a pointerBox() method can be defined for the same thing, but in a square
	// a pointerCircle() method can be defined for the same thing but in a circle
	//
	// if 'priority' is defined in the entity, it will be used to order the update/draw
	// greater priority will be run first
	//
	/** Array holding all game entities. Use addEntity() and delEntity() to modify it's elements. */
	var entities = [];
	var addEntities = [];
	var delEntities = [];
	var totalEntityCount = 0;
	
	// array for synchronously sending events to entities in the update loop
	// [ entity, method, arg ]
	var entityEventQueue = [];
	// a list of entities who have received an event and returned true
	var entitiesTriggered = [];
	
	// different specialist lists
	var entitiesKeyHeld = [];
	var entitiesColliders = [];
	// TODO: entitiesPointerDown, entitiesPointerUp, entitiesPointerMove, entitiesKeyDown, entitiesKeyUp
	
	/**
		Add this game entity to our pool of entities (will happen synchronously after update() in the main loop)
		@param e The entity to be added to the jsGameSoup entity pool.
	*/
	this.addEntity = function addEntity(e) {
		addEntities.push(e);
		return e;
	}
	
	/**
		Remove this entity from our pool of entities (will happen synchronously after update() in the main loop)
		@param e The entity to be removed from the jsGameSoup entity pool.
	*/
	this.delEntity = function delEntity(e) {
		delEntities.push(e);
		return e;
	}
	
	/**
		Returns true if this entity is in our array of all game entities.
		@param e The entity which we want to check for in the jsGamesoup entity pool.
	*/
	this.inEntities = function inEntities(e) {
		// is this entity in our entity list?
		return entities.indexOf(e) >= 0;
	}
	
	/**
		Deletes all entities the engine knows about.
	*/
	this.clearEntities = function clearEntities() {
		for (var e=0; e<entities.length; e++) {
			delEntities.push(entities[e]);
		}
		return entities.length > 0;
	}
	
	/**
		Gets a list of entities which have already been triggered by the current event.
		Call this inside e.g. pointerUp() to get a list of entities which have also had their pointerUp() method called. Note that only lower priority entities will see the triggers of higher priority entities (e.g. entities with higher priorities get triggered first).
	*/
	this.getTriggeredEntities = function() {
		return entitiesTriggered;
	}
	
	this.addEntityToSpecialistLists = function addEntityToSpecialistLists(e) {
		// add this object to any specialist list to which it belongs
		for (var method in e) {
			// if this entity has an event listener for when certain keys are held down
			if (method.indexOf("keyHeld") == 0 && entitiesKeyHeld.indexOf(e) < 0) {
				entitiesKeyHeld.push(e);
			}
			// if this entity has any type of collision detection happening
			if (method.indexOf("collision") == 0 && entitiesColliders.indexOf(e) < 0) {
				entitiesColliders.push(e);
			}
		}
	}
	
	this.removeEntityFromSpecialistLists = function removeEntityFromSpecialistLists(e) {
		// clean this entity out of any special lists (above) to which it belongs
		entitiesKeyHeld.remove(e);
		entitiesColliders.remove(e);
	}
	
	/* ********************
	 	Main loop
	 **********************/
	
	/** This is our main game loop, which gets launched automatically with the launch() method. */
	this.gameSoupLoop = function gameSoupLoop() {
		// do we have any scheduled callbacks waiting to run?
		if (this.frameCount in scheduled) {
			for (var s=0; s<scheduled[this.frameCount].length; s++) {
				// run the callback
				scheduled[this.frameCount][s](this);
			}
			delete scheduled[this.frameCount];
		}
		
		// run .update() on every entity in our list
		for (var o=0; o<entities.length; o++) {
			if (entities[o].update) {
				entities[o].update(this);
			}
		}
		
		// get all the events out of the event queue and execute the event method on it's entity
		var ev = null;
		entitiesTriggered = [];
		while (ev = entityEventQueue.shift()) {
			if (ev[0][ev[1]](ev[2])) {
				entitiesTriggered.push(ev[0]);
			}
		}
		
		// add any new entities which the user has added
		for (var o=0; o<addEntities.length; o++) {
			// TODO: make sublists of drawables to make the loops tighter
			// TODO: make sublists of updateables to make the loops tighter
			// TODO: make sublists of event handling entities
			// set default priority if it's not set
			if (!addEntities[o].priority) addEntities[o].priority = 0;
			// this hack is so that entities get a stable sort because WebKit's sort is not stable, gah!
			addEntities[o].priority_preference = totalEntityCount;
			totalEntityCount += 1;
			// add the new one to our list of entities
			entities.push(addEntities[o]);
			this.addEntityToSpecialistLists(addEntities[o]);
			if (addEntities[o].init) {
				addEntities[o].init(this);
			}
			if (addEntities[o].update) {
				addEntities[o].update(this);
			}
		}
		// sort entities by priority after adding new entities
		if (addEntities.length)	this.sortEntities();
		addEntities = [];
		
		// delete any entities the user has asked to remove
		for (var o=0; o<delEntities.length; o++) {
			entities.remove(delEntities[o]);
			this.removeEntityFromSpecialistLists(delEntities[o]);
		}
		delEntities = [];
		
		// test for held keys and send them to listening entities
		for (var o=0; o<entitiesKeyHeld.length; o++) {
			var hasHeld = false;
			for (var k in this.heldKeys) {
				if (this.heldKeys[k]) {
					this.callAll(entitiesKeyHeld, "keyHeld_" + k);
					hasHeld = true;
				}
			}
			if (hasHeld)
				this.callAll(entitiesKeyHeld, "keyHeld");
		}
		
		// clear the background
		this.clear();
		// run .draw() on every entity in our list
		for (var o=0; o<entities.length; o++) {
			if (entities[o].draw) {
				this.ctx.save();
				entities[o].draw(this.ctx, this);
				this.ctx.restore();
			}
		}
		
		this.frameCount += 1;
	}
	
	/** Launch an instance of jsGameSoup (generally happens automatically). */
	this.launch = function launch() {
		var GS = this;
		// launch our custom loop
		if (navigator.userAgent.indexOf("MSIE") == -1) {
			var looping = setInterval(function() {
				try {
					GS.gameSoupLoop();
				} catch(e) {
					clearInterval(looping);
					throw(e);
				}
			}, 1000 / this.framerate);
		} else {
			// internet explorer is too hard to debug with try/catch as it forgets the stack :(
			var looping = setInterval(function() { GS.gameSoupLoop(); }, 1000 / this.framerate);
		}
		// DEBUG:
		//setInterval(function() { for (var e=0; e<entities.length; e++) console.log(entities[e].x + ", " + entities[e].y); }, 1000);
		//setInterval(function() { console.log(entities.length) }, 1000);
		//setInterval(function() { console.log(entitiesColliders.length) }, 1000);
	}
	
	/**
		Call this after any entity's priority changes - it's automatically called when new entities are added.
	*/
	this.sortEntities = function() {
		entities.sort(function(a, b) { return a.priority == b.priority ? a.priority_preference - b.priority_preference : a.priority - b.priority; });
	}
	
	/* ********************************************
		Collisions and collision helpers
	 **********************************************/
	
	// TODO: use canvas isPointInPath instead, when it's supported by excanvas
	/* Detect whether a point is inside a polygon (list of points) or not */
	this.pointInPoly = function pointInPoly(pos, poly) {
		/* This code is patterned after [Franklin, 2000]
		http://www.geometryalgorithms.com/Archive/algorithm_0103/algorithm_0103.htm
		Tells us if the point is in this polygon */
		cn = 0
		pts = poly.slice();
		pts.push([poly[0][0], poly[0][1]]);
		for (var i=0; i<poly.length; i++)
			if (((pts[i][1] <= pos[1]) && (pts[i+1][1] > pos[1])) || ((pts[i][1] > pos[1]) && (pts[i+1][1] <= pos[1])))
				if (pos[0] < pts[i][0] + (pos[1] - pts[i][1]) / (pts[i+1][1] - pts[i][1]) * (pts[i+1][0] - pts[i][0]))
		cn += 1
		return cn % 2
	}
	
	/* Detect whether a point is inside a box or not */
	this.pointInBox = function pointInBox(pos, box) {
		return pos[0] >= box[0] && pos[0] <= box[2] && pos[1] >= box[1] && pos[1] <= box[3];
	}
	
	/* Detect whether a point is inside a circle */
	this.pointInCircle = function pointInCircle(pos, circle) {
		return this.distance(pos, circle.slice(0,2)) <= circle[2];
	}
	
	/* ***************************************
	 	Make calls on entity methods
	 *****************************************/
	
	// call a method on an entity if the point is inside the entity's polygon/circle/box
	// used in mouse events to send mouseDown and mouseUp events into the entity
	this.pointInEntitiesCall = function pointInEntitiesCall(pos, fn, arg) {
		var hit = [];
		for (var e=0; e<entities.length; e++) {
			var ent = entities[e];
			if (ent[fn]) {
				if ((ent.pointerPoly && this.pointInPoly(pos, ent.pointerPoly())) || (ent.pointerBox && this.pointInBox(pos, ent.pointerBox())) || (ent.pointerCircle && this.pointInCircle(pos, ent.pointerCircle())) || (ent.pointerTest && ent.pointerTest(pos))) {
					entityEventQueue.push([ent, fn, arg]);
					hit.push(ent);
				}
			}
		}
		return hit;
	}
	
	// call a method on each entity for which that method exists
	// used for key events etc.
	this.entitiesCall = function entitiesCall(fn, arg) {
		this.callAll(entities, fn, arg);
	}
	
	// generalised form of entitiesCall which can be applied on any array of entities
	this.callAll = function callAll(arr, fn, arg) {
		for (var e=0; e<arr.length; e++) {
			if (arr[e][fn]) {
				entityEventQueue.push([arr[e], fn, arg]);
			}
		}
	}
}

	/* *****************************************
	 	Cross platform launching stuff
		(outside JSGameSoup definition)
	 *******************************************/

JSGameSoup.ready = function(fn) {
	JSGameSoup.ready_function = fn;
}

/**
 *	Helper function which is automatically called to launch JSGameSoup on a canvas.
 *
 *	Finds all canvas tags in the document,
 *	calls the function named in the attribute 'jsgs',
 *	passes a new JSGameSoup instance to that function,
 *	fps is set in the attribute called 'fps'.
 *
 *	Modified version of processingjs' init.js example script.
 *
 */

function _FindAndLaunchCanvasJSGS() {
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

// do not run until stylesheets have been applied
// this hack is neccessary because styled divs into
// which the canvas is inserted will break horribly
// on webkit at random.
function _JSGS_test_applied_stylesheets() {
	// insert a styled div into our document body that we will test the width of
	var divtest = document.createElement('div');
	document.body.appendChild(divtest);
	divtest.style.position = "absolute";
	divtest.style.width = "100%";
	divtest.style.height = "100%";
	
	// keep checking whether the div we created is the right size yet
	var checkdiv = function() {
		if (parseInt(divtest.offsetWidth) == 0) {
			// console.log('delayed start');
			setTimeout(checkdiv, 13);
		} else {
			// one it's the right size do the launch
			document.body.removeChild(divtest);
			delete divtest;
			// MAIN LAUNCH
			if (JSGameSoup["ready_function"]) {
			JSGameSoup.ready_function();
			}
			_FindAndLaunchCanvasJSGS();
		}
	}
	// start the check loop
	checkdiv();
}

// Crossplatform document.ready from here:
// http://dean.edwards.name/weblog/2006/06/again/#comment335794
function _JSGS_init() {
  if (arguments.callee.done) return;
  arguments.callee.done = true;
  _JSGS_test_applied_stylesheets();
}

/* Copied from jQuery source */

// Mozilla, Opera and webkit nightlies currently support this event
if ( document.addEventListener ) {
	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", function(){
		document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
		_JSGS_init();
	}, false );
// If IE event model is used
} else if ( document.attachEvent ) {
	// ensure firing before onload,
	// maybe late but safe also for iframes
	document.attachEvent("onreadystatechange", function(){
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", arguments.callee );
			_JSGS_init();
		}
	});
	
	// If IE and not an iframe
	// continually check to see if the document is ready
	if ( document.documentElement.doScroll && window == window.top ) (function(){
		if ( _JSGS_init.done ) return;
		
		try {
			// If IE is used, use the trick by Diego Perini
			// http://javascript.nwbox.com/IEContentLoaded/
			document.documentElement.doScroll("left");
		} catch( error ) {
			setTimeout( arguments.callee, 0 );
			return;
		}

		// and execute any waiting functions
		_JSGS_init();
	})();
}

// onload fallback
_prevOnload = window.onload;
window.onload = function() {
	if (typeof _prevOnload === 'function') _prevOnload();
	_JSGS_init();
};

/* *************************************
	Sweet methods.
   *************************************/

/**
	jQuery style 'each' method (but with the arguments reversed! So you can do e.g. `ar.each(Math.round);)`
	@param function to call on each element of the array. Function should take two arguments: element, index
*/
if (!Array.prototype.each) {
	Array.prototype.each = function(fn) {
		var newarray = [];
		this.fn = fn;
		for (var idx=0; idx<this.length; idx++) {
			newarray[idx] = this.fn(this[idx], idx);
		}
		return newarray;
	}
}

/** 
	Non-buggy modulus that works correctly on negative numbers.
	@param number to mod against
*/
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
}


/* *************************************
 *	Random stuff to support IE.
 * *************************************/

// indexOf
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

/**
	Python style array remove element method 
	@param element to find and remove
*/
if (!Array.prototype.remove) {
	Array.prototype.remove = function(el) {
		var p = this.indexOf(el);
		if (p>=0) {
			this.splice(p, 1);
		}
	}
}

/* On Android versions that don't support it, patch in support it.
	https://github.com/Modernizr/Modernizr/issues/186
	http://code.google.com/p/todataurl-png-js/source/browse/trunk/todataurl.js
*/
function supportsToDataURL() {
	if (window["FlashCanvas"]) {
		return true;
	} else {
		var c = document.createElement("canvas");
		var data = c["toDataURL"] && c.toDataURL("image/png");
		return (data && data.indexOf("data:image/png") == 0);
	}
}

if (!supportsToDataURL()) {
	Number.prototype.toUInt=function(){ return this<0?this+4294967296:this; };
	Number.prototype.bytes32=function(){ return [(this>>>24)&0xff,(this>>>16)&0xff,(this>>>8)&0xff,this&0xff]; };
	Number.prototype.bytes16sw=function(){ return [this&0xff,(this>>>8)&0xff]; };

	Array.prototype.adler32=function(start,len){
		switch(arguments.length){ case 0:start=0; case 1:len=this.length-start; }
		var a=1,b=0;
		for(var i=0;i<len;i++){
			a = (a+this[start+i])%65521; b = (b+a)%65521;
		}
		return ((b << 16) | a).toUInt();
	};

	Array.prototype.crc32=function(start,len){
		switch(arguments.length){ case 0:start=0; case 1:len=this.length-start; }
		var table=arguments.callee.crctable;
		if(!table){
			table=[];
			var c;
			for (var n = 0; n < 256; n++) {
				c = n;
				for (var k = 0; k < 8; k++)
					c = c & 1?0xedb88320 ^ (c >>> 1):c >>> 1;
				table[n] = c.toUInt();
			}
			arguments.callee.crctable=table;
		}
		var c = 0xffffffff;
		for (var i = 0; i < len; i++)
			c = table[(c ^ this[start+i]) & 0xff] ^ (c>>>8);

		return (c^0xffffffff).toUInt();
	};


	(function(){
		var toDataURL=function(){
			var imageData=Array.prototype.slice.call(this.getContext("2d").getImageData(0,0,this.width,this.height).data);
			var w=this.width;
			var h=this.height;
			var stream=[
				0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,
				0x00,0x00,0x00,0x0d,0x49,0x48,0x44,0x52
			];
			Array.prototype.push.apply(stream, w.bytes32() );
			Array.prototype.push.apply(stream, h.bytes32() );
			stream.push(0x08,0x06,0x00,0x00,0x00);
			Array.prototype.push.apply(stream, stream.crc32(12,17).bytes32() );
			var len=h*(w*4+1);
			for(var y=0;y<h;y++)
				imageData.splice(y*(w*4+1),0,0);
			var blocks=Math.ceil(len/32768);
			Array.prototype.push.apply(stream, (len+5*blocks+6).bytes32() );
			var crcStart=stream.length;
			var crcLen=(len+5*blocks+6+4);
			stream.push(0x49,0x44,0x41,0x54,0x78,0x01);
			for(var i=0;i<blocks;i++){
				var blockLen=Math.min(32768,len-(i*32768));
				stream.push(i==(blocks-1)?0x01:0x00);
				Array.prototype.push.apply(stream, blockLen.bytes16sw() );
				Array.prototype.push.apply(stream, (~blockLen).bytes16sw() );
				var id=imageData.slice(i*32768,i*32768+blockLen);
				Array.prototype.push.apply(stream, id );
			}
			Array.prototype.push.apply(stream, imageData.adler32().bytes32() );
			Array.prototype.push.apply(stream, stream.crc32(crcStart, crcLen).bytes32() );

			stream.push(0x00,0x00,0x00,0x00,0x49,0x45,0x4e,0x44);
			Array.prototype.push.apply(stream, stream.crc32(stream.length-4, 4).bytes32() );
			return "data:image/png;base64,"+btoa(stream.map(function(c){ return String.fromCharCode(c); }).join(''));
		};
		
		var tdu=HTMLCanvasElement.prototype.toDataURL;
		
		HTMLCanvasElement.prototype.toDataURL=function(type){

				var res=tdu.apply(this,arguments);
				if(res == "data:,"){
					HTMLCanvasElement.prototype.toDataURL=toDataURL;
					return this.toDataURL();
				}else{
					HTMLCanvasElement.prototype.toDataURL=tdu;
					return res;
				}
		}

	})();
}

/* console.log statement should work on platforms that do not support it. this is pretty awful. */
if (typeof(console) == "undefined") {
	var body = document.getElementsByTagName("body");
	if (body.length) {
		function getDocHeight() {
			var D = document;
			return Math.max(
				Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
				Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
				Math.max(D.body.clientHeight, D.documentElement.clientHeight)
			);
		}
		
		var logarea = document.createElement("pre");
		logarea.style.width = "100%";
		logarea.style.position = "absolute";
		logarea.style.top = (getDocHeight() - 100) + "px";
		logarea.style.height = "50px";
		logarea.style.left = "0px";
		logarea.style.filter = "alpha(opacity=50)";
		logarea.style.opacity = "0.5";
		logarea.style.margin = "0";
		logarea.style.padding = "0";
		logarea.style.overflow = "hidden";
		logarea.style.textAlign = "left";
		logarea.style.borderTop = "1px solid black";
		logarea.style.display = "none";
		
		body[0].appendChild(logarea);
		
		window.console = {
			"log": function(msg) {
				logarea.style.display = "block";
				logarea.innerHTML += msg + "\r\n";
			}
		};
	} else {
		window.console = {
			"log": function(msg) {
				// yikes!
				// alert(msg);
			}
		};
	}
}
