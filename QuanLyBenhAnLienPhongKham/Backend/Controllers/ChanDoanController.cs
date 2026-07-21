using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/chan-doan")]
    [Authorize]
    public class ChanDoanController : ControllerBase
    {
        private readonly IChanDoanService _service;

        public ChanDoanController(IChanDoanService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách chẩn đoán của đợt khám
        /// </summary>
        [HttpGet("dot-kham/{maDotKham}")]
        public async Task<IActionResult> GetByDotKham(string maDotKham)
        {
            try
            {
                var result = await _service.GetByDotKhamAsync(maDotKham);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo chẩn đoán mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_BACSI,VT_ADMIN")]
        public async Task<IActionResult> Create([FromBody] ChanDoan chanDoan)
        {
            try
            {
                var maChanDoan = await _service.CreateAsync(chanDoan);
                return Ok(ApiResponse<object>.SuccessResponse(new { maChanDoan }, "Tạo chẩn đoán thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật chẩn đoán
        /// </summary>
        [HttpPut("{maChanDoan}")]
        [Authorize(Roles = "VT_BACSI,VT_ADMIN")]
        public async Task<IActionResult> Update(string maChanDoan, [FromBody] ChanDoan chanDoan)
        {
            try
            {
                chanDoan.MaChanDoan = maChanDoan;
                var result = await _service.UpdateAsync(chanDoan);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy chẩn đoán"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa chẩn đoán
        /// </summary>
        [HttpDelete("{maChanDoan}")]
        [Authorize(Roles = "VT_BACSI,VT_ADMIN")]
        public async Task<IActionResult> Delete(string maChanDoan)
        {
            try
            {
                var result = await _service.DeleteAsync(maChanDoan);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy chẩn đoán"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
