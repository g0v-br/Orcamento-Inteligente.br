### build stage ###
FROM node:12-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install

ENV PATH ./node_modules/@vue/cli-service/bin:$PATH
RUN npm run build

### production stage ###
FROM nginx:1.16-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
