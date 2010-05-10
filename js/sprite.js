var spriteids = 0;

/* sprite class - controls a single image on the screen */
function Sprite(url, parentdiv, hasheight, frames) {
	// create a unique id
	spriteids += 1;
	var id = spriteids;
	
	// internal variables
	this.pos = [0, 0];
	this.loaded = false;
	this.heightoffset = !hasheight + 1;
	if (frames)
		this.frames = frames;
	else
		this.frames = 1;
	this.halfwidth = 0;
	this.halfheight = 0;
	
	// remember the container of our div
	this.parentdiv = parentdiv;
	
	// create an empty div to hold our new sprite
	this.div = document.createElement('div');
	this.div.id = "sprite-" + id;
	parentdiv.appendChild(this.div);
	
	// load the image
	this.img = new Image();
	this.img.name = url;
	this.img.sprite = this;
	this.img.src = url;
	this.img.onload = function () {
		//alert("'" + this.name + "' is " + this.width + " by " + this.height + " pixels in size.");
		var div = this.sprite.div;
		div.style.position = "absolute";
		div.style.width = this.width / this.sprite.frames;
		div.style.height = this.height;
		this.sprite.halfwidth = (this.width / this.sprite.frames) / 2;
		this.sprite.halfheight = this.height / this.sprite.heightoffset;
		div.style.padding = 0;
		div.style.margin = 0;
		div.style.backgroundImage = "url(" + this.src + ")";
		this.sprite.loaded = true;
		this.sprite.update();
		return true;
	}
	
	// update from new settings
	this.update = function() {
		this.div.style.left = this.pos[0] - this.halfwidth;
		this.div.style.top = this.pos[1] - this.halfheight;
		return this;
	}
	
	// set this sprite's z-index
	this.z = function(z) {
		this.div.style.zIndex = z;
		return this;
	}
	
	// move the sprite to a specific on-screen position
	// this is the center of the sprite
	this.move = function(pos) {
		this.pos = pos;
		if (this.loaded)
			this.update();
		return this;
	}
	
	// delete this sprite
	this.destroy = function() {
		parentdiv.removeChild(this.div);
	}
}
