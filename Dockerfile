FROM node:latest
MAINTAINER kamataryo <mugil.cephalus@gmail.com>

ADD . /src
WORKDIR /src

RUN npm install
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["npm", "run", "serve"]
