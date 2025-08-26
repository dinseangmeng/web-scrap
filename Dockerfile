FROM node:20

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libfreetype6 \
    libharfbuzz0b \
    fonts-freefont-ttf \
    git \
    bash \
    libstdc++6 \
    wget \
    dos2unix \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/temp

# Set environment variables
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    CHROME_BIN=/usr/bin/chromium \
    CHROME_PATH=/usr/lib/chromium/ \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    chrome_launchOptions_executablePath=/usr/bin/chromium \
    chrome_launchOptions_args=--no-sandbox,--disable-dev-shm-usage,--disable-gpu,--headless \
    temp_directory=/app/temp

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY .env.example .env

RUN npm install
RUN npm install -g dotenv

# Copy the application
COPY . /app/

# Set permissions and create user
RUN addgroup --system appuser && \
    adduser --system --ingroup appuser appuser && \
    # Set ownership after user creation
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser


CMD ["npm", "start"]