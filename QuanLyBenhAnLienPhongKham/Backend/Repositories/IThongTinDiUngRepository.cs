using Models;

namespace Repositories
{
    public interface IThongTinDiUngRepository
    {
        Task<IEnumerable<ThongTinDiUng>> GetByMaBenhNhanAsync(string maBenhNhan);
        Task<string> CreateAsync(ThongTinDiUng diUng);
        Task<bool> DeleteAsync(string maDiUng);
    }
}
