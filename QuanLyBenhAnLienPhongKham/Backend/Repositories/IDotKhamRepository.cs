using Models;

namespace Repositories
{
    public interface IDotKhamRepository
    {
        Task<IEnumerable<DotKham>> GetAllAsync();
        Task<DotKham?> GetByIdAsync(string maDotKham);
        Task<IEnumerable<DotKham>> GetByBacSiAsync(string maBacSi, string? trangThai);
        Task<IEnumerable<DotKham>> GetByHoSoAsync(string maHoSo);
        Task<IEnumerable<DotKham>> GetByBenhNhanAsync(string maBenhNhan);
        Task<string> GetOrCreateHoSoByMaBenhNhanAsync(string maBenhNhan);
        Task<string> CreateAsync(DotKham dotKham);
        Task<bool> UpdateAsync(DotKham dotKham);
        Task<bool> UpdateTrangThaiAsync(string maDotKham, string trangThai);
    }
}
