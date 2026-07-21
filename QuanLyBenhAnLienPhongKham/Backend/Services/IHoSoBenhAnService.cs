using Models;

namespace Services
{
    public interface IHoSoBenhAnService
    {
        Task<HoSoBenhAn?> GetByIdAsync(string maHoSo);
        Task<HoSoBenhAn?> GetByMaBenhNhanAsync(string maBenhNhan);
        Task<string> CreateAsync(string maBenhNhan);
        Task<bool> UpdateAsync(HoSoBenhAn hoSo);
        Task<IEnumerable<DotKham>> GetLichSuKhamAsync(string maHoSo);
    }
}
