using Models;

namespace Services
{
    public interface IThongTinDiUngService
    {
        Task<IEnumerable<ThongTinDiUng>> GetByMaBenhNhanAsync(string maBenhNhan);
        Task<string> CreateAsync(ThongTinDiUng diUng);
        Task<bool> DeleteAsync(string maDiUng);
    }
}
