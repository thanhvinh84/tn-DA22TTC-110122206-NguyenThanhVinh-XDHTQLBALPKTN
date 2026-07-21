using Models;

namespace Repositories
{
    public interface IKetQuaCanLamSangRepository
    {
        Task<KetQuaCanLamSang?> GetByChiDinhAsync(string maChiDinh);
        Task<IEnumerable<KetQuaCanLamSang>> GetByDotKhamAsync(string maDotKham);
        Task<string> CreateAsync(KetQuaCanLamSang ketQua);
        Task<bool> UpdateAsync(KetQuaCanLamSang ketQua);
    }
}
