FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG API_URL=http://44.217.15.185:1010/prueba-tecnica-bg/server/
RUN mkdir -p src/environments && \
    echo "export const environment = { production: true, API_URL: '${API_URL}' };" > src/environments/environment.ts

RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build

FROM node:24-alpine

WORKDIR /app

COPY --from=build /app/dist/front ./dist/front
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 4000

CMD ["node", "dist/front/server/server.mjs"]
