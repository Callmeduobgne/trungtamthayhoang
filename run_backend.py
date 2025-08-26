#!/usr/bin/env python3
"""
Script khởi động server backend cho hệ thống quản lý trung tâm
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from flask import Flask
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Import config
from config import Config

def create_app():
    """Tạo và cấu hình Flask app"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db = MongoEngine()
    jwt = JWTManager()
    
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Import và register blueprints
    from routes.auth import auth_bp
    from routes.admin import admin_bp
    from routes.user import user_bp
    from routes.register import register_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(register_bp, url_prefix='/register')
    
    @app.route('/')
    def health_check():
        return {
            'status': 'success',
            'message': 'Trung Tâm Thầy Hoàng API đang hoạt động!',
            'version': '1.0.0'
        }
    
    @app.route('/health')
    def health():
        return {'status': 'healthy', 'database': 'connected'}
    
    return app

if __name__ == '__main__':
    print("🚀 Đang khởi động Trung Tâm Thầy Hoàng Backend Server...")
    
    app = create_app()
    
    print("✅ Flask app đã được tạo thành công!")
    print("🌐 Server sẽ chạy tại: http://localhost:5001")
    print("📝 API endpoints:")
    print("   - GET  /health - Kiểm tra trạng thái")
    print("   - POST /auth/login - Đăng nhập")
    print("   - POST /register/register - Đăng ký")
    print("   - GET  /admin/students - Danh sách học sinh (admin)")
    print("   - POST /admin/students - Thêm học sinh (admin)")
    print("")
    print("🔑 Tài khoản admin mẫu:")
    print("   - Phone: 0123456789")
    print("   - Password: 123456")
    print("")
    print("⏹️  Nhấn Ctrl+C để dừng server")
    
    try:
        app.run(
            host='0.0.0.0',
            port=5001,
            debug=True,
            use_reloader=True
        )
    except KeyboardInterrupt:
        print("\n👋 Server đã được dừng. Tạm biệt!")
