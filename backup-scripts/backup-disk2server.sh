#!/bin/bash

cd $HOME/nezalohovane-foto
for dir in $(ls) ; do  
	rsync -av --progress $dir vps.sukovec.cz:foto/

	RET=$?

	if [[ $RET == 0 ]] ; then
		if [ -d ../uploaded-foto/$(basename $dir) ] ; then
			echo "Collision! $dir exists in source and destination"
			exit 1
		fi

		mv $dir ../uploaded-foto/
	else
		echo $dir not backed up, run again
	fi
done

rsync -av --progress $HOME/video-nezalohovano/ vps.sukovec.cz:video-backup/
if [ $? -eq 0 ] ; then
	mv $HOME/video-nezalohovano/* $HOME/video-zalohovano/
else
	echo "Error backing videos, run again"
fi

