namespace Models
{
    public class HoaDon
    {
        public string MaHoaDon { get; set; } = string.Empty;
        public string MaDotKham { get; set; } = string.Empty;
        public DateTime? NgayLap { get; set; }
        public decimal? TongTien { get; set; }
        public string? TrangThai { get; set; }
        
        // Thông tin bổ sung
        public string? MaBenhNhan { get; set; }
        public string? HoTenBenhNhan { get; set; }
    }
}
