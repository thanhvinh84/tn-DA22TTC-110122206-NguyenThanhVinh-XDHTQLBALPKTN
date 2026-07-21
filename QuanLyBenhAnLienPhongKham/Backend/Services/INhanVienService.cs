using Models;
using DTOs;

namespace Services
{
    public interface INhanVienService
    {
        Task<IEnumerable<NhanVienDetailDTO>> GetAllAsync();
        Task<NhanVienDetailDTO?> GetByIdAsync(string maNhanVien);
        Task<IEnumerable<NhanVienDetailDTO>> SearchAsync(string keyword);
        Task<IEnumerable<NhanVienDetailDTO>> GetByPhongKhamAsync(string maPhongKham);
        Task<string> CreateAsync(NhanVienCreateDTO dto);
        Task<bool> UpdateAsync(NhanVienUpdateDTO dto);
        Task<bool> DeleteAsync(string maNhanVien);
    }
}
