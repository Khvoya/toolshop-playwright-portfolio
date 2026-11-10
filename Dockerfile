FROM mcr.microsoft.com/playwright:v1.65.0-noble

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json playwright.config.ts ./
COPY src ./src
COPY tests ./tests

ENTRYPOINT ["npx", "playwright", "test"]
