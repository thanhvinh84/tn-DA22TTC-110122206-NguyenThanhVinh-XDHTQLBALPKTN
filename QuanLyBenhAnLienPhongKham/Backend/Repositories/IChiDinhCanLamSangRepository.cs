using Models;

namespace Repositories
{
    public interface IChiDinhCanLamSangRepository
    {
        Task<IEnumerable<ChiDinhCanLamSang>> GetAllAsync();
        Task<IEnumerable<ChiDinhCanLamSang>> GetByDotKhamAsync(string maDotKham);
        Task<ChiDinhCanLamSang?> GetByIdAsync(string maChiDinh);
        Task<string> CreateAsync(ChiDinhCanLamSang chiDinh);
        Task<bool> UpdateTrangThaiAsync(string maChiDinh, string trangThai);
    }
}
