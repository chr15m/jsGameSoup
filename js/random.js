/**
	@class A fast, deterministic, seedable random number generator.
	@description Unlike the native random number generator built into most browsers, this one is deterministic, and so it will produce the same sequence of outputs each time it is given the same seed. By default it is seeded with the current time, which means the output is effectively non-deterministic. To make the output deterministic (e.g. the same each time) you should seed it with your own number. This code is based on George Marsaglia's MWC algorithm from the v8 Javascript engine.
	@param seed is an optional number to set the initial seed.
*/

function SeedableRandom(seed) {
	// seed with the current time by default
	/** The last value the random number generator was seeded with. */
	this.last_seed = null;
	
	/**
		Get the next random number between 0 and 1 in the current sequence.
	*/
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
	
	/**
		@description Alias for next();
	*/
	this.random = this.next;
	
	this.nextX = function() {
		return 36969 * (this.x & 0xFFFF) + (this.x >> 16);
	}
	
	this.nextY = function() {
		return 18273 * (this.y & 0xFFFF) + (this.y >> 16);
	}
	
	/**
		Get the next random integer in the current sequence.
		@param a The lower bound of integers (inclusive).
		@param gs The upper bound of integers (exclusive).
	*/
	this.nextInt = function nextInt(a, b) {
		if (!b) {
			a = 0;
			b = 0xFFFFFFFF;
		}
		// fetch an integer between a and b inclusive
		return Math.floor(this.next() * (b - a)) + a;
	}
	
	/**
		Seed the random number generator. The same seed will always yield the same sequence. Seed with the current time if you want it to vary each time.
		@param x The seed.
	*/
	this.seed = function(x) {
		this.last_seed = x;
		this.x = x * 3253;
		this.y = this.nextX();
	}
	
	/**
		Seed the random number generator with a two dimensional seed.
		@param x First seed.
		@param y Second seed.
	*/
	this.seed2d = function seed(x, y) {
		this.last_seed = [x, y];
		this.x = x * 2549 + y * 3571;
		this.y = y * 2549 + x * 3571;
	}
	
	/**
		Seed the random number generator with a three dimensional seed.
		@param x First seed.
		@param y Second seed.
		@param z Third seed.
	*/
	this.seed3d = function seed(x, y, z) {
		this.last_seed = [x, y, z];
		this.x = x * 2549 + y * 3571 + z * 3253;
		this.y = x * 3253 + y * 2549 + z * 3571;
	}
	
	// seed the generator with the seed we were passed, or the time as a last resort
	this.seed(seed == null ? (new Date()).getTime() : seed);
}
