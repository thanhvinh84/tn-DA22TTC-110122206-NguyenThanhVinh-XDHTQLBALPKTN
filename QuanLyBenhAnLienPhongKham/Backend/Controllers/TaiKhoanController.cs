using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/tai-khoan")]
    [Authorize(Roles = "VT_ADMIN")]
    public class TaiKhoanController : ControllerBase
    {
        private readonly ITaiKhoanService _service;

        public TaiKhoanController(ITaiKhoanService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả tài khoản
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? maVaiTro)
        {
            try
            {
                var result = await _service.GetAllAsync();
                
                // Lọc theo vai trò
                if (!string.IsNullOrWhiteSpace(maVaiTro))
                {
                    result = result.Where(tk => tk.MaVaiTro == maVaiTro).ToList();
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin tài khoản theo mã
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy tài khoản"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo tài khoản mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaiKhoan taiKhoan)
        {
            try
            {
                // Kiểm tra tên người dùng đã tồn tại
                var existing = await _service.GetByUsernameAsync(taiKhoan.TenNguoiDung);
                if (existing != null)
                    return BadRequest(ApiResponse<object>.ErrorResponse("Tên người dùng đã tồn tại"));
                
                var id = await _service.CreateAsync(taiKhoan);
                return Ok(ApiResponse<object>.SuccessResponse(new { maTaiKhoan = id }, "Tạo tài khoản thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin tài khoản
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] TaiKhoan taiKhoan)
        {
            try
            {
                taiKhoan.MaTaiKhoan = id;
                var result = await _service.UpdateAsync(taiKhoan);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy tài khoản"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Đổi mật khẩu
        /// </summary>
        [HttpPut("{id}/doi-mat-khau")]
        public async Task<IActionResult> ChangePassword(string id, [FromBody] ChangePasswordDTO dto)
        {
            try
            {
                var result = await _service.ChangePasswordAsync(id, dto.MatKhauCu, dto.MatKhauMoi);
                if (!result)
                    return BadRequest(ApiResponse<object>.ErrorResponse("Mật khẩu cũ không đúng"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Đổi mật khẩu thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Khóa/Mở khóa tài khoản
        /// </summary>
        [HttpPut("{id}/trang-thai")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusDTO dto)
        {
            try
            {
                var result = await _service.UpdateStatusAsync(id, dto.TrangThai);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy tài khoản"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật trạng thái thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Khóa tài khoản
        /// </summary>
        [HttpPut("{id}/khoa")]
        public async Task<IActionResult> Lock(string id)
        {
            try
            {
                var result = await _service.UpdateStatusAsync(id, false);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy tài khoản"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Khóa tài khoản thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Mở khóa tài khoản
        /// </summary>
        [HttpPut("{id}/mo")]
        public async Task<IActionResult> Unlock(string id)
        {
            try
            {
                var result = await _service.UpdateStatusAsync(id, true);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy tài khoản"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Mở khóa tài khoản thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Reset mật khẩu về mặc định (123456)
        /// </summary>
        [HttpPut("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(string id)
        {
            try
            {
                var result = await _service.ResetPasswordAsync(id);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy tài khoản"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Reset mật khẩu thành công. Mật khẩu mới: 123456"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa tài khoản
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _service.DeleteAsync(id);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy tài khoản"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
