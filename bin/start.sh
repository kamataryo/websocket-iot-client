#!/usr/bin/env bash
# start developmental environment

DB_PATH=./db
LOCAL_BINS=./node_modules/.bin

# build
NODE_ENV=development npm run build

# start DB
[[ -d $DB_PATH ]] && rm -rf $DB_PATH && mkdir $DB_PATH
mongod --dbpath=$DB_PATH &
PS1=$!

# start client
$LOCAL_BINS/webpack-dev-server --progress --colors --hot --inline --watch &
PS2=$!

# start server
$LOCAL_BINS/nodemon ./lib/index.js

# kill all related process
kill -9 $PS1
kill -9 $PS2
