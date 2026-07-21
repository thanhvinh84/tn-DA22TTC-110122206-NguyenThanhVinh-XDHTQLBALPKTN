using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;

namespace Controllers
{
    [ApiController]
    [Route("api/benh-nhan")]
    [Authorize]
    public class BenhNhanController : ControllerBase
    {
        private readonly IBenhNhanService _service;

        public BenhNhanController(IBenhNhanService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả bệnh nhân
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
        /// Lấy thông tin bệnh nhân theo mã
        /// </summary>
        [HttpGet("{maBenhNhan}")]
        public async Task<IActionResult> GetById(string maBenhNhan)
        {
            try
            {
                var result = await _service.GetByIdAsync(maBenhNhan);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bệnh nhân"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tìm kiếm bệnh nhân theo mã, CCCD, số điện thoại, họ tên
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            try
            {
                var result = await _service.SearchAsync(keyword);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo bệnh nhân mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> Create([FromBody] BenhNhanCreateDTO dto)
        {
            try
            {
                var maBenhNhan = await _service.CreateAsync(dto);
                return Ok(ApiResponse<object>.SuccessResponse(new { maBenhNhan }, "Tạo bệnh nhân thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin bệnh nhân
        /// </summary>
        [HttpPut("{maBenhNhan}")]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> Update(string maBenhNhan, [FromBody] BenhNhanUpdateDTO dto)
        {
            try
            {
                dto.MaBenhNhan = maBenhNhan;
                var result = await _service.UpdateAsync(dto);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bệnh nhân"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa bệnh nhân
        /// </summary>
        [HttpDelete("{maBenhNhan}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Delete(string maBenhNhan)
        {
            try
            {
                var result = await _service.DeleteAsync(maBenhNhan);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bệnh nhân"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
