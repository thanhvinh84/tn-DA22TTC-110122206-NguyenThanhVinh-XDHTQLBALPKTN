namespace Models
{
    public class HoSoBenhAn
    {
        public string MaHoSo { get; set; } = string.Empty;
        public string MaBenhNhan { get; set; } = string.Empty;
        public DateTime NgayTao { get; set; }
        
        // Thông tin y tế
        public string? NhomMau { get; set; }
        public string? TienSuBenh { get; set; }
        public string? GhiChu { get; set; }
        
        // Thông tin bệnh nhân (từ JOIN)
        public string? HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? GioiTinh { get; set; }
        public string? DiaChi { get; set; }
    }
}
