SCRIPTS = jsgamesoup.js entity-reference.js
TXTS = embedding-distributing-deploying.txt why-use-jsgamesoup.txt
HTMLS = $(TXTS:.txt=.html)
ALLDOCS = $(HTMLS) index.html jsdocs

all: $(ALLDOCS)

%.html : %.txt
	../scripts/txt2html $< $@

index.html: ../README
	../scripts/txt2html $< $@

jsdocs:../js/jsgamesoup.js ../js/entity-reference.js
	jsdoc ../js/jsgamesoup.js ../js/entity-reference.js

clean: $(ALLDOCS)
	rm -r $(ALLDOCS)

