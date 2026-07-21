using Models;

namespace Repositories
{
    public interface IDanhMucBenhRepository
    {
        Task<IEnumerable<DanhMucBenh>> GetAllAsync();
        Task<DanhMucBenh?> GetByIdAsync(string maBenh);
        Task<bool> CreateAsync(DanhMucBenh benh);
        Task<bool> UpdateAsync(DanhMucBenh benh);
        Task<bool> DeleteAsync(string maBenh);
    }
}
