namespace DTOs
{
    public class ThongKeDoanhThuDTO
    {
        public decimal TongDoanhThu { get; set; }
        public int SoLuongHoaDon { get; set; }
        public decimal DoanhThuTrungBinh { get; set; }
        public List<DoanhThuTheoNgay> DoanhThuTheoNgay { get; set; } = new List<DoanhThuTheoNgay>();
        public List<DoanhThuTheoThang> DoanhThuTheoThang { get; set; } = new List<DoanhThuTheoThang>();
        public List<Top10BenhNhan> Top10BenhNhan { get; set; } = new List<Top10BenhNhan>();
        public ThongKeTrangThai ThongKeTrangThai { get; set; } = new ThongKeTrangThai();
    }

    public class DoanhThuTheoNgay
    {
        public DateTime Ngay { get; set; }
        public decimal TongTien { get; set; }
        public int SoLuong { get; set; }
    }

    public class DoanhThuTheoThang
    {
        public int Thang { get; set; }
        public int Nam { get; set; }
        public decimal TongTien { get; set; }
        public int SoLuong { get; set; }
    }

    public class Top10BenhNhan
    {
        public string MaBenhNhan { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public decimal TongChiTieu { get; set; }
        public int SoLanKham { get; set; }
    }

    public class ThongKeTrangThai
    {
        public int ChuaThanhToan { get; set; }
        public int DaThanhToan { get; set; }
        public decimal TongChuaThanhToan { get; set; }
        public decimal TongDaThanhToan { get; set; }
    }
}
