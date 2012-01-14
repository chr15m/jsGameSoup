/*
Copyright (C) 2009 by Benjamin Hardin
http://46dogs.blogspot.com/2009/10/star-pathroute-finding-javascript-code.html

Copyright (C) 2012 by Chris McCormick
(modifications to the original source for jsGameSoup inclusion)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/**
	@class AStar path finding algorithm implementation by Benjamin Hardin.
	@description Finds a path between two different squares on a two dimensional board of squares with some squares marked as impassable. Original MIT licensed source code from http://46dogs.blogspot.com/2009/10/star-pathroute-finding-javascript-code.html
	@param initial_board is a two dimensional array of 1/0 values for passable/non-passable squares.
*/
function AStar(initial_board) {
	var board = initial_board;
	
	/**	@method 
		@description Finds a short path between two points on a 2 dimensional board.
		@param start is a two-value array of x, y position e.g. [5, 4]
		@param destination is a two-value array of x, y position e.g. [5, 4]
	*/
	this.find_path = function(start, destination)
	{
		var columns = board.length;
		var rows = board[0].length;
		// Create start and destination as true nodes
		start = new this.Node(start[0], start[1], -1, -1, -1, -1);
		destination = new this.Node(destination[0], destination[1], -1, -1, -1, -1);
		
		var open = []; // List of open nodes (nodes to be inspected)
		var closed = []; // List of closed nodes (nodes we've already inspected)
		
		var g = 0; // Cost from start to current node
		var h = this.heuristic(start, destination); // Cost from current node to destination
		var f = g+h; // Cost from start to destination going through the current node
		
		// Push the start node onto the list of open nodes
		open.push(start); 
		
		//Keep going while there's nodes in our open list
		while (open.length > 0)
		{
			// Find the best open node (lowest f value)
			
			// Alternately, you could simply keep the open list sorted by f value lowest to highest,
			// in which case you always use the first node
			var best_cost = open[0].f;
			var best_node = 0;
			
			for (var i = 1; i < open.length; i++)
			{
				if (open[i].f < best_cost)
				{
					best_cost = open[i].f;
					best_node = i;
				}
			}
			
			// Set it as our current node
			var current_node = open[best_node];
			
			// Check if we've reached our destination
			if (current_node.x == destination.x && current_node.y == destination.y)
			{
				var path = [destination]; //Initialize the path with the destination node

				// Go up the chain to recreate the path 
				while (current_node.parent_index != -1)
				{
					current_node = closed[current_node.parent_index];
					path.unshift(current_node);
				}

				return path;
			}
			
			// Remove the current node from our open list
			open.splice(best_node, 1);
			
			// Push it onto the closed list
			closed.push(current_node);
			
			// Expand our current node (look in all 8 directions)
			for (var new_node_x = Math.max(0, current_node.x-1); new_node_x <= Math.min(columns-1, current_node.x+1); new_node_x++)
				for (var new_node_y = Math.max(0, current_node.y-1); new_node_y <= Math.min(rows-1, current_node.y+1); new_node_y++)
				{
					if (board[new_node_x][new_node_y] == 0 // If the new node is open
						|| (destination.x == new_node_x && destination.y == new_node_y)) //or the new node is our destination
					{
						// See if the node is already in our closed list. If so, skip it.
						var found_in_closed = false;
						for (var i in closed)
							if (closed[i].x == new_node_x && closed[i].y == new_node_y)
							{
								found_in_closed = true;
								break;
							}
						
						if (found_in_closed)
							continue;
						
						// See if the node is in our open list. If not, use it.
						var found_in_open = false;
						for (var i in open)
							if (open[i].x == new_node_x && open[i].y == new_node_y)
							{
								found_in_open = true;
								break;
							}
						
						if (!found_in_open)
						{
							var new_node = new this.Node(new_node_x, new_node_y, closed.length-1, -1, -1, -1);

							new_node.g = current_node.g + Math.floor(Math.sqrt(Math.pow(new_node.x-current_node.x, 2)+Math.pow(new_node.y-current_node.y, 2)));
							new_node.h = this.heuristic(new_node, destination);
							new_node.f = new_node.g+new_node.h;

							open.push(new_node);
						}
					}
				}
		}

		return [];
	}
	
	/**
		@method
		@description Update the board to a new configuration.
		@param new_board is the new board data - a two dimensional array.
	*/
	this.update_board = function(new_board) {
		board = new_board
	}
	
	/**	
		@method
		@description Function that defines the heuristic for closeness of two nodes. Override this to define your own heuristic for distance between two nodes. An A* heurisitic must be admissible, meaning it must never overestimate the distance to the goal. In other words, it must either underestimate or return exactly the distance to the goal.
		@param current_node is the source node we are measuring a path from in the current iteration.
		@param destination_node is the endpoint of the current path being tested.
	*/
	this.heuristic = function(current_node, destination_node) {
		var x = current_node.x - destination_node.x;
		var y = current_node.y - destination_node.y;
		return x * x + y * y;
	}
	
	/* Representation of a node being tested in the 2d board. */
	this.Node = function(x, y, parent_index, g, h, f) {
		this.x = x;
		this.y = y;
		this.parent_index = parent_index;
		this.g = g;
		this.h = h;
		this.f = f;
	}
}
