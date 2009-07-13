#!/bin/sh

BZRREV=`bzr log -l 1 --line | cut -f1 -d":"`;
bzr export jsGameSoup-v$BZRREV.zip ..
ln -s jsGameSoup-v$BZRREV.zip jsGameSoup.zip
