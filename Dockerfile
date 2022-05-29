FROM node:16-alpine3.14
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk update
RUN apk --no-cache add curl
RUN apk --no-cache add bash
RUN apk --no-cache add git
RUN apk add openjdk17 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
RUN npm ci
COPY src/ ./src
COPY routes/ ./routes
COPY app.js ./app.js
COPY bin/ ./bin
EXPOSE 3000 3001
CMD ["npm", "start"]