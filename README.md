# Estate Website - Property Management Platform

A modern, full-stack real estate application built with React and Node.js.

## 🏗 Project Structure

```text
PropertyWebsite/
├── frontend/           # React frontend (Vite)
│   ├── public/         # Static assets
│   └── src/
│       ├── api/        # Axios instances & API calls
│       ├── assets/     # Images/Icons
│       ├── components/ # Reusable UI components
│       ├── context/    # User & Global AUTH states
│       ├── lib/        # Utility libraries (tailwind-merge, etc.)
│       ├── pages/      # Route pages (Home, Dashboard, etc.)
│       ├── App.jsx     # Main routes & layout
│       └── main.jsx    # Entry point
├── backend/            # Express backend (Node.js)
│   ├── src/
│       ├── controllers/# Request handlers (logic)
│       ├── db/         # Database connection logic
│       ├── middlewares/# Auth & validation middlewares
│       ├── models/     # Mongoose schemas
│       ├── routes/     # API route definitions
│       ├── utils/      # Standardized responses & errors
│       ├── app.js      # Express app configuration
│       └── index.js    # Entry point (Starts server)
└── README.md           # This file
```

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, React Hook Form, Zod.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt, Multer, Cloudinary.

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB (Local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone <repository-url>
cd PropertyWebsite
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend/` directory.
- Add your variables (Port, MongoDB URL, Cloudinary settings, JWT Secrets).

**Run Backend:**
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
- Create a `.env` file in the `frontend/` directory if needed (e.g., API Base URL).

**Run Frontend:**
```bash
npm run dev
```

## 📜 Available Scripts

### Frontend
- `npm run dev`: Starts Vite dev server.
- `npm run build`: Builds for production.
- `npm run lint`: Runs ESLint checks.

### Backend
- `npm run dev`: Starts server with `nodemon`.
- `npm start`: Starts server with `node`.

---
Made with ❤️ for Property Management.
