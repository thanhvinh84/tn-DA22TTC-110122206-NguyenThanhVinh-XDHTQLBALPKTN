using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;

namespace Controllers
{
    [ApiController]
    [Route("api/dot-kham")]
    [Authorize]
    public class DotKhamController : ControllerBase
    {
        private readonly IDotKhamService _service;

        public DotKhamController(IDotKhamService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả đợt khám
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
        /// Lấy thông tin đợt khám theo mã
        /// </summary>
        [HttpGet("{maDotKham}")]
        public async Task<IActionResult> GetById(string maDotKham)
        {
            try
            {
                var result = await _service.GetByIdAsync(maDotKham);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy đợt khám"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách bệnh nhân chờ khám của bác sĩ
        /// </summary>
        [HttpGet("bac-si/{maBacSi}")]
        [Authorize(Roles = "VT_BACSI,VT_ADMIN")]
        public async Task<IActionResult> GetByBacSi(string maBacSi, [FromQuery] string? trangThai)
        {
            try
            {
                var result = await _service.GetByBacSiAsync(maBacSi, trangThai);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách đợt khám theo hồ sơ bệnh án
        /// </summary>
        [HttpGet("ho-so/{maHoSo}")]
        public async Task<IActionResult> GetByHoSo(string maHoSo)
        {
            try
            {
                var result = await _service.GetByHoSoAsync(maHoSo);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách đợt khám theo mã bệnh nhân
        /// </summary>
        [HttpGet("benh-nhan/{maBenhNhan}")]
        public async Task<IActionResult> GetByBenhNhan(string maBenhNhan)
        {
            try
            {
                var result = await _service.GetByBenhNhanAsync(maBenhNhan);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo lượt khám mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> Create([FromBody] DotKhamCreateDTO dto)
        {
            try
            {
                var maDotKham = await _service.CreateAsync(dto);
                return Ok(ApiResponse<object>.SuccessResponse(new { maDotKham }, "Tạo lượt khám thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin đợt khám
        /// </summary>
        [HttpPut("{maDotKham}")]
        public async Task<IActionResult> Update(string maDotKham, [FromBody] DotKhamUpdateDTO dto)
        {
            try
            {
                dto.MaDotKham = maDotKham;
                var result = await _service.UpdateAsync(dto);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy đợt khám"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật trạng thái đợt khám
        /// </summary>
        [HttpPut("{maDotKham}/trang-thai")]
        public async Task<IActionResult> UpdateTrangThai(string maDotKham, [FromBody] UpdateTrangThaiDTO dto)
        {
            try
            {
                var result = await _service.UpdateTrangThaiAsync(maDotKham, dto.TrangThai);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy đợt khám"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật trạng thái thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
