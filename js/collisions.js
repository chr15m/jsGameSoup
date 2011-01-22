/** 
	@namespace
	Test for collisions between arrays of entities. Each collision method accept two arrays of entities. Every entity in the first array will be tested for collisions against every entity in the second array. The two arrays can also be the same to test every entity against every other. When a collision is found between two entities, the collide_xxxx() method will be called on each entity involved in the collision, where "xxxx" is the type of collision (e.g. collide_aabb(), collide_circle(), collide_polygon()). The first argument is the other entity in the collision, and the second argument is the result returned from the collision, which depends on the type of collision (e.g. might be penetration depth or points or just boolean).
*/

collide = {}

// generic function for running fn on all of groupa and groupb
collide.collideall = function(fn, calltype) {
	var fnname = "collide_" + calltype;
	return function(groupa, groupb) {
		for (var a in groupa) {
			for (var b in groupb) {
				var ae = groupa[a];
				var be = groupb[b];
				if (ae != be && groupa.hasOwnProperty(a) && groupb.hasOwnProperty(b)) {
					var collisionresult = fn(ae, be);
					if (collisionresult) {
						if (ae[fnname])
							ae[fnname](be, collisionresult);
						if (be[fnname])
							be[fnname](ae, collisionresult);
					}
				}
			}
		}
	}
}

/**
	Axis-aligned bounding-box collision between two arrays of entities. This expects entities to have a method called get_collision_aabb() which should return a rectangle of the boundaries of the entity with the form [x, y, w, h].
	@param a is an array of entities
	@param b is an array of entities that will be collided with those in group a
*/
collide.aabb = function() {};

collide.collide_aabb_entities = function(a, b) {
	if (b.get_collision_aabb && a.get_collision_aabb) {
		var aaabb = a.get_collision_aabb();
		var baabb = b.get_collision_aabb();
		
		return (!(aaabb[0] > baabb[0] + baabb[2] || 
		baabb[0] > aaabb[0] + aaabb[2] || 
		aaabb[1] > baabb[1] + baabb[3] || 
		baabb[1] > aaabb[1] + aaabb[3]));
	}
}

collide.aabb = collide.collideall(collide.collide_aabb_entities, "aabb");

/**
	Circle collision test between two groups of entities. This expects entities to have a method called get_collision_circle() which should return the center of the circle and the radius like this: return [[x, y], r].
	@param a is an array of entities
	@param b is an array of entities that will be collided with those in group a
*/
collide.circles = function() {};

collide.collide_circle_entities = function(a, b) {
	if (b.get_collision_circle && a.get_collision_circle) {
		var ca = a.get_collision_circle();
		var cb = b.get_collision_circle();
		return Math.pow(ca[0][0] - cb[0][0],2) + Math.pow(ca[0][1] - cb[0][1],2) < Math.pow(ca[1] + cb[1], 2);
	}
}

collide.circles = collide.collideall(collide.collide_circle_entities, "circle");

/**
	Helper function which tests whether a point is within a particular polygon.
	@param pos is a point of the form [x, y]
	@param poly is a polygon defined as a list of points of the form [[x1, y1], [x2, y2], ... [xn, yn]]
 */
var pointInPoly = function(pos, poly) {
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

/**
	Helper function which tests whether two lines intersect.
	@param l1 is a line of the form [[x1, y1], [x2, y2]]
	@param l2 is a line of the form [[x1, y1], [x2, y2]]	
*/
var lineOnLine = function(l1, l2) {
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

/**
	Polygon collision tests whether two entities defined by polygons are touching. Entities should have a get_collision_poly() method which should return an array of lines of the form [[x1, y1], [x2, y2], ... [xn, yn]].
	@param a is an array of entities
	@param b is an array of entities that will be collided with those in group a
*/
collide.polys = function() {};

collide.collide_poly_entities = function(a, b) {
	if (b.get_collision_poly && a.get_collision_poly) {
		var e1 = a.get_collision_poly();
		var e2 = b.get_collision_poly();
		for (var l1=0; l1<e1.length; l1++) {
			for (var l2=0; l2<e2.length; l2++) {
				var compareline1 = [e1[l1], e1[(l1 + 1) % e1.length]];
				var compareline2 = [e2[l2], e2[(l2 + 1) % e2.length]];
				var linesresult = lineOnLine(compareline1, compareline2);
				if (linesresult.length) {
					return [compareline1, compareline2, linesresult];
				}
			}
		}
		// if we get here test if a point from each poly is inside the other
		return pointInPoly(e1[0], e2) || pointInPoly(e2[0], e1);
	}
}

collide.polys = collide.collideall(collide.collide_poly_entities, "poly");
