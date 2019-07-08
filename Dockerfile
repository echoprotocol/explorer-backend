FROM node:10.15

WORKDIR /app

ENV NODE_ENV="production"

COPY package.json ./
RUN NODE_ENV=development npm install

COPY ./src ./src
COPY ./config ./config
COPY ./typing ./typing
COPY ./tsconfig.build.json .
COPY ./tsconfig.json .
COPY ./public ./public

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
