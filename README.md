# Uni Store – University Book Marketplace

A modern full-stack web application that lets university students buy and sell books. Users can search, filter by section, view listings, and contact sellers via WhatsApp or Telegram. Authenticated users can manage their own book listings with image uploads powered by Cloudinary.

---

## ✨ Key Features

- **Book discovery** – Homepage with search, section filter, sort options, and pagination
- **Authentication** – Signup, login, logout, and profile update using JWT stored in HTTP-only cookies
- **Book management** – Add, edit, delete, and mark books as sold; owners can only modify their own posts
- **Responsive UI** – Mobile-first React frontend with Tailwind CSS styling
- **RTL/LTR support** – Arabic and English language switching with automatic direction handling
- **Seller contact** – WhatsApp and Telegram direct contact links for each book
- **Admin panel** – Platform stats, user and book management, password reset, and admin promotion
- **Security** – Helmet CSP, Joi validation, bcrypt hashing, owner/admin authorization, and rate limiting
- **API docs** – Swagger documentation available at `/api-docs`

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Zustand, Tailwind CSS, i18next, Axios, react-hot-toast
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Joi, Multer
- **Services:** Cloudinary (image uploads), Upstash Redis (rate limiting), MongoDB Atlas

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB instance
- Cloudinary account
- Upstash Redis account

### Install & Run

```bash
git clone https://github.com/mnoNoor/uni-store.git
cd uni-store
npm run build
npm start
```

### Development mode

```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:5000/api`
Swagger: `http://localhost:5000/api-docs`

---

## 🔐 Environment Variables (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
SUPERADMIN_EMAIL=your_superadmin_email@example.com
CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

---

## 📡 API Reference

Base URL: `/api`

| Method | Endpoint          | Description                           | Auth |
| ------ | ----------------- | ------------------------------------- | ---- |
| POST   | `/auth/signup`    | Register new user                     | ❌   |
| POST   | `/auth/login`     | Login user                            | ❌   |
| POST   | `/auth/logout`    | Logout user                           | ❌   |
| GET    | `/auth/user-auth` | Get authenticated user                | ✅   |
| PUT    | `/auth/profile`   | Update profile                        | ✅   |
| GET    | `/books`          | List books (pagination/search/filter) | ❌   |
| GET    | `/books/:id`      | View book details                     | ❌   |
| GET    | `/books/user/me`  | List current user books               | ✅   |
| POST   | `/books`          | Create book listing                   | ✅   |
| PUT    | `/books/:id`      | Edit book                             | ✅   |
| PATCH  | `/books/:id/sold` | Mark book sold                        | ✅   |
| DELETE | `/books/:id`      | Delete book                           | ✅   |

> _Owner only: `/books/:id` edit, `/books/:id/sold` mark sold, and `/books/:id` delete_

### Admin Endpoints

| Method | Endpoint                    | Description           | Auth          |
| ------ | --------------------------- | --------------------- | ------------- |
| GET    | `/admin/stats`              | Platform statistics   | ✅ Admin      |
| GET    | `/admin/users`              | List users            | ✅ Admin      |
| GET    | `/admin/books`              | List all books        | ✅ Admin      |
| DELETE | `/admin/users/:id`          | Delete user           | ✅ Admin      |
| DELETE | `/admin/books/:id`          | Delete any book       | ✅ Admin      |
| PATCH  | `/admin/users/:id/password` | Reset user password   | ✅ Admin      |
| POST   | `/admin/admins`             | Promote user to admin | ✅ Superadmin |

---

## 📁 Project Structure

```
uni-store/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── docs/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── Features/
│   │   ├── constants/
│   │   ├── lib/
│   │   ├── locales/
│   │   ├── stores/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── package.json
```

---

## 🔒 Security Highlights

- HTTP-only auth cookies
- Helmet CSP configured for Cloudinary
- Upstash Redis rate limiting (100 req/min)
- Owner verification for book edits/deletes
- Admin and superadmin authorization controls
- Joi validation for requests
- Bcrypt password hashing
- Image upload validation and file handling

---

## 🚢 Deployment

- Use `npm run build` at the repo root to install dependencies and build the frontend
- Run `npm start` to launch the backend and serve the built UI in production
- Set the backend environment variables above
- Swagger docs are exposed at `/api-docs`

---

## 📝 License

MIT
