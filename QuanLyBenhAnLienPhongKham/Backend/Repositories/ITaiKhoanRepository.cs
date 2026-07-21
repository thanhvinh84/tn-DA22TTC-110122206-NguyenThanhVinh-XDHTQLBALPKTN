using Models;

namespace Repositories
{
    public interface ITaiKhoanRepository
    {
        Task<TaiKhoan?> GetByUsernameAsync(string tenNguoiDung);
        Task<TaiKhoan?> GetByIdAsync(string id);
        Task<IEnumerable<TaiKhoan>> GetAllAsync();
        Task<string> CreateAsync(TaiKhoan taiKhoan);
        Task<bool> UpdateAsync(TaiKhoan taiKhoan);
        Task<bool> DeleteAsync(string id);
    }
}
