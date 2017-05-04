#!/usr/bin/env bash

# start developmental environment

DB_PATH=./db
DB_PORT=27017
LOCAL_BIN=./node_modules/.bin

# start DB
[[ -d $DB_PATH ]] && rm -rf $DB_PATH
mkdir $DB_PATH
mongod --dbpath="$DB_PATH" --port="$DB_PORT" &
PS1=$!

# wait mongo start
COUNTER=0
COMMAND="db.version()"
while [[ ! $(mongo --eval $COMMAND) ]]; do
  if [[ $COUNTER -gt 100 ]]; then
    # kill all related process
    kill -9 $PS1
    echo 'MongoDB not found.'
    exit 1
  fi
  COUNTER=`1 + $COUNTER`
  sleep 0.1
done

# migrate
$LOCAL_BIN/babel-node ./src/server/migrate/index.js

./node_modules/.bin/ava

# kill all related process
kill -9 $PS1
