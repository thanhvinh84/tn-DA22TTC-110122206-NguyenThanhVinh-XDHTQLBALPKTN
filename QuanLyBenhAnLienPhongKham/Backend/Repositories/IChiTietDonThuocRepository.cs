using Models;

namespace Repositories
{
    public interface IChiTietDonThuocRepository
    {
        Task<IEnumerable<ChiTietDonThuoc>> GetByDonThuocAsync(string maDonThuoc);
        Task<bool> CreateAsync(ChiTietDonThuoc chiTiet);
        Task<bool> UpdateAsync(ChiTietDonThuoc chiTiet);
        Task<bool> DeleteAsync(string maDonThuoc, string maThuoc);
    }
}
