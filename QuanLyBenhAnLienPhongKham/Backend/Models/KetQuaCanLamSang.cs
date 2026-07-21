namespace Models
{
    public class KetQuaCanLamSang
    {
        public string MaKetQua { get; set; } = string.Empty;
        public string MaChiDinh { get; set; } = string.Empty;
        public string MaHoSo { get; set; } = string.Empty;
        public string? MaKyThuatVien { get; set; }
        public DateTime? NgayCoKetQua { get; set; }
        public string? KetLuan { get; set; }
        public string? KetQua { get; set; } // Alias for KetLuan for frontend compatibility
        public string? GhiChu { get; set; }
        public string? TepDinhKem { get; set; }
        public string? LoaiKetQua { get; set; }
        public string? HinhAnhKetQua { get; set; } // Danh sách đường dẫn hình ảnh (phân cách bằng ;)
        
        // Thông tin bổ sung
        public string? HoTenKyThuatVien { get; set; }
        public string? LoaiChiDinh { get; set; }
        public string? LoaiDichVu { get; set; }
        public string? TenDichVu { get; set; }
    }
}
