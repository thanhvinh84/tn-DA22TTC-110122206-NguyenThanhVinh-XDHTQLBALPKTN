namespace DTOs
{
    public class LoginRequest
    {
        public string TenNguoiDung { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string MaVaiTro { get; set; } = string.Empty;
        public string TenVaiTro { get; set; } = string.Empty;
        public string MaTaiKhoan { get; set; } = string.Empty;
        public string TenNguoiDung { get; set; } = string.Empty;
        public string? HoTen { get; set; }
        public string? MaNhanVien { get; set; }
        public string? MaBenhNhan { get; set; }
        public string? MaPhongKham { get; set; }
    }
}
