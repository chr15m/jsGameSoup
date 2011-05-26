#!/bin/sh

scripts/replace-version.sh js/jsgamesoup.js
scripts/replace-version.sh README.markdown
bzr commit -m 'Version bump for publish script'
make clean -C docs/
make -C docs/
rsync -avz docs/* chrism@mccormick.cx:~/mccormick.cx/projects/jsGameSoup/

# push changes to Google Code
bzr push https://mccormix@jsgamesoup.googlecode.com/svn/jsgamesoup/
# push changes to the github repository
bzr dpush git+ssh://git@github.com/chr15m/jsGameSoup.git
