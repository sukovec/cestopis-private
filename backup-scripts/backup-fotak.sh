#!/bin/bash

export TZ=EST5 # override when time zone changges

DATEFILE=$HOME/.newest-fotak-date
NEW=$(cat $DATEFILE)
NEWEST=$NEW

DSK=$1
PTH="/mnt/mmc"

if [ "$DSK" == "" ] ; then
	DSK="/dev/sdc1"
fi

echo "Mounting $DSK into $PTH"
sudo mount $DSK $PTH

TOTAL=0
DIRS=0
SKIPPED=0
for file in $(find $PTH/DCIM/ -type f) ; do
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
	
	ODIR=$HOME/nezalohovane-foto/$FLD

	if [ ! -d $ODIR ] ; then
		echo "Creating directory for date $FLD"
		mkdir -p $ODIR
		DIRS=$(( $DIRS + 1 ))
	fi

	cp $file $ODIR
	if [ $? != 0 ] ; then
		echo "Error: Cannot copy $file"
		exit 1
	else
		TOTAL=$(( $TOTAL + 1 ))
	fi
done	

echo $NEWEST > $DATEFILE

echo "Unmounting, copied $TOTAL into $DIRS new directories, $SKIPPED was skipped"
echo "Newest was $NEW, now it's $NEWEST"
sudo umount $PTH



echo "Start backup-video-fotak.sh for backing up videos"
