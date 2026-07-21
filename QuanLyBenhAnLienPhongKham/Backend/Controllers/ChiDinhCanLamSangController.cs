using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Services;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/chi-dinh")]
    [Authorize]
    public class ChiDinhCanLamSangController : ControllerBase
    {
        private readonly IChiDinhCanLamSangService _service;

        public ChiDinhCanLamSangController(IChiDinhCanLamSangService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy tất cả chỉ định cận lâm sàng (cho kỹ thuật viên)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "VT_KYTHUATVIEN,VT_ADMIN")]
        public async Task<IActionResult> GetAll([FromQuery] string? trangThai, [FromQuery] string? loaiDichVu)
        {
            try
            {
                var result = await _service.GetAllAsync();
                
                // Filter by trangThai if provided
                if (!string.IsNullOrEmpty(trangThai))
                {
                    result = result.Where(cd => cd.TrangThai == trangThai);
                }
                
                // Filter by loaiDichVu if provided
                if (!string.IsNullOrEmpty(loaiDichVu))
                {
                    result = result.Where(cd => cd.LoaiDichVu == loaiDichVu);
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách chỉ định của đợt khám
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
        /// Tạo chỉ định cận lâm sàng mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_BACSI,VT_ADMIN")]
        public async Task<IActionResult> Create([FromBody] ChiDinhCanLamSang chiDinh)
        {
            try
            {
                chiDinh.NgayChiDinh = DateTime.Now;
                chiDinh.TrangThai = "Chờ thực hiện";
                var maChiDinh = await _service.CreateAsync(chiDinh);
                return Ok(ApiResponse<object>.SuccessResponse(new { maChiDinh }, "Tạo chỉ định thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật trạng thái chỉ định
        /// </summary>
        [HttpPut("{maChiDinh}/trang-thai")]
        [Authorize(Roles = "VT_KYTHUATVIEN,VT_ADMIN")]
        public async Task<IActionResult> UpdateTrangThai(string maChiDinh, [FromBody] UpdateTrangThaiRequest request)
        {
            try
            {
                var result = await _service.UpdateTrangThaiAsync(maChiDinh, request.TrangThai);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy chỉ định"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật trạng thái thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
    
    public class UpdateTrangThaiRequest
    {
        public string TrangThai { get; set; } = string.Empty;
    }
}
