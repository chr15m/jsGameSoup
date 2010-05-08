/* seedable random number generator */
function SeedableRandom2d(x, y) {
	this.next = function next() {
		// Random number generator using George Marsaglia's MWC algorithm.
		// Got this from the v8 js engine
		
		// don't let them get stuck
		if (this.x == 0) this.x == -1;
		if (this.y == 0) this.y == -1;
		
		// Mix the bits.
		this.x = this.nextX();
		this.y = this.nextY();
		return ((this.x << 16) + (this.y & 0xFFFF)) / 0xFFFFFFFF + 0.5;
	}
	
	this.nextX = function() {
		return 36969 * (this.x & 0xFFFF) + (this.x >> 16);
	}
	
	this.nextY = function() {
		return 18273 * (this.y & 0xFFFF) + (this.y >> 16);
	}
	
	this.nextInt = function nextInt(a, b) {
		// fetch an integer between a and b inclusive
		return Math.floor(this.next() * (b - a)) + a;
	}
	
	this.seed = function seed(x, y) {
		this.x = x * 2549 + y * 3571;
		this.y = y * 2549 + x * 3571;
		// start with the first iteration so we can be sure two close-together seeds are quite random
		//this.next();
	}
	
	this.seed(x, y);
}
