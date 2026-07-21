using Models;

namespace Services
{
    public interface IChiDinhCanLamSangService
    {
        Task<IEnumerable<ChiDinhCanLamSang>> GetAllAsync();
        Task<IEnumerable<ChiDinhCanLamSang>> GetByDotKhamAsync(string maDotKham);
        Task<string> CreateAsync(ChiDinhCanLamSang chiDinh);
        Task<bool> UpdateTrangThaiAsync(string maChiDinh, string trangThai);
    }
}
