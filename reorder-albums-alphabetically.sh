#!/bin/bash

ORDERED_LIST=`./bin/flickr album index -f title id | sed $'s/title\tid//' | sort -r | while IFS=$'\t' read TITLE ID; do
    echo $ID
done`

./bin/flickr album order $ORDERED_LIST