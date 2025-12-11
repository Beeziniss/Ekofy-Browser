# Ekofy Browser

A modern music streaming and management platform built with Next.js, featuring artist dashboards, track uploads, real-time notifications, and comprehensive admin controls.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Installation](#installation)
- [Development](#development)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js**: Version 20.x or higher (recommended: 20.19.6)
- **npm**: Version 10.x or higher (comes with Node.js)
- **Git**: For cloning the repository

Optional:
- **Bun**: Alternative package manager (the project includes `bun.lock`)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Beeziniss/Ekofy-Browser.git
cd Ekofy-Browser
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using Bun (if you prefer):
```bash
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then configure all required environment variables (see [Environment Configuration](#environment-configuration) section below).

### 4. Generate GraphQL Schema and Types

The project uses GraphQL Code Generator to generate TypeScript types from your GraphQL schema. Before running the development server, you need to generate these files:

```bash
npm run codegen
```

**Note**: This command requires a valid `NEXT_PUBLIC_URL_ENDPOINT` to be set in your `.env` file, as it fetches the GraphQL schema from the backend API.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Configuration

The application requires several environment variables to function properly. Create a `.env` file in the root directory and configure the following variables:

### Required Environment Variables

```env
# Backend API Configuration
NEXT_PUBLIC_URL_ENDPOINT=https://your-api-endpoint.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-api-endpoint.com/graphql

# Google OAuth Authentication
NEXT_PUBLIC_AUTHENTICATION_GOOGLE_CLIENT_ID=your-google-client-id

# Cloudinary Configuration (for image/media uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key

# AWS S3 Configuration (for file storage)
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=your-aws-region

# FPT AI Service (optional - for AI features)
NEXT_PUBLIC_KEY_FPT_AI=your-fpt-ai-key

# Audd API (optional - for music recognition)
AUDD_API_TOKEN=your-audd-token
```

### Environment Variable Details

- **NEXT_PUBLIC_URL_ENDPOINT**: The base URL of your backend API server
- **NEXT_PUBLIC_GRAPHQL_ENDPOINT**: The GraphQL endpoint (typically `{BASE_URL}/graphql`)
- **NEXT_PUBLIC_AUTHENTICATION_GOOGLE_CLIENT_ID**: OAuth 2.0 client ID from Google Cloud Console
- **Cloudinary variables**: Obtain from your [Cloudinary dashboard](https://cloudinary.com/console)
- **AWS variables**: Create an IAM user with S3 access in [AWS Console](https://console.aws.amazon.com/)
- **FPT AI key**: Register at [FPT AI](https://fpt.ai/) for AI services
- **AUDD token**: Get from [AudD Music Recognition API](https://audd.io/)

## Installation

### Package Manager

This project uses **npm** as the primary package manager. You can also use **Bun** as an alternative since the project includes a `bun.lock` file.

### Dependencies Overview

The project uses:
- **UI Framework**: Next.js 15.4.8 with React 19
- **Styling**: Tailwind CSS 4.0 with shadcn/ui components
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query) with GraphQL
- **Real-time Communication**: SignalR for WebSocket connections
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Google OAuth via @react-oauth/google

## Development

### Development Workflow

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   This starts Next.js in development mode with hot-reload enabled.

2. **Run GraphQL code generation in watch mode** (in a separate terminal):
   ```bash
   npm run codegen
   ```
   This watches for GraphQL query/mutation changes and regenerates TypeScript types.

3. **Run both concurrently**:
   ```bash
   npm run dev:all
   ```
   This runs both the dev server and codegen in watch mode simultaneously.

### Code Style and Formatting

The project uses:
- **ESLint**: For code linting
- **Prettier**: For code formatting with Tailwind CSS class sorting

Format your code:
```bash
npm run format
```

Lint your code:
```bash
npm run lint
```

### Development Best Practices

1. **Always run code generation** after modifying GraphQL queries/mutations
2. **Format your code** before committing using `npm run format`
3. **Check linting errors** with `npm run lint`
4. **Use TypeScript strictly** - the project has strict mode enabled
5. **Follow the existing folder structure** when adding new features

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Starts the Next.js development server on port 3000 |
| `build` | `npm run build` | Creates an optimized production build |
| `start` | `npm start` | Starts the production server (run `build` first) |
| `lint` | `npm run lint` | Runs ESLint to check for code issues |
| `format` | `npm run format` | Formats code with Prettier |
| `codegen` | `npm run codegen` | Generates GraphQL TypeScript types in watch mode |
| `dev:all` | `npm run dev:all` | Runs dev server and codegen concurrently |

## Project Structure

```
Ekofy-Browser/
├── public/                    # Static assets (images, SVGs, icons)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (client)/         # Client-facing pages
│   │   ├── admin/            # Admin dashboard
│   │   ├── artist/           # Artist dashboard
│   │   ├── moderator/        # Moderator dashboard
│   │   ├── api/              # API routes
│   │   └── layout.tsx        # Root layout
│   ├── assets/               # Additional assets
│   ├── components/           # Reusable React components
│   │   └── ui/              # shadcn/ui components
│   ├── config/               # Configuration files
│   ├── gql/                  # Generated GraphQL types (auto-generated)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   ├── modules/              # Feature modules
│   ├── providers/            # React context providers
│   ├── services/             # API service functions
│   ├── store/                # Zustand store (see store/README.md)
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Environment variables template
├── codegen.ts                # GraphQL Code Generator configuration
├── components.json           # shadcn/ui configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration (auto-generated)
└── tsconfig.json             # TypeScript configuration
```

### Important Directories

- **`src/app/`**: Contains all pages using Next.js App Router
- **`src/components/ui/`**: shadcn/ui components (installed via CLI)
- **`src/gql/`**: Auto-generated GraphQL types (don't edit manually)
- **`src/store/`**: Zustand state management (see `/src/store/README.md`)
- **`src/services/`**: API integration services

## Key Features

- 🎵 **Music Streaming**: HLS-based audio streaming with playback controls
- 👤 **Multi-Role Support**: Separate dashboards for Artists, Moderators, and Admins
- 📤 **Track Upload**: Upload and manage music tracks with real-time progress
- 💬 **Real-time Chat**: SignalR-powered messaging system
- 🔔 **Live Notifications**: Real-time notification system
- 🔐 **Authentication**: Google OAuth integration
- ☁️ **Cloud Storage**: AWS S3 and Cloudinary integration
- 📊 **Analytics**: Track and user analytics dashboards
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS
- 📱 **Responsive Design**: Mobile-friendly interface

## Technology Stack

### Core Framework
- **Next.js 15.4.8**: React framework with App Router
- **React 19.1.2**: UI library
- **TypeScript 5**: Type-safe development

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components built on Radix UI
- **Lucide React**: Icon library

### State & Data Management
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state management and caching
- **GraphQL Code Generator**: Type-safe GraphQL operations

### Real-time & Communication
- **SignalR**: WebSocket-based real-time communication
- **Axios**: HTTP client for REST APIs

### Forms & Validation
- **React Hook Form**: Performant form library
- **Zod**: TypeScript-first schema validation

### Cloud Services
- **AWS S3**: File storage
- **Cloudinary**: Media management and optimization

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **GraphQLSP**: GraphQL language server for IDE support

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors after cloning
**Solution**: Make sure you've installed all dependencies:
```bash
rm -rf node_modules
npm install
```

#### 2. GraphQL codegen fails
**Problem**: `NEXT_PUBLIC_URL_ENDPOINT` is not set or backend is not running.

**Solution**: 
- Ensure `.env` file exists with correct `NEXT_PUBLIC_URL_ENDPOINT`
- Verify the backend API is running and accessible
- Check if the GraphQL endpoint returns a valid schema

#### 3. "Cannot find module '@/...' " errors
**Problem**: TypeScript path aliases not recognized.

**Solution**: 
- Restart your IDE/editor
- Ensure `tsconfig.json` has correct paths configuration
- Run `npm run build` to check for TypeScript errors

#### 4. Environment variables not loading
**Problem**: Using `process.env.VARIABLE_NAME` returns `undefined`.

**Solution**:
- Ensure `.env` file is in the root directory
- Restart the dev server after changing `.env`
- Variables must start with `NEXT_PUBLIC_` to be accessible in browser

#### 5. SSL/TLS certificate errors in development
**Problem**: "self-signed certificate" error when connecting to backend.

**Solution**: The `codegen.ts` file sets `NODE_TLS_REJECT_UNAUTHORIZED=0` for development. If you still face issues, verify your backend API's SSL configuration.

#### 6. SignalR connection failures
**Problem**: Real-time features (chat, notifications) not working.

**Solution**:
- Check that `NEXT_PUBLIC_URL_ENDPOINT` is correctly set
- Verify the backend SignalR hubs are running at:
  - `/hub/chat`
  - `/hub/notification`
  - `/hub/track-upload`

### Getting Help

If you encounter issues not covered here:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [shadcn/ui documentation](https://ui.shadcn.com)
3. Open an issue in the repository
4. Check backend API logs for errors

## Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - React 19 documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Component library documentation
- [TanStack Query](https://tanstack.com/query/latest) - Data fetching and caching
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

### Tools & Services
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) - Type-safe GraphQL
- [Cloudinary](https://cloudinary.com/documentation) - Media management
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/) - File storage
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2) - Authentication

### Community & Support
- [Next.js GitHub](https://github.com/vercel/next.js) - Report issues and contribute
- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui) - UI component issues

---

**Note**: This project is part of the Ekofy ecosystem. Make sure you have access to the backend API and required cloud services before starting development.

For production deployment, refer to [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
