var s = require("../js/multiplayer/server");
s.start();

// access to all clients:
console.log("Clients: " + s.clients);

// custom method to tell which clients are proximate to eachother
s.get_friends = function(client) {
	// return some subset of s.clients that can be seen by client
	// you can access client.state to filter clients
	return s.clients;
}
