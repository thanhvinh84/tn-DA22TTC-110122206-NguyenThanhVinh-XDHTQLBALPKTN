using Models;

namespace Repositories
{
    public interface IChuyenKhoaRepository
    {
        Task<IEnumerable<ChuyenKhoa>> GetAllAsync();
        Task<ChuyenKhoa?> GetByIdAsync(string id);
        Task<string> CreateAsync(ChuyenKhoa chuyenKhoa);
        Task<bool> UpdateAsync(ChuyenKhoa chuyenKhoa);
        Task<bool> DeleteAsync(string id);
    }
}
