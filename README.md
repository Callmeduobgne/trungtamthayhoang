# Trung Tâm Thầy Hoàng - School Management System

Hệ thống quản lý trung tâm giáo dục với giao diện hiện đại và tính năng đầy đủ.

## 🚀 Tính năng

### 👨‍💼 Quản trị viên

- ✅ Quản lý học sinh (CRUD operations)
- ✅ Quản lý giáo viên (Card layout đẹp mắt)
- ✅ Dashboard với thống kê tổng quan
- ✅ Dark theme chuyên nghiệp

### 🔐 Hệ thống xác thực

- ✅ Đăng nhập/Đăng ký
- ✅ JWT Authentication
- ✅ Phân quyền theo vai trò
- ✅ Quên mật khẩu với OTP

### 🌐 Giao diện

- ✅ Responsive design
- ✅ Dark theme với accent màu vàng
- ✅ IBM Network styling
- ✅ Full Vietnamese localization

## 🛠 Công nghệ sử dụng

### Backend

- **Python 3.13** với Flask
- **MongoDB** với MongoEngine
- **JWT** cho authentication
- **Flask-CORS** cho cross-origin requests

### Frontend  

- **Next.js 15.5.0** với TypeScript
- **Tailwind CSS** cho styling
- **React Hooks** cho state management

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/Callmeduobgne/trungtamthayhoang.git
cd trungtamthayhoang
```

### 2. Backend Setup

```bash
# Tạo virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Cài đặt dependencies
cd backend
pip install -r requirements.txt

# Khởi tạo dữ liệu mẫu
cd ..
python init_data.py

# Chạy backend server
python run_backend.py
```

### 3. Frontend Setup

```bash
cd frontend-nextjs
npm install
npm run dev
```
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Cài đặt dependencies
cd backend
pip install -r requirements.txt

# Khởi tạo dữ liệu mẫu
cd ..
python init_data.py

# Chạy backend server
python run_backend.py
```

### 3. Frontend Setup
```bash
cd frontend-nextjs
npm install
npm run dev
```

## 🚀 Chạy ứng dụng

1. **Backend:** http://localhost:5001
2. **Frontend:** http://localhost:3000

### Tài khoản demo
- **Admin:** `0123456789` / `123456`

## 📁 Cấu trúc dự án

```
trungtamthayhoang/
├── backend/                 # Flask API server
│   ├── routes/             # API endpoints
│   ├── models.py           # Database models
│   ├── config.py           # Configuration
│   └── utils.py            # Utilities
├── frontend-nextjs/        # Next.js frontend
│   └── src/app/            # App pages
│       ├── admin/          # Admin dashboard
│       ├── login/          # Authentication
│       └── dashboard/      # User dashboard
├── init_data.py           # Database initialization
└── run_backend.py         # Backend server launcher
```

## 🎯 Roadmap

- [ ] Teacher schedule management
- [ ] Student grades system  
- [ ] Parent portal
- [ ] SMS OTP integration
- [ ] File upload features
- [ ] Export/Import Excel
- [ ] Advanced reporting
- [ ] Mobile app

## 📝 API Documentation

### Authentication
- `POST /auth/login` - Đăng nhập
- `POST /register/register` - Đăng ký

### Admin Routes
- `GET /admin/students` - Danh sách học sinh
- `POST /admin/students` - Thêm học sinh
- `PUT /admin/students/{id}` - Cập nhật học sinh
- `DELETE /admin/students/{id}` - Xóa học sinh
- `GET /admin/teachers` - Danh sách giáo viên
- `POST /admin/teachers` - Thêm giáo viên

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact
Project Link: [https://github.com/Callmeduobgne/trungtamthayhoang](https://github.com/Callmeduobgne/trungtamthayhoang)

---

**Được phát triển với ❤️ cho giáo dục Việt Nam**
