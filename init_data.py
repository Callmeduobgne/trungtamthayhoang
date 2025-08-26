#!/usr/bin/env python3
"""
Script khởi tạo dữ liệu mẫu cho hệ thống quản lý trung tâm
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from flask import Flask
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Import config và models
from config import Config
from models import Student, Teacher, User

def create_app():
    """Tạo Flask app với cấu hình cơ bản"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db = MongoEngine()
    jwt = JWTManager()
    
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    return app

def init_sample_data():
    """Khởi tạo dữ liệu mẫu"""
    app = create_app()
    
    with app.app_context():
        print("🔄 Đang kiểm tra database...")
        
        # Kiểm tra kết nối
        try:
            student_count = Student.objects.count()
            print(f"📊 Hiện có {student_count} học sinh trong database")
        except Exception as e:
            print(f"❌ Lỗi kết nối database: {e}")
            return False
        
        # Tạo dữ liệu mẫu nếu chưa có
        if student_count == 0:
            print("⚠️  Chưa có dữ liệu, đang tạo dữ liệu mẫu...")
            
            # Tạo tài khoản admin mẫu
            try:
                admin = User(
                    phone="0123456789",
                    role="admin",
                    status="active"
                )
                admin.set_password("123456")
                admin.save()
                print("✅ Đã tạo tài khoản admin: 0123456789 / 123456")
            except Exception as e:
                print(f"ℹ️  Admin có thể đã tồn tại: {e}")
            
            # Tạo học sinh mẫu
            students = [
                Student(
                    full_name='Nguyễn Văn An',
                    phone='0123456781',
                    date_of_birth='2010-05-15',
                    gender='Male',
                    address='123 Đường ABC, Quận 1, TP.HCM',
                    parent_name='Nguyễn Văn Bình',
                    parent_phone='0987654321',
                    status='active'
                ),
                Student(
                    full_name='Trần Thị Cúc',
                    phone='0123456782',
                    date_of_birth='2010-08-20',
                    gender='Female',
                    address='456 Đường DEF, Quận 2, TP.HCM',
                    parent_name='Trần Văn Dũng',
                    parent_phone='0987654322',
                    status='active'
                ),
                Student(
                    full_name='Lê Văn Em',
                    phone='0123456783',
                    date_of_birth='2011-01-10',
                    gender='Male',
                    address='789 Đường GHI, Quận 3, TP.HCM',
                    parent_name='Lê Thị Phượng',
                    parent_phone='0987654323',
                    status='active'
                ),
                Student(
                    full_name='Phạm Thị Giang',
                    phone='0123456784',
                    date_of_birth='2010-12-25',
                    gender='Female',
                    address='321 Đường JKL, Quận 4, TP.HCM',
                    parent_name='Phạm Văn Hải',
                    parent_phone='0987654324',
                    status='active'
                ),
                Student(
                    full_name='Hoàng Văn Inh',
                    phone='0123456785',
                    date_of_birth='2011-03-30',
                    gender='Male',
                    address='654 Đường MNO, Quận 5, TP.HCM',
                    parent_name='Hoàng Thị Kim',
                    parent_phone='0987654325',
                    status='active'
                )
            ]
            
            for student in students:
                try:
                    student.save()
                    print(f"✅ Đã tạo học sinh: {student.full_name}")
                except Exception as e:
                    print(f"❌ Lỗi tạo học sinh {student.full_name}: {e}")
            
            print(f"🎉 Đã tạo xong {len(students)} học sinh mẫu!")
            
            # Tạo giáo viên mẫu
            print("📚 Đang tạo dữ liệu giáo viên mẫu...")
            teachers = [
                Teacher(
                    full_name='Nguyễn Thị Lan',
                    position='Giáo viên chủ nhiệm',
                    date_of_birth='1985-03-15',
                    subject='Toán học',
                    phone='0987654321',
                    email='lan.nguyen@school.edu.vn',
                    status='active'
                ),
                Teacher(
                    full_name='Trần Văn Minh',
                    position='Phó hiệu trưởng',
                    date_of_birth='1980-07-22',
                    subject='Vật lý',
                    phone='0987654322',
                    email='minh.tran@school.edu.vn',
                    status='active'
                ),
                Teacher(
                    full_name='Lê Thị Hương',
                    position='Giáo viên',
                    date_of_birth='1990-12-08',
                    subject='Ngữ văn',
                    phone='0987654323',
                    email='huong.le@school.edu.vn',
                    status='active'
                ),
                Teacher(
                    full_name='Phạm Đức Thành',
                    position='Tổ trưởng',
                    date_of_birth='1988-05-30',
                    subject='Hóa học',
                    phone='0987654324',
                    email='thanh.pham@school.edu.vn',
                    status='active'
                ),
                Teacher(
                    full_name='Võ Thị Mai',
                    position='Giáo viên',
                    date_of_birth='1992-09-14',
                    subject='Tiếng Anh',
                    phone='0987654325',
                    email='mai.vo@school.edu.vn',
                    status='active'
                )
            ]
            
            for teacher in teachers:
                try:
                    teacher.save()
                    print(f"✅ Đã tạo giáo viên: {teacher.full_name}")
                except Exception as e:
                    print(f"❌ Lỗi tạo giáo viên {teacher.full_name}: {e}")
            
            print(f"🎉 Đã tạo xong {len(teachers)} giáo viên mẫu!")
        
        else:
            print("✅ Database đã có dữ liệu, không cần khởi tạo.")
        
        return True

if __name__ == "__main__":
    print("🚀 Bắt đầu khởi tạo dữ liệu mẫu...")
    success = init_sample_data()
    if success:
        print("🎯 Hoàn thành khởi tạo dữ liệu!")
    else:
        print("💥 Có lỗi trong quá trình khởi tạo!")
        sys.exit(1)
