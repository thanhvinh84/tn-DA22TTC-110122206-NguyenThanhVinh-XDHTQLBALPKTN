namespace Models
{
    public class ThongTinDiUng
    {
        public string MaDiUng { get; set; } = string.Empty;
        public string MaBenhNhan { get; set; } = string.Empty;
        public string? TacNhan { get; set; }
        public string? BieuHien { get; set; }
        public DateTime? NgayGhiNhan { get; set; }
        public string? MucDoDiUng { get; set; }
        public string? TenDiUng { get; set; }
    }
}
