using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;
using Repositories;

namespace Controllers
{
    [ApiController]
    [Route("api/chi-so-su-song")]
    [Authorize]
    public class ChiSoSuSongController : ControllerBase
    {
        private readonly IChiSoSuSongRepository _repository;

        public ChiSoSuSongController(IChiSoSuSongRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Lấy chỉ số sống theo đợt khám
        /// </summary>
        [HttpGet("dot-kham/{maDotKham}")]
        public async Task<IActionResult> GetByDotKham(string maDotKham)
        {
            try
            {
                var result = await _repository.GetByDotKhamAsync(maDotKham);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo/cập nhật chỉ số sống
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_BACSI,VT_LETAN,VT_ADMIN")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] ChiSoSuSong chiSo)
        {
            try
            {
                // Kiểm tra đã có chỉ số chưa
                var existing = await _repository.GetByDotKhamAsync(chiSo.MaDotKham);
                
                if (existing != null)
                {
                    chiSo.MaChiSo = existing.MaChiSo;
                    await _repository.UpdateAsync(chiSo);
                    return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật chỉ số sống thành công"));
                }
                else
                {
                    var maChiSo = await _repository.CreateAsync(chiSo);
                    return Ok(ApiResponse<object>.SuccessResponse(new { maChiSo }, "Tạo chỉ số sống thành công"));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
