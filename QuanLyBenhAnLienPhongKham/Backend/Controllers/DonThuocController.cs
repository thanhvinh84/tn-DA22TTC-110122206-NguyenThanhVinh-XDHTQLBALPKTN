using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/don-thuoc")]
    [Authorize]
    public class DonThuocController : ControllerBase
    {
        private readonly IDonThuocService _service;

        public DonThuocController(IDonThuocService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy đơn thuốc theo đợt khám
        /// </summary>
        [HttpGet("dot-kham/{maDotKham}")]
        public async Task<IActionResult> GetByDotKham(string maDotKham)
        {
            try
            {
                var donThuoc = await _service.GetByDotKhamAsync(maDotKham);
                if (donThuoc == null)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(new List<object>()));
                }
                
                // Load chi tiết đơn thuốc
                var chiTiet = await _service.GetChiTietAsync(donThuoc.MaDonThuoc);
                
                // Trả về mảng với 1 đơn thuốc (để frontend dễ xử lý)
                var result = new[]
                {
                    new
                    {
                        donThuoc.MaDonThuoc,
                        donThuoc.MaDotKham,
                        donThuoc.MaBacSi,
                        donThuoc.NgayLap,
                        donThuoc.HoTenBacSi,
                        donThuoc.MaBenhNhan,
                        donThuoc.HoTenBenhNhan,
                        ChiTiet = chiTiet
                    }
                };
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Tạo đơn thuốc mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_BACSI,VT_ADMIN")]
        public async Task<IActionResult> Create([FromBody] DonThuoc donThuoc)
        {
            try
            {
                donThuoc.NgayLap = DateTime.Now;
                var maDonThuoc = await _service.CreateAsync(donThuoc);
                return Ok(ApiResponse<object>.SuccessResponse(new { maDonThuoc }, "Tạo đơn thuốc thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy chi tiết đơn thuốc
        /// </summary>
        [HttpGet("{maDonThuoc}/chi-tiet")]
        public async Task<IActionResult> GetChiTiet(string maDonThuoc)
        {
            try
            {
                var result = await _service.GetChiTietAsync(maDonThuoc);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Thêm thuốc vào đơn
        /// </summary>
        [HttpPost("{maDonThuoc}/chi-tiet")]
        [Authorize(Roles = "VT_BACSI,VT_ADMIN")]
        public async Task<IActionResult> AddChiTiet(string maDonThuoc, [FromBody] ChiTietDonThuoc chiTiet)
        {
            try
            {
                chiTiet.MaDonThuoc = maDonThuoc;
                
                // Kiểm tra dị ứng
                var canhBao = await _service.KiemTraDiUngAsync(maDonThuoc, chiTiet.MaThuoc);
                
                // Nếu nghiêm trọng, không cho phép thêm thuốc
                if (canhBao != null && canhBao.NghiemTrong)
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse(
                        $"CẢNH BÁO NGHIÊM TRỌNG: Bệnh nhân dị ứng với thuốc này! " +
                        $"Tên dị ứng: {canhBao.TenDiUng}. " +
                        $"Mức độ: {canhBao.MucDoDiUng}. " +
                        (string.IsNullOrEmpty(canhBao.BieuHien) ? "" : $"Biểu hiện: {canhBao.BieuHien}. ") +
                        "Không thể kê đơn thuốc này!"
                    ));
                }
                
                // Thêm thuốc vào đơn
                var result = await _service.AddChiTietAsync(chiTiet);
                if (!result)
                    return BadRequest(ApiResponse<object>.ErrorResponse("Thêm thuốc thất bại"));
                
                // Nếu có cảnh báo nhưng không nghiêm trọng
                if (canhBao != null)
                {
                    return Ok(ApiResponse<object>.SuccessWithWarning(
                        null, 
                        canhBao, 
                        "Thêm thuốc thành công nhưng có cảnh báo dị ứng"
                    ));
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Thêm thuốc thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Xóa thuốc khỏi đơn
        /// </summary>
        [HttpDelete("{maDonThuoc}/chi-tiet/{maThuoc}")]
        [Authorize(Roles = "VT_BACSI,VT_ADMIN")]
        public async Task<IActionResult> DeleteChiTiet(string maDonThuoc, string maThuoc)
        {
            try
            {
                var result = await _service.DeleteChiTietAsync(maDonThuoc, maThuoc);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy thuốc trong đơn"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa thuốc thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
