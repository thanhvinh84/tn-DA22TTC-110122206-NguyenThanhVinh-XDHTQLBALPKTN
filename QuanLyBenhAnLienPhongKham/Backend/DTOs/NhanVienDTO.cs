namespace DTOs
{
    public class NhanVienCreateDTO
    {
        public string? MaPhongKham { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string? CCCD { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
        public DateTime? NgayVaoLam { get; set; }
        public string? ChucVu { get; set; }
        public bool LaBacSi { get; set; }
        public string? ChuyenKhoa { get; set; }
        public string? BangCap { get; set; }
        public string? ChungChiHanhNghe { get; set; }
    }

    public class NhanVienUpdateDTO
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

    public class NhanVienDetailDTO
    {
        public string MaNhanVien { get; set; } = string.Empty;
        public string? MaPhongKham { get; set; }
        public string? TenPhongKham { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string? CCCD { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
        public DateTime? NgayVaoLam { get; set; }
        public string? ChucVu { get; set; }
        public bool LaBacSi { get; set; }
    }
}
