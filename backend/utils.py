from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
import mongoengine

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from models import User
        user_id = get_jwt_identity()
        user = User.objects(id=ObjectId(user_id)).first()
        if not user or user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def validate_phone(phone):
    return phone and len(phone) == 10 and phone.startswith('0') and phone.isdigit()

def validate_password(password):
    return password and len(password) >= 8 and any(c.isdigit() for c in password)
