#!/bin/bash

if [ "$1" == "" ]
then
	echo "Usage: $0 FILENAME"
else
	bzrrev=`bzr revno | xargs expr 1 +`
	sed "s/v[0-9][0-9]*/v$bzrrev/g" $1 > $1.tmp
	mv $1.tmp $1
fi
