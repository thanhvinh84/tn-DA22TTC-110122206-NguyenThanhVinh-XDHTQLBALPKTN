using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Repositories;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/danh-muc")]
    [Authorize]
    public class DanhMucController : ControllerBase
    {
        private readonly IDanhMucBenhRepository _benhRepo;
        private readonly IDanhMucThuocRepository _thuocRepo;
        private readonly IChuyenKhoaRepository _chuyenKhoaRepo;
        private readonly IVaiTroRepository _vaiTroRepo;
        private readonly IBacSiRepository _bacSiRepo;

        public DanhMucController(
            IDanhMucBenhRepository benhRepo,
            IDanhMucThuocRepository thuocRepo,
            IChuyenKhoaRepository chuyenKhoaRepo,
            IVaiTroRepository vaiTroRepo,
            IBacSiRepository bacSiRepo)
        {
            _benhRepo = benhRepo;
            _thuocRepo = thuocRepo;
            _chuyenKhoaRepo = chuyenKhoaRepo;
            _vaiTroRepo = vaiTroRepo;
            _bacSiRepo = bacSiRepo;
        }

        /// <summary>
        /// Lấy danh sách bệnh
        /// </summary>
        [HttpGet("benh")]
        public async Task<IActionResult> GetBenh([FromQuery] string? search)
        {
            try
            {
                var result = await _benhRepo.GetAllAsync();
                
                // Lọc theo từ khóa nếu có
                if (!string.IsNullOrEmpty(search))
                {
                    result = result.Where(b => 
                        (b.MaBenh != null && b.MaBenh.Contains(search, StringComparison.OrdinalIgnoreCase)) ||
                        (b.TenBenh != null && b.TenBenh.Contains(search, StringComparison.OrdinalIgnoreCase))
                    ).ToList();
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách thuốc
        /// </summary>
        [HttpGet("thuoc")]
        public async Task<IActionResult> GetThuoc([FromQuery] string? search)
        {
            try
            {
                var result = await _thuocRepo.GetAllAsync();
                
                // Lọc theo từ khóa nếu có
                if (!string.IsNullOrEmpty(search))
                {
                    result = result.Where(t => 
                        (t.MaThuoc != null && t.MaThuoc.Contains(search, StringComparison.OrdinalIgnoreCase)) ||
                        (t.TenThuoc != null && t.TenThuoc.Contains(search, StringComparison.OrdinalIgnoreCase))
                    ).ToList();
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin thuốc theo mã
        /// </summary>
        [HttpGet("thuoc/{maThuoc}")]
        public async Task<IActionResult> GetThuocById(string maThuoc)
        {
            try
            {
                var result = await _thuocRepo.GetByIdAsync(maThuoc);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy thuốc"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách chuyên khoa
        /// </summary>
        [HttpGet("chuyen-khoa")]
        public async Task<IActionResult> GetChuyenKhoa()
        {
            try
            {
                var result = await _chuyenKhoaRepo.GetAllAsync();
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách vai trò
        /// </summary>
        [HttpGet("vai-tro")]
        public async Task<IActionResult> GetVaiTro()
        {
            try
            {
                var result = await _vaiTroRepo.GetAllAsync();
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách bác sĩ
        /// </summary>
        [HttpGet("bac-si")]
        public async Task<IActionResult> GetBacSi()
        {
            try
            {
                var result = await _bacSiRepo.GetAllAsync();
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo thuốc mới
        /// </summary>
        [HttpPost("thuoc")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> CreateThuoc([FromBody] DanhMucThuoc thuoc)
        {
            try
            {
                var result = await _thuocRepo.CreateAsync(thuoc);
                if (!result)
                    return BadRequest(ApiResponse<object>.ErrorResponse("Tạo thuốc thất bại"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Tạo thuốc thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo bệnh mới
        /// </summary>
        [HttpPost("benh")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> CreateBenh([FromBody] DanhMucBenh benh)
        {
            try
            {
                var result = await _benhRepo.CreateAsync(benh);
                if (!result)
                    return BadRequest(ApiResponse<object>.ErrorResponse("Tạo bệnh thất bại"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Tạo bệnh thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin bệnh theo mã
        /// </summary>
        [HttpGet("benh/{maBenh}")]
        public async Task<IActionResult> GetBenhById(string maBenh)
        {
            try
            {
                var result = await _benhRepo.GetByIdAsync(maBenh);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bệnh"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin bệnh
        /// </summary>
        [HttpPut("benh/{maBenh}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> UpdateBenh(string maBenh, [FromBody] DanhMucBenh benh)
        {
            try
            {
                benh.MaBenh = maBenh;
                var result = await _benhRepo.UpdateAsync(benh);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bệnh"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa bệnh
        /// </summary>
        [HttpDelete("benh/{maBenh}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> DeleteBenh(string maBenh)
        {
            try
            {
                var result = await _benhRepo.DeleteAsync(maBenh);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bệnh"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin thuốc
        /// </summary>
        [HttpPut("thuoc/{maThuoc}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> UpdateThuoc(string maThuoc, [FromBody] DanhMucThuoc thuoc)
        {
            try
            {
                thuoc.MaThuoc = maThuoc;
                var result = await _thuocRepo.UpdateAsync(thuoc);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy thuốc"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa thuốc
        /// </summary>
        [HttpDelete("thuoc/{maThuoc}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> DeleteThuoc(string maThuoc)
        {
            try
            {
                var result = await _thuocRepo.DeleteAsync(maThuoc);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy thuốc"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
