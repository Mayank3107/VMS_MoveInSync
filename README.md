
# 🏢 Visitor Management System (VMS)

A full-stack web application designed to streamline the process of managing visitors in corporate environments. VMS facilitates secure visit scheduling, QR-based verification, live photo capture, and role-based access for Visitors, Employees, Guards, and Admins.

---

## 🚀 Features

- ✅ Visitor registration and visit scheduling
- ✅ Employee visit approval workflow
- ✅ QR code generation & real-time validation
- ✅ Guard portal with live camera photo capture
- ✅ Role-based authentication (JWT)
- ✅ Admin panel to manage guards, employees & visits
- ✅ Email notifications using Nodemailer
- ✅ Cloudinary for profile & entry image uploads
- ✅ Integrated with MongoDB using Mongoose

---

## 🧱 Tech Stack

### Frontend
- **React.js**
- **Tailwind CSS**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**

### Other Integrations
- **Cloudinary** - For photo storage
- **QRCode** - Visit pass generation
- **Nodemailer** - For email alerts
- **JWT** - For authentication
- **NodeCache** - For temporary caching

---

## 📸 Screenshots

<!-- Include some optional screenshots of the login screen, visitor dashboard, guard camera screen, etc. -->

![Screenshot (83)](https://github.com/user-attachments/assets/befa6c78-0f9b-481f-89b8-0ac1e7ed6e50)
![Screenshot (84)](https://github.com/user-attachments/assets/9fd138bf-62b5-432a-a0cd-ca30f0a1731c)
![Screenshot (85)](https://github.com/user-attachments/assets/7bc170d8-79cd-4ed3-ad25-3e4f5a7e534d)
![Screenshot (86)](https://github.com/user-attachments/assets/e5bf3651-252b-4a5d-bd5e-36e6a44ca0df)
![Screenshot (87)](https://github.com/user-attachments/assets/12941e3a-30e5-4879-b0d3-4182e8c90264)
![Screenshot (88)](https://github.com/user-attachments/assets/0f725d73-1a06-4430-9782-c63c605aa210)



---

## 📦 Project Structure

```
.
├── frontend/                 # React frontend
│   ├── src/components      # Reusable components
│   ├── src/pages           # Role-based pages
├── backend/                 # Express backend
│   ├── controllers         # Route logic
│   ├── models              # MongoDB schemas
│   ├── routes              # API routes
│   ├── middleware          # Auth and error handlers
│   ├── utils               # Cloudinary, email, cache
├── public/                 # Static files
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail or other SMTP setup for Nodemailer

### Environment Variables

Create a `.env` file inside the `server/` directory with the following:

```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-password>
```

---

### Running the Project

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

---

## 🔐 User Roles

| Role     | Capabilities |
|----------|--------------|
| Visitor  | Create & view visit requests |
| Employee | Approve/Reject visits, create visits |
| Guard    | Verify visit using QR, capture photo, mark entry/exit |
| Admin    | Manage users and view all activity |

---

## 📚 Documentation

Full software design document available https://docs.google.com/document/d/19HEjT79JrVk412kFKeCaXdszKRs7XjcZeNwraxf6LWM/edit?usp=sharing




---

## 📬 Contact

- Email: mayankgupta31072033@gmail.com
- LinkedIn:https://www.linkedin.com/in/mayank-gupta-838009265/
- GitHub:http://github.com/Mayank3107

```

Let me know if you want the `README.md` to include badges, deployment instructions (e.g., Render or Vercel), or links to API docs and frontend demo.
