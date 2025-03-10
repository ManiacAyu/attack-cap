# Next.js + Node.js Project

## 📌 Overview
This project consists of a **Next.js frontend** and a **Node.js (Express) backend** with MongoDB for database storage. It supports user authentication and post creation, including media uploads.

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- **Node.js** (>= 18.x)
- **npm** or **yarn**
- **MongoDB Atlas** (or a local MongoDB instance)

## ⚙️ Backend Setup (Node.js + Express)

### Installation
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Environment Variables
Create a `.env` file in the `backend` directory and add:
```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret_key>
PORT=5000
```

### Running the Backend
Start the server:
```sh
npm start
```
By default, the backend runs on `http://localhost:5000`.

## ⚙️ Frontend Setup (Next.js)

### Installation
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```

### Environment Variables
Create a `.env.local` file in the `frontend` directory and add:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Running the Frontend
Start the development server:
```sh
npm run dev  # or yarn dev
```
By default, the frontend runs on `http://localhost:3000`.

## 📡 API Endpoints

### Authentication
- `POST /signup` → Register a new user.
- `POST /login` → Authenticate and get a JWT token.

### Posts
- `POST /post` → Create a new post (Authenticated, supports media uploads).
- `POST /post/:id` → Fetch posts by a specific user.
- `GET /posts` → Fetch all posts.

## 🛠 Troubleshooting
If you encounter issues:
- Ensure MongoDB is running.
- Check `.env` files for correct values.
- Verify the backend is running before testing the frontend.
- Look at logs (`console.log`) for debugging.

## 📜 License
This project is licensed under the MIT License.

---
Happy coding! 🚀

