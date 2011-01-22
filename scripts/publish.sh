#!/bin/sh

make -C docs/
rsync -avz docs/* chrism@mccormick.cx:~/mccormick.cx/projects/jsGameSoup/
bzr push https://mccormix@jsgamesoup.googlecode.com/svn/jsgamesoup/
