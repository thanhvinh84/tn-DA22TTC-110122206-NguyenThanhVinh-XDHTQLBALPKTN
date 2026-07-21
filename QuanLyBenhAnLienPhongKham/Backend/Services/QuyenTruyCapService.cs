using Models;
using Repositories;

namespace Services
{
    public class QuyenTruyCapService : IQuyenTruyCapService
    {
        private readonly IQuyenTruyCapHoSoRepository _repository;

        public QuyenTruyCapService(IQuyenTruyCapHoSoRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> CheckQuyenAsync(string maHoSo, string maTaiKhoan, string loaiQuyen)
        {
            return await _repository.CheckQuyenAsync(maHoSo, maTaiKhoan, loaiQuyen);
        }

        public async Task<IEnumerable<QuyenTruyCapHoSo>> GetByHoSoAsync(string maHoSo)
        {
            return await _repository.GetByHoSoAsync(maHoSo);
        }

        public async Task<string> CreateAsync(QuyenTruyCapHoSo quyen)
        {
            return await _repository.CreateAsync(quyen);
        }

        public async Task<bool> DeleteAsync(string maQuyen)
        {
            return await _repository.DeleteAsync(maQuyen);
        }
    }
}
