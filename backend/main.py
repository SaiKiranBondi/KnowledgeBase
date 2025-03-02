from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from db import SessionLocal, User
from schemas import (
    UserRegister,
    UserLogin,
    ChangePassword,
    ForgotPasswordRequest,
    UserProfile,
)
from fastapi.middleware.cors import CORSMiddleware
from db import init_db
import os
import smtplib
import random
from email.message import EmailMessage
from dotenv import load_dotenv  # ✅ Load environment variables
from pydantic import BaseModel
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


load_dotenv()  # ✅ Load .env file

# ✅ SMTP Config
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# ✅ Store OTPs temporarily (Use Redis in production)
reset_codes = {}


from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_reset_email(email, reset_code):
    msg = MIMEMultipart()
    msg["Subject"] = "🔑 Password Reset Code - KnowledgeBase App"
    msg["From"] = SMTP_USERNAME
    msg["To"] = email

    # ✅ HTML Email Content
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2c3e50;">🔐 Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your KnowledgeBase App account.</p>
        <p><strong>Your Reset Code: <span style="color: #e74c3c;">{reset_code}</span></strong></p>
        <p>Enter this code in the app to reset your password.</p>
        <p style="color: #7f8c8d; font-size: 12px;">If you didn't request this, you can ignore this email.</p>
        <hr>
        <p style="font-size: 14px; color: #95a5a6;">Thank you,<br>KnowledgeBase Team</p>
    </body>
    </html>
    """

    # ✅ Plain Text Backup (For email clients that do not support HTML)
    plain_text_content = f"""
    Password Reset Request - KnowledgeBase App

    Your password reset code is: {reset_code}
    Enter this code in the app to reset your password.

    If you did not request this, ignore this email.

    Thank you,
    KnowledgeBase Team
    """

    # ✅ Attach both plain text and HTML versions
    msg.attach(MIMEText(plain_text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Reset code sent to {email}")
    except Exception as e:
        print(f"❌ Error sending email: {e}")


init_db()

# JWT Config
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Store reset codes (Temporary - Use Redis in production)
reset_codes = {}


# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Password Hashing
def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Token Generator
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ✅ Register User
@app.post("/register/")
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing_email = db.query(User).filter(User.email == user.email).first()
    existing_username = db.query(User).filter(User.username == user.username).first()

    if existing_email:
        raise HTTPException(status_code=400, detail="Email ID already exists")
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username, email=user.email, password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token({"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# ✅ Login User
@app.post("/login/")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.username_or_email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not registered")
    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")

    access_token = create_access_token({"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/forgot-password/")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reset_code = str(random.randint(1000, 9999))  # 4-digit OTP
    reset_codes[request.email] = reset_code

    # ✅ Send email with the reset code
    send_reset_email(request.email, reset_code)

    return {"message": "Reset code sent to email"}


class ResetPasswordRequest(BaseModel):
    email: str
    reset_code: str
    new_password: str
    confirm_password: str


@app.post("/reset-password/")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    if request.email not in reset_codes:
        raise HTTPException(status_code=404, detail="Email not found")

    if reset_codes[request.email] != request.reset_code:
        raise HTTPException(status_code=400, detail="Invalid reset code")

    if request.new_password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = get_password_hash(request.new_password)
    db.commit()
    del reset_codes[request.email]  # Remove used reset code

    return {"message": "Password successfully reset. You can now log in."}


# ✅ Change Password from Profile
@app.post("/change-password/")
def change_password(data: ChangePassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if data.old_password:
        if not verify_password(data.old_password, user.password_hash):
            raise HTTPException(status_code=401, detail="Incorrect old password")

    user.password_hash = get_password_hash(data.new_password)
    db.commit()

    return {"message": "Password successfully changed"}


class ChangeUsernameRequest(BaseModel):
    email: str
    new_username: str


@app.post("/change-username/")
def change_username(request: ChangeUsernameRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    existing_user = db.query(User).filter(User.username == request.new_username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    user.username = request.new_username
    db.commit()

    return {"message": "Username successfully updated"}


# ✅ Token Decoder
def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# ✅ Profile Route
@app.get("/profile/", response_model=UserProfile)
def get_profile(user: User = Depends(get_current_user)):
    return {"username": user.username, "email": user.email}


class VerifyCodeRequest(BaseModel):
    email: str
    reset_code: str


@app.post("/verify-code/")
def verify_code(request: VerifyCodeRequest):
    if request.email not in reset_codes:
        raise HTTPException(status_code=404, detail="Email not found")

    if reset_codes[request.email] != request.reset_code:
        raise HTTPException(status_code=400, detail="Invalid reset code")

    return {"message": "Reset code verified. You can now reset your password."}
