#!/usr/bin/env bash


LOCAL_BIN="./node_modules/.bin"

# build client
NODE_ENV=production $LOCAL_BIN/webpack --config ./configs/client.webpack.config.babel.js -p

# build server
NODE_ENV=production $LOCAL_BIN/webpack --config ./configs/server.webpack.config.babel.js -p
[[ -d ./dist/server/node_modules ]] && rm ./dist/server/node_modules
cp -r ./node_modules ./dist/server/
