#!/bin/bash

LOG=$HOME/backup-log.txt
FR=$HOME/foto
BU=$HOME/foto-backed
BUCKET=latamtrip

export  B2_ACCOUNT_INFO=~/.b2latamtrip

if [ $SHLVL -gt 5 ] ; then 
	echo "Possible loop?"
	exit 5
fi


if [ $TERM != "screen" ] ; then
	SCRIPTPATH=ftbu.sh

	echo "executing script in TMUX"
	echo -e "\nRuning backup on $(date)\n==============================================" >> $LOG
	tmux new -s fotobackupXX -d "bash -c '$SCRIPTPATH 2>&1  | tee -a $LOG'"

	echo "follows list of already backed up"

	echo "--XX-BACKED-UP--"
	
	$HOME/listbu.sh

	exit 0
fi

cd $FR
for folder in $(ls) ; do 
	echo "Backing up directory $folder"
	echo "============================"


	b2 sync --threads 2 --noProgress $FR/$folder b2://$BUCKET/$folder

	if [ $? == 0 ] ; then
		echo "---------"
		echo "Success. Moving into new destination"
		mv $FR/$folder $BU/
		echo "Creating thumbnails"
		~/bin/make-thumbs.sh $BU/$folder
		echo "Done..."
	else
		echo "El problem while uploading $folder, will try next time"
	fi
done

