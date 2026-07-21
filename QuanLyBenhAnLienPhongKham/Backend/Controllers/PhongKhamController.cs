using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/phong-kham")]
    [Authorize]
    public class PhongKhamController : ControllerBase
    {
        private readonly IPhongKhamService _service;

        public PhongKhamController(IPhongKhamService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả phòng khám
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? keyword)
        {
            try
            {
                var result = await _service.GetAllAsync();
                
                // Tìm kiếm nếu có keyword
                if (!string.IsNullOrWhiteSpace(keyword))
                {
                    result = result.Where(pk => 
                        pk.TenPhongKham.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                        (pk.DiaChi != null && pk.DiaChi.Contains(keyword, StringComparison.OrdinalIgnoreCase)) ||
                        (pk.SoDienThoai != null && pk.SoDienThoai.Contains(keyword)) ||
                        (pk.Email != null && pk.Email.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                    ).ToList();
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin phòng khám theo mã
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy phòng khám"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo phòng khám mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Create([FromBody] PhongKham phongKham)
        {
            try
            {
                var id = await _service.CreateAsync(phongKham);
                return Ok(ApiResponse<object>.SuccessResponse(new { maPhongKham = id }, "Tạo phòng khám thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin phòng khám
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Update(string id, [FromBody] PhongKham phongKham)
        {
            try
            {
                phongKham.MaPhongKham = id;
                var result = await _service.UpdateAsync(phongKham);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy phòng khám"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa phòng khám
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _service.DeleteAsync(id);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy phòng khám"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
