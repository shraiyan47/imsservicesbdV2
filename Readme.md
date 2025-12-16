
# IMS Services - NextJS Setup

## Overview
This is a NextJS application for IMS Services.

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=<your_api_url>
NEXT_PUBLIC_APP_ENV=<development|production>
```

## Running the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Project Structure

```
├── app/              # NextJS app directory
├── components/       # Reusable components
├── public/          # Static assets
├── .env.local       # Environment variables (not committed)
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linting

## Notes

- Never commit sensitive credentials to version control
- Use `.env.local` for local development only
- Refer to `.env.example` for required variables

## ENV Values
MONGODB_URI = 