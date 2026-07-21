namespace Models
{
    public class ChiDinhCanLamSang
    {
        public string MaChiDinh { get; set; } = string.Empty;
        public string MaDotKham { get; set; } = string.Empty;
        public string? MaBacSi { get; set; }
        public DateTime? NgayChiDinh { get; set; }
        public string? LoaiChiDinh { get; set; }
        public string? LoaiDichVu { get; set; } // Loại dịch vụ (Xét nghiệm máu, Siêu âm, X-quang...)
        public string? TenDichVu { get; set; }  // Tên cụ thể của dịch vụ
        public string? GhiChu { get; set; }
        public string? TrangThai { get; set; }
        
        // Thông tin bổ sung
        public string? HoTenBacSi { get; set; }
        public string? MaBenhNhan { get; set; }
        public string? HoTenBenhNhan { get; set; }
        public string? TenBenhNhan { get; set; } // Alias for HoTenBenhNhan
    }
}
