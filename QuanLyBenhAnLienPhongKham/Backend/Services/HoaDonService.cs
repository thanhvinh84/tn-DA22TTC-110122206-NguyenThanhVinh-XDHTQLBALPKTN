using Models;
using Repositories;
using DTOs;

namespace Services
{
    public class HoaDonService : IHoaDonService
    {
        private readonly IHoaDonRepository _repository;

        public HoaDonService(IHoaDonRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<HoaDon>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<HoaDon?> GetByIdAsync(string maHoaDon)
        {
            return await _repository.GetByIdAsync(maHoaDon);
        }

        public async Task<HoaDon?> GetByDotKhamAsync(string maDotKham)
        {
            return await _repository.GetByDotKhamAsync(maDotKham);
        }

        public async Task<string> CreateAsync(HoaDon hoaDon)
        {
            hoaDon.NgayLap = hoaDon.NgayLap ?? DateTime.Now;
            hoaDon.TrangThai = hoaDon.TrangThai ?? "CHUATHANHTOAN";
            return await _repository.CreateAsync(hoaDon);
        }

        public async Task<bool> UpdateAsync(HoaDon hoaDon)
        {
            return await _repository.UpdateAsync(hoaDon);
        }

        public async Task<bool> UpdateTrangThaiAsync(string maHoaDon, string trangThai)
        {
            return await _repository.UpdateTrangThaiAsync(maHoaDon, trangThai);
        }

        public async Task<bool> ThanhToanAsync(string maHoaDon)
        {
            var hoaDon = await _repository.GetByIdAsync(maHoaDon);
            if (hoaDon == null || hoaDon.TrangThai == "Đã thanh toán")
                return false;

            return await _repository.UpdateTrangThaiAsync(maHoaDon, "Đã thanh toán");
        }

        public async Task<bool> HuyAsync(string maHoaDon, string lyDo)
        {
            var hoaDon = await _repository.GetByIdAsync(maHoaDon);
            if (hoaDon == null || hoaDon.TrangThai == "DATHANHTOAN")
                return false;

            return await _repository.UpdateTrangThaiAsync(maHoaDon, "DAHUY");
        }

        public async Task<bool> DeleteAsync(string maHoaDon)
        {
            // Tạm thời trả về false, cần implement trong repository
            return false;
        }

        public async Task<ThongKeDoanhThuDTO> ThongKeDoanhThuAsync(DateTime? tuNgay, DateTime? denNgay)
        {
            // Mặc định lấy 30 ngày gần nhất
            var start = tuNgay?.Date ?? DateTime.Now.AddDays(-30).Date;
            // Thêm 1 ngày và trừ 1 giây để bao gồm toàn bộ ngày cuối (23:59:59)
            var end = denNgay.HasValue 
                ? denNgay.Value.Date.AddDays(1).AddSeconds(-1)
                : DateTime.Now.Date.AddDays(1).AddSeconds(-1);
            
            var hoaDons = await _repository.GetAllAsync();
            var hoaDonDaThanhToan = hoaDons.Where(hd => 
                hd.TrangThai == "Đã thanh toán" &&
                hd.NgayLap.HasValue &&
                hd.NgayLap >= start &&
                hd.NgayLap <= end
            ).ToList();
            
            var result = new ThongKeDoanhThuDTO
            {
                TongDoanhThu = hoaDonDaThanhToan.Sum(hd => hd.TongTien ?? 0),
                SoLuongHoaDon = hoaDonDaThanhToan.Count,
                DoanhThuTrungBinh = hoaDonDaThanhToan.Any() 
                    ? hoaDonDaThanhToan.Average(hd => hd.TongTien ?? 0) 
                    : 0,
                    
                // Group by ngày
                DoanhThuTheoNgay = hoaDonDaThanhToan
                    .GroupBy(hd => hd.NgayLap!.Value.Date)
                    .Select(g => new DoanhThuTheoNgay
                    {
                        Ngay = g.Key,
                        TongTien = g.Sum(hd => hd.TongTien ?? 0),
                        SoLuong = g.Count()
                    })
                    .OrderBy(x => x.Ngay)
                    .ToList(),
                    
                // Group by tháng
                DoanhThuTheoThang = hoaDonDaThanhToan
                    .GroupBy(hd => new { hd.NgayLap!.Value.Year, hd.NgayLap.Value.Month })
                    .Select(g => new DoanhThuTheoThang
                    {
                        Nam = g.Key.Year,
                        Thang = g.Key.Month,
                        TongTien = g.Sum(hd => hd.TongTien ?? 0),
                        SoLuong = g.Count()
                    })
                    .OrderBy(x => x.Nam).ThenBy(x => x.Thang)
                    .Take(12)
                    .ToList(),
                    
                // Top 10 bệnh nhân
                Top10BenhNhan = hoaDonDaThanhToan
                    .Where(hd => !string.IsNullOrEmpty(hd.MaBenhNhan))
                    .GroupBy(hd => new { hd.MaBenhNhan, hd.HoTenBenhNhan })
                    .Select(g => new Top10BenhNhan
                    {
                        MaBenhNhan = g.Key.MaBenhNhan ?? "",
                        HoTen = g.Key.HoTenBenhNhan ?? "Không xác định",
                        TongChiTieu = g.Sum(hd => hd.TongTien ?? 0),
                        SoLanKham = g.Count()
                    })
                    .OrderByDescending(x => x.TongChiTieu)
                    .Take(10)
                    .ToList(),
                    
                // Thống kê trạng thái
                ThongKeTrangThai = new ThongKeTrangThai
                {
                    DaThanhToan = hoaDons.Count(hd => hd.TrangThai == "Đã thanh toán"),
                    ChuaThanhToan = hoaDons.Count(hd => hd.TrangThai != "Đã thanh toán" && hd.TrangThai != "DAHUY"),
                    TongDaThanhToan = hoaDons
                        .Where(hd => hd.TrangThai == "Đã thanh toán")
                        .Sum(hd => hd.TongTien ?? 0),
                    TongChuaThanhToan = hoaDons
                        .Where(hd => hd.TrangThai != "Đã thanh toán" && hd.TrangThai != "DAHUY")
                        .Sum(hd => hd.TongTien ?? 0)
                }
            };
            
            return result;
        }
    }
}
