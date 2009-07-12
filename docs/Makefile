SCRIPTS = jsgamesoup.js entity-reference.js
TXTS = embedding-distributing-deploying.txt why-use-jsgamesoup.txt
HTMLS = $(TXTS:.txt=.html)
ALLDOCS = $(HTMLS) index.html jsGameSoup.zip jsdocs demos js

all: $(ALLDOCS)

%.html : %.txt
	../scripts/txt2html $< $@

index.html: ../README
	../scripts/txt2html $< $@

jsdocs:../js/jsgamesoup.js ../js/entity-reference.js
	jsdoc ../js/jsgamesoup.js ../js/entity-reference.js

demos:../demos
	bzr export demos ../demos/

jsGameSoup.zip:..
	bzr export jsGameSoup.zip ..

js:../js
	bzr export js ../js/
	../scripts/fetch-externals.sh

clean: $(ALLDOCS)
	rm -r $(ALLDOCS)

