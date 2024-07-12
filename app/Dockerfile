FROM node:20

RUN apt-get update \
    && apt-get install -y postgresql-client

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

CMD ["node", "dist/src/index.js"]
