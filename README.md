# KnowledgeBase Task Manager

A **Task Manager App** built using **React (Frontend)** and **FastAPI (Backend)** with **JWT authentication, task prioritization using Gemini AI, and email-based password reset.**

---

## **🚀 Features**

✅ **User Authentication** (Register, Login, JWT Token Authentication)  
✅ **Task Management** (Add, View, Complete, Delete Tasks)  
✅ **Task Prioritization** (Uses **Gemini AI** to assign Priority & Reason)  
✅ **Filters** (Priority, Completed/Ongoing, Time Window)  
✅ **Password Reset via Email** (OTP-based system)  
✅ **Secure Password Hashing** (Using bcrypt)  
✅ **CORS Enabled** for Frontend-Backend communication

---

## **📌 Setup Instructions (Windows)**

### **1️⃣ Clone the Repository**

```bash
# Using Git
git clone https://github.com/your-username/knowledgebase-task-manager.git
cd knowledgebase-task-manager
```

### **2️⃣ Backend Setup (FastAPI)**

#### **🔹 Install Python and Virtual Environment**

```bash
# Ensure Python 3.10+ is installed
python --version

# Create virtual environment
python -m venv env

# Activate virtual environment
env\Scripts\activate  # (Windows)
```

#### **🔹 Install Dependencies**

```bash
pip install -r backend/requirements.txt
```

#### **🔹 Set Up Environment Variables**

Create a **.env** file inside `backend/` with:

```env
# FastAPI Secret Key
SECRET_KEY=your_secret_key_here

# SMTP Email Config
SMTP_SERVER=smtp.yourmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-email-password

# Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key
```

#### **🔹 Run Backend Server**

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be running at **http://localhost:8000**

---

### **3️⃣ Frontend Setup (React)**

#### **🔹 Install Node.js** (If not installed)

- Download from [Node.js Official Website](https://nodejs.org/)

#### **🔹 Install Dependencies**

```bash
cd frontend
npm install
```

#### **🔹 Add Proxy for API Requests** (Windows Fix)

Modify `frontend/package.json`:

```json
"proxy": "http://localhost:8000"
```

#### **🔹 Start Frontend Server**

```bash
npm start
```

Frontend will be running at **http://localhost:3000**

---

## **📂 Project Structure**

### **Backend (FastAPI)** - `/backend`

```
backend/
├── db.py                # Database Models & Session Setup
├── main.py              # FastAPI Backend Routes
├── schemas.py           # Pydantic Schemas for Validation
├── requirements.txt     # Python Dependencies
├── .env                 # Environment Variables (Ignored in Git)
```

### **Frontend (React)** - `/frontend`

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.js       # Login Page
│   │   ├── Register.js    # Registration Page
│   │   ├── Profile.js     # User Profile Page
│   │   ├── TaskPage.js    # Task List Page (Filters & Completion)
│   │   ├── TaskForm.js    # Add New Tasks
│   │   ├── TaskList.js    # Display Tasks
│   ├── styles/            # CSS Files
│   ├── App.js             # Main React Component
│   ├── index.js           # Entry Point
├── package.json          # React Dependencies & Proxy Config
```

---

## **📜 API Endpoints**

### **🔹 Authentication**

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| `POST` | `/register/`        | Register a new user        |
| `POST` | `/login/`           | Login and get JWT Token    |
| `POST` | `/forgot-password/` | Request password reset OTP |
| `POST` | `/reset-password/`  | Reset password using OTP   |

### **🔹 Tasks**

| Method   | Endpoint                    | Description                          |
| -------- | --------------------------- | ------------------------------------ |
| `POST`   | `/tasks/`                   | Add a new task                       |
| `GET`    | `/tasks/`                   | Get all tasks for the logged-in user |
| `POST`   | `/tasks/{task_id}/complete` | Mark a task as completed             |
| `DELETE` | `/tasks/{task_id}`          | Delete a task                        |

---

## **🎨 Filters & UI Features**

### **🔹 Task Filters**

✅ **Filter by Priority** (Low, Medium, High)  
✅ **Filter by Status** (Completed / Ongoing)  
✅ **Filter by Deadline** (Tasks before selected date)

### **🔹 UI Improvements**

✅ **Internal Scroll in Task List** (Navigation buttons always visible)  
✅ **Sticky Navbar on Task Page** (Prevent loss of navigation)  
✅ **Dark Mode (Coming Soon)**

---

## **📦 Requirements**

### **🔹 Backend (Python)**

- Python 3.10+
- FastAPI
- Uvicorn
- SQLAlchemy
- Passlib (For Password Hashing)
- JWT (PyJWT)
- Python-dotenv
- smtplib (For Email Reset)

### **🔹 Frontend (React)**

- Node.js 16+
- React
- Axios (For API Requests)
- React Router

---

## **🚀 Run the Project (One Command Per Terminal)**

🔹 **Backend**

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

🔹 **Frontend**

```bash
cd frontend
npm start
```

---

## **🛠️ Troubleshooting**

### **❌ CORS Issues?**

- Restart **both frontend & backend** after adding `"proxy": "http://localhost:8000"` in `package.json`

### **❌ Backend Not Starting?**

```bash
# Ensure virtual environment is activated
env\Scripts\activate  # (Windows)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **❌ Frontend Not Connecting to Backend?**

- Make sure both **backend (8000)** and **frontend (3000)** are running
- Check browser **CORS errors** in Console (F12 -> Console)

---

## **📜 License**

This project is **open-source** and available under the **MIT License**.

---

## **📢 Contributors & Feedback**

If you find any bugs or want to contribute, feel free to **submit a Pull Request** or **open an Issue** on GitHub!

---

🎉 **Happy Coding! 🚀**
