using Models;

namespace Repositories
{
    public interface IDanhMucThuocRepository
    {
        Task<IEnumerable<DanhMucThuoc>> GetAllAsync();
        Task<DanhMucThuoc?> GetByIdAsync(string maThuoc);
        Task<bool> CreateAsync(DanhMucThuoc thuoc);
        Task<bool> UpdateAsync(DanhMucThuoc thuoc);
        Task<bool> DeleteAsync(string maThuoc);
    }
}
