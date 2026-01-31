FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared-types/package*.json ./packages/shared-types/

RUN npm install

COPY . .

# Build shared-types first
RUN npm run build --workspace=packages/shared-types

EXPOSE 3000

CMD ["npm", "run", "backend"]
