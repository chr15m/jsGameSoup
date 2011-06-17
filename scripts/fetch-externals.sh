#!/bin/sh

svn export http://explorercanvas.googlecode.com/svn/trunk/ js/explorercanvas
svn export http://flashcanvas.googlecode.com/svn/trunk/ js/flashcanvas
# TODO: get rid of this
wget http://icant.co.uk/sandbox/fauxconsole/fauxconsole.zip -O tests/fauxconsole.zip
unzip -o tests/fauxconsole.zip -d tests/
rm tests/fauxconsole.zip
