using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Models;
using Repositories;

namespace Controllers
{
    [ApiController]
    [Route("api/lich-su-truy-cap")]
    [Authorize]
    public class LichSuTruyCapHoSoController : ControllerBase
    {
        private readonly ILichSuTruyCapHoSoRepository _repository;

        public LichSuTruyCapHoSoController(ILichSuTruyCapHoSoRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Ghi log truy cập hồ sơ
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LichSuTruyCapHoSo lichSu)
        {
            try
            {
                // Lấy thông tin bác sĩ từ token
                var maBacSi = User.Claims.FirstOrDefault(c => c.Type == "MaNhanVien")?.Value;
                if (string.IsNullOrEmpty(maBacSi))
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được bác sĩ"));
                }

                lichSu.MaBacSi = maBacSi;
                lichSu.DiaChiIP = HttpContext.Connection.RemoteIpAddress?.ToString();
                
                var maLichSu = await _repository.CreateAsync(lichSu);
                return Ok(ApiResponse<object>.SuccessResponse(new { maLichSu }));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy lịch sử truy cập theo bệnh nhân
        /// </summary>
        [HttpGet("benh-nhan/{maBenhNhan}")]
        [Authorize(Roles = "VT_BACSI,VT_ADMIN")]
        public async Task<IActionResult> GetByBenhNhan(string maBenhNhan)
        {
            try
            {
                var result = await _repository.GetByBenhNhanAsync(maBenhNhan);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy lịch sử truy cập của bác sĩ
        /// </summary>
        [HttpGet("cua-toi")]
        [Authorize(Roles = "VT_BACSI")]
        public async Task<IActionResult> GetCuaToi([FromQuery] int? limit)
        {
            try
            {
                var maBacSi = User.Claims.FirstOrDefault(c => c.Type == "MaNhanVien")?.Value;
                if (string.IsNullOrEmpty(maBacSi))
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được bác sĩ"));
                }

                var result = await _repository.GetByBacSiAsync(maBacSi, limit);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
