using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/hoa-don")]
    [Authorize]
    public class HoaDonController : ControllerBase
    {
        private readonly IHoaDonService _service;

        public HoaDonController(IHoaDonService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy danh sách tất cả hóa đơn
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> GetAll([FromQuery] string? trangThai, [FromQuery] DateTime? tuNgay, [FromQuery] DateTime? denNgay)
        {
            try
            {
                var result = await _service.GetAllAsync();
                
                // Lọc theo trạng thái
                if (!string.IsNullOrWhiteSpace(trangThai))
                {
                    result = result.Where(hd => hd.TrangThai == trangThai).ToList();
                }
                
                // Lọc theo ngày
                if (tuNgay.HasValue)
                {
                    result = result.Where(hd => hd.NgayLap >= tuNgay.Value).ToList();
                }
                if (denNgay.HasValue)
                {
                    result = result.Where(hd => hd.NgayLap <= denNgay.Value).ToList();
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin hóa đơn theo mã
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy hóa đơn"));
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy hóa đơn theo đợt khám
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
        /// Tạo hóa đơn mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> Create([FromBody] HoaDon hoaDon)
        {
            try
            {
                var id = await _service.CreateAsync(hoaDon);
                return Ok(ApiResponse<object>.SuccessResponse(new { maHoaDon = id }, "Tạo hóa đơn thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật thông tin hóa đơn
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> Update(string id, [FromBody] HoaDon hoaDon)
        {
            try
            {
                hoaDon.MaHoaDon = id;
                var result = await _service.UpdateAsync(hoaDon);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy hóa đơn"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Thanh toán hóa đơn
        /// </summary>
        [HttpPut("{id}/thanh-toan")]
        [Authorize(Roles = "VT_ADMIN,VT_LETAN")]
        public async Task<IActionResult> ThanhToan(string id)
        {
            try
            {
                var result = await _service.ThanhToanAsync(id);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy hóa đơn hoặc hóa đơn đã thanh toán"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Thanh toán thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Hủy hóa đơn
        /// </summary>
        [HttpPut("{id}/huy")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Huy(string id, [FromBody] HuyHoaDonDTO dto)
        {
            try
            {
                var result = await _service.HuyAsync(id, dto.LyDo);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy hóa đơn hoặc hóa đơn đã thanh toán"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Hủy hóa đơn thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa hóa đơn
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _service.DeleteAsync(id);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy hóa đơn"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Thống kê doanh thu
        /// </summary>
        [HttpGet("thong-ke/doanh-thu")]
        [Authorize(Roles = "VT_ADMIN")]
        public async Task<IActionResult> ThongKeDoanhThu([FromQuery] DateTime? tuNgay, [FromQuery] DateTime? denNgay)
        {
            try
            {
                var result = await _service.ThongKeDoanhThuAsync(tuNgay, denNgay);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
