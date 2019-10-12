#!/bin/bash

DATEFILE=$HOME/.newest-sarka-date
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

for i in $(find /mnt/mmc/{DCIM,Mexiko} -type f) ; do
	BN=$(basename $i)
	DT=$(echo $BN | cut -f 1 -d "_")

	# only copy photos with date > NEW
	if [ $DT -le $NEW ] ; then
		SKIPPED=$(( $SKIPPED + 1 ))
		continue
	fi

	# save date of newest found photo
	if [ $DT -gt $NEWEST ] ; then
		NEWEST=$DT
	fi

	ODIR=$HOME/nezalohovane-foto/sarka-$DT

	if [ ! -d $ODIR ] ; then
		echo "Creating dir for date $DT: $ODIR"
		mkdir $ODIR
		DIRS=$(( $DIRS + 1 ))
	fi

	cp $i $ODIR
	if [ $? != 0 ] ; then
		echo "ERRROROROROROROROROR"
		echo "Error copyin $i to $ODIR"
		exit 0 
	else
		TOTAL=$(( $TOTAL + 1 ))
	fi
done

echo $NEWEST > $DATEFILE
echo "Unmounting, copied $TOTAL into $DIRS new directories, $SKIPPED was skipped, newest date was $NEW and is $NEWEST now"
sudo umount $PTH
