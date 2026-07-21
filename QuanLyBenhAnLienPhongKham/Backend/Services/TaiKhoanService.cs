using Models;
using Repositories;

namespace Services
{
    public class TaiKhoanService : ITaiKhoanService
    {
        private readonly ITaiKhoanRepository _repository;

        public TaiKhoanService(ITaiKhoanRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TaiKhoan>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<TaiKhoan?> GetByIdAsync(string maTaiKhoan)
        {
            return await _repository.GetByIdAsync(maTaiKhoan);
        }

        public async Task<TaiKhoan?> GetByUsernameAsync(string tenNguoiDung)
        {
            return await _repository.GetByUsernameAsync(tenNguoiDung);
        }

        public async Task<string> CreateAsync(TaiKhoan taiKhoan)
        {
            // TẠM THỜI không hash mật khẩu để test (giống AuthService)
            // TODO: Sau này sửa lại để dùng BCrypt cho cả Create và Login
            // taiKhoan.MatKhau = BCrypt.Net.BCrypt.HashPassword(taiKhoan.MatKhau);
            
            // Nếu không có mật khẩu, đặt mặc định là 123456
            if (string.IsNullOrEmpty(taiKhoan.MatKhau))
            {
                taiKhoan.MatKhau = "123456";
            }
            
            taiKhoan.TrangThai = taiKhoan.TrangThai ?? true;
            taiKhoan.NgayTao = DateTime.Now;
            
            return await _repository.CreateAsync(taiKhoan);
        }

        public async Task<bool> UpdateAsync(TaiKhoan taiKhoan)
        {
            // Không cho phép cập nhật mật khẩu qua phương thức này
            var existing = await _repository.GetByIdAsync(taiKhoan.MaTaiKhoan);
            if (existing == null) return false;
            
            taiKhoan.MatKhau = existing.MatKhau; // Giữ nguyên mật khẩu cũ
            return await _repository.UpdateAsync(taiKhoan);
        }

        public async Task<bool> DeleteAsync(string maTaiKhoan)
        {
            return await _repository.DeleteAsync(maTaiKhoan);
        }

        public async Task<bool> ChangePasswordAsync(string maTaiKhoan, string matKhauCu, string matKhauMoi)
        {
            var taiKhoan = await _repository.GetByIdAsync(maTaiKhoan);
            if (taiKhoan == null) return false;

            // TẠM THỜI dùng plain text comparison (giống AuthService)
            // TODO: Sau này sửa lại để dùng BCrypt
            if (taiKhoan.MatKhau != matKhauCu)
                return false;

            // Cập nhật mật khẩu mới (plain text)
            taiKhoan.MatKhau = matKhauMoi;
            return await _repository.UpdateAsync(taiKhoan);
        }

        public async Task<bool> UpdateStatusAsync(string maTaiKhoan, bool trangThai)
        {
            var taiKhoan = await _repository.GetByIdAsync(maTaiKhoan);
            if (taiKhoan == null) return false;

            taiKhoan.TrangThai = trangThai;
            return await _repository.UpdateAsync(taiKhoan);
        }

        public async Task<bool> ResetPasswordAsync(string maTaiKhoan)
        {
            var taiKhoan = await _repository.GetByIdAsync(maTaiKhoan);
            if (taiKhoan == null) return false;

            // Reset mật khẩu về mặc định: 123456 (plain text)
            taiKhoan.MatKhau = "123456";
            return await _repository.UpdateAsync(taiKhoan);
        }
    }
}
