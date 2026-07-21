@echo off
chcp 65001 >nul
cls

echo ========================================
echo   HỆ THỐNG QUẢN LÝ BỆNH ÁN
echo   LIÊN PHÒNG KHÁM TƯ NHÂN
echo ========================================
echo.
echo 🚀 Đang khởi động backend...
echo.

cd /d "%~dp0Backend"

echo 📦 Đang restore packages...
dotnet restore >nul 2>&1

echo 🔨 Đang build project...
dotnet build >nul 2>&1

echo.
echo ========================================
echo   BACKEND ĐANG CHẠY
echo ========================================
echo.
echo 🌐 URL: http://localhost:5000
echo 📱 Mở trình duyệt và truy cập URL trên
echo.
echo 🎫 Tài khoản demo:
echo    - admin / 123456 (Quản trị viên)
echo    - letan / 123456 (Lễ tân)
echo    - bacsi / 123456 (Bác sĩ)
echo    - kythuatvien / 123456 (Kỹ thuật viên)
echo    - benhnhan / 123456 (Bệnh nhân)
echo.
echo ⚠️  Nhấn Ctrl+C để dừng backend
echo ========================================
echo.

dotnet run
