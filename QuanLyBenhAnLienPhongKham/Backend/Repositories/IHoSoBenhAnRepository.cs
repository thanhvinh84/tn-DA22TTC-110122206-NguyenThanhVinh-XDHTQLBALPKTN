using Models;

namespace Repositories
{
    public interface IHoSoBenhAnRepository
    {
        Task<HoSoBenhAn?> GetByIdAsync(string maHoSo);
        Task<HoSoBenhAn?> GetByMaBenhNhanAsync(string maBenhNhan);
        Task<string> CreateAsync(HoSoBenhAn hoSo);
        Task<bool> UpdateAsync(HoSoBenhAn hoSo);
        Task<IEnumerable<DotKham>> GetLichSuKhamAsync(string maHoSo);
    }
}
