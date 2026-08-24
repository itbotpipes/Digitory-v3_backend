# Digitory CMS Backend

This is the fully functioning MVP backend for the Digitory CMS. It provides a highly modular, production-ready REST API built with Node.js, Express, and MongoDB.

## Features (MVP)
- **Authentication**: Stateless JWT authentication with secure password hashing.
- **Users & Roles**: Admin/Editor role management with strict business rules (e.g., cannot delete last Admin).
- **Pages**: Dynamic content creation utilizing strict Section Schemas (Hero, CTA, Rich Text, etc.) with Draft/Publish workflows.
- **Blog**: Post and Category management with soft-delete support and draft/publish toggles.
- **Media**: Local file uploading via Multer to `/uploads`.
- **Global Settings**: Singleton settings document for branding and contact info.
- **Navigation**: Recursive menu items specifically for Header and Footer locations.
- **Leads & Testimonials**: Fully functional endpoints for Contact Messages, Demo Requests, FAQs, and Testimonials using a shared generic architecture.

## Tech Stack
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **JWT** for stateless session management
- **Express Validator** for request payload validation
- **Multer** for local file uploads
- **Winston** & **Morgan** for standard logging

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root of the project using the template from `.env.example`. Make sure to provide your MongoDB URI and a JWT secret.

## Running Locally

**Start development server**
```bash
npm run dev
```

**Run standard formatters and linters**
```bash
npm run format
npm run lint
```

## Database Seeding

To quickly bootstrap a new database with default roles, an admin user, settings, and navigation, run:

```bash
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@digitory.com`
- Password: `password123`

## API Documentation

Swagger API documentation is automatically available when running the server:
`http://localhost:5000/api-docs`

## Folder Structure

```
src/
├── config/           # Environment, logger configs
├── controllers/      # Route controllers (Request/Response logic)
├── docs/             # Swagger OpenAPI yaml files
├── middlewares/      # Express middlewares (Auth, Error handling, Multer)
├── models/           # Mongoose schemas (Base, Sections, Content)
├── repositories/     # Database access layer (Clean repo pattern)
├── routes/           # Express routes (v1 API)
├── scripts/          # Utility scripts (Seeding)
├── services/         # Business logic layer
├── utils/            # Helper classes (ApiError, ApiResponse, asyncHandler)
└── validators/       # express-validator payload schemas
```
