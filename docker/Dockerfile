### build stage ###
FROM node:12-alpine as build-stage

WORKDIR /app

# expand dependencies
COPY package*.json ./
RUN npm install

# build the distribution
COPY public ./public
COPY src ./src
COPY cypress.json babel.config.js vue.config.js ./
RUN PATH=/app/node_modules/.bin:$PATH npm run build

### production stage ###
FROM nginx:1.16-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# loads nginx optimized config
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/run_server.sh /run_server.sh
RUN chmod +rx /run_server.sh

CMD ["/run_server.sh"]
