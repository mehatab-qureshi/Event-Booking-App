# 🎟️ Eventify — Event Booking Platform
A full-stack event booking web application with role-based authentication, OTP verification, and admin dashboard.

## 🌐 Live Demo
👉 [event-booking-app-iota.vercel.app](https://event-booking-app-iota.vercel.app)

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT, OTP Email Verification (Resend)
- **Deployment:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas (Database)

## ✨ Features
- 🔐 JWT Authentication with OTP Email Verification
- 👤 Role-based access (Admin / User)
- 🎉 Browse & Search Events
- 📋 Book Events with OTP Confirmation
- 🛠️ Admin Dashboard — Create/Delete Events
- ✅ Admin can Confirm/Reject Bookings
- 📊 Revenue & Booking Stats for Admin
- 📱 Fully Responsive UI

## 🚀 Run Locally

### Backend
```bash
cd server
npm install
npm run dev

### Frontend
```bash
cd client
npm install
npm run dev
```

### Environment Variables
**server/.env**
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_passekey
PORT=5000

**client/.env**
VITE_API_URL=http://localhost:5000/api

