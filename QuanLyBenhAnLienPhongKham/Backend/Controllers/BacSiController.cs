using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/bac-si")]
    [Authorize]
    public class BacSiController : ControllerBase
    {
        private readonly IBacSiService _service;

        public BacSiController(IBacSiService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả bác sĩ (kèm thông tin chuyên khoa)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? maChuyenKhoa)
        {
            try
            {
                var result = await _service.GetAllAsync();
                
                // Lọc theo chuyên khoa
                if (!string.IsNullOrEmpty(maChuyenKhoa))
                {
                    result = result.Where(bs => bs.MaChuyenKhoa == maChuyenKhoa).ToList();
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin bác sĩ theo mã
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bác sĩ"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin bác sĩ theo mã nhân viên
        /// </summary>
        [HttpGet("nhan-vien/{maNhanVien}")]
        public async Task<IActionResult> GetByNhanVien(string maNhanVien)
        {
            try
            {
                var result = await _service.GetByIdAsync(maNhanVien);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bác sĩ"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo bác sĩ mới (phải có MaNhanVien tương ứng)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Create([FromBody] BacSi bacSi)
        {
            try
            {
                var id = await _service.CreateAsync(bacSi);
                return Ok(ApiResponse<object>.SuccessResponse(new { maBacSi = id }, "Tạo bác sĩ thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin bác sĩ
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Update(string id, [FromBody] BacSi bacSi)
        {
            try
            {
                bacSi.MaBacSi = id;
                var result = await _service.UpdateAsync(bacSi);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bác sĩ"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin bác sĩ theo mã nhân viên
        /// </summary>
        [HttpPut("nhan-vien/{maNhanVien}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> UpdateByNhanVien(string maNhanVien, [FromBody] BacSi bacSi)
        {
            try
            {
                bacSi.MaBacSi = maNhanVien;
                var result = await _service.UpdateAsync(bacSi);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bác sĩ"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa bác sĩ
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _service.DeleteAsync(id);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bác sĩ hoặc bác sĩ đang có lượt khám"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
