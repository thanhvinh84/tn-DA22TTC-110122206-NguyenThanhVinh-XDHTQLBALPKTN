using Models;
using Repositories;

namespace Services
{
    public class ThongTinDiUngService : IThongTinDiUngService
    {
        private readonly IThongTinDiUngRepository _repository;

        public ThongTinDiUngService(IThongTinDiUngRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ThongTinDiUng>> GetByMaBenhNhanAsync(string maBenhNhan)
        {
            return await _repository.GetByMaBenhNhanAsync(maBenhNhan);
        }

        public async Task<string> CreateAsync(ThongTinDiUng diUng)
        {
            diUng.NgayGhiNhan = diUng.NgayGhiNhan ?? DateTime.Now;
            return await _repository.CreateAsync(diUng);
        }

        public async Task<bool> DeleteAsync(string maDiUng)
        {
            return await _repository.DeleteAsync(maDiUng);
        }
    }
}
