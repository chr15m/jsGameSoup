/*
	jsGameSoup generic multiplayer server.
	
	Copyright Chris McCormick, 2011.
	Licensed under the terms of the AGPLv3.
	See the file COPYING for details.
	
	(Basically you need to make any modifications to this
	code public if you run this server on a public network).
*/

// TODO: server side filter for state data (user supplied function)
// TODO: example of server which updates client states
// TODO: try and get keepalive working on ff
// TODO: create private/public ID map to prevent cheating (or just strip random number?)

var express = require('express');
var app = express.createServer();

// source served client files come from here
var client_dir = process.cwd();

// static serve our files
app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.logger({ format: ':url :method' }));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

/* Statically serve multiplayer.js and test page ****************************************************/

// statically serve the client side multiplayer library
app.get('/multiplayer.js', function(req, res) {
	res.sendfile(__dirname + '/multiplayer.js');
});

// statically serve the test page
app.get('/test', function(req, res) {
	res.sendfile(__dirname + '/test.html');
});

// give the user access to the express app itself
this.app = app;

/* dynamic ajaxy stuff for client ****************************************************************/

// unique ID counter for clients
var lastID = 1;

/** list of clients who are currently long-polling. Public access to this list so custom servers can do what they want with it. */
var clients = this.clients = {};

// closure ourself
var server = this;

/** method used by the server to determine which data should be sent to which clients from which other clients. Override this to provide custom behaviour.
	@param client is the client being tested.
	@return a list of clients who know about client.
 **/
this.get_friends = function(client) {
	return clients;
}

/** logging function - override this if you want something else to happen to logs than printing to stdout.
	@param msg is the message to write.
 */
this.log = function(msg) {
	console.log(msg);
}

/** process the data from a client before it goes out.
	@param incoming_data
	@return modified incoming data
*/
this.pre_process = function(data) {
	return data;
}

// utility function for logging the number of clients connected
function log_num_clients() {
	var c=0;
	for (x in clients) {
		c++;
	}
	server.log(c + " clients connected");
}

/* Client object stores everything we know about a client and their socket connections. **********/

function Client(id) {
	// queue with outgoing one-time message data for this client
	var queue = [];
	// transient connection back to the client
	var poller = null;
	// when did the last poll start?
	var poll_start = 0;
	// timer to keep track of whether we should expire soon or what
	var forget_me = null;
	// representation of this client's state data 
	this.state = null;
	// maintain a last_friends_list to send disconnect/connect
	// when the friends list changes on state/message
	this.old_friends = [];
	
	// push new notifications onto the queue
	// wait will stop the send attempt
	this.push = function(msg, originator, wait) {
		// add the originating client ID to the msg
		if (originator) msg['id'] = originator;
		// add the latest data to our outgoing queue
		queue.push(msg);
		// don't try the send if they have set this to false
		if (!wait) {
			// try to send everything in our queue
			this.try_send();
		}
	}
	
	// close off the poller we previously had connected
	this.close = function() {
		// send an empty message to close the poll
		this.push("");
		server.log(" -> Poller closed: " + id);
	}
	
	// kill off a particular client
	this.kill = function() {
		// tell all other clients this client is gone
		for (var c in this.get_friends()) {
			clients[c].push({"type": "client_disconnected"}, id);
		}
		// if we have a current poller (should never happen) disconnect it in case
		if (poller) {
			poller.res.end("");
		}
		server.log(" -> Dead: " + id);
		// remove us from the list of clients (should get garbage collected)
		delete clients[id];
		log_num_clients();
	}
	
	// get a list of friends of this client
	// if the friend list has changed tells old and new friends
	this.get_friends = function(ignore) {
		// get a new list of our current friends
		var friends = server.get_friends(this);
		// list of friends who also need to check if we are still their friend
		var notify = {};
		
		// find friends who are in old_friends but no longer friends
		for (var c in this.old_friends) {
			if (!(c in friends)) {
				// tell this client those friends which have left (don't close socket yet)
				this.push({"type": "client_left"}, c, true);
				// we want the friend to also check if we are still in their list
				notify[c] = this.old_friends[c];
			}
		}
		
		// we want state from new friends
		for (var c in friends) {
			if (!(c in this.old_friends)) {
				// the state of this friend
				var friend_state = friends[c].state;
				// only send their state if they have one
				if (friend_state != null) {
					// push this out but don't close the socket just yet
					this.push({"type": "client_state", "state": friend_state}, c, true);
					// we want the friend to also check if we are still in their list
					notify[c] = friends[c];
				}				
			}
		}
		
		// remember the list of our current friends
		this.old_friends = friends;
		
		// run get_friends on the friends who we noticed changed so they will notice us change
		for (var c in notify) {
			if (c != ignore) {
				// make sure we do not get re-checked on the rebound
				notify[c].get_friends(id);
			}
		}
		
		// finally, try to do the send of all data we pushed
		this.try_send();
		
		return friends;
	}
	
	// save up the last poller from this connection
	this.set_poller = function(req, res) {
		// if they have never polled before send them initial state of other clients
		if (poll_start == 0) {
			// list of our friends
			for (var c in this.get_friends()) {
				// the state of this friend
				var friend_state = clients[c].state;
				// only send their state if they have one
				if (friend_state != null) {
					// push this out but don't close the socket just yet
					this.push({"type": "client_state", "state": friend_state}, c, true);
				}
			}
		}
		// if we already have a registered poller, disconnect it
		if (poller) {
			this.close();
		}
		// the transport we are going to use to send data to the client
		poller = {"req": req, "res": res};
		// try to send everything in our queue
		this.try_send();
		// set the time this poll started
		poll_start = this.touch();
	}
	
	this.try_send = function() {
		// do we have data to send to this client?
		if (queue.length && poller) {
			// send them all queued data
			poller.res.send(JSON.stringify(queue));
			// the transport is closed now
			this.forget_poller();
			// empty the queue
			queue = [];
		}
	}
	
	// poller has closed so forget it
	this.forget_poller = function() {
		poller = null;
		var me = this;
		// don't set it more than once
		if (!forget_me) {
			// in five seconds time we will die if not heard back from
			forget_me = setTimeout(function() {
				me.kill();
			}, 5000);
		}
	}
	
	// update the last time we heard from this client
	this.touch = function() {
		// if we have a death-watch lined up, clear it now since we're alive
		if (forget_me) {
			clearTimeout(forget_me);
			forget_me = null;
		}
		// set and return the current time
		return this.last = new Date().getTime();
	};
	this.touch();
	
	// if this client has been polling too long
	this.has_poll_expired = function() {
		// close out requests older than 10 seconds
		return poller && ((new Date().getTime() - 10000) > poll_start);
	}
	
	// we haven't heard from this client for too long
	this.is_dead = function() {
		// a client we haven't heard from for 30 seconds?
		return (new Date().getTime() - 30000) > this.last;
	}
	
	// update our state
	this.set_state = function(new_state) {
		// set our new state
		this.state = new_state;
		// send the new state to all of our friends
		for (var c in this.get_friends()) {
			// tell them our own new state
			clients[c].push({"type": "client_state", "state": this.state}, id);
		}
		// we are still active
		this.touch();
	}
}

/* URLs that multiplayer.js communicates with. *********************************************************/

// get an ID for this client
app.get('/c/id', function(req, res) {
	// ID has a component to make sure it's unique
	// and a component to make sure it's not trivially guessable
	var id = lastID++ + Math.random();
	clients[id] = new Client(id);
	res.end(JSON.stringify(id));
	server.log(" -> New client: " + id);
	log_num_clients();
});

// client is polling us, hold their connection for a bit
app.get('/c/poll/:id', function(req, res) {
	var c = clients[req.params.id];
	// only continue if it's a valid client connection
	if (c) {
		// store up this connection in case we get something to send them later
		c.set_poller(req, res);
		var donefunc = function() {
			c.forget_poller();
			server.log(" -> Poller closed: " + req.params.id);
		}
		// add a close handler for the connection
		//req.connection.on('close', donefunc);
		req.on('close', donefunc);
		req.on('end', donefunc);
		server.log(" -> Poller started: " + req.params.id);
	} else {
		// standard HTTP 404 if we don't know this client ID
		server.log(" -> Invalid client: " + req.params.id);
		res.end('false', 404);
		log_num_clients();
	}
});

// client is sending new broadcast data
app.post('/c/broadcast/:id', function(req, res) {
	var sender = clients[req.params.id];
	//server.log("");
	//server.log("Broadcast: " + req.params.id);
	//server.log("RAW DATA: " + req.body.p);
	if (sender) {
		// this sender is still active
		sender.touch();
		// add the data to every client's outgoing queue
		for (var c in sender.get_friends()) {
			// don't bother sending a broadcast back to ourselves
			if (c != req.params.id) {
				var outgoing = JSON.parse(req.body.p);
				outgoing["type"] = "broadcast";
				// add it to the other client's queue
				clients[c].push(outgoing, req.params.id);
				server.log(" -> " + req.params.id + " -> " + c + ": " + outgoing);
			}
		}
		res.end("true");
	} else {
		res.end("false");
	}
});

// client is setting a new state
app.post('/c/state/:id', function(req, res) {
	var sender = clients[req.params.id];
	if (sender) {
		// this sender is still active
		sender.touch();
		sender.set_state(JSON.parse(req.body.p));
		server.log(" -> " + req.params.id + " STATE");
		res.end("true");
	} else {
		res.end("false");
	}
});

/* Clean up stale clients and connections, make sure polls don't last too long. *********************/

function start_checks() {	
	// check for old long polls and close them
	setInterval(function() {
		// check every client to see if it has expired and close the connection if so
		for (var c in clients) {
			if (clients[c].has_poll_expired()) {
				server.log(" -> Poll reset: " + c);
				// close this poller
				clients[c].close();
			}
		}
	}, 1000);
	
	// check for dead clients and close them down
	setInterval(function() {
		// check every client to see if it has expired and close the connection if so
		for (var c in clients) {
			if (clients[c].is_dead()) {
				clients[c].kill();
			}
		}
	}, 1000);
}

/** Start serving. */
this.start = function() {
	// start the interval checks for dead clients
	start_checks();
	
	// launch the server
	app.listen(8000);
	server.log("listening on port 8000");
	server.log("serving: " + client_dir);
}

// if this is the main module - launch the server (server works standalone with no modifications)
if (!module.parent) {
	this.start();
}

