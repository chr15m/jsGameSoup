#!/bin/sh

bzrrev=`bzr log -l 1 --line | cut -f1 -d":" | xargs expr 1 +`; sed "s/v[0-9][0-9]*/v$bzrrev/g" README
