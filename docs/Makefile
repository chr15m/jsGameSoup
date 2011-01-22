SCRIPTS = jsgamesoup.js entity-reference.js sprite.js collisions.js random.js network.js cookies.js example-game.js
TXTS = 
HTMLS = $(TXTS:.txt=.html)
ALLDOCS = $(HTMLS) index.html jsGameSoup.zip jsdocs demos tests js COPYING

all: $(ALLDOCS)

%.html : %.txt
	../scripts/txt2html.sh $< $@

index.html: ../README
	../scripts/txt2html.sh $< $@

jsdocs: $(SCRIPTS:^:../)
	cd ../js && jsdoc -t=../docs/jsdoc-templates $(SCRIPTS) && mv jsdocs ../docs && cd ../docs

tests:../tests
	rsync -avz ../tests tests

demos:../demos
	rsync -avz ../demos demos

COPYING:../COPYING
	cp ../COPYING .

jsGameSoup.zip:..
	rm -f jsGameSoup.zip
	../scripts/make-zip.sh

js:../js
	rsync -avz ../js js
	#bzr export js ../js/
	../scripts/fetch-externals.sh

clean:
	rm -rf $(ALLDOCS) jsGameSoup-v*.zip

