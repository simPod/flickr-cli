#!/bin/bash

ALBUM_ID=$1

function getSome() {
local PHOTOS=`./bin/flickr album list $ALBUM_ID -f id`
echo $PHOTOS | sed -e 's/id //'
}

PHOTOS=`getSome`

while [ ! -z "$PHOTOS" ];
do
    ./bin/flickr album remove $ALBUM_ID --photoids $PHOTOS
    echo "Removed some"
    PHOTOS=`getSome`
done