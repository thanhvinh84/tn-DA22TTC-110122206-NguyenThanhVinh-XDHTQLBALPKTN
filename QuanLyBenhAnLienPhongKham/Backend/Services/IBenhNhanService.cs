using Models;
using DTOs;

namespace Services
{
    public interface IBenhNhanService
    {
        Task<IEnumerable<BenhNhan>> GetAllAsync();
        Task<BenhNhan?> GetByIdAsync(string maBenhNhan);
        Task<IEnumerable<BenhNhan>> SearchAsync(string keyword);
        Task<string> CreateAsync(BenhNhanCreateDTO dto);
        Task<bool> UpdateAsync(BenhNhanUpdateDTO dto);
        Task<bool> DeleteAsync(string maBenhNhan);
    }
}
