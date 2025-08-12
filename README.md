# 🏦 Doctor Appointment Booking System (MERN)

A full-stack **MERN** application for booking doctor appointments with an admin/doctor dashboard, email notifications, and online payments (PayPal).

---

## 🔎 Project Overview

This app allows users to search for doctors, book appointments (with optional PayPal payment), cancel or keep appointments, and receive email confirmations. Doctors and admins have a dashboard to manage appointments and doctors.

---

## 🚀 Features

### Website (User)
- User registration & login
- Search doctors by name, specialization, or availability
- Book appointment by selecting available date & time
- Cancel appointment or pay online (PayPal)
- Email notifications sent to patient and doctor after booking/payment (Nodemailer)

### Dashboard (Admin / Doctor)
- JWT authentication & role-based authorization (admin, doctor)
- Admin can add/remove doctors, view and cancel appointments
- Doctor can view and manage their own appointments
- Filters:
  - Doctors by specialization and availability
  - Appointments by date and status (pending, canceled, completed)
- Appointment detail page (view appointment & doctor info)

---

## 🧰 Tech Stack

- **Frontend:** React (hooks), Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Auth:** JSON Web Token (JWT)  
- **Files:** Cloudinary (image uploads)  
- **Payments:** PayPal integration  
- **Emails:** Nodemailer  
- **DB:** MongoDB + Mongoose  
- **Security:** bcryptjs (password hashing)

---
## 📽️ Demo Video
https://www.linkedin.com/posts/sohila-nabil-16924a338_greetstack-activity-7314554558783836160-hT4R?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFTA4GEBuhjbusj-I33iC0hLPEPnA9hyOO0
---
## Install dependencies
- cd server
  npm install
- cd client
  npm install
- cd admin
  npm install




## ⚙️ Environment Variables

Create `.env` in the `server/` folder and add:

PORT=3000
MONGO_URL = ""
CLOUD_NAME=""
CLOUD_API_KEY = ""
CLOUD_API_SECRET = ""
ADMIN_EMAIL = "admin321gmai"
ADMIN_PASSWORD = "admin321"
JWT_SECRET="DMS@212"
PAYPAL_CLIENT_ID = ""
PAYPAL_CLIENT_SECRET = ""
PAYPAL_BASE_URL="https://api-m.sandbox.paypal.com"
FRONTEND_URL =""
EMAIL_USER = ""
EMAIL_PASS=""
CLIENT_URL=""
ADMIN_URL=""

Create `.env` in the `client/` folder and add:

VITE_API_URL='http://localhost:3000'
VITE_PAYPAL_CLIENT_ID = ""

## Run the application

1- Backend
npm run start

2- Frontend (client,admin)
npm run dev

📷 Screenshots

<img width="1366" height="461" alt="dms18" src="https://github.com/user-attachments/assets/d0ed1bfb-69fb-4e26-bb3c-4f83e80f93d9" />
<img width="1366" height="599" alt="dms17" src="https://github.com/user-attachments/assets/4a61ce6f-f976-4dbf-b9ad-6fe1f6fa3acd" />
<img width="1347" height="595" alt="dms15" src="https://github.com/user-attachments/assets/34cc7547-0f6e-4595-9e16-041109af16ac" />
<img width="1354" height="582" alt="dms14" src="https://github.com/user-attachments/assets/8d5e6bbb-3077-4e8a-9c79-a7e7b276ea60" />
<img width="1343" height="582" alt="dms13" src="https://github.com/user-attachments/assets/4039dc16-c4e7-44a6-92c0-ab1df9d5b87b" />
<img width="1347" height="586" alt="dms12" src="https://github.com/user-attachments/assets/1debeb08-53ff-4851-88bc-29957ebea9c8" />
<img width="1353" height="519" alt="dms11" src="https://github.com/user-attachments/assets/11560bab-2bbc-4577-ae31-82678059cd67" />
<img width="1354" height="606" alt="dms10" src="https://github.com/user-attachments/assets/edba35b9-78ef-44ce-9019-fc685dfb383d" />
<img width="1350" height="595" alt="dms9" src="https://github.com/user-attachments/assets/59f9a3ad-9bc3-473f-ba95-ee368c46b710" />
<img width="1350" height="589" alt="dms8" src="https://github.com/user-attachments/assets/16ff6247-d1fc-4309-90fc-d59691453537" />
<img width="1343" height="599" alt="dms7" src="https://github.com/user-attachments/assets/3696612f-bcff-41ee-8e50-f0224bf2706a" />
<img width="1355" height="606" alt="dms6" src="https://github.com/user-attachments/assets/a848064f-120c-4fe2-9c80-a5eb901f9509" />
<img width="1350" height="581" alt="dms5" src="https://github.com/user-attachments/assets/fe3b810b-3bbf-4d45-96ae-4076a660ada6" />
<img width="1341" height="590" alt="dms4" src="https://github.com/user-attachments/assets/9c0afc58-f6df-4de4-a876-c36aca8ac9a1" />
<img width="1345" height="589" alt="dms3" src="https://github.com/user-attachments/assets/3a9de84e-5e7b-4fb9-a7f0-5f91b260de7d" />
<img width="1345" height="604" alt="dms2" src="https://github.com/user-attachments/assets/8395281b-6253-46b7-808b-64a11de474e0" />
<img width="1364" height="607" alt="dms1" src="https://github.com/user-attachments/assets/4abd6b43-ec20-4348-be2e-c62e6ee464ad" />
<img width="1309" height="593" alt="dms19" src="https://github.com/user-attachments/assets/ac8d6bb9-edff-4cc3-8cf7-85dd10865825" />
