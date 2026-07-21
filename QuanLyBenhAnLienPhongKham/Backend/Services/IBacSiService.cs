using Models;

namespace Services
{
    public interface IBacSiService
    {
        Task<IEnumerable<BacSi>> GetAllAsync();
        Task<BacSi?> GetByIdAsync(string maBacSi);
        Task<string> CreateAsync(BacSi bacSi);
        Task<bool> UpdateAsync(BacSi bacSi);
        Task<bool> DeleteAsync(string maBacSi);
    }
}
