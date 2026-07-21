using Models;

namespace Repositories
{
    public interface IBenhNhanRepository
    {
        Task<IEnumerable<BenhNhan>> GetAllAsync();
        Task<BenhNhan?> GetByIdAsync(string maBenhNhan);
        Task<IEnumerable<BenhNhan>> SearchAsync(string keyword);
        Task<string> CreateAsync(BenhNhan benhNhan);
        Task<bool> UpdateAsync(BenhNhan benhNhan);
        Task<bool> DeleteAsync(string maBenhNhan);
    }
}
