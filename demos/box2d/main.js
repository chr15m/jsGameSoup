var world;

function init(gs)
{	
	// box2d world
	
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set( -200, -200 );
	worldAABB.maxVertex.Set( gs.width + 200, gs.height + 200 );

	world = new b2World( worldAABB, new b2Vec2( 0, 100 ), true );
	
	function createBox(world, x, y, width, height) {

		var boxSd = new b2BoxDef();

		boxSd.extents.Set(width, height);

		var boxBd = new b2BodyDef();
	
		boxBd.AddShape(boxSd);
		boxBd.position.Set(x,y);

		return world.CreateBody(boxBd);
	}
	
	// floor, ceiling, and walls
	createBox(world, gs.width / 2, gs.height + 200, gs.width, 200);
	createBox(world, gs.width / 2, - 200, gs.width, 200);
	createBox(world, - 200, gs.height / 2, 200, gs.height);
	createBox(world, gs.width + 200, gs.height / 2, 200, gs.height);	
	
	function createBall(size)
	{
		var b2body = new b2BodyDef();

		var circle = new b2CircleDef();
		circle.radius = r;
		circle.density = 1;
		circle.friction = 0.1;
		circle.restitution = 0.9;
		b2body.AddShape(circle);

		b2body.position.Set( gs.random(0, gs.width), gs.random(0, gs.height) );
		b2body.linearVelocity.Set( gs.random(-3, 3), gs.random(-3, 3) );

		return world.CreateBody(b2body);
	}
	
	// entity to invoke box2d step function
	
	gs.addEntity({
		"update" : function(gs)	{
				world.Step(1/gs.framerate, 1);
			}
	});
	
	// balls! (no update function since motion handled by box2d step)
	
	for (i = 0; i < 20; i++)
	{
		var r = gs.random(10, 30);
		var c = gs.random(100, 200);
		
		gs.addEntity({
			"r" : r,
			"c" : c,
			"fs" : 'rgba(' + parseInt(c) + ', ' + parseInt(c) + ', ' + parseInt(c) + ', 1.0)',
			"body" : createBall(r),
			"draw" : function(c, gs) {
				c.fillStyle = this.fs;
				c.beginPath();
				c.arc(this.body.m_position.x, this.body.m_position.y, this.r, 0, Math.PI*2, true);
				c.closePath();
				c.fill();
			},
		});
	}

}

function launch() {
	var gs = new JSGameSoup(document.getElementById("canvas"), 24);
	init(gs);
	gs.launch();
}
