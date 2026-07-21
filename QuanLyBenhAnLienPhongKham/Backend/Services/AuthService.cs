using DTOs;
using Helpers;
using Repositories;

namespace Services
{
    public class AuthService : IAuthService
    {
        private readonly ITaiKhoanRepository _taiKhoanRepo;
        private readonly IConfiguration _configuration;

        public AuthService(ITaiKhoanRepository taiKhoanRepo, IConfiguration configuration)
        {
            _taiKhoanRepo = taiKhoanRepo;
            _configuration = configuration;
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            // Tìm tài khoản theo tên người dùng
            var taiKhoan = await _taiKhoanRepo.GetByUsernameAsync(request.TenNguoiDung);
            
            if (taiKhoan == null)
                return null;

            // Kiểm tra mật khẩu - TẠM THỜI dùng plain text để test
            // TODO: Sửa lại thành BCrypt.Verify sau khi có hash đúng
            if (taiKhoan.MatKhau != request.MatKhau)
                return null;

            // Kiểm tra trạng thái tài khoản
            if (taiKhoan.TrangThai == false)
                return null;

            // Tạo JWT token
            var jwtHelper = new JwtHelper(_configuration);
            var token = jwtHelper.GenerateToken(
                taiKhoan.MaTaiKhoan,
                taiKhoan.TenNguoiDung,
                taiKhoan.MaVaiTro,
                taiKhoan.MaNhanVien,
                taiKhoan.MaBenhNhan
            );

            return new LoginResponse
            {
                Token = token,
                MaVaiTro = taiKhoan.MaVaiTro,
                TenVaiTro = taiKhoan.TenVaiTro ?? "",
                MaTaiKhoan = taiKhoan.MaTaiKhoan,
                TenNguoiDung = taiKhoan.TenNguoiDung,
                HoTen = taiKhoan.HoTen,
                MaNhanVien = taiKhoan.MaNhanVien,
                MaBenhNhan = taiKhoan.MaBenhNhan,
                MaPhongKham = taiKhoan.MaPhongKham
            };
        }
    }
}
