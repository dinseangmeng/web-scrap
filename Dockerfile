FROM node:20

# Install required system dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxss1 \
    libgtk-3-0 \
    libxcomposite1 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxdamage1 \
    libgbm1 \
    libxkbcommon0 \
    libfreetype6 \
    libharfbuzz0b \
    fonts-freefont-ttf \
    fonts-liberation \
    git \
    bash \
    libstdc++6 \
    wget \
    dos2unix \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/temp

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    CHROME_BIN=/usr/bin/chromium \
    CHROME_PATH=/usr/lib/chromium/ \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    chrome_launchOptions_executablePath=/usr/bin/chromium \
    chrome_launchOptions_args=--no-sandbox,--disable-dev-shm-usage,--disable-gpu,--headless \
    temp_directory=/app/temp \
    DISPLAY=:99

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY .env.example .env

# Install dependencies
RUN npm ci --only=production

# Install dotenv globally if needed
RUN npm install -g dotenv

# Copy the application
COPY . /app/

# Create user and set permissions
RUN groupadd --system --gid 1001 appuser && \
    useradd --system --uid 1001 --gid 1001 --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app && \
    chmod -R 755 /app

# Create necessary directories with proper permissions
RUN mkdir -p /home/appuser/.cache/puppeteer && \
    mkdir -p /app/temp && \
    chown -R appuser:appuser /home/appuser/.cache && \
    chown -R appuser:appuser /app/temp

# Switch to non-root user
USER appuser

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/health || exit 1

EXPOSE 4000

CMD ["npm", "start"]