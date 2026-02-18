# Uni Shop - University Books Marketplace

Uni Shop is a full‑stack web application that allows university students to buy and sell books. Users can browse books, filter by section, search by title/description, and contact sellers via WhatsApp or Telegram. Authenticated users can add, edit, and delete their own book listings, with image uploads handled by Cloudinary. The API is rate‑limited using Upstash, secured with Helmet, and authentication is managed with JWT stored in HTTP‑only cookies.

---

## Features

- **User authentication** – sign up, log in, log out (JWT + HTTP‑only cookies)
- **Book management** – create, read, update, delete book listings
- **Image upload** – books can have an image, uploaded to Cloudinary with automatic optimization
- **Search & filter** – search by title or description; sort by price or date
- **Contact sellers** – direct links to WhatsApp or Telegram chats
- **Rate limiting** – 100 requests per 60 seconds per user (Upstash Redis)
- **Security** – Helmet.js with custom CSP for Cloudinary, HTTP-only cookies, CORS properly configured
- **Responsive UI** – built with Tailwind CSS, works on mobile and desktop
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
- **Routing**: React Router v6
- **HTTP client**: Axios (with credentials, environment-aware base URL)
- **Styling**: Tailwind CSS, Heroicons, Lucide React
- **Notifications**: react‑hot‑toast

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
git clone https://github.com/mnoNoor/uni-shop.git
cd uni-shop
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
| GET    | `/books/:id`      | Get a single book by ID                      | No                 |
| POST   | `/books`          | Create a new book (multipart/form-data)      | Yes                |
| PUT    | `/books/:id`      | Update a book (multipart/form-data optional) | Yes                |
| DELETE | `/books/:id`      | Delete a book                                | Yes                |

All protected routes expect an HTTP‑only cookie named `token` containing a valid JWT.

---

## Folder Structure

```
uni-shop/
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
│   │   ├── components/     # Reusable UI (LoadingSkeleton, RateLimitedUI, SearchBar)
│   │   ├── layout/         # Layout components (Header, Footer, NavBar, BookCard)
│   │   ├── lib/            # Axios instance
│   │   ├── pages/          # Page components (Home, AddBook, BookDetail, etc.)
│   │   ├── stores/         # Zustand store (authStore)
│   │   ├── utils/          # Helper functions (formatCurrency)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── package.json
└── README.md
```

---

## Rate Limiting

The API uses Upstash Redis with a sliding window rate limiter: **100 requests per 60 seconds** per user (identified by the JWT token). When the limit is exceeded, the server responds with a `429 Too Many Requests` status, and the frontend displays a friendly rate‑limited UI.

---

## Security Features

- **Helmet.js** – with custom CSP allowing Cloudinary images
- **HTTP‑only cookies** – prevents XSS attacks
- **Environment‑aware CORS** – only allows frontend origin in development
- **Rate limiting** – prevents brute force and DoS attacks
- **Password hashing** – bcrypt with salt rounds
- **Input validation** – Joi schemas on all endpoints
- **File restrictions** – size limits, type validation via Cloudinary

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

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
- All other open‑source libraries used in this project

---

**Built by mnoNoor**
