#!/bin/sh

if [ "$1" = "-d" ]; then
	export GRADLE_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n"
else
	unset GRADLE_OPTS
fi
./gradlew runMod
