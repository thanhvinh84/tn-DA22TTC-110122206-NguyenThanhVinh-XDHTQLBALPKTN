namespace Models
{
    public class QuyenTruyCapHoSo
    {
        public string MaQuyen { get; set; } = string.Empty;
        public string MaHoSo { get; set; } = string.Empty;
        public string MaTaiKhoan { get; set; } = string.Empty;
        public string? MaPhongKham { get; set; }
        public string? LoaiQuyen { get; set; }
        public DateTime? ThoiGianCap { get; set; }
        public string? GhiChu { get; set; }
    }
}
