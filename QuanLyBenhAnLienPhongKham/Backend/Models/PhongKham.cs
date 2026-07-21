namespace Models
{
    public class PhongKham
    {
        public string MaPhongKham { get; set; } = string.Empty;
        public string TenPhongKham { get; set; } = string.Empty;
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public bool? TrangThaiLienKet { get; set; }
    }
}
