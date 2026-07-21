using Models;

namespace Services
{
    public interface ITaiKhoanService
    {
        Task<IEnumerable<TaiKhoan>> GetAllAsync();
        Task<TaiKhoan?> GetByIdAsync(string maTaiKhoan);
        Task<TaiKhoan?> GetByUsernameAsync(string tenNguoiDung);
        Task<string> CreateAsync(TaiKhoan taiKhoan);
        Task<bool> UpdateAsync(TaiKhoan taiKhoan);
        Task<bool> DeleteAsync(string maTaiKhoan);
        Task<bool> ChangePasswordAsync(string maTaiKhoan, string matKhauCu, string matKhauMoi);
        Task<bool> UpdateStatusAsync(string maTaiKhoan, bool trangThai);
        Task<bool> ResetPasswordAsync(string maTaiKhoan);
    }
}
