using Models;

namespace Services
{
    public interface IQuyenTruyCapHoSoService
    {
        Task<IEnumerable<QuyenTruyCapHoSo>> GetAllAsync();
        Task<QuyenTruyCapHoSo?> GetByIdAsync(string maQuyen);
        Task<QuyenTruyCapHoSo?> GetByHoSoAndTaiKhoanAsync(string maHoSo, string maTaiKhoan);
        Task<bool> CheckPermissionAsync(string maHoSo, string maTaiKhoan, string loaiQuyen);
        Task<IEnumerable<object>> GetHoSoByTaiKhoanAsync(string maTaiKhoan);
        Task<string> CreateAsync(QuyenTruyCapHoSo quyen);
        Task<bool> UpdateAsync(QuyenTruyCapHoSo quyen);
        Task<bool> DeleteAsync(string maQuyen);
    }
}
