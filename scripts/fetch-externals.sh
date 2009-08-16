#!/bin/sh

svn export http://explorercanvas.googlecode.com/svn/trunk/ js/explorercanvas
wget http://icant.co.uk/sandbox/fauxconsole/fauxconsole.zip -O tests/fauxconsole.zip
unzip -o tests/fauxconsole.zip -d tests/
rm tests/fauxconsole.zip
