using Models;
using DTOs;

namespace Services
{
    public interface IHoaDonService
    {
        Task<IEnumerable<HoaDon>> GetAllAsync();
        Task<HoaDon?> GetByIdAsync(string maHoaDon);
        Task<HoaDon?> GetByDotKhamAsync(string maDotKham);
        Task<string> CreateAsync(HoaDon hoaDon);
        Task<bool> UpdateAsync(HoaDon hoaDon);
        Task<bool> UpdateTrangThaiAsync(string maHoaDon, string trangThai);
        Task<bool> ThanhToanAsync(string maHoaDon);
        Task<bool> HuyAsync(string maHoaDon, string lyDo);
        Task<bool> DeleteAsync(string maHoaDon);
        Task<ThongKeDoanhThuDTO> ThongKeDoanhThuAsync(DateTime? tuNgay, DateTime? denNgay);
    }
}
