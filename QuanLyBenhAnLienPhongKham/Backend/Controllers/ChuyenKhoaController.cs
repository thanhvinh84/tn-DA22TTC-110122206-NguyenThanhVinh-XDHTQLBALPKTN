using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/chuyen-khoa")]
    [Authorize]
    public class ChuyenKhoaController : ControllerBase
    {
        private readonly IChuyenKhoaService _service;

        public ChuyenKhoaController(IChuyenKhoaService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả chuyên khoa
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _service.GetAllAsync();
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin chuyên khoa theo mã
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy chuyên khoa"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo chuyên khoa mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Create([FromBody] ChuyenKhoa chuyenKhoa)
        {
            try
            {
                var id = await _service.CreateAsync(chuyenKhoa);
                return Ok(ApiResponse<object>.SuccessResponse(new { maChuyenKhoa = id }, "Tạo chuyên khoa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin chuyên khoa
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Update(string id, [FromBody] ChuyenKhoa chuyenKhoa)
        {
            try
            {
                chuyenKhoa.MaChuyenKhoa = id;
                var result = await _service.UpdateAsync(chuyenKhoa);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy chuyên khoa"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa chuyên khoa
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _service.DeleteAsync(id);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy chuyên khoa hoặc chuyên khoa đang được sử dụng"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
