#!/bin/bash
# push.sh

sudo rm /home/nabster/.forever/hey.log
sudo forever start --uid "hey" --spinSleepTime 10000 --minUptime 10000 -a app.js --prod
