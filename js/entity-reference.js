/**
@class ExampleEntity
@description This is the reference implementation of the most important class in the jsGameSoup framework,
which is the entity class. You will create a class like thisfor each type of entity in your game.
You only need to override the methods that your entity needs. For example, if it needs to be drawn
then you need to implement a draw() method. If it needs to change it's state or position, or other
paramters every frame then you should implement an update() method in that entity. If it needs to
collide with other entities there is a class of methods which you can implement to make that happen
too.
*/

function ExampleEntity() {
	/**
		Called every frame to draw this entity.
		@param c The canvas context which you can draw on. See the mozilla canvas documentation for examples of how to do this.
		@param gs The instance of jsGameSoup which is running this entity.
	*/
	this.draw = function (c, gs) {
		// Do your drawing stuff in here
	}
	
	/**
		Called every frame to update the state or position of this entity.
		@param gs The instance of jsGameSoup which is running this entity.
	*/
	this.update = function (gs) {
		// Do your updating stuff here
	}
}
