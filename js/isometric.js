/**
        @class Isometric 3d.
        @description Translate between isometric and 2d/screen coordinate systems.
        @param tilesize is width and height (in 3d pixels) of a single isometric tile. Defaults to 64.
	@param skew is the ratio that the width and height are compressed. 0.5 is the default. 0.75 would be shallower - i.e. more side-on.
*/
Isometric = function(tilesize, skew) {
	var tilesize = tilesize ? tilesize : 64;
	var skew = skew ? skew : 0.5;
	this.screen = null;
	this.pos = [0, 0];
	
	/** Should be an object which publishes .width and .height e.g. a jsGameSoup object so we can stay in the center of it. */
	this.set_screen_object = function(s) {
		this.screen = s;
	}
	
	/** Focus on a particular tile (use floating point number to focus in between tiles). */
	this.set_focus = function(pos) {
		this.pos = pos;
	}
	
	/** Translate screen/pixel coordinates into isometric (ground) coordinates. */
	this.screen_to_world = function(pos) {
		var width = (this.screen ? this.screen.width / 2 : 0);
		var height = (this.screen ? this.screen.height / 2 : 0);
		return [
			-(skew * width - pos[0] * skew - pos[1] + height)/(2 * skew * tilesize) + this.pos[0],
			-(skew * width - pos[0] * skew + pos[1] - height)/(2 * skew * tilesize) + this.pos[1]
		];
	}
	/** Alias for screen_to_world. */
	this.s2w = this.screen_to_world;
	
	/** Translate isometric world coordinates into screen coordinates. */
	this.world_to_screen = function(pos) {
		var x = pos[0] - this.pos[0];
		var y = pos[1] - this.pos[1];
		// default to 0 if z is not supplied
		var z = pos.length == 3 ? pos[2] : 0;
		var width = (this.screen ? this.screen.width / 2 : 0);
		var height = (this.screen ? this.screen.height / 2 : 0);
		return [
			(x + y) * tilesize + width,
			((x - y) * skew - z) * tilesize + height
		];
	}
	/** Alias for world_to_screen. */
	this.w2s = this.world_to_screen;	
 }
