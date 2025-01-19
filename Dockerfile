# build 阶段
FROM node:18-alpine as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install
COPY . .
RUN npm run build

# production 阶段
FROM nginx:stable as production-stage

COPY --from=build-stage /app/dist /etc/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
