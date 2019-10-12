#!/bin/bash

export TZ=EST5 # override when time zone changges

DATEFILE=$HOME/.newest-video-fotak-date
NEW=$(cat $DATEFILE)
NEWEST=$NEW

DSK=$1
PTH="/mnt/mmc"
VIDEOS=$PTH/PRIVATE/AVCHD/BDMV/STREAM/
VIDEOUT=$HOME/video-nezalohovano/


if [ "$DSK" == "" ] ; then
	DSK="/dev/sdc1"
fi

echo "Mounting $DSK into $PTH"
sudo mount $DSK $PTH

if [ "$?" -ne 0 ] ; then
	echo "Mount failed, exiting"
	exit 5
fi

TOTAL=0
DIRS=0
SKIPPED=0
for file in $(find $VIDEOS -type f) ; do
	DT=$(stat $file -c "%Y")
	FLD=$(stat $file -c "%y" | cut -f 1 -d " ")

	if [ $DT -le $NEW ] ; then
		echo ".. skipping '$file' - is older then newest" 
		SKIPPED=$(( $SKIPPED + 1 ))
		continue
	fi

	if [ $DT -gt $NEWEST ] ; then
		NEWEST=$DT
	fi
	
	ODIR=$VIDEOUT

	echo "Copying file $file"
	cp $file $ODIR/$FLD-$(basename $file)

	if [ $? != 0 ] ; then
		echo "Error: Cannot copy $file"
		exit 1
	else
		TOTAL=$(( $TOTAL + 1 ))
	fi
done	

echo $NEWEST > $DATEFILE

echo "Unmounting, copied $TOTAL files, $SKIPPED was skipped"
echo "Newest was $NEW, now it's $NEWEST"
sudo umount $PTH
