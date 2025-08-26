#!/bin/bash

echo "🚀 Đang push dự án Trung Tâm Thầy Hoàng lên GitHub..."
echo ""
echo "📋 Hướng dẫn:"
echo "1. Đi đến: https://github.com/settings/tokens"
echo "2. Tạo Personal Access Token (classic) với permissions:"
echo "   - repo (full control)"
echo "   - workflow"
echo ""
echo "3. Khi được hỏi username: nhập 'Callmeduobgne'"
echo "4. Khi được hỏi password: nhập Personal Access Token vừa tạo"
echo ""
read -p "Nhấn Enter để tiếp tục push..."

git remote set-url origin https://github.com/Callmeduobgne/trungtamthayhoang.git
git push -u origin main

echo ""
echo "✅ Nếu thành công, dự án đã được push lên:"
echo "   https://github.com/Callmeduobgne/trungtamthayhoang"
echo ""
echo "📚 Repository sẽ chứa:"
echo "   - Backend Flask với API hoàn chỉnh"
echo "   - Frontend Next.js với UI đẹp mắt"  
echo "   - Database models cho school management"
echo "   - Documentation và README"
echo "   - Scripts khởi động tự động"
