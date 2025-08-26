from flask import Blueprint, request, jsonify
from models import User, Student, Class, Verification
from werkzeug.security import generate_password_hash
import random
import string
from datetime import datetime, timedelta

register_bp = Blueprint('register', __name__)

@register_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.objects(phone=data['phone']).first():
        return jsonify({'message': 'Phone exists'}), 409
    
    if len(data['password']) < 8 or not any(c.isdigit() for c in data['password']):
        return jsonify({'message': 'Password must be ≥8 chars with ≥1 digit'}), 400
    
    # Create user
    user = User(
        phone=data['phone'],
        password_hash=generate_password_hash(data['password']),
        role='parent',
        status='active'
    )
    user.save()
    
    # Create student
    class_obj = Class.objects(name=data['className']).first()
    student = Student(
        full_name=data['studentName'],
        phone=data['phone'],
        class_id=str(class_obj.id) if class_obj else '',
        parent_name='',
        parent_phone=data['phone'],
        status='active'
    )
    student.save()
    
    return jsonify({'message': 'Registration successful'}), 201

@register_bp.route('/forgot-password/request', methods=['POST'])
def request_otp():
    phone = request.get_json()['phone']
    
    if not User.objects(phone=phone).first():
        return jsonify({'message': 'Phone not found'}), 404
    
    otp = ''.join(random.choices(string.digits, k=6))
    
    verification = Verification(
        phone=phone,
        code_hash=generate_password_hash(otp),
        purpose='reset_pw',
        expires_at=datetime.utcnow() + timedelta(minutes=5),
        attempts=0,
        status='pending'
    )
    verification.save()
    
    print(f"OTP for {phone}: {otp}")
    return jsonify({'message': 'OTP sent'}), 200

@register_bp.route('/forgot-password/verify', methods=['POST'])
def verify_otp():
    data = request.get_json()
    
    verification = Verification.objects(
        phone=data['phone'],
        purpose='reset_pw',
        status='pending',
        expires_at__gt=datetime.utcnow()
    ).first()
    
    if not verification or verification.attempts >= 5:
        return jsonify({'message': 'Invalid or expired OTP'}), 400
    
    from werkzeug.security import check_password_hash
    if not check_password_hash(verification.code_hash, data['otp']):
        verification.attempts += 1
        verification.save()
        return jsonify({'message': 'Invalid OTP'}), 400
    
    verification.status = 'verified'
    verification.save()
    
    return jsonify({'message': 'OTP verified'}), 200

@register_bp.route('/forgot-password/reset', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    verification = Verification.objects(
        phone=data['phone'],
        purpose='reset_pw',
        status='verified'
    ).first()
    
    if not verification:
        return jsonify({'message': 'Invalid request'}), 400
    
    user = User.objects(phone=data['phone']).first()
    user.password_hash = generate_password_hash(data['newPassword'])
    user.save()
    
    verification.delete()
    
    return jsonify({'message': 'Password reset successful'}), 200
