#!/usr/bin/env bash

BZRREV=`bzr log -r -1.. --line | cut -d":" -f 1`

if [ "$1" == "" -o "$2" == "" ]
then
	echo "Usage: txt2html INFILE.txt OUTFILE.html"
else
	html=`markdown $1`
	infile=`cat template.html`
	echo "${infile//\#\#\# CONTENT \#\#\#/$html}" > $2
	infile=`cat $2`
	echo "${infile//\#\#\# VERSION \#\#\#/$BZRREV}" > $2
fi
