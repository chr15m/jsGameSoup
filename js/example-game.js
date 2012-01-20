/**
	@class Example code in the form of a simple "falling game" where the player must try to stay on the screen as platforms move past them upward.
*/
function ExampleGame(gs) {
	// seedable random number generator for building the world
	var r = new SeedableRandom();
	var d = new Date;
	r.seed(d.getTime());
	// vertical separation of platform layers
	X_SEPARATION = 300;
	Y_SEPARATION = 150;
	
	/* The player class */
	function Player(world) {
		this.type = 'player';
		// constants
		var MAX_VY = 20;
		var WALK_VX = 3;
		var WALK_FRAMES = 3;
		var FALL_FRAMES = 2;
		// position
		var pos = this.pos = [gs.width / 2, gs.height / 2];
		// velocity
		var vx = 0;
		var vy = 0;
		// sprite which represents the player
		var p = new Sprite(["center", "bottom"], {
			"stand": [["img/character-stand.png", 0],],
			"walk right": [["img/character-walk-right-1.png", WALK_FRAMES], ["img/character-walk-right-2.png", WALK_FRAMES], ["img/character-walk-right-3.png", WALK_FRAMES], ["img/character-walk-right-2.png", WALK_FRAMES],],
			"walk left": [["img/character-walk-left-1.png", WALK_FRAMES], ["img/character-walk-left-2.png", WALK_FRAMES], ["img/character-walk-left-3.png", WALK_FRAMES], ["img/character-walk-left-2.png", WALK_FRAMES],],
			"fall": [["img/character-fall-1.png", FALL_FRAMES], ["img/character-fall-2.png", FALL_FRAMES],],
		},
		// callback gets called when everything is loaded
		function() {
			p.action("stand");
		});
		
		/* Concurrency stuff */
		
		// draw the player's sprite every frame
		this.draw = function(c) {
			p.draw(c, world.camera(pos));
		}
		
		this.updateanimation = function() {
			if (vy > world.gravity * 2) {
				p.action("fall");
			} else {
				if (vx >= WALK_VX) {
					p.action("walk right");
				} else if (vx <= -WALK_VX) {
					p.action("walk left");
				} else {
					p.action("stand");
				}
			}
		}
		
		// update the player's position every frame
		this.update = function() {
			vy = Math.min(vy + world.gravity, MAX_VY);
			this.updateanimation();
			pos[0] += vx;
			pos[1] += vy;
			p.update();
			if (pos[1] > p.height + gs.height || pos[1] < 0) {
				document.getElementById("gameover").style.paddingTop = gs.height / 2 - 100;
				document.getElementById("gameover").style.display = "block";
			}
		}
		
		/* collision stuff */
		
		// return the bounding box of our sprite for the collision test
		this.get_collision_aabb = function() {
			return p.aabb(pos);
		}
		
		/* input events stuff */
		this.keyDown_37 = function () {
			this.updateanimation();
			vx = -WALK_VX;
		}
		
		this.keyUp_37 = this.keyUp_39 = function() {
			this.updateanimation();
			vx = 0;
		}
		
		this.keyDown_39 = function () {
			this.updateanimation();
			vx = WALK_VX;
		}
		
		// basic comparison function
		var cmp = function(x, y){ return x[0] < y[0] ? 1 : x[0] > y[0] ? -1 : 0; };
		
		// if the axis aligned bouding box of this entity collides with another
		this.collide_aabb = function(who) {
			if (who.type == 'platform') {
				var ab = this.get_collision_aabb();
				var bb = who.get_collision_aabb();
				
				var sides = [
						[bb[1] - (ab[1] + ab[3]), 1, 1],
						[bb[0] - (ab[0] + ab[2]), 0, 1],
						[ab[0] - (bb[0] + bb[2]), 0, -1],
						[ab[1] - (bb[1] + bb[3]), 1, -1]
				];
				sides.sort(cmp);
				var d = sides[0];
				// hit a vertical side
				if (d[1]) {
					if (pos[0] > bb[0] + bb[2]) {
						pos[0] += WALK_VX;
					} else if (pos[0] < bb[0]) {
						pos[0] -= WALK_VX;
					} else {
						pos[1] = bb[1];
						vy = 0;
						this.updateanimation();
					}
				} else {
					// horizontal side
					if (pos[0] > bb[0] + bb[2]) {
						pos[0] += WALK_VX;
					} else if (pos[0] < bb[0]) {
						pos[0] -= WALK_VX;
					}
				}
			}
		}
		/*this.keyDown = function (keyCode) {
			console.log(keyCode);
		}*/
	}
	
	/* A prop in the world. */
	function Prop(world, platform) {
		this.type = 'prop';
		var propfile = null;
		var offset = 0;
		
		// choose a random sprite to load for this prop
		if (r.nextInt(0, 5) == 0) {
			propfile = "img/prop-" + ["tyre", "lamp", "bench"][r.nextInt(0, 3)] + ".png";
		} else {
			propfile = "img/tree";
			if (r.nextInt(0, 2))
				propfile += "-pine";
			propfile += "-" + r.nextInt(1, 4) + ".png";
		}
		
		// instantiate the sprite
		var p = new Sprite(["center", "bottom"], {"default": [[propfile, 0]]}, function() {
			p.action("default");
			offset = (r.next() - 0.5) * (platform.get_collision_aabb()[2] - p.width / 2);
		});
		
		// draw this prop's sprite every frame
		this.draw = function(c) {
			p.draw(c, world.camera([platform.pos[0] + offset, platform.pos[1] + 1]));
		}
	}
	
	/* Platform */
	function Platform(world, pos) {
		this.type = 'platform';
		// the list of props sitting on this platform
		var props = [];
		// current position
		this.pos = pos;
		// closureify
		var platform = this;
		
		// get the sprite for this platform
		var p = this.sprite = new Sprite(["center", "top"], {"default": [["img/platform-" + r.nextInt(1, 5) + ".png", 0]]}, function() {
			// once the sprite is loaded do some init
			p.action("default");
		});
		
		// called when this entity is added
		this.init = function() {
			// make me some props
			for (var i = 0; i < r.nextInt(1, 4); i++) {
				props.push(new Prop(world, this));
				gs.addEntity(props[props.length - 1]);
			}
		}
		
		// update this platform's position every frame
		this.update = function() {
			pos[1] -= world.upspeed;
			// if the platform has moved off the screen the get rid of it
			if (pos[1] < -200) {
				for (var i = 0; i < props.length; i++) {
					gs.delEntity(props[i]);
					delete props[i];
				}
				gs.delEntity(this);
				world.remove(this);
			}
			p.update();
		}
		
		// draw this platform's sprite every frame
		this.draw = function(c) {
			p.draw(c, world.camera(pos));
		}
		
		// return the bounding box of our sprite for the aabb collision test
		this.get_collision_aabb = function() {
			return p.aabb(pos);
		}
	}
	
	/* World */
	function World() {
		// how much gravity to apply to objects each frame
		this.gravity = 0.4;
		// how fast the props etc. should move upwards
		this.upspeed = 1; //0.09;
		// where the camera is centered
		this.cpos = gs.width / 2;
		// how far has the user progressed downwards?
		this.distance = 0;
		// last time we created new platforms
		var lastupdate = 0;
		
		// background colour
		var bg = 'rgba(240, 255, 255, 1.0)';
		var player = new Player(this);
		var platforms = [];
		
		// defines a simple screen-relative camera method
		this.camera = function(pos) {
			return [pos[0] - this.cpos + gs.width / 2, pos[1]];
		}
		
		// called when we are first added
		this.init = function() {
			gs.addEntity(player);
			platforms.push(gs.addEntity(new Platform(this, [gs.width / 2, gs.height / 2])));
			for (var y = gs.height / 2 + Y_SEPARATION; y < gs.height + Y_SEPARATION; y += Y_SEPARATION) {
				this.addrow(y);
			}
		}
		
		// called every frame to draw the background
		this.draw = function() {
			gs.background(bg);
		}
		
		// called every frame to run the game, collisions, etc.
		this.update = function() {
			// detect collisions between the player and the props
			collide.aabb([player], platforms);
			// update the camera position
			this.cpos += (player.pos[0] - this.cpos) * 0.5;
			// increment the total distance travelled
			this.distance += this.upspeed;
			// each time we overflow create new platforms
			if (Math.floor(this.distance / Y_SEPARATION) > lastupdate) {
				lastupdate = Math.floor(this.distance / Y_SEPARATION);
				this.addrow(gs.height + Y_SEPARATION);
			}
			// constantly increase the speed of platforms moving up
			this.upspeed += 0.001;
		}
		
		/* mouse/finger detection */

		this.pointerDown = function() {
			if (gs.pointerPosition[0] < gs.width / 2) {
				player.keyDown_37();
			} else {
				player.keyDown_39();
			}
		}
		
		this.pointerUp = function() {
			player.keyUp_37();
		}
		
		this.pointerBox = function() {
			return [0, 0, gs.width, gs.height];
		}
		
		// remove a platform from the world
		this.remove = function(which) {
			platforms.remove(which);
			//console.log(platforms.length);
			gs.delEntity(which);
		}
		
		// add a new random row of platforms to the world
		this.addrow = function(y) {
			for (var x = player.pos[0] - gs.width / 2; x < player.pos[0] + gs.width / 2; x += X_SEPARATION) {
				platforms.push(gs.addEntity(new Platform(this, [x, y])));
			}
		}
	}
	
	// preload all of the sprites we will use in this game
	Sprite.preload([
			"img/character-fall-1.png",
			"img/character-fall-2.png",
			"img/character-stand.png",
			"img/character-walk-left-1.png",
			"img/character-walk-left-2.png",
			"img/character-walk-left-3.png",
			"img/character-walk-right-1.png",
			"img/character-walk-right-2.png",
			"img/character-walk-right-3.png",
			"img/makeleft.sh",
			"img/platform-1.png",
			"img/platform-2.png",
			"img/platform-3.png",
			"img/platform-4.png",
			"img/prop-bench.png",
			"img/prop-lamp.png",
			"img/prop-tyre.png",
			"img/tree-1.png",
			"img/tree-2.png",
			"img/tree-3.png",
			"img/tree-pine-1.png",
			"img/tree-pine-2.png",
			"img/tree-pine-3.png",
		],
		// create the world
		function() { gs.addEntity(new World()); }
	);
}

// this launch function is called by the HTML document to start the game
// the HTML document has a div tag called 'surface'
function launch() {
	// grab the surface div and insert a canvas of the same size inside it
	var surface = document.getElementById("surface");
	var newcanvas = document.createElement("canvas");
	// set the width and height of our canvas to be the same as the container div
	newcanvas.style.width = newcanvas.width = (surface.offsetWidth + 1);
	newcanvas.style.height = newcanvas.height = (surface.offsetHeight + 1);
	surface.appendChild(newcanvas);
	// launch the gamesoup loop on the new canvas we just created
	var gs = new JSGameSoup(newcanvas, 30);
	ExampleGame(gs);
	gs.launch();
}
