SCRIPTS = jsgamesoup.js entity-reference.js sprite.js collisions.js random.js audio.js cookies.js network.js statemachine.js a_star.js url.js noise.js example-game.js
TXTS = 
HTMLS = $(TXTS:.txt=.html)
ALLDOCS = $(HTMLS) index.html jsGameSoup.zip jsdocs demos tests js js/explorercanvas js/flashcanvas COPYING

all: $(ALLDOCS)

%.html : %.txt
	../scripts/txt2html.sh $< $@

index.html: ../README.markdown
	../scripts/txt2html.sh $< $@

jsdocs: $(SCRIPTS:^:../)
	cd ../js && jsdoc -t=../docs/jsdoc-templates $(SCRIPTS) && mv jsdocs ../docs && cd ../docs

tests:../tests
	rsync -avz ../tests .

demos:../demos
	rsync -avz ../demos .

COPYING:../COPYING
	cp ../COPYING .

jsGameSoup.zip:..
	rm -f jsGameSoup.zip
	../scripts/make-zip.sh

js:../js
	rsync -avz ../js/ js

js/explorercanvas js/flashcanvas:
	../scripts/fetch-externals.sh

clean:
	rm -rf $(ALLDOCS) jsGameSoup-v*.zip

