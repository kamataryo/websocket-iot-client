# WebSocket IoT Client

[![Build Status](https://travis-ci.org/kamataryo/websocket-iot-client.svg?branch=master)](https://travis-ci.org/kamataryo/websocket-iot-client)

This is an user interface to control IoT based on Socket.IO, React and Material UI.
This is orchestrated with raspberrypi-easy-home-kit

## usage

### client

see http://kamataryo.github.io/websocket-iot-client/

## development

```
$ git clone https://github.com/kamataryo/websocket-iot-client.git
$ cd websocket-iot-client
$ npm install
$ npm start
```

## docker

### build and run

```shell
$ docker build --tag yourname/websocket-iot-client .
$ docker run -d -p 3000:3000 yourname/websocket-iot-client
```

### pull and run

```shell
$ docker pull kamataryo/websocket-iot-client
$ docker run -d -p 3000:3000 kamataryo/websocket-iot-client
```
