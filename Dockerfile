FROM hub.lumigame.com/base/node:18-16-alpine-24h1.1

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN mkdir /app && chown -R node /app

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
ENV PATH /app/node_modules/.bin:$PATH

COPY . .

USER node

CMD [ "yarn", "run", "start" ]