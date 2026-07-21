using Models;

namespace Repositories
{
    public interface IHoaDonRepository
    {
        Task<IEnumerable<HoaDon>> GetAllAsync();
        Task<HoaDon?> GetByDotKhamAsync(string maDotKham);
        Task<HoaDon?> GetByIdAsync(string maHoaDon);
        Task<string> CreateAsync(HoaDon hoaDon);
        Task<bool> UpdateAsync(HoaDon hoaDon);
        Task<bool> UpdateTrangThaiAsync(string maHoaDon, string trangThai);
    }
}
