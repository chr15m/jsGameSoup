#!/bin/sh

make -C docs/
rsync -avz docs/* chrism@mccormick.cx:~/mccormick.cx/projects/jsGameSoup/
bzr svn-push https://mccormix@podsixnet.googlecode.com/svn/jsgamesoup/
