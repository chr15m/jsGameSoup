SCRIPTS = jsgamesoup.js entity-reference.js sprite.js collisions.js random.js audio.js cookies.js network.js statemachine.js a_star.js url.js noise.js example-game.js

all: jsdocs

jsdocs: $(SCRIPTS:^:../)
	cd ../js && jsdoc -t=../website/jsdoc-templates $(SCRIPTS) && mv jsdocs ../website && cd ../website

clean:
	rm -rf jsdocs

