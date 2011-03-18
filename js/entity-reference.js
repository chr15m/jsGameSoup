/**
	@class Example implementation showing the properties and methods that a jsGameSoup entity can have.
	@description This is the reference implementation of the most important class in the jsGameSoup framework, which is the entity class. You will create a class like thisfor each type of entity in your game. You only need to override the methods that your entity needs. For example, if it needs to be drawn then you need to implement a draw() method. If it needs to change it's state or position, or other parameters every frame then you should implement an update() method in that entity etc.
*/

function ExampleEntity() {
	/** @description the priority parameter defines the order of execution and drawing of every entity. By default, entities have the priority in which they were added. If you dynamically change an entity's priority you should call the sortEntities() method on the jsGameSoup instance for your game. E.g. in your update(gs) method you would call gs.sortEntities() after updating an entity's priority. */
	this.priority = 1;
	
	/**
		Called as soon as this entity is added to the game. Use this to set up various entity parameters based upon the running game.
		@param gs The instance of jsGameSoup which is running the game.
	**/
	this.init = function(gs) {
	}

	/**
		Called every frame to draw this entity.
		@param c The canvas context which you can draw on. See the mozilla canvas documentation for examples of how to do this. You can use the Sprite() class and Sprite.draw() if you are just drawing sprites.
		@param gs The instance of jsGameSoup which is running this entity.
	*/
	this.draw = function (c, gs) {
		// Do your drawing stuff in here
	}
	
	/**
		Called every frame to update the state or position, or whatever, of this entity. You should put any code which updates this entity's state inside this method.
		@param gs The instance of jsGameSoup which is running this entity.
	*/
	this.update = function (gs) {
		// Do your updating stuff here
	}
	
	/**
		Called when a key is pressed.
		@param keyCode is the Javascript keyCode returned by the browser.
	*/
	this.keyDown = function (keyCode) {
		console.log("keyDown: " + keyCode);
	}
	
	/**
		Called when a key is released.
		@param keyCode is the Javascript keyCode returned by the browser.
	*/
	this.keyUp = function (keyCode) {
		console.log("keyUp: " + keyCode);
	}
	
	/**
		keyHeld_XX is called during every frame when the key with keyCode XX is held down. In this case, it's keyCode 32 which is the spacebar. This function would get called every frame during which the spacebar is held down.
	*/
	this.keyHeld_32 = function () {
		console.log("keyHeld_32");
	}
	
	/**
		keyDown_XX is called when the key with keyCode XX is pressed. In this case, it's keyCode 32 which is the spacebar. Each time the spacebar is pressed, this function would get called.
	*/
	this.keyDown_32 = function () {
		console.log("keyDown_32");
	}
	
	/**
		keyUp_XX is called when the key with keyCode XX is released. In this case, it's keyCode 32 which is the spacebar. Each time the spacebar is released, this function would get called.
	*/
	this.keyUp_32 = function () {
		console.log("keyUp_32");
	}
	
	/**
		Gets called when the pointer/mouse/finger is moved inside the entity's bounds. You can define the bounds of the entity with pointerPoly(), pointerBox(), or pointerCircle(), or all three. You can use the variable gs.pointerPosition to retrieve the last known position of the pointer.
	*/
	this.pointerMove = function () {
		console.log("pointerMove");
	}
	
	/**
		Gets called when the pointer/mouse/finger is pressed inside this entity's bounds. You can define the bounds of the entity with pointerPoly(), pointerBox(), or pointerCircle(), or all three.
		@param i represents the pointer button which was pressed. (e.g. 1 = "mouse button 1")
	*/
	this.pointerDown = function (i) {
		console.log("pointerDown: " + i);
	}
	
	/**
		Gets called when the pointer/mouse/finger is released inside this entity's bounds. You can define the bounds of the entity with pointerPoly(), pointerBox(), or pointerCircle(), or all three.
		@param i represents the pointer button which was pressed. (e.g. 1 = "mouse button 1")
	*/
	this.pointerUp = function (i) {
		console.log("pointerUp: " + i);
	}
	
	/**
		If defined, this method allows the entity to receive pointer events (like mouse clicks or finger touches) by returning the coordinates of a polygon to receive events. This function should return a list of points which define the bounds of this entity. e.g. [[x1, y1], [x2, y2] ... [xn, yn]]
	*/
	this.pointerPoly = function () {
		return this.poly;
	}
	
	/**
		If defined, this method allows the entity to receive pointer events (like mouse clicks or finger touches) by returning the coordinates of a box to receive events. This function should return a list of four points corresponding to the absolute coordinates, e.g. [left, top, right, bottom].
	*/
	this.pointerBox = function () {
		return this.box;
	}
	
	/**
		If defined, this method allows the entity to receive pointer events (like mouse clicks or finger touches) by returning the coordinates and radius of a circle to receive events. This function should return a list of three numbers corresponding to the position and radius, e.g. [x, y, radius]
	*/
	this.pointerCircle = function () {
		return this.circle;
	}
	
	/**
		This method can provide it's own test for whether a touch event is inside this entity. Useful for more complex hit-zone shapes, multiple shapes, etc.
	*/
	this.pointerTest = function(pos) {
		return pos_is_inside_me(pos);
	}
	
	/**
		This method is called where xxxx is a collision type as defined in collide.js such as aabb, circle, or polygon, if this entity is involved in such a collision. See the collision documentation for more information.
	*/
	this.collide_xxxxx = function () {
		return this.poly;
	}
}
