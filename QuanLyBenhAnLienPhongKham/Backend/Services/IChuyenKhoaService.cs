using Models;

namespace Services
{
    public interface IChuyenKhoaService
    {
        Task<IEnumerable<ChuyenKhoa>> GetAllAsync();
        Task<ChuyenKhoa?> GetByIdAsync(string maChuyenKhoa);
        Task<string> CreateAsync(ChuyenKhoa chuyenKhoa);
        Task<bool> UpdateAsync(ChuyenKhoa chuyenKhoa);
        Task<bool> DeleteAsync(string maChuyenKhoa);
    }
}
