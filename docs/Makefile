SCRIPTS = jsgamesoup.js entity-reference.js
TXTS = embedding-distributing-deploying.txt why-use-jsgamesoup.txt
HTMLS = $(TXTS:.txt=.html)
ALLDOCS = $(HTMLS) index.html jsGameSoup.zip jsdocs demos tests js

all: $(ALLDOCS)

%.html : %.txt
	../scripts/txt2html.sh $< $@

index.html: ../README
	../scripts/txt2html.sh $< $@

jsdocs:../js/jsgamesoup.js ../js/entity-reference.js
	jsdoc ../js/jsgamesoup.js ../js/entity-reference.js

tests:../tests
	cp -av ../tests .

demos:../demos
	cp -av ../demos .

jsGameSoup.zip:..
	rm -f jsGameSoup.zip
	../scripts/make-zip.sh

js:../js
	cp -av ../js .
	#bzr export js ../js/
	../scripts/fetch-externals.sh

clean:
	rm -rf $(ALLDOCS) jsGameSoup-v*.zip

