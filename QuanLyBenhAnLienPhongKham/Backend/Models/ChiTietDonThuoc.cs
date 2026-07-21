namespace Models
{
    public class ChiTietDonThuoc
    {
        public string MaDonThuoc { get; set; } = string.Empty;
        public string MaThuoc { get; set; } = string.Empty;
        public string? MaHoaDon { get; set; }
        public int? SoLuong { get; set; }
        public string? LieuDung { get; set; }
        public string? CachDung { get; set; }
        
        // Thông tin bổ sung
        public string? TenThuoc { get; set; }
        public string? CongDung { get; set; }
    }
}
