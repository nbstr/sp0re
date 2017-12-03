#!/bin/bash
# push.sh

git rm -r --cached .
git add --all :/

git commit -m "fixing .gitignore"
git push origin master

git pull