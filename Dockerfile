FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]


# docker build  . -t ghcr.io/hardikhari96/kubectl/first:latest
# docker push ghcr.io/hardikhari96/kubectl/first:latest 