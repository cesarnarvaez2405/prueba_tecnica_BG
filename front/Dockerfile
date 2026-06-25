FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG API_URL=http://44.217.15.185:1010/prueba-tecnica-bg/server/
RUN mkdir -p src/environments && \
    echo "export const environment = { production: true, API_URL: '${API_URL}' };" > src/environments/environment.ts

RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build

FROM nginx:alpine

COPY --from=build /app/dist/front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]
