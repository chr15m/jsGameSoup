SCRIPTS = jsgamesoup.js entity-reference.js
TXTS = embedding-distributing-deploying.txt why-use-jsgamesoup.txt
HTMLS = $(TXTS:.txt=.html)
ALLDOCS = $(HTMLS) index.html jsGameSoup.zip jsdocs demos tests js ../README

all: $(ALLDOCS)

%.html : %.txt
	../scripts/txt2html.sh $< $@

index.html: ../README
	../scripts/txt2html.sh $< $@

jsdocs:../js/jsgamesoup.js ../js/entity-reference.js
	jsdoc ../js/jsgamesoup.js ../js/entity-reference.js

tests:../tests
	bzr export tests ../tests/

demos:../demos
	bzr export demos ../demos/

jsGameSoup.zip:..
	../scripts/make-zip.sh

js:../js
	bzr export js ../js/
	../scripts/fetch-externals.sh

clean:
	rm -rf $(ALLDOCS) jsGameSoup-v*.zip

