using Models;

namespace Services
{
    public interface IQuyenTruyCapService
    {
        Task<bool> CheckQuyenAsync(string maHoSo, string maTaiKhoan, string loaiQuyen);
        Task<IEnumerable<QuyenTruyCapHoSo>> GetByHoSoAsync(string maHoSo);
        Task<string> CreateAsync(QuyenTruyCapHoSo quyen);
        Task<bool> DeleteAsync(string maQuyen);
    }
}
