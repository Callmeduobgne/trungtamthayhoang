from flask import Blueprint, request, jsonify
from models import User, Student, Verification
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import datetime, timedelta, timezone
import random

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    phone = data.get('phone')
    student_name = data.get('studentName')
    password = data.get('password')

    if User.objects(phone=phone).first():
        return jsonify({'message': 'Phone number already registered'}), 409

    new_user = User(phone=phone)
    new_user.set_password(password)
    new_user.save()

    new_student = Student(full_name=student_name, parent_user_id=new_user)
    new_student.save()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone = data.get('phone')
    password = data.get('password')
    user = User.objects(phone=phone).first()

    if user and user.check_password(password):
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                'role': user.role,
                'phone': user.phone
            }
        )
        refresh_token = create_refresh_token(identity=str(user.id))
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/forgot-password/request', methods=['POST'])
def forgot_password_request():
    phone = request.get_json().get('phone')
    user = User.objects(phone=phone).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    otp = str(random.randint(100000, 999999))
    # In a real app, hash the OTP
    verification = Verification(
        phone=phone,
        code_hash=otp, # Store hashed OTP in production
        purpose='reset_pw',
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=5)
    )
    verification.save()
    # In a real app, send OTP via SMS
    print(f"OTP for {phone}: {otp}")
    return jsonify({'message': 'OTP sent'}), 200

@auth_bp.route('/forgot-password/reset', methods=['POST'])
def forgot_password_reset():
    data = request.get_json()
    phone = data.get('phone')
    otp = data.get('otp')
    new_password = data.get('newPassword')

    verification = Verification.objects(phone=phone, purpose='reset_pw', status='pending').first()

    if not verification or verification.code_hash != otp or verification.expires_at < datetime.now(timezone.utc):
        return jsonify({'message': 'Invalid or expired OTP'}), 400

    user = User.objects(phone=phone).first()
    user.set_password(new_password)
    user.save()

    verification.status = 'used'
    verification.save()

    return jsonify({'message': 'Password reset successfully'}), 200
