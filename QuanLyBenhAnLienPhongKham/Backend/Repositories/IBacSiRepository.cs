using Models;

namespace Repositories
{
    public interface IBacSiRepository
    {
        Task<IEnumerable<BacSi>> GetAllAsync();
        Task<BacSi?> GetByIdAsync(string id);
        Task<string> CreateAsync(BacSi bacSi);
        Task<bool> UpdateAsync(BacSi bacSi);
        Task<bool> DeleteAsync(string id);
    }
}
