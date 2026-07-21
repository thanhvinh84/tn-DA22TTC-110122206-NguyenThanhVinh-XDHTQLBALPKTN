namespace DTOs
{
    public class DotKhamCreateDTO
    {
        public string? MaHoSo { get; set; }
        public string? MaBenhNhan { get; set; }
        public string? MaPhongKham { get; set; }
        public string? MaBacSi { get; set; }
        public string? MaLeTan { get; set; }
        public DateTime? ThoiGianDen { get; set; }
        public string? LyDoKham { get; set; }
        public string? TrangThai { get; set; }
    }

    public class DotKhamUpdateDTO
    {
        public string MaDotKham { get; set; } = string.Empty;
        public string? MaBacSi { get; set; }
        public string? LyDoKham { get; set; }
        public string? TrangThai { get; set; }
    }

    public class UpdateTrangThaiDTO
    {
        public string TrangThai { get; set; } = string.Empty;
    }
}
