# Uni Store – University Books Marketplace

Uni Store is a full‑stack web application that allows university students to buy and sell books. Users can browse books, filter by section, search by title or description, and contact sellers via WhatsApp or Telegram. Authenticated users can add, edit, and delete their own book listings, with image uploads handled by Cloudinary. The API is rate‑limited using Upstash, secured with Helmet, and authentication is managed with JWT stored in HTTP‑only cookies.

---

## Features

- **User authentication** – sign up, log in, log out (JWT + HTTP‑only cookies)
- **Book management** – create, read, update, delete book listings (edit/delete buttons only appear for owners)
- **Image upload** – books include images uploaded to Cloudinary with preview, validation, and automatic optimization
- **Search & filter** – search by title or description; sort by price (low to high, high to low) or newest first
- **Contact sellers** – direct links to WhatsApp or Telegram chats
- **User profile page** – view your account details and all books you've listed in one place
- **Rate limiting** – 100 requests per 60 seconds per user (Upstash Redis) with friendly UI feedback
- **Security** – Helmet.js with custom CSP for Cloudinary, HTTP-only cookies, environment‑aware CORS
- **Responsive UI** – built with Tailwind CSS, works seamlessly on mobile and desktop
- **Production ready** – single-command build and deploy setup

---

## Tech Stack

### Backend

- **Runtime**: Node.js (Express)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcryptjs, cookie‑parser
- **Security**: Helmet, CORS (environment-aware)
- **Validation**: Joi
- **File upload**: Multer + Cloudinary SDK
- **Rate limiting**: @upstash/ratelimit + @upstash/redis

### Frontend

- **Framework**: React (Vite)
- **State management**: Zustand
- **Routing**: React Router v6 (with layout pattern)
- **HTTP client**: Axios (with credentials, environment-aware base URL)
- **Styling**: Tailwind CSS, Heroicons, Lucide React
- **Notifications**: react‑hot‑toast
- **Architecture**: Feature-based folder structure (auth, books, shared components, etc.)

### Services

- **Cloudinary** – image hosting and transformations
- **Upstash** – Redis for rate limiting
- **MongoDB Atlas**

---

## Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account
- Upstash Redis account

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/mnoNoor/uni-store.git
cd uni-store
```

### 2. Install dependencies (root level)

```bash
npm run build
```

This single command installs dependencies for both backend and frontend, and builds the frontend for production.

### 3. Backend environment setup

Create a `.env` file in the `backend` folder (see [Environment Variables](#environment-variables)).

### 4. Run in development mode

**Backend:**

```bash
cd backend
npm start
```

**Frontend (in a new terminal):**

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development   # Switch to 'production' for deployment

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

### Frontend (.env)

The frontend axios instance automatically detects the environment:

- **Development**: `http://localhost:5000/api`
- **Production**: `/api` (relative to your domain)

Override if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Running the Application

### Development Mode

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Production Build

```bash
# From root directory
npm run build
npm start
```

This will:

1. Install all dependencies
2. Build the React frontend
3. Start the backend server (which serves the built frontend)

---

## API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint          | Description                                  | Auth required      |
| ------ | ----------------- | -------------------------------------------- | ------------------ |
| POST   | `/auth/signup`    | Register a new user                          | No                 |
| POST   | `/auth/login`     | Log in an existing user                      | No                 |
| POST   | `/auth/logout`    | Log out the current user                     | No (clears cookie) |
| GET    | `/auth/user-auth` | Get authenticated user info                  | Yes                |
| GET    | `/books`          | Get all books                                | No                 |
| GET    | `/books/user/me`  | Get books belonging to current user          | Yes                |
| GET    | `/books/:id`      | Get a single book by ID                      | No                 |
| POST   | `/books`          | Create a new book (multipart/form-data)      | Yes                |
| PUT    | `/books/:id`      | Update a book (multipart/form-data optional) | Yes (owner only)   |
| DELETE | `/books/:id`      | Delete a book                                | Yes (owner only)   |

All protected routes expect an HTTP‑only cookie named `token` containing a valid JWT.

---

## Folder Structure

```
uni-store/
├── backend/                # Express server
│   ├── config/             # DB, Cloudinary, Upstash configs
│   ├── controllers/        # Route handlers (auth, books)
│   ├── middlewares/        # Auth, error handler, rate limiter, upload, validation
│   ├── models/             # Mongoose models (User, Book)
│   ├── routes/             # Express routes (authRoutes, booksRoutes)
│   ├── utils/              # asyncHandler, setCookie
│   ├── validators/         # Joi validation schemas
│   ├── .env                # Environment variables
│   ├── index.js            # App entry point
│   └── package.json
│
├── frontend/               # React app
│   ├── public/
│   ├── src/
│   │   ├── Features/       # Feature-based architecture
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── books/      # Book-related components
│   │   │   ├── layout/     # Layout components (Header, Footer, NavBar)
│   │   │   ├── pages/      # Static pages (About, Contact)
│   │   │   ├── shared/     # Reusable components (ImageUpload, ContactSection)
│   │   │   ├── user/       # User profile components
│   │   │   └── utils/      # Helper functions (formatCurrency)
│   │   ├── lib/            # Axios instance (environment-aware)
│   │   ├── stores/         # Zustand store (authStore)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── package.json            # Root package.json for easy deployment
└── README.md
```

---

## Security Features

- **Helmet.js** – with custom CSP allowing Cloudinary images
- **HTTP‑only cookies** – prevents XSS attacks
- **Environment‑aware CORS** – only allows frontend origin in development
- **Rate limiting** – prevents brute force and DoS attacks
- **Password hashing** – bcrypt with salt rounds
- **Input validation** – Joi schemas on all endpoints (backend) + frontend validation
- **File restrictions** – size limits (5MB), type validation
- **Owner verification** – users can only edit/delete their own books

---

## Deployment

### Deploy as a single app (Render, Railway, etc.)

1. Push code to GitHub
2. Connect your repository to the hosting platform
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add all environment variables from [backend .env](#backend-env)

The app will serve both API and frontend from the same domain.

## What's Next / Planned Features

- [ ] Email verification (schema ready)
- [ ] Password reset flow (schema ready)
- [ ] Edit profile page
- [ ] Admin dashboard for moderation
- [ ] Pagination for books endpoint
- [ ] Unit and integration tests
- [ ] Swagger API documentation
- [ ] Docker containerization
- [ ] Structured logging (winston/pino)
- [ ] Search debouncing for better performance

---

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

## Acknowledgements

- [Cloudinary](https://cloudinary.com) for image hosting and optimization
- [Upstash](https://upstash.com) for serverless Redis
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Zustand](https://github.com/pmndrs/zustand) for lightweight state management
- [Helmet](https://helmetjs.github.io/) for security headers
- [Lucide React](https://lucide.dev) for beautiful icons
- All other open‑source libraries used in this project

---

## Contact

Project Link: [https://github.com/mnoNoor/Uni-Store](https://github.com/mnoNoor/Uni-Store)

---

**Built by mnoNoor**
