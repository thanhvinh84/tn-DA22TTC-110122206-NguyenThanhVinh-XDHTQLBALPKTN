using Models;
using Repositories;

namespace Services
{
    public class ChiDinhCanLamSangService : IChiDinhCanLamSangService
    {
        private readonly IChiDinhCanLamSangRepository _repository;

        public ChiDinhCanLamSangService(IChiDinhCanLamSangRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ChiDinhCanLamSang>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<IEnumerable<ChiDinhCanLamSang>> GetByDotKhamAsync(string maDotKham)
        {
            return await _repository.GetByDotKhamAsync(maDotKham);
        }

        public async Task<string> CreateAsync(ChiDinhCanLamSang chiDinh)
        {
            return await _repository.CreateAsync(chiDinh);
        }

        public async Task<bool> UpdateTrangThaiAsync(string maChiDinh, string trangThai)
        {
            return await _repository.UpdateTrangThaiAsync(maChiDinh, trangThai);
        }
    }
}
