using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/quyen-truy-cap-ho-so")]
    [Authorize]
    public class QuyenTruyCapHoSoController : ControllerBase
    {
        private readonly IQuyenTruyCapHoSoService _service;

        public QuyenTruyCapHoSoController(IQuyenTruyCapHoSoService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả quyền truy cập
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> GetAll([FromQuery] string? maHoSo, [FromQuery] string? maTaiKhoan)
        {
            try
            {
                var result = await _service.GetAllAsync();
                
                // Lọc theo hồ sơ
                if (!string.IsNullOrEmpty(maHoSo))
                {
                    result = result.Where(q => q.MaHoSo == maHoSo).ToList();
                }
                
                // Lọc theo tài khoản
                if (!string.IsNullOrEmpty(maTaiKhoan))
                {
                    result = result.Where(q => q.MaTaiKhoan == maTaiKhoan).ToList();
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin quyền truy cập theo mã
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy quyền truy cập"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Kiểm tra quyền truy cập hồ sơ
        /// </summary>
        [HttpGet("check")]
        public async Task<IActionResult> CheckPermission([FromQuery] string maHoSo, [FromQuery] string maTaiKhoan, [FromQuery] string loaiQuyen)
        {
            try
            {
                var hasPermission = await _service.CheckPermissionAsync(maHoSo, maTaiKhoan, loaiQuyen);
                return Ok(ApiResponse<object>.SuccessResponse(new { hasPermission }));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cấp quyền truy cập hồ sơ
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN,VT_BACSI")]
        public async Task<IActionResult> Create([FromBody] QuyenTruyCapHoSo quyen)
        {
            try
            {
                // Kiểm tra quyền đã tồn tại
                var existing = await _service.GetByHoSoAndTaiKhoanAsync(quyen.MaHoSo, quyen.MaTaiKhoan);
                if (existing != null)
                    return BadRequest(ApiResponse<object>.ErrorResponse("Quyền truy cập đã tồn tại"));
                
                var id = await _service.CreateAsync(quyen);
                return Ok(ApiResponse<object>.SuccessResponse(new { maQuyen = id }, "Cấp quyền thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật quyền truy cập
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "VT_ADMIN,VT_BACSI")]
        public async Task<IActionResult> Update(string id, [FromBody] QuyenTruyCapHoSo quyen)
        {
            try
            {
                quyen.MaQuyen = id;
                var result = await _service.UpdateAsync(quyen);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy quyền truy cập"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Thu hồi quyền truy cập
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "VT_ADMIN,VT_BACSI")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _service.DeleteAsync(id);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy quyền truy cập"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Thu hồi quyền thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách hồ sơ mà tài khoản có quyền truy cập
        /// </summary>
        [HttpGet("tai-khoan/{maTaiKhoan}/ho-so")]
        public async Task<IActionResult> GetHoSoByTaiKhoan(string maTaiKhoan)
        {
            try
            {
                var result = await _service.GetHoSoByTaiKhoanAsync(maTaiKhoan);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
