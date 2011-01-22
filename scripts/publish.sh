#!/bin/sh

scripts/replace-version.sh js/jsgamesoup.js
scripts/replace-version.sh README
make clean -C docs/
make -C docs/
rsync -avz docs/* chrism@mccormick.cx:~/mccormick.cx/projects/jsGameSoup/
bzr push https://mccormix@jsgamesoup.googlecode.com/svn/jsgamesoup/
