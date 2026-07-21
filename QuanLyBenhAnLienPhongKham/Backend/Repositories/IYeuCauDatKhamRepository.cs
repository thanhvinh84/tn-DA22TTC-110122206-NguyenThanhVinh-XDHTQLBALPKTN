using Models;

namespace Repositories
{
    public interface IYeuCauDatKhamRepository
    {
        Task<string> CreateAsync(YeuCauDatKham yeuCau);
        Task<YeuCauDatKham?> GetByIdAsync(string maYeuCau);
        Task<IEnumerable<YeuCauDatKham>> GetByBenhNhanAsync(string maBenhNhan);
        Task<IEnumerable<YeuCauDatKham>> GetByTrangThaiAsync(string trangThai);
        Task<IEnumerable<YeuCauDatKham>> GetAllAsync();
        Task<bool> UpdateAsync(YeuCauDatKham yeuCau);
        Task<bool> XacNhanAsync(string maYeuCau, string maNhanVienXuLy, string? maPhongKham);
        Task<bool> TuChoiAsync(string maYeuCau, string maNhanVienXuLy, string lyDoTuChoi);
        Task<bool> HuyAsync(string maYeuCau);
        Task<bool> UpdateMaDotKhamAsync(string maYeuCau, string maDotKham);
        Task<int> CountByTrangThaiAsync(string trangThai);
    }
}
