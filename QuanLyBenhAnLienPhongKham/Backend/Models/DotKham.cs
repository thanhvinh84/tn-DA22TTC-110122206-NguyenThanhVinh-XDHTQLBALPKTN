namespace Models
{
    public class DotKham
    {
        public string MaDotKham { get; set; } = string.Empty;
        public string MaHoSo { get; set; } = string.Empty;
        public string? MaPhongKham { get; set; }
        public string? MaBacSi { get; set; }
        public string? MaLeTan { get; set; }
        public DateTime? ThoiGianDen { get; set; }
        public string? LyDoKham { get; set; }
        public string? TrangThai { get; set; }
        
        // Thông tin bổ sung
        public string? MaBenhNhan { get; set; }
        public string? HoTenBenhNhan { get; set; }
        public string? GioiTinh { get; set; }
        public string? HoTenBacSi { get; set; }
        public string? TenPhongKham { get; set; }
    }
}
