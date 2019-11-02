#!/bin/bash
./bin/flickr album index -f id title  | while IFS=$'\t' read ALBUMID TITLE; do
while IFS=$'\t' read ALBUMID TITLE; do
    RENAMED=`echo $TITLE | sed -E 's/^(([0-9]{4}) - )([0-9]{4}.+)$/\3 \2/'`
    # RENAMED=`echo $TITLE | sed -E 's/^(.+) ([0-9]{4}(-[0-9]{2})*)$/\2 - \1/'`
    # RENAMED="$TITLE"
    if [ "$RENAMED" != "$TITLE" ]; then
        echo "Renaming $ALBUMID to $RENAMED (From $TITLE)"
        ./bin/flickr album rename --albumid "$ALBUMID" --title "$RENAMED"
    fi
done
