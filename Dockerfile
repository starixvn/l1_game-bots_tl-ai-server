FROM hub.lumigame.com/docker-hub/library/node:18.1-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN mkdir /app && chown -R node /app

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
ENV PATH /app/node_modules/.bin:$PATH

COPY ./src/ .

USER node

CMD [ "node", "./index.js" ]