FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY src/ ./src
COPY routes/ ./routes
COPY app.js ./app.js
COPY bin/ ./bin
EXPOSE 3000
CMD ["node", "bin/www"]