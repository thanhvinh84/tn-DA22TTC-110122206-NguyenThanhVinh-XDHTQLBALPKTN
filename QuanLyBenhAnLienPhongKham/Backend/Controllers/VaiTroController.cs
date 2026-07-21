using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;

namespace Controllers
{
    [ApiController]
    [Route("api/vai-tro")]
    [Authorize]
    public class VaiTroController : ControllerBase
    {
        private readonly IVaiTroService _service;

        public VaiTroController(IVaiTroService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả vai trò
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
        /// Lấy thông tin vai trò theo mã
        /// </summary>
        [HttpGet("{maVaiTro}")]
        public async Task<IActionResult> GetById(string maVaiTro)
        {
            try
            {
                var result = await _service.GetByIdAsync(maVaiTro);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy vai trò"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
