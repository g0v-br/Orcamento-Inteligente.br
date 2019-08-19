### build stage ###
FROM node:12-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV PATH /app/node_modules/.bin:$PATH
RUN npm run build

### production stage ###
FROM nginx:1.16-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
