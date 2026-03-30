# ArchLabs - Architecture Portfolio & Properties Management Platform

## Project Overview

**ArchLabs** is a full-stack web application built with **Next.js** designed to showcase architectural projects and manage real estate properties. It serves as both a **portfolio website** and a **content management system** for architects and real estate professionals.

The site includes:
- A public-facing portfolio to display projects and properties
- An admin dashboard to manage content
- User authentication system
- Contact form for inquiries
- Blog/articles section

---

## Tech Stack

- **Frontend**: Next.js 16.1.6 (with React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma)
- **ORM**: Prisma
- **Authentication**: Custom JWT-based auth system
- **Styling**: Tailwind CSS with custom theme

---

## Database Models (What You're Storing)

### 1. **Project** - Your architectural projects
```
- id, slug, title, category (Residential, Commercial, etc)
- description, location, year
- images[], coverImage (photos of the project)
- featured (show on homepage), status (draft/published)
- createdAt, updatedAt
```
**Used for**: Showcase your completed architectural works

### 2. **Property** - Real estate listings
```
- id, title, type (apartment, house, etc)
- price, location, bedrooms, bathrooms, area
- images[], coverImage
- description, status (available/sold), featured
- createdAt, updatedAt
```
**Used for**: List properties for sale/rent with all details

### 3. **Article** - Blog posts
```
- id, slug, title, excerpt, content
- coverImage, author, status (draft/published)
- createdAt, updatedAt
```
**Used for**: Write blog posts about architecture trends, case studies, tips

### 4. **Message** - Contact form submissions
```
- id, name, email, message
- createdAt
```
**Used for**: Store inquiries from the contact form on your website

### 5. **Admin** - User accounts
```
- id, email (unique), password (hashed)
- createdAt
```
**Used for**: Admin user accounts to log in and manage content

---

## API Endpoints (What You Can Call)

### Authentication
- `POST /api/auth/register` - Create admin account
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current logged-in user

### Projects
- `GET /api/projects` - Get all **published** projects (public)
- `GET /api/projects/all` - Get all projects including drafts (admin only)
- `GET /api/projects/[id]` - Get single project details
- `POST /api/projects` - Create new project (admin only)
- `PUT /api/projects/[id]` - Update project (admin only)
- `DELETE /api/projects/[id]` - Delete project (admin only)

### Properties
- `GET /api/properties` - Get all **available** properties (public)
- `GET /api/properties/[id]` - Get single property details
- `POST /api/properties` - Create property (admin)
- `PUT /api/properties/[id]` - Update property (admin)
- `DELETE /api/properties/[id]` - Delete property (admin)

### Articles
- `GET /api/articles` - Get all **published** articles (public)
- `GET /api/articles/[id]` - Get single article
- `POST /api/articles` - Create article (admin)
- `PUT /api/articles/[id]` - Update article (admin)
- `DELETE /api/articles/[id]` - Delete article (admin)

### Contact
- `POST /api/contact` - Submit contact form (public)

---

## Pages & Routes

### Public Pages
- `/` - Home page (portfolio showcase)
- `/projects` - List all published projects
- `/projects/[slug]` - Single project detail page
- `/properties` - List all available properties
- `/properties/[slug]` - Single property detail page
- `/articles` - Blog posts listing
- `/articles/[slug]` - Single article page
- `/contact` - Contact form page

### Admin Pages (Private - Requires Login)
- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard overview
- `/admin/projects` - **Manage projects** (create, edit, delete, change status)
- `/admin/properties` - **Manage properties** (create, edit, delete)
- `/admin/articles` - **Manage articles** (create, edit, delete)
- `/admin/messages` - **View contact form submissions**

---

## Key Features

### ✅ What's Implemented
1. **Authentication System**
   - Admin login/register/logout
   - JWT token-based session management
   - Protected admin routes

2. **Admin Dashboard**
   - Sidebar navigation
   - Project management (CRUD operations)
   - Form to create/edit projects
   - Table view of all projects
   - Quick edit and delete buttons
   - Status management (draft/published)
   - Featured flag for homepage

3. **Database & ORM**
   - Prisma for database management
   - PostgreSQL connection
   - Migrations set up

4. **API Routes**
   - REST endpoints for all models
   - Authentication middleware
   - Error handling

### 🔄 What You Currently Set Up
- Root layout with HTML/body tags
- API endpoints for projects (create, read, update, delete)
- Admin projects page with complete CRUD UI
- Type definitions that match your database

---

## Project Structure

```
archlabs/
├── app/                          # Main application (Next.js App Router)
│   ├── layout.tsx               # Root layout with html/body tags
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── projects/           # Project API endpoints
│   │   ├── properties/         # Property API endpoints
│   │   ├── articles/           # Article API endpoints
│   │   ├── contact/            # Contact form endpoint
│   │   └── messages/           # Messages endpoint
│   └── admin/                  # Admin pages
│       ├── login/              # Login page
│       ├── dashboard/          # Dashboard overview
│       ├── projects/           # Project management page ✅
│       ├── properties/         # Property management
│       ├── articles/           # Article management
│       └── messages/           # Messages viewer
│
├── prisma/
│   ├── schema.prisma           # Database schema (models defined here)
│   └── migrations/             # Database migrations
│
├── src/
│   ├── components/             # React components
│   │   └── AdminSidebar.tsx   # Navigation sidebar
│   ├── lib/
│   │   ├── auth.ts            # Authentication logic
│   │   ├── middleware.ts      # Auth middleware
│   │   └── prisma.ts          # Prisma client
│   └── types/
│       └── index.ts           # TypeScript type definitions
│
├── public/                     # Static files
├── package.json               # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.ts            # Next.js config
└── prisma.config.ts          # Prisma config
```

---

## How to Use This Project

### 1. **Create Admin Account**
- Go to `/api/auth/register` or use the signup form
- Set email and password

### 2. **Log In**
- Visit `/admin/login`
- Enter credentials
- Access admin dashboard

### 3. **Manage Projects** (Currently Set Up)
- Go to `/admin/projects`
- Click "+ Add Project"
- Fill in: Title, Category, Location, Year, Cover Image URL, Description
- Set Status (Draft/Published)
- Mark as Featured if needed
- Click Create/Update
- View all projects in table format
- Edit or delete as needed

### 4. **Manage Other Content** (To Be Set Up)
- Similarly manage Properties, Articles, Messages
- Follow same CRUD pattern

### 5. **View Public Site**
- Published projects show on `/projects`
- Published properties show on `/properties`
- Published articles show on `/articles`
- Admin-only content won't appear on public site

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Next Steps to Complete Your Project

1. **Create Properties Management Page** - Similar to projects admin page
2. **Create Articles Management Page** - For blog management
3. **Build Public Facing Pages** - Home, projects list, properties list, etc.
4. **Create Contact Form Page** - For visitors to send messages
5. **Build Project/Property Detail Pages** - Show full information
6. **Add Image Upload** - Instead of just URLs
7. **Add Search & Filter** - For projects and properties
8. **Add User Reviews/Ratings** - For properties
9. **Email Notifications** - For admin when form submitted
10. **Deploy to Production** - Host your site live

---

## Environment Variables Needed

Create a `.env.local` file:
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key_here
```

---

## Current Status

- ✅ Database schema created
- ✅ Authentication system set up
- ✅ Project API endpoints working
- ✅ Admin projects management page working
- ⏳ Properties management - Ready to build
- ⏳ Articles management - Ready to build
- ⏳ Public pages - Ready to build

---

## Example: How a Feature Works

**When you create a project in the admin dashboard:**

1. You fill the form on `/admin/projects`
2. Click "Create" button
3. Frontend calls `POST /api/projects` with your data
4. Backend validates and creates entry in `Project` table
5. System auto-generates a URL-friendly slug
6. Data saves to PostgreSQL
7. Admin page refreshes and shows new project in table
8. If status is "published", it shows publicly at `/projects`

---

## Questions About Your Project?

- **"What's a slug?"** - A URL-friendly version of the title (e.g., "Modern House" → "modern-house")
- **"Why have draft status?"** - So you can work on projects before making them public
- **"Can users edit their projects?"** - No, only admins through the dashboard
- **"Is the site responsive?"** - Yes, built with Tailwind CSS for mobile/tablet/desktop
- **"Can I upload images?"** - Currently expects image URLs. Image upload can be added later

---

This is your **content management system for architecture work**! 🏗️
