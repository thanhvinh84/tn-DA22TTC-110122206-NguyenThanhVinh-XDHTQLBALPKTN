namespace Models
{
    public class ChanDoan
    {
        public string MaChanDoan { get; set; } = string.Empty;
        public string MaHoSo { get; set; } = string.Empty;
        public string MaDotKham { get; set; } = string.Empty;
        public string? MaBacSi { get; set; }
        public string? MaBenh { get; set; }
        public string? Loai { get; set; }
        public string? NoiDungChanDoan { get; set; }
        
        // Thông tin bổ sung
        public string? TenBenh { get; set; }
        public string? HoTenBacSi { get; set; }
    }
}
