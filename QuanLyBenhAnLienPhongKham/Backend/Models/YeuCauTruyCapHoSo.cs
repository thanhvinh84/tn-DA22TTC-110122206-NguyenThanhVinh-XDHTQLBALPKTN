namespace Models
{
    public class YeuCauTruyCapHoSo
    {
        public string MaYeuCau { get; set; } = string.Empty;
        public string MaBenhNhan { get; set; } = string.Empty;
        public string MaBacSiYeuCau { get; set; } = string.Empty;
        public string MaPhongKhamYeuCau { get; set; } = string.Empty;
        public string MaBacSiDuocYeuCau { get; set; } = string.Empty;
        public string MaPhongKhamDuocYeuCau { get; set; } = string.Empty;
        public DateTime NgayYeuCau { get; set; }
        public string TrangThai { get; set; } = "Chờ duyệt";
        public string? LoaiQuyen { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public string? LyDoYeuCau { get; set; }
        public string? LyDoTuChoi { get; set; }
        public DateTime? NgayDuyet { get; set; }
        public string? GhiChu { get; set; }
        
        // Thông tin bổ sung (không lưu DB)
        public string? TenBenhNhan { get; set; }
        public string? TenBacSiYeuCau { get; set; }
        public string? TenPhongKhamYeuCau { get; set; }
        public string? TenBacSiDuocYeuCau { get; set; }
        public string? TenPhongKhamDuocYeuCau { get; set; }
    }
}
