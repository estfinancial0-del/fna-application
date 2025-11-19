# EST Capital - Financial Needs Analysis Application

A comprehensive Financial Needs Analysis (FNA) application built for EST Capital to help clients understand their financial goals and create personalized strategies.

## Overview

This application provides a complete solution for conducting financial needs analysis, covering aspects such as retirement planning, wealth creation, and protection strategies. It features user authentication, comprehensive data collection forms, PDF generation, and an admin dashboard for managing submissions.

## Features

- **User Authentication**: Secure login system to protect client data
- **Comprehensive FNA Form**: Multi-step form collecting detailed financial information
- **PDF Report Generation**: Automatic generation of professional FNA reports
- **Admin Dashboard**: View and manage all FNA submissions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with React and shadcn/ui components

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **Wouter** for routing
- **tRPC** for type-safe API calls

### Backend
- **Node.js** with Express
- **tRPC** for API layer
- **Drizzle ORM** for database operations
- **PostgreSQL** for data storage

## Project Structure

```
fna-application/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utility functions
│   │   └── hooks/       # Custom React hooks
├── server/              # Backend API
│   ├── _core/          # Core server functionality
│   ├── routers.ts      # API route definitions
│   └── db.ts           # Database configuration
├── shared/              # Shared types and constants
├── drizzle/            # Database schema and migrations
└── package.json        # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/estfinancial0-del/fna-application.git
cd fna-application
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=your_postgresql_connection_string
```

4. Run database migrations:
```bash
pnpm drizzle-kit push
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5000`

## Deployment

This application is configured for deployment on Vercel. The `vercel.json` configuration file is included in the repository.

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

## Database Schema

The application uses the following main tables:

- **users**: User authentication and profile information
- **fna_submissions**: Financial needs analysis form submissions
- **Additional tables**: For storing detailed financial data

## API Routes

The application uses tRPC for type-safe API communication. Main routers include:

- **fnaRouter**: Handles FNA form submissions and retrieval
- **systemRouter**: Core system functionality
- **adminRouter**: Admin dashboard operations

## Contributing

This is a private project for EST Capital. For any issues or feature requests, please contact the development team.

## License

Proprietary - EST Capital

## Support

For support or questions, please contact EST Capital's technical team.

---

**Live Application**: [https://finneedsan-c6hpxwgw.manus.space](https://finneedsan-c6hpxwgw.manus.space)

**Repository**: [https://github.com/estfinancial0-del/fna-application](https://github.com/estfinancial0-del/fna-application)
