// this is an entity that uses sylvester.js vector types to calculate it's new velocity based on the other bodies
function Thing(gs, crowd) {
	// position, velocity, and mass of this object (random)
	this.position = $V([Math.random() * gs.width, Math.random() * gs.height]);
	this.lastposition = this.position.dup();
	this.velocity = $V([0.0, 0.0]);
	this.mass = Math.max(0.1, Math.random()) * Math.sqrt(gs.width^2 + gs.height^2);
	
	this.update = function() {
		// every frame calculate a new velocity based on proximity and mass of the other bodies
		for (var c=0; c<crowd.length; c++) {
			var a = this.lastposition;
			var b = crowd[c].lastposition;
			var distance = a.distanceFrom(b);
			var mass = (this.mass + crowd[c].mass) / 2;
			this.velocity = this.velocity.add(b.subtract(a).x(mass).x(1.0/Math.max(0.00001, distance)).x(0.001));
		}
		// update my position with my new velocity, remember my old position for calculations
		this.lastposition = this.position.dup();
		this.position = this.position.add(this.velocity);
	}
	
	this.draw = function(c, gs) {
		c.fillStyle = "rgb(0, 0, 0)";
		c.strokeStyle = "rgb(150, 150, 150)";
		c.lineWidth = 2;
		// every frame draw a circle with a radius equal to my mass
		c.beginPath();
		c.arc(this.lastposition.e(1), this.lastposition.e(2), this.mass, 0, Math.PI * 2, false);
		c.fill();
		c.closePath();
		var vec = this.position.subtract(this.lastposition).multiply(-5).add(this.lastposition);
		c.beginPath();
		c.moveTo(this.lastposition.e(1), this.lastposition.e(2));
		c.lineTo(vec.e(1), vec.e(2));
		c.closePath();
		c.stroke();
	}
}

// Blastoff
function launch() {
	var crowd = [];
	var gs = new JSGameSoup(document.getElementById("surface"), 24);
	// add twenty bodies to the game with a shared array so they can see eachother
	for (var i=0; i<10; i++) {
		crowd.push(gs.addEntity(new Thing(gs, crowd)));
	}
	gs.launch();
}
