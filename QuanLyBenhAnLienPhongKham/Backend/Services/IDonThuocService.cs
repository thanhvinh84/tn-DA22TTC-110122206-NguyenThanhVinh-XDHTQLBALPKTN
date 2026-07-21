using Models;
using DTOs;

namespace Services
{
    public interface IDonThuocService
    {
        Task<DonThuoc?> GetByDotKhamAsync(string maDotKham);
        Task<string> CreateAsync(DonThuoc donThuoc);
        Task<IEnumerable<ChiTietDonThuoc>> GetChiTietAsync(string maDonThuoc);
        Task<bool> AddChiTietAsync(ChiTietDonThuoc chiTiet);
        Task<CanhBaoDiUng?> KiemTraDiUngAsync(string maDonThuoc, string maThuoc);
        Task<bool> DeleteChiTietAsync(string maDonThuoc, string maThuoc);
    }
}
