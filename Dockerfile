FROM node:22-slim
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ARG PORT=3000
EXPOSE ${PORT}

CMD [ "node", "dist/main.js" ]