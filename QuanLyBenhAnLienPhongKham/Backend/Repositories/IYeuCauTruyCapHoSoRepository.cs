using Models;

namespace Repositories
{
    public interface IYeuCauTruyCapHoSoRepository
    {
        Task<string> CreateAsync(YeuCauTruyCapHoSo yeuCau);
        Task<YeuCauTruyCapHoSo?> GetByIdAsync(string maYeuCau);
        Task<IEnumerable<YeuCauTruyCapHoSo>> GetByBacSiYeuCauAsync(string maBacSi);
        Task<IEnumerable<YeuCauTruyCapHoSo>> GetByBacSiDuocYeuCauAsync(string maBacSi);
        Task<bool> UpdateAsync(YeuCauTruyCapHoSo yeuCau);
        Task<bool> ChapNhanYeuCauAsync(string maYeuCau, string loaiQuyen, DateTime ngayHetHan);
        Task<bool> TuChoiYeuCauAsync(string maYeuCau, string lyDoTuChoi);
        Task<YeuCauTruyCapHoSo?> KiemTraQuyenTruyCapAsync(string maBacSi, string maBenhNhan, string maPhongKhamCuaBenhNhan);
    }
}
