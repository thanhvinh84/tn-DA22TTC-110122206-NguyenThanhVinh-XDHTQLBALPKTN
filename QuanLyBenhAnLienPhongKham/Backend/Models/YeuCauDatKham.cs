namespace Models
{
    public class YeuCauDatKham
    {
        public string MaYeuCau { get; set; } = string.Empty;
        public string MaBenhNhan { get; set; } = string.Empty;
        public string? MaPhongKham { get; set; }
        public DateTime ThoiGianMongMuon { get; set; }
        public string LyDoKham { get; set; } = string.Empty;
        public string? GhiChu { get; set; }
        public string TrangThai { get; set; } = "Chờ xác nhận"; // Chờ xác nhận, Đã xác nhận, Đã từ chối, Đã tạo đợt khám, Đã hủy
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public string? MaNhanVienXuLy { get; set; }
        public DateTime? NgayXuLy { get; set; }
        public string? LyDoTuChoi { get; set; }
        public string? MaDotKham { get; set; }
        
        // Thông tin bổ sung từ JOIN
        public string? TenBenhNhan { get; set; }
        public string? SoDienThoai { get; set; }
        public string? TenPhongKham { get; set; }
        public string? TenNhanVienXuLy { get; set; }
    }
}
