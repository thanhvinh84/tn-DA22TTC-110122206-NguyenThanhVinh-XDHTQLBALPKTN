using Models;

namespace Repositories
{
    public interface IPhongKhamRepository
    {
        Task<IEnumerable<PhongKham>> GetAllAsync();
        Task<PhongKham?> GetByIdAsync(string id);
        Task<string> CreateAsync(PhongKham phongKham);
        Task<bool> UpdateAsync(PhongKham phongKham);
        Task<bool> DeleteAsync(string id);
    }
}
