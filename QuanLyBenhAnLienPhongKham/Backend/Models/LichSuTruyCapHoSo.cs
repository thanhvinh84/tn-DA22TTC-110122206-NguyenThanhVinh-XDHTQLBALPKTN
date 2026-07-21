namespace Models
{
    public class LichSuTruyCapHoSo
    {
        public string MaLichSu { get; set; } = string.Empty;
        public string MaBenhNhan { get; set; } = string.Empty;
        public string MaBacSi { get; set; } = string.Empty;
        public string MaPhongKham { get; set; } = string.Empty;
        public string? MaHoSo { get; set; }
        public string? MaDotKham { get; set; }
        public string LoaiTruyCap { get; set; } = string.Empty;
        public DateTime NgayTruyCap { get; set; }
        public string? DiaChiIP { get; set; }
        public string? ThongTinBosung { get; set; }
        
        // Thông tin bổ sung (không lưu DB)
        public string? TenBenhNhan { get; set; }
        public string? TenBacSi { get; set; }
        public string? TenPhongKham { get; set; }
    }
}
