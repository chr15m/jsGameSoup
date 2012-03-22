var s = require("../../js/multiplayer/server");
var express = require("express");
// serve the jsGameSoup js folder statically
s.app.use("/js", express.static(__dirname + '/../../js'));

s.start();

// access to all clients:
console.log("Clients: " + s.clients);

// custom method to tell which clients are proximate to eachother
// this one partitions the page into one half and people clicking
// on one half can only see other click/drags on the same half
s.get_friends = function(client) {
	// return some subset of s.clients that can be seen by client
	// you can access client.state to filter clients
	var friends = {};
	for (var c in s.clients) {
		// clients who are on the same side of the box can see eachother
		if (s.clients[c].state && client.state && (Math.floor(s.clients[c].state.position[0] / 150) == Math.floor(client.state.position[0] / 150))) {
			friends[c] = s.clients[c];
		}
	}
	return friends;
}
