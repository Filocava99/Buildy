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
ENV MYTOKEN=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
ENV MONGO_URL=mongodb
CMD ["npm", "start"]