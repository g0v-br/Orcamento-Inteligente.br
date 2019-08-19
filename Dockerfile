### build stage ###
FROM node:12-alpine as build-stage
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

### production stage ###
FROM nginx:1.16-alpine as production-stage
COPY --from=build-stage /dist /usr/share/nginx/html
