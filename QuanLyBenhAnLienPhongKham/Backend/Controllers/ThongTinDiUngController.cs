using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/di-ung")]
    [Authorize]
    public class ThongTinDiUngController : ControllerBase
    {
        private readonly IThongTinDiUngService _service;

        public ThongTinDiUngController(IThongTinDiUngService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách dị ứng của bệnh nhân
        /// </summary>
        [HttpGet("benh-nhan/{maBenhNhan}")]
        public async Task<IActionResult> GetByMaBenhNhan(string maBenhNhan)
        {
            try
            {
                var result = await _service.GetByMaBenhNhanAsync(maBenhNhan);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Thêm thông tin dị ứng mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN,VT_BACSI,VT_LETAN")]
        public async Task<IActionResult> Create([FromBody] ThongTinDiUng diUng)
        {
            try
            {
                var maDiUng = await _service.CreateAsync(diUng);
                return Ok(ApiResponse<object>.SuccessResponse(new { maDiUng }, "Thêm thông tin dị ứng thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa thông tin dị ứng
        /// </summary>
        [HttpDelete("{maDiUng}")]
        [Authorize(Roles = "VT_ADMIN,VT_BACSI")]
        public async Task<IActionResult> Delete(string maDiUng)
        {
            try
            {
                var result = await _service.DeleteAsync(maDiUng);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy thông tin dị ứng"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
