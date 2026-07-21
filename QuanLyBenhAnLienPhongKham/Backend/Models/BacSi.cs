namespace Models
{
    public class BacSi
    {
        public string MaBacSi { get; set; } = string.Empty;
        public string? MaChuyenKhoa { get; set; }
        public string? ChungChiHanhNghe { get; set; }
        public string? BangCap { get; set; }
        
        // Thông tin từ NhanVien
        public string? HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? MaPhongKham { get; set; }
        public string? TenChuyenKhoa { get; set; }
    }
}
