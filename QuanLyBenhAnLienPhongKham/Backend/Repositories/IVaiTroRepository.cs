using Models;

namespace Repositories
{
    public interface IVaiTroRepository
    {
        Task<IEnumerable<VaiTro>> GetAllAsync();
        Task<VaiTro?> GetByIdAsync(string maVaiTro);
    }
}
