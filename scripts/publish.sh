#!/bin/sh

make clean -C website/
make -C website/
rsync -avz website/jsdocs jsgamesoup.net:/var/www/jsgamesoup.net/website/
ssh jsgamesoup.net "cd /var/www/jsgamesoup.net/; bzr up"

# push changes to Google Code
bzr push https://mccormix@jsgamesoup.googlecode.com/svn/jsgamesoup/
# push changes to the github repository
bzr dpush git+ssh://git@github.com/chr15m/jsGameSoup.git
