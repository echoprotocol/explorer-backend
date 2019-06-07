FROM node:10.15

WORKDIR /app

ARG NODE_APP_INSTANCE="production"

ENV NODE_ENV="production"
ENV NODE_APP_INSTANCE=$NODE_APP_INSTANCE

COPY ./ /app/

RUN npm config set unsafe-perm true
RUN NODE_ENV=development npm install

RUN git clone https://github.com/vishnubob/wait-for-it.git

CMD ["npm", "run", "start"]
