# Jobistry
<br></br>
## !! THERE ARE SOME BUGS REGARDING STATE UPDATES THAT NEEDS TO BE ROSOLVED !!
### !! Will release the updated version sson with additional changes too !!
<br></br>

## 💼 Freelance Job Marketplace

A full-stack freelance job marketplace platform that connects freelancers and clients. Users can register, post jobs or submit proposals, form contracts, and communicate in real time — all through a clean and user-friendly interface.

## 🚀 Live Demo
> [🔗 Click here to view the deployed app](#) *(Add URL once deployed)*

---

## 📑 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Coming Soon...]

---

## 🧠 About the Project

This project aims to simulate real-world freelance marketplaces like Upwork or Fiverr. It allows clients to post projects and freelancers to bid on them. Once a client accepts a proposal, a contract is formed, and both parties can chat in real-time.

### Project Goals
- Build a full-featured job marketplace with modern web technologies.
- Practice real-time communication using Socket.IO.
- Handle authentication and authorization using JWT.
- Use RESTful APIs and NoSQL databases.
- Ensure clean, maintainable, and scalable code structure.

---

## 🧰 Tech Stack

### 🖥️ Frontend
- **React.js** with **Tailwind CSS**
- **React Router DOM**
- **Context API** (Auth and Socket context)
- **Axios**

### 🧪 Backend
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.IO**
- **JWT (JSON Web Tokens)** for Authentication

### Dev Tools
- **VS Code**
- **Postman** (for API testing)
- **Nodemon**
- **ESLint + Prettier**

---

## 🏗️ Architecture

```plaintext
Client (React) <--> Express API <--> MongoDB
                   ↕
               Socket.IO (Real-time chat)
```

## ✨ Features
### 👥 User Management
- Register/Login (Client & Freelancer roles)

- JWT-based protected routes

- Role-based access control

### 📄 Project Management
- Clients can post, edit, or delete projects

- Freelancers can browse and propose bids

- Proposal acceptance turns into a contract

### 🤝 Contracts
- Auto-generated upon proposal acceptance

- Viewable in the “Contracts” section

### 💬 Messaging (Real-Time)
- Socket.IO-powered chat system

- Shows all conversations in a WhatsApp-style layout

- Chat persists in MongoDB

### 📬 Notifications (Future Enhancement)
- Real-time notifications for proposal acceptance or new messages


## ⚙️ Installation
### Prerequisites
- Node.js v18+

- MongoDB installed and running

- NPM

Step-by-step Guide
```bash
# Clone the repository
git clone https://github.com/KIRTAN-PATEL017/Jobistry.git
cd freelance-marketplace
```
```bash
# Setup Backend
cd backend
npm install
npm run dev
```
```bash
# Setup Frontend
cd ../frontend
npm install
npm run dev
```
## 🔐 Environment Variables
#### Backend .env
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 🔌 API Endpoints
### Auth
-POST /api/auth/register

-POST /api/auth/login

-GET /api/auth/me (requires token)

### Projects
- POST /api/projects (Client only)

- GET /api/projects

- GET /api/projects/:id

- PUT /api/projects/:id

- DELETE /api/projects/:id

### Proposals
- POST /api/proposals (Freelancer only)

- GET /api/proposals/project/:projectId

- PUT /api/proposals/:id/accept (Client only)

### Contracts
- GET /api/contracts

- GET /api/contracts/:id

### Messages
- GET /api/messages/:conversationId
  
- POST /api/messages

Real-time messaging handled through Socket.IO events


<br></br>
## Coming Soon...
- Payments (maybe)

- Advance Filters

- Setting, Notification, and Review features
