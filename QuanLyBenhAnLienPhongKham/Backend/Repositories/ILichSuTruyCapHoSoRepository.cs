using Models;

namespace Repositories
{
    public interface ILichSuTruyCapHoSoRepository
    {
        Task<string> CreateAsync(LichSuTruyCapHoSo lichSu);
        Task<IEnumerable<LichSuTruyCapHoSo>> GetByBenhNhanAsync(string maBenhNhan);
        Task<IEnumerable<LichSuTruyCapHoSo>> GetByBacSiAsync(string maBacSi, int? limit = null);
    }
}
