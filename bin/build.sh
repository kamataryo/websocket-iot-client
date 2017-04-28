#!/usr/bin/env bash
LOCAL_BIN="./node_modules/.bin"

# build server
$LOCAL_BIN/babel ./server --out-dir ./lib --source-maps inline
$LOCAL_BIN/webpack -p
