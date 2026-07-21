using Models;
using Repositories;

namespace Services
{
    public class HoSoBenhAnService : IHoSoBenhAnService
    {
        private readonly IHoSoBenhAnRepository _repository;

        public HoSoBenhAnService(IHoSoBenhAnRepository repository)
        {
            _repository = repository;
        }

        public async Task<HoSoBenhAn?> GetByIdAsync(string maHoSo)
        {
            return await _repository.GetByIdAsync(maHoSo);
        }

        public async Task<HoSoBenhAn?> GetByMaBenhNhanAsync(string maBenhNhan)
        {
            return await _repository.GetByMaBenhNhanAsync(maBenhNhan);
        }

        public async Task<string> CreateAsync(string maBenhNhan)
        {
            var hoSo = new HoSoBenhAn
            {
                MaBenhNhan = maBenhNhan,
                NgayTao = DateTime.Now
            };
            return await _repository.CreateAsync(hoSo);
        }

        public async Task<bool> UpdateAsync(HoSoBenhAn hoSo)
        {
            return await _repository.UpdateAsync(hoSo);
        }

        public async Task<IEnumerable<DotKham>> GetLichSuKhamAsync(string maHoSo)
        {
            return await _repository.GetLichSuKhamAsync(maHoSo);
        }
    }
}
