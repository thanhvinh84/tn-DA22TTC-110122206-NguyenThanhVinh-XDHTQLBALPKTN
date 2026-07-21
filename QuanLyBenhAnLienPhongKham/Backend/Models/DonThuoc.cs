namespace Models
{
    public class DonThuoc
    {
        public string MaDonThuoc { get; set; } = string.Empty;
        public string MaDotKham { get; set; } = string.Empty;
        public string? MaBacSi { get; set; }
        public DateTime? NgayLap { get; set; }
        
        // Thông tin bổ sung
        public string? HoTenBacSi { get; set; }
        public string? MaBenhNhan { get; set; }
        public string? HoTenBenhNhan { get; set; }
    }
}
