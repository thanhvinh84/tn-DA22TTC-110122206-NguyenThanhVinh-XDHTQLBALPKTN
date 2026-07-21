using Models;
using Repositories;

namespace Services
{
    public class QuyenTruyCapHoSoService : IQuyenTruyCapHoSoService
    {
        private readonly IQuyenTruyCapHoSoRepository _repository;

        public QuyenTruyCapHoSoService(IQuyenTruyCapHoSoRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<QuyenTruyCapHoSo>> GetAllAsync()
        {
            // Tạm thời trả về danh sách rỗng, cần implement trong repository
            return new List<QuyenTruyCapHoSo>();
        }

        public async Task<QuyenTruyCapHoSo?> GetByIdAsync(string maQuyen)
        {
            // Tạm thời trả về null, cần implement trong repository
            return null;
        }

        public async Task<QuyenTruyCapHoSo?> GetByHoSoAndTaiKhoanAsync(string maHoSo, string maTaiKhoan)
        {
            var allQuyens = await GetAllAsync();
            return allQuyens.FirstOrDefault(q => q.MaHoSo == maHoSo && q.MaTaiKhoan == maTaiKhoan);
        }

        public async Task<bool> CheckPermissionAsync(string maHoSo, string maTaiKhoan, string loaiQuyen)
        {
            return await _repository.CheckQuyenAsync(maHoSo, maTaiKhoan, loaiQuyen);
        }

        public async Task<IEnumerable<object>> GetHoSoByTaiKhoanAsync(string maTaiKhoan)
        {
            // Tạm thời trả về danh sách rỗng, cần implement trong repository
            return new List<object>();
        }

        public async Task<string> CreateAsync(QuyenTruyCapHoSo quyen)
        {
            quyen.ThoiGianCap = quyen.ThoiGianCap ?? DateTime.Now;
            return await _repository.CreateAsync(quyen);
        }

        public async Task<bool> UpdateAsync(QuyenTruyCapHoSo quyen)
        {
            // Tạm thời trả về false, cần implement trong repository
            return false;
        }

        public async Task<bool> DeleteAsync(string maQuyen)
        {
            return await _repository.DeleteAsync(maQuyen);
        }
    }
}
