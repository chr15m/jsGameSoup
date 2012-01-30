/**	@class Method to turn an entity into a simple finite state machine.
	@description Allows you to give any game entity multiple update, draw, and event handling routines, and switch between them quickly and easily. Furnishes your entity with a new method "set_state(name)" which sets the state and methods to that name. For example, if you have a method running_draw() and a method standing_draw(), when you call set_state("running") the running_draw() method will be set as the main draw() method. This is true of any method prefixed with "running_" e.g. running_update() and running_keyDown_37() for example. The named init method (e.g. "running_init") for each state will also get called when you transition to that state.
	@param entity is the game entity you want to turn into a finite state machine.
*/
function statemachine(entity) {
	entity.state = "";
	entity.set_state = function(newstate) {
		// loop through every method and find the ones we want to change to
		for (var m in this) {
			if (!m.indexOf(newstate + "_") && typeof(this[m]) == "function") {
				var parts = m.split("_");
				if (parts.length == 2) {
					this[parts[1]] = this[m];
				}
			}
		}
		this.state = newstate;
		// call the init method for this state upon entering
		if (typeof(this[newstate + "_init"]) == "function") {
			this[newstate + "_init"]();
		}
	}
	return entity;
}
