# Stage 1: Development
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY ./agg-auth/package.json ./agg-auth/package-lock.json ./
COPY ./agg-auth/tsconfig.json ./agg-auth/tsconfig.build.json ./agg-auth/nest-cli.json ./
RUN npm install

# Copy all source files
COPY ./agg-auth .

# Build the application
RUN npm run build

# Stage 2: Production
# FROM node:20-alpine AS production

# WORKDIR /usr/src/app

# # Copy package files and install only production dependencies
# COPY ./agg-auth/package.json ./agg-auth/package-lock.json ./
# RUN npm install --prod7

# # Copy the built files from the development stage
# COPY --from=development /usr/src/app/dist ./dist

# # Set the command to run the application
# CMD ["node", "dist/main"]
