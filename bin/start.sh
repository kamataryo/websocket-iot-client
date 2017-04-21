#!/usr/bin/env bash

# start developmental environment

DB_PATH=./db
LOCAL_BIN=./node_modules/.bin

# start DB
[[ -d $DB_PATH ]] && rm -rf $DB_PATH
mkdir $DB_PATH
mongod --dbpath=$DB_PATH &
PS1=$!

# start client
$LOCAL_BIN/webpack-dev-server --progress --colors --hot --inline --watch &
PS2=$!

# wait mongo start
COUNTER=0
while [[ ! $(mongo --eval 'db.version') ]]; do
  if [[ $COUNTER -gt 100 ]]; then
    # kill all related process
    kill -9 $PS1
    kill -9 $PS2
    echo 'MongoDB not found.'
    exit 1
  fi
  COUNTER=`1 + $COUNTER`
  sleep 0.1
done

# migrate
$LOCAL_BIN/babel-node ./server/migrate/index.js

# start server
$LOCAL_BIN/nodemon --exec "$LOCAL_BIN/babel-node" -- ./server/index.js

# kill all related process
kill -9 $PS1
kill -9 $PS2
