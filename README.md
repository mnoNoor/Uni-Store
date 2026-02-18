# Uni Shop - University Books Marketplace

Uni Shop is a full‑stack web application that allows university students to buy and sell books. Users can browse books, filter by section, search by title/author, and contact sellers via WhatsApp or Telegram. Authenticated users can add, edit, and delete their own book listings, with image uploads handled by Cloudinary. The API is rate‑limited using Upstash, and authentication is managed with JWT stored in HTTP‑only cookies.

---

## Features

- **User authentication** – sign up, log in, log out (JWT + HTTP‑only cookies)
- **Book management** – create, read, update, delete book listings
- **Image upload** – books can have an image, uploaded to Cloudinary
- **Search & filter** – search by title, description, or author; sort by price or date
- **Contact sellers** – direct links to WhatsApp or Telegram chats
- **Rate limiting** – 100 requests per 60 seconds per user (Upstash Redis)
- **Responsive UI** – built with Tailwind CSS, works on mobile and desktop

---

## Tech Stack

### Backend

- **Runtime**: Node.js (Express)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcryptjs, cookie‑parser
- **Validation**: Joi
- **File upload**: Multer + Cloudinary SDK
- **Rate limiting**: @upstash/ratelimit + @upstash/redis
- **Email** (planned): nodemailer / mailtrap (dependencies included)
- **Other**: cors, helmet

### Frontend

- **Framework**: React (Vite)
- **State management**: Zustand
- **Routing**: React Router v6
- **HTTP client**: Axios (with credentials)
- **UI components**: Tailwind CSS, Heroicons, Lucide React
- **Notifications**: react‑hot‑toast

### Services

- **Cloudinary** – image hosting and transformations
- **Upstash** – Redis for rate limiting
- **MongoDB Atlas** (or local MongoDB)

---

## Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account
- Upstash Redis account (or local Redis with compatible env vars)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/mnoNoor/uni-shop.git
cd uni-shop
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (see [Environment Variables](#environment-variables)).

Start the backend server:

```bash
npm start
```

The server will run on `http://localhost:5000` by default.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend root (optional, if you need to change the API URL – default is `http://localhost:5000/api`).

Start the frontend development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

### Frontend (.env)

If your backend runs on a different URL, create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The frontend axios instance already points to `http://localhost:5000/api` by default, so this is optional.

---

## Running the Application

1. **Backend**: `cd backend && npm start`
2. **Frontend**: `cd frontend && npm run dev`

Open your browser and navigate to `http://localhost:5173`.

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
```

---

## Rate Limiting

The API uses Upstash Redis with a sliding window rate limiter: **100 requests per 60 seconds** per user (identified by the JWT token). When the limit is exceeded, the server responds with a `429 Too Many Requests` status, and the frontend displays a friendly rate‑limited UI.

---

## Deployment

### Backend (e.g., Render, Railway, Heroku)

- Set the environment variables on your hosting platform.
- Make sure the `NODE_ENV` is set to `production` so that cookies are sent with `Secure` flag.
- Update CORS origin to your frontend domain.

### Frontend (e.g., Vercel, Netlify)

- Build the project: `npm run build`
- Set the `VITE_API_BASE_URL` environment variable to your deployed backend URL.
- Deploy the `dist` folder.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. Please follow the existing code style and add tests if applicable.

---

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

## Acknowledgements

- [Cloudinary](https://cloudinary.com) for image hosting
- [Upstash](https://upstash.com) for serverless Redis
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Zustand](https://github.com/pmndrs/zustand) for state management
- All other open‑source libraries used in this project
