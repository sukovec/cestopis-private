#!/data/user/0/com.arachnoid.sshelper/bin/bash

# written for SSHelper Android App

SRV=suk@192.168.43.12
DST=nezalohovane-foto
PREFIX=ticofon
NEWTIMEFILE=~/.newestfototime

NEWEST=$(cat $NEWTIMEFILE)
NEWTIME=$NEWEST

declare -A DATES

TOTALNEW=0
echo -n "Making file lists:"
for fname in $(find SDCard/DCIM/100_CFV5/ -type f) ; do
	TIME=$(stat $fname -c "%Y")
	#echo -n "File $fname: ($TIME)"
	if [ $TIME -lt $NEWEST ] ; then
		#echo ": skipping"
		echo -n "."
		continue
	fi

	if [ $TIME -gt $NEWTIME ] ; then
		NEWTIME=$TIME
		#echo -n " NT"
		echo -n "X"
	else
		echo -n "!"
	fi

	TOTALNEW=$(( $TOTALNEW + 1 ))

	CDATE=$(stat $fname -c "%y" | cut -f 1 -d " ")
	CFLDNAME="FILES_$(echo $CDATE | tr -d "-")"

	DATES[$CDATE]="$DST/$PREFIX-$CDATE"

	eval "$CFLDNAME+=($fname)"
	#echo " to $CFLDNAME (${DATES[$CDATE]})"

done

echo
echo "Folders: ${#DATES[@]}, files: $TOTALNEW"

SYNCED=0

for i in ${!DATES[@]}; do
	CD=FILES_$(echo $i | tr -d "-")
	eval CARR=\( \$\{${CD}[@]\} \)

	echo "Syncing date $i, total ${#CARR[@]} files"
	rsync -av --progress "${CARR[@]}" $SRV:${DATES[$i]}
	if [ $? -eq 0 ] ; then
		SYNCED=$(( $SYNCED + ${#CARR[@]} ))
	fi

	#echo "Files going to ${DATES[$i]}:"
	#echo $i $CD: ${CARR[*]}
done

if [ $SYNCED -eq $TOTALNEW ] ; then
	echo $NEWTIME > $NEWTIMEFILE
	echo "Success"
else
	echo "$SYNCED neq $TOTALNEW"
	echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
	echo "!! NOT SUCCESSFULL RUN AGAIN !!"
	echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
fi
