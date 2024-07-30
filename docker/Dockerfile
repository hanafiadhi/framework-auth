# Stage 1: Development Stage
FROM node:20-alpine AS development

WORKDIR /usr/src/app/auth

# Copy package files and install all dependencies including dev dependencies
COPY ./auth-agg/package.json ./auth-agg/package-lock.json ./
COPY ./auth-agg/tsconfig.json ./auth-agg/tsconfig.build.json ./auth-agg/nest-cli.json ./
RUN npm install

# Clean npm cache
RUN npm cache clean --force

# Copy all source files
COPY ./auth-agg .

# Stage 2: Build Stage
FROM development AS builder

# Build the application
RUN npm run build

# Stage 3: Production Stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app/auth

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app/auth/package.json ./package.json
COPY --from=builder /usr/src/app/auth/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/src/app/auth/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /usr/src/app/auth/node_modules ./node_modules
COPY --from=builder /usr/src/app/auth/dist ./dist

# Set the command to run the application
CMD ["node", "dist/main"]
