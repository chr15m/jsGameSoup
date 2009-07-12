#!/bin/sh

make -C docs/
rsync -avz docs/* chrism@mccormick.cx:~/mccormick.cx/projects/jsGameSoup/
