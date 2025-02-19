# alphadev-webscrapper

Web scraping API service with authentication and Swagger documentation.

## Requirements
- Node.js
- Docker (optional)

## Tech Stack
- Express.js
- Puppeteer
- Swagger
- EJS

## Setup

1. Clone and install:
```bash
git clone [https://github.com/dinseangmeng/web-scrap.git]
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

## Development
```bash
npm run start:dev
```

## Production
```bash
npm start
```
or with Docker:
```bash
docker build -t alphadev-webscrapper .
docker run -p 4000:4000 alphadev-webscrapper
```

## API Documentation
Access Swagger at: http://localhost:4000/api-docs

## Author
DINN SEANGMENG

## License
ISC