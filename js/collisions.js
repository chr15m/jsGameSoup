/** All collision methods accept two groups of entities to be collided against eachother. Each of the first array of entities will be tested against the second array of entities. The two arrays can also be the same to test every entity against every other. When a collision is found between two entities, the collide() method will be called on the entity. The first argument is the other entity in the collision, and the second argument is the type of collision. */

collide = {}

/* axis-aligned bounding-box collision between two groups of entities. This expects all entities to have a method called aabb() which returns a rectangle of the boundaries of the entity with the form [x, y, w, h]. */
collide.aabb = function(groupa, groupb) {
	for (var a=0; a<groupa.length; a++) {
		for (var b=0; b<groupb.length; b++) {
			if (groupa[a] != groupb[b]) {
				collide.aabb_entities(groupa[a], groupb[b]);
			}
		}
	}
}

collide.aabb_entities = function(a, b) {
	if (b.aabb && a.aabb) {
		var aaabb = a.aabb();
		var baabb = b.aabb();
		
		if (!(aaabb[0] > baabb[0] + baabb[2] || 
		baabb[0] > aaabb[0] + aaabb[2] || 
		aaabb[1] > baabb[1] + baabb[3] || 
		baabb[1] > aaabb[1] + aaabb[3])) {
			if (a.collide)
				a.collide(b, "aabb");
			if (b.collide)
				b.collide(a, "aabb");
		}
	}
}

// TODO: uncomment poly collisions below
// TODO: do circle collisions

/*
	this.lineOnLine = function lineOnLine(l1, l2) {
		// Detects the intersection of two lines
		//   http://www.kevlindev.com/gui/math/intersection/Intersection.js
		var a1 = l1[0];
		var a2 = l1[1];
		var b1 = l2[0];
		var b2 = l2[1];
		var a1x = a1[0];
		var a1y = a1[1];
		var a2x = a2[0];
		var a2y = a2[1];
		var b1x = b1[0];
		var b1y = b1[1];
		var b2x = b2[0];
		var b2y = b2[1];
		
		var ua_t = (b2x - b1x) * (a1y - b1y) - (b2y - b1y) * (a1x - b1x);
		var ub_t = (a2x - a1x) * (a1y - b1y) - (a2y - a1y) * (a1x - b1x);
		var u_b  = (b2y - b1y) * (a2x - a1x) - (b2x - b1x) * (a2y - a1y);
		
		if (u_b) {
			var ua = ua_t / u_b;
			var ub = ub_t / u_b;
			
			if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
				// intersection
				return [a1x + ua * (a2x - a1x), a1y + ua * (a2y - a1y)];
			} else {
				return [];
			}
		} else {
			if (ua_t == 0 || ub_t == 0) {
				// coincident
				//return [line2]
				//this will be caught elsewhere anyway
				return [(a2x + a1x) / 2, (a2y + a1y) / 2];
			} else {
				// parallel
				return [];
			}
		}
	}
	
	for (var o=0; o<entitiesColliders.length; o++) {
		for (var e=o; e<entitiesColliders.length; e++) {
			if (e != o) {
				if (this.collidePolyPoly(entitiesColliders[o].collisionPoly(), entitiesColliders[e].collisionPoly())) {
					if (entitiesColliders[o].collided)
						entitiesColliders[o].collided(entitiesColliders[e]);
					if (entitiesColliders[e].collided)
						entitiesColliders[e].collided(entitiesColliders[o]);
				}
			}
		}
	}
	
	// Test whether two polygons are touching
	this.collidePolyPoly = function collidePolyPoly(e1, e2) {
		var collided = false;
		for (var l1=0; l1<e1.length; l1++) {
			for (var l2=0; l2<e2.length; l2++) {
				if (this.lineOnLine([e1[l1], e1[(l1 + 1) % e1.length]], [e2[l2], e2[(l2 + 1) % e2.length]]).length) {
					collided = true;
				}
			}
		}
		return collided;
	}
*/	
