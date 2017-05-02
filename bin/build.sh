#!/usr/bin/env bash
LOCAL_BIN="./node_modules/.bin"

# build server
$LOCAL_BIN/babel ./src/server --out-dir ./dist/server --source-maps inline
$LOCAL_BIN/webpack -p
