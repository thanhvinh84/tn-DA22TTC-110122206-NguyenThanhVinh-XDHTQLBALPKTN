namespace Models
{
    public class NhanVien
    {
        public string MaNhanVien { get; set; } = string.Empty;
        public string? MaPhongKham { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string? CCCD { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
        public DateTime? NgayVaoLam { get; set; }
        public string? ChucVu { get; set; }
    }
}
