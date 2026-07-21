using Models;

namespace Repositories
{
    public interface INhanVienRepository
    {
        Task<IEnumerable<NhanVien>> GetAllAsync();
        Task<NhanVien?> GetByIdAsync(string id);
        Task<NhanVien?> GetByCCCDAsync(string cccd);
        Task<string> CreateAsync(NhanVien nhanVien);
        Task<bool> UpdateAsync(NhanVien nhanVien);
        Task<bool> DeleteAsync(string id);
    }
}
