# ☁️ Cloud Storage Application

A secure **MERN stack cloud storage platform** with **AWS S3 integration**.  
Developed by **V.S. NAVVIN** as a full‑stack portfolio project for placements and product thinking.

---

## 🚀 Features

- 🔐 **Authentication** – Secure login/signup with **JWT + cookies**  
- 📤 **File Uploads** – Upload files directly from frontend with **Multer**  
- ☁️ **AWS S3 Integration** – Store files in scalable cloud buckets  
- 📑 **Metadata Management** – MongoDB stores file details (name, URL, user ID)  
- 🎨 **Responsive UI** – Modern design with **React + Axios**  
- 🧼 **Clean Git hygiene** – Easy to set up and extend  

---

## 🛠️ Tech Stack

- **Frontend:** React, Axios, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Cloud Storage:** AWS S3  
- **Auth:** JWT, Cookies  
- **File Handling:** Multer  

---

## 📁 Project Structure

cloud-storage-app/  
├── backend/        # Express + AWS S3 server  
├── frontend/       # React + Axios client  
├── .gitignore  
├── package.json  
├── README.md  

---

## 🧪 How to Run Locally

1. **Clone the repo**  
   bash  
   git clone https://github.com/VS-NAVVIN/cloud-storage-application.git  

2. **Install dependencies**  
   bash  
   cd backend && npm install  
   cd ../frontend && npm install  

3. **Configure environment variables**  
   Create a `.env` file in the backend directory:  
   env  
   MONGO_URI=your_mongodb_uri  
   AWS_ACCESS_KEY_ID=your_access_key  
   AWS_SECRET_ACCESS_KEY=your_secret_key  
   AWS_BUCKET_NAME=your_bucket_name  
   JWT_SECRET=your_jwt_secret  

4. **Start servers**  
   bash  
   cd backend && npm run dev  
   cd ../frontend && npm run dev  

5. **Open the app**  
   Visit 👉 http://localhost:5173  

---

## 📌 Status

- ✅ **Completed** as a placement‑prep project  
- 🧠 **Built** for real‑world learning and product thinking  
- 📚 **Will be revisited** for revisions and upgrades  

---

## 👤 Author

- **Name:** V.S. NAVVIN  
- **Role:** Product‑focused full‑stack developer  
- **Specialization:** **MERN, real‑time apps, and cloud‑native design**

---
