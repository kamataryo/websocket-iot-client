#!/usr/bin/env bash
LOCAL_BIN="./node_modules/.bin"

# build client
NODE_ENV=production $LOCAL_BIN/webpack -p

# build server
$LOCAL_BIN/babel ./src/server --out-dir ./dist/server --source-maps inline
cp ./src/server/package.json ./dist/server/
pushd ./dist/server
yarn
rm yarn.lock
popd
