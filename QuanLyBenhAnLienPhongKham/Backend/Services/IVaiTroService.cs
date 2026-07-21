using Models;

namespace Services
{
    public interface IVaiTroService
    {
        Task<IEnumerable<VaiTro>> GetAllAsync();
        Task<VaiTro?> GetByIdAsync(string maVaiTro);
    }
}
