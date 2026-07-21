namespace Models
{
    public class ChiSoSuSong
    {
        public string MaChiSo { get; set; } = string.Empty;
        public string MaDotKham { get; set; } = string.Empty;
        public int? NhipTim { get; set; }
        public int? HuyetApTamThu { get; set; }
        public int? HuyetApTamTruong { get; set; }
        public decimal? CanNang { get; set; }
        public int? NhipTho { get; set; }
        public decimal? NhietDo { get; set; }
    }
}
