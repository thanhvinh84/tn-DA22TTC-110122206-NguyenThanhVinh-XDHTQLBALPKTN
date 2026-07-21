using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Models;
using Repositories;

namespace Controllers
{
    [ApiController]
    [Route("api/yeu-cau-truy-cap")]
    [Authorize]
    public class YeuCauTruyCapHoSoController : ControllerBase
    {
        private readonly IYeuCauTruyCapHoSoRepository _repository;
        private readonly ILichSuTruyCapHoSoRepository _lichSuRepository;

        public YeuCauTruyCapHoSoController(
            IYeuCauTruyCapHoSoRepository repository,
            ILichSuTruyCapHoSoRepository lichSuRepository)
        {
            _repository = repository;
            _lichSuRepository = lichSuRepository;
        }

        /// <summary>
        /// Tạo yêu cầu truy cập hồ sơ
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_BACSI")]
        public async Task<IActionResult> Create([FromBody] YeuCauTruyCapHoSo yeuCau)
        {
            try
            {
                // Lấy thông tin bác sĩ từ token
                var maBacSi = User.Claims.FirstOrDefault(c => c.Type == "MaNhanVien")?.Value;
                if (string.IsNullOrEmpty(maBacSi))
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được bác sĩ"));
                }

                yeuCau.MaBacSiYeuCau = maBacSi;
                
                var maYeuCau = await _repository.CreateAsync(yeuCau);
                return Ok(ApiResponse<object>.SuccessResponse(new { maYeuCau }, "Gửi yêu cầu thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách yêu cầu đã gửi của bác sĩ
        /// </summary>
        [HttpGet("da-gui")]
        [Authorize(Roles = "VT_BACSI")]
        public async Task<IActionResult> GetDaGui()
        {
            try
            {
                var maBacSi = User.Claims.FirstOrDefault(c => c.Type == "MaNhanVien")?.Value;
                if (string.IsNullOrEmpty(maBacSi))
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được bác sĩ"));
                }

                var result = await _repository.GetByBacSiYeuCauAsync(maBacSi);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy danh sách yêu cầu chờ duyệt (bác sĩ nhận được)
        /// </summary>
        [HttpGet("cho-duyet")]
        [Authorize(Roles = "VT_BACSI")]
        public async Task<IActionResult> GetChoDuyet()
        {
            try
            {
                var maBacSi = User.Claims.FirstOrDefault(c => c.Type == "MaNhanVien")?.Value;
                if (string.IsNullOrEmpty(maBacSi))
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được bác sĩ"));
                }

                var result = await _repository.GetByBacSiDuocYeuCauAsync(maBacSi);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Chấp nhận yêu cầu
        /// </summary>
        [HttpPost("{maYeuCau}/chap-nhan")]
        [Authorize(Roles = "VT_BACSI")]
        public async Task<IActionResult> ChapNhan(string maYeuCau, [FromBody] ChapNhanYeuCauDTO request)
        {
            try
            {
                var ngayHetHan = DateTime.Now.AddDays(request.SoNgayHetHan);
                var result = await _repository.ChapNhanYeuCauAsync(maYeuCau, request.LoaiQuyen, ngayHetHan);
                
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy yêu cầu"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Chấp nhận yêu cầu thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Từ chối yêu cầu
        /// </summary>
        [HttpPost("{maYeuCau}/tu-choi")]
        [Authorize(Roles = "VT_BACSI")]
        public async Task<IActionResult> TuChoi(string maYeuCau, [FromBody] TuChoiYeuCauDTO request)
        {
            try
            {
                var result = await _repository.TuChoiYeuCauAsync(maYeuCau, request.LyDoTuChoi ?? "");
                
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
        /// Kiểm tra quyền truy cập hồ sơ
        /// </summary>
        [HttpGet("kiem-tra-quyen")]
        [Authorize(Roles = "VT_BACSI")]
        public async Task<IActionResult> KiemTraQuyen([FromQuery] string maBenhNhan, [FromQuery] string maPhongKham)
        {
            try
            {
                var maBacSi = User.Claims.FirstOrDefault(c => c.Type == "MaNhanVien")?.Value;
                if (string.IsNullOrEmpty(maBacSi))
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được bác sĩ"));
                }

                var result = await _repository.KiemTraQuyenTruyCapAsync(maBacSi, maBenhNhan, maPhongKham);
                
                if (result == null)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(new { coQuyen = false }));
                }
                
                return Ok(ApiResponse<object>.SuccessResponse(new { 
                    coQuyen = true, 
                    loaiQuyen = result.LoaiQuyen,
                    ngayHetHan = result.NgayHetHan
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
