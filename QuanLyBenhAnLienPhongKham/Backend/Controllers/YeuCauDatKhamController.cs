using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Models;
using Repositories;

namespace Controllers
{
    [ApiController]
    [Route("api/yeu-cau-dat-kham")]
    [Authorize]
    public class YeuCauDatKhamController : ControllerBase
    {
        private readonly IYeuCauDatKhamRepository _repository;

        public YeuCauDatKhamController(IYeuCauDatKhamRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Bệnh nhân tạo yêu cầu đặt khám
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_BENHNHAN")]
        public async Task<IActionResult> Create([FromBody] YeuCauDatKham yeuCau)
        {
            try
            {
                // Lấy mã bệnh nhân từ token
                var maBenhNhan = User.Claims.FirstOrDefault(c => c.Type == "MaBenhNhan")?.Value;
                if (string.IsNullOrEmpty(maBenhNhan))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Không tìm thấy thông tin bệnh nhân"));
                }

                yeuCau.MaBenhNhan = maBenhNhan;
                yeuCau.TrangThai = "Chờ xác nhận";
                yeuCau.NgayTao = DateTime.Now;

                // Validate thời gian đặt phải trong tương lai
                if (yeuCau.ThoiGianMongMuon <= DateTime.Now)
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Thời gian đặt khám phải trong tương lai"));
                }

                var maYeuCau = await _repository.CreateAsync(yeuCau);
                return Ok(ApiResponse<object>.SuccessResponse(new { maYeuCau }, "Tạo yêu cầu đặt khám thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách yêu cầu của bệnh nhân (cho bệnh nhân xem)
        /// </summary>
        [HttpGet("benh-nhan")]
        [Authorize(Roles = "VT_BENHNHAN")]
        public async Task<IActionResult> GetByBenhNhan()
        {
            try
            {
                var maBenhNhan = User.Claims.FirstOrDefault(c => c.Type == "MaBenhNhan")?.Value;
                if (string.IsNullOrEmpty(maBenhNhan))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Không tìm thấy thông tin bệnh nhân"));
                }

                var result = await _repository.GetByBenhNhanAsync(maBenhNhan);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy tất cả yêu cầu (cho lễ tân)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "VT_LETAN,VT_ADMIN")]
        public async Task<IActionResult> GetAll([FromQuery] string? trangThai)
        {
            try
            {
                IEnumerable<YeuCauDatKham> result;
                
                if (!string.IsNullOrEmpty(trangThai))
                {
                    result = await _repository.GetByTrangThaiAsync(trangThai);
                }
                else
                {
                    result = await _repository.GetAllAsync();
                }

                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy chi tiết yêu cầu
        /// </summary>
        [HttpGet("{maYeuCau}")]
        public async Task<IActionResult> GetById(string maYeuCau)
        {
            try
            {
                var result = await _repository.GetByIdAsync(maYeuCau);
                if (result == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy yêu cầu"));

                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lễ tân xác nhận yêu cầu
        /// </summary>
        [HttpPut("{maYeuCau}/xac-nhan")]
        [Authorize(Roles = "VT_LETAN,VT_ADMIN")]
        public async Task<IActionResult> XacNhan(string maYeuCau, [FromBody] XacNhanYeuCauDto dto)
        {
            try
            {
                var maNhanVien = User.Claims.FirstOrDefault(c => c.Type == "MaNhanVien")?.Value;
                if (string.IsNullOrEmpty(maNhanVien))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Không tìm thấy thông tin nhân viên"));
                }

                var result = await _repository.XacNhanAsync(maYeuCau, maNhanVien, dto.MaPhongKham);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy yêu cầu"));

                return Ok(ApiResponse<object>.SuccessResponse(null, "Xác nhận yêu cầu thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lễ tân từ chối yêu cầu
        /// </summary>
        [HttpPut("{maYeuCau}/tu-choi")]
        [Authorize(Roles = "VT_LETAN,VT_ADMIN")]
        public async Task<IActionResult> TuChoi(string maYeuCau, [FromBody] TuChoiYeuCauDto dto)
        {
            try
            {
                var maNhanVien = User.Claims.FirstOrDefault(c => c.Type == "MaNhanVien")?.Value;
                if (string.IsNullOrEmpty(maNhanVien))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Không tìm thấy thông tin nhân viên"));
                }

                var result = await _repository.TuChoiAsync(maYeuCau, maNhanVien, dto.LyDoTuChoi);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy yêu cầu"));

                return Ok(ApiResponse<object>.SuccessResponse(null, "Từ chối yêu cầu thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Bệnh nhân hủy yêu cầu
        /// </summary>
        [HttpPut("{maYeuCau}/huy")]
        [Authorize(Roles = "VT_BENHNHAN")]
        public async Task<IActionResult> Huy(string maYeuCau)
        {
            try
            {
                // Kiểm tra yêu cầu có thuộc về bệnh nhân này không
                var yeuCau = await _repository.GetByIdAsync(maYeuCau);
                if (yeuCau == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy yêu cầu"));

                var maBenhNhan = User.Claims.FirstOrDefault(c => c.Type == "MaBenhNhan")?.Value;
                if (yeuCau.MaBenhNhan != maBenhNhan)
                {
                    return Forbid();
                }

                // Chỉ cho phép hủy nếu đang chờ xác nhận
                if (yeuCau.TrangThai != "Chờ xác nhận")
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Chỉ có thể hủy yêu cầu đang chờ xác nhận"));
                }

                var result = await _repository.HuyAsync(maYeuCau);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không thể hủy yêu cầu"));

                return Ok(ApiResponse<object>.SuccessResponse(null, "Hủy yêu cầu thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật mã đợt khám sau khi tạo đợt khám
        /// </summary>
        [HttpPut("{maYeuCau}/dot-kham")]
        [Authorize(Roles = "VT_LETAN,VT_ADMIN")]
        public async Task<IActionResult> UpdateMaDotKham(string maYeuCau, [FromBody] UpdateDotKhamDto dto)
        {
            try
            {
                var result = await _repository.UpdateMaDotKhamAsync(maYeuCau, dto.MaDotKham);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy yêu cầu"));

                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật đợt khám thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Đếm số yêu cầu theo trạng thái
        /// </summary>
        [HttpGet("thong-ke/count")]
        [Authorize(Roles = "VT_LETAN,VT_ADMIN")]
        public async Task<IActionResult> CountByTrangThai([FromQuery] string trangThai)
        {
            try
            {
                var count = await _repository.CountByTrangThaiAsync(trangThai);
                return Ok(ApiResponse<object>.SuccessResponse(new { count }));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }

    // DTOs
    public class XacNhanYeuCauDto
    {
        public string? MaPhongKham { get; set; }
    }

    public class TuChoiYeuCauDto
    {
        public string LyDoTuChoi { get; set; } = string.Empty;
    }

    public class UpdateDotKhamDto
    {
        public string MaDotKham { get; set; } = string.Empty;
    }
}
