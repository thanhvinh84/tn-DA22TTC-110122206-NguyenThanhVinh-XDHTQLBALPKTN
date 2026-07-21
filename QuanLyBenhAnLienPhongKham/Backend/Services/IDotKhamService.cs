using Models;
using DTOs;

namespace Services
{
    public interface IDotKhamService
    {
        Task<IEnumerable<DotKham>> GetAllAsync();
        Task<DotKham?> GetByIdAsync(string maDotKham);
        Task<IEnumerable<DotKham>> GetByBacSiAsync(string maBacSi, string? trangThai);
        Task<IEnumerable<DotKham>> GetByHoSoAsync(string maHoSo);
        Task<IEnumerable<DotKham>> GetByBenhNhanAsync(string maBenhNhan);
        Task<string> CreateAsync(DotKhamCreateDTO dto);
        Task<bool> UpdateAsync(DotKhamUpdateDTO dto);
        Task<bool> UpdateTrangThaiAsync(string maDotKham, string trangThai);
    }
}
