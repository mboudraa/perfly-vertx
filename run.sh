#!/bin/sh

unset GRADLE_OPTS

for i in $*; do
    case $i in
        -d) export GRADLE_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n"
            ;;
        -c) gradleCmd="clean" 
            ;;
    esac	
done

gradleCmd="$gradleCmd runMod"
./gradlew $gradleCmd
