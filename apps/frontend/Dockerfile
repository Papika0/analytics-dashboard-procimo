FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/shared-types/package*.json ./packages/shared-types/

RUN npm install

COPY . .

# Build shared-types first
RUN npm run build --workspace=packages/shared-types

EXPOSE 5173

CMD ["npm", "run", "frontend"]
