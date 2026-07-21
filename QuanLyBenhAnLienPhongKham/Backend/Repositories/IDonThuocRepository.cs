using Models;

namespace Repositories
{
    public interface IDonThuocRepository
    {
        Task<DonThuoc?> GetByDotKhamAsync(string maDotKham);
        Task<DonThuoc?> GetByIdAsync(string maDonThuoc);
        Task<string> CreateAsync(DonThuoc donThuoc);
    }
}
