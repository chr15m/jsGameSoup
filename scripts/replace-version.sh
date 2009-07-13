#!/bin/sh

bzrrev=`bzr log -l 1 --line | cut -f1 -d":"`; sed "s/v[0-9][0-9]*/v$bzrrev/g" README
