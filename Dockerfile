FROM node:22-slim
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

ARG PORT=3000
EXPOSE ${PORT}

CMD [ "node", "dist/src/main.js" ]