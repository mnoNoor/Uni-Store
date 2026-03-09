# Uni Store – University Book Marketplace

A full‑stack web application where university students can buy and sell books. Browse listings, filter by section, search by title/description, and contact sellers via WhatsApp or Telegram. Authenticated users can add, edit, and delete their own books with image uploads handled by Cloudinary.

---

## ✨ Features

- **Browse & Search** – Paginated book listing with search, section filters (male/female/both), and sort options (newest, price low-high, price high-low)
- **User Authentication** – Signup, login, logout with JWT stored in HTTP‑only cookies (secure, XSS-proof)
- **Book Management** – Add books with image upload (preview, 5MB limit, auto WebP conversion). Edit/delete buttons visible only to owners
- **Contact Sellers** – Direct WhatsApp and Telegram buttons on each book
- **User Dashboard** – Profile page showing your details and all your listed books
- **RTL/LTR Support** – Full Arabic/English translation with automatic direction switching
- **Rate Limiting** – 100 requests per 60 seconds per user with friendly UI feedback
- **Security** – Helmet.js with CSP, owner verification, input validation, bcrypt hashing
- **Responsive** – Mobile-first design with Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend:** React, Zustand, React Router, Tailwind CSS, i18next, Axios, react-hot-toast  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Joi, Multer  
**Services:** Cloudinary (images), Upstash Redis (rate limiting), MongoDB Atlas

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+, MongoDB, Cloudinary & Upstash accounts

### Installation

```bash
git clone https://github.com/mnoNoor/uni-store.git
cd uni-store
npm run build   # installs backend + frontend deps & builds frontend
npm start       # runs the server
```

### Development Mode

```bash
# Terminal 1 (backend)
cd backend && npm start

# Terminal 2 (frontend)
cd frontend && npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:5000/api`

Swagger: `http://localhost:5000/api-docs`

---

## 🔐 Environment Variables (backend/.env)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_token
```

---

## 📡 API Reference

Base URL: `/api`

| Method | Endpoint          | Description                       | Auth |
| ------ | ----------------- | --------------------------------- | ---- |
| POST   | `/auth/signup`    | Register                          | ❌   |
| POST   | `/auth/login`     | Login                             | ❌   |
| POST   | `/auth/logout`    | Logout                            | ❌   |
| GET    | `/auth/user-auth` | Get current user                  | ✅   |
| GET    | `/books`          | Get all books (paginated)         | ❌   |
| GET    | `/books/:id`      | Get single book                   | ❌   |
| GET    | `/books/user/me`  | Get user's books                  | ✅   |
| POST   | `/books`          | Create book (multipart/form-data) | ✅   |
| PUT    | `/books/:id`      | Update book                       | ✅\* |
| DELETE | `/books/:id`      | Delete book                       | ✅\* |

\* _Owner only_

**Query params (GET /books):** `page`, `limit` (default 12), `search`, `sort` (newest/price-asc/price-desc), `section` (male/female/both)

---

## 📁 Project Structure (Brief)

```
uni-store/
├── backend/
│   ├── controllers/        # authController.js, booksController.js
│   ├── models/             # User.js, Book.js
│   ├── routes/             # authRoutes.js, booksRoutes.js
│   ├── middlewares/        # auth.js, errorHandler.js, rateLimiter.js, upload.js, validation.js
│   ├── validators/         # Joi schemas
│   ├── config/             # db.js, cloudinary.js, upstash.js, swagger.js
│   ├── utils/              # asyncHandler.js, setCookie.js
│   ├── docs/               # Swagger documentation
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── Features/       # auth/, books/, layout/, pages/, shared/, user/
│   │   ├── stores/          # authStore.js
│   │   ├── lib/             # axios.js, i18n.js, i18nDir.js
│   │   ├── locales/         # ar.json, en.json
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── package.json            # Root: one-command deploy
```

---

## 🔒 Security

- HTTP‑only cookies (prevents XSS)
- Helmet.js with custom CSP allowing Cloudinary
- Rate limiting (Upstash: 100 req/min)
- Owner verification on edit/delete
- Joi input validation (all endpoints)
- bcrypt password hashing
- File validation: images only, max 5MB

---

## 🚢 Deployment (Render/Railway)

1. Push to GitHub
2. Connect repo → Build command: `npm run build` → Start command: `npm start`
3. Add all environment variables from above

App serves both API and frontend from same domain.

---

## 📝 License

MIT © [mnoNoor](https://github.com/mnoNoor)

**Live Demo:** [Uni Store](https://book-store-ftd7.onrender.com/)  
**GitHub:** [https://github.com/mnoNoor/uni-store](https://github.com/mnoNoor/uni-store)
