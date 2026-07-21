using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;

namespace Controllers
{
    [ApiController]
    [Route("api/ho-so")]
    [Authorize]
    public class HoSoBenhAnController : ControllerBase
    {
        private readonly IHoSoBenhAnService _service;

        public HoSoBenhAnController(IHoSoBenhAnService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy hồ sơ bệnh án theo mã hồ sơ
        /// </summary>
        [HttpGet("{maHoSo}")]
        public async Task<IActionResult> GetById(string maHoSo)
        {
            try
            {
                var result = await _service.GetByIdAsync(maHoSo);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy hồ sơ"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy hồ sơ bệnh án theo mã bệnh nhân
        /// </summary>
        [HttpGet("by-benh-nhan/{maBenhNhan}")]
        public async Task<IActionResult> GetByMaBenhNhan(string maBenhNhan)
        {
            try
            {
                var result = await _service.GetByMaBenhNhanAsync(maBenhNhan);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy hồ sơ"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo hồ sơ bệnh án mới cho bệnh nhân
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> Create([FromBody] dynamic data)
        {
            try
            {
                string maBenhNhan = data.maBenhNhan;
                var maHoSo = await _service.CreateAsync(maBenhNhan);
                return Ok(ApiResponse<object>.SuccessResponse(new { maHoSo }, "Tạo hồ sơ thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin hồ sơ bệnh án (nhóm máu, tiền sử bệnh, ghi chú)
        /// </summary>
        [HttpPut("{maHoSo}")]
        [Authorize(Roles = "VT_ADMIN,VT_BACSI,VT_LETAN")]
        public async Task<IActionResult> Update(string maHoSo, [FromBody] Models.HoSoBenhAn hoSo)
        {
            try
            {
                hoSo.MaHoSo = maHoSo;
                var result = await _service.UpdateAsync(hoSo);
                
                if (result)
                    return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật hồ sơ thành công"));
                else
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy hồ sơ"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy lịch sử khám bệnh của hồ sơ
        /// </summary>
        [HttpGet("{maHoSo}/lich-su-kham")]
        public async Task<IActionResult> GetLichSuKham(string maHoSo)
        {
            try
            {
                var result = await _service.GetLichSuKhamAsync(maHoSo);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
