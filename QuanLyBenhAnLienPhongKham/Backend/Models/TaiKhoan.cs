namespace Models
{
    public class TaiKhoan
    {
        public string MaTaiKhoan { get; set; } = string.Empty;
        public string MaVaiTro { get; set; } = string.Empty;
        public string? MaNhanVien { get; set; }
        public string? MaBenhNhan { get; set; }
        public string TenNguoiDung { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
        public bool? TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }
        
        // Thông tin bổ sung
        public string? TenVaiTro { get; set; }
        public string? HoTen { get; set; }
        public string? MaPhongKham { get; set; }
    }
}
