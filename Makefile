SCRIPTS = jsgamesoup.js entity-reference.js sprite.js collisions.js random.js audio.js cookies.js network.js statemachine.js a_star.js url.js noise.js example-game.js isometric.js vectorize.js
DEPENDENCIES = js/contrib/box2d.js js/contrib/protoclass.js js/contrib/json2.js js/contrib/flashcanvas.js js/contrib/flashcanvas.swf

# by default make the documentation

all: jsdocs dependencies

# how to build the documentation

jsdocs: $(SCRIPTS:^:../)
	cd js && jsdoc -t=../website/jsdoc-templates $(SCRIPTS) && mv jsdocs ../

# all dependencies

dependencies: js/contrib $(DEPENDENCIES)

# how to specifically fetch each of the dependencies

js/contrib:
	mkdir js/contrib

js/contrib/box2d.js js/contrib/protoclass.js:
	curl -s http://mrdoob.com/projects/chromeexperiments/ball-pool/js/`basename $@` > js/contrib/`basename $@`

js/contrib/flashcanvas.js:
	curl -s http://flashcanvas.googlecode.com/svn/trunk/bin/flashcanvas.js > js/contrib/flashcanvas.js

js/contrib/flashcanvas.swf:
	curl -s http://flashcanvas.googlecode.com/svn/trunk/bin/flashcanvas.swf > js/contrib/flashcanvas.swf

js/contrib/json2.js:
	curl -s https://raw.github.com/douglascrockford/JSON-js/master/json2.js > js/contrib/json2.js

# how to clean everything

clean:
	rm -rf jsdocs
	rm -rf $(DEPENDENCIES)
