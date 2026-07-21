using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;

namespace Controllers
{
    [ApiController]
    [Route("api/nhan-vien")]
    [Authorize]
    public class NhanVienController : ControllerBase
    {
        private readonly INhanVienService _service;

        public NhanVienController(INhanVienService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả nhân viên
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
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
        /// Lấy thông tin nhân viên theo mã
        /// </summary>
        [HttpGet("{maNhanVien}")]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> GetById(string maNhanVien)
        {
            try
            {
                var result = await _service.GetByIdAsync(maNhanVien);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy nhân viên"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tìm kiếm nhân viên theo họ tên, CCCD, số điện thoại, email
        /// </summary>
        [HttpGet("search")]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
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
        /// Lấy danh sách nhân viên theo phòng khám
        /// </summary>
        [HttpGet("phong-kham/{maPhongKham}")]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> GetByPhongKham(string maPhongKham)
        {
            try
            {
                var result = await _service.GetByPhongKhamAsync(maPhongKham);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo nhân viên mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Create([FromBody] NhanVienCreateDTO dto)
        {
            try
            {
                Console.WriteLine($"=== CREATE NHAN VIEN ===");
                Console.WriteLine($"HoTen: {dto.HoTen}");
                Console.WriteLine($"LaBacSi: {dto.LaBacSi}");
                Console.WriteLine($"ChuyenKhoa: {dto.ChuyenKhoa}");
                Console.WriteLine($"ChungChiHanhNghe: {dto.ChungChiHanhNghe}");
                Console.WriteLine($"BangCap: {dto.BangCap}");
                
                var maNhanVien = await _service.CreateAsync(dto);
                return Ok(ApiResponse<object>.SuccessResponse(new { maNhanVien }, "Tạo nhân viên thành công"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                Console.WriteLine($"STACK TRACE: {ex.StackTrace}");
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin nhân viên
        /// </summary>
        [HttpPut("{maNhanVien}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Update(string maNhanVien, [FromBody] NhanVienUpdateDTO dto)
        {
            try
            {
                dto.MaNhanVien = maNhanVien;
                var result = await _service.UpdateAsync(dto);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy nhân viên"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa nhân viên
        /// </summary>
        [HttpDelete("{maNhanVien}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Delete(string maNhanVien)
        {
            try
            {
                var result = await _service.DeleteAsync(maNhanVien);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy nhân viên"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
