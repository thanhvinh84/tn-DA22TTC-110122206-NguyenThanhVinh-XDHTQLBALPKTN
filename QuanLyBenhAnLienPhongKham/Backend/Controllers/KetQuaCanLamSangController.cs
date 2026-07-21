using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;
using Models;
using Repositories;

namespace Controllers
{
    [ApiController]
    [Route("api/ket-qua")]
    [Authorize]
    public class KetQuaCanLamSangController : ControllerBase
    {
        private readonly IKetQuaCanLamSangRepository _repository;
        private readonly IChiDinhCanLamSangRepository _chiDinhRepository;
        private readonly string _connectionString;

        public KetQuaCanLamSangController(
            IKetQuaCanLamSangRepository repository,
            IChiDinhCanLamSangRepository chiDinhRepository,
            string connectionString)
        {
            _repository = repository;
            _chiDinhRepository = chiDinhRepository;
            _connectionString = connectionString;
        }

        /// <summary>
        /// Lấy kết quả theo chỉ định
        /// </summary>
        [HttpGet("chi-dinh/{maChiDinh}")]
        public async Task<IActionResult> GetByChiDinh(string maChiDinh)
        {
            try
            {
                var result = await _repository.GetByChiDinhAsync(maChiDinh);
                return Ok(ApiResponse<object>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy kết quả theo đợt khám
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
        /// Tạo kết quả cận lâm sàng
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "VT_KYTHUATVIEN,VT_ADMIN")]
        public async Task<IActionResult> Create([FromBody] KetQuaCanLamSang ketQua)
        {
            try
            {
                // Lấy thông tin chỉ định để lấy MaHoSo
                var chiDinh = await _chiDinhRepository.GetByIdAsync(ketQua.MaChiDinh);
                if (chiDinh == null)
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Không tìm thấy chỉ định"));
                }
                
                // Lấy MaHoSo từ DotKham
                using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
                var sql = "SELECT MaHoSo FROM DotKham WHERE MaDotKham = @MaDotKham";
                var maHoSo = await Dapper.SqlMapper.QueryFirstOrDefaultAsync<string>(connection, sql, new { MaDotKham = chiDinh.MaDotKham });
                
                if (string.IsNullOrEmpty(maHoSo))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Không tìm thấy hồ sơ bệnh án"));
                }
                
                ketQua.MaHoSo = maHoSo;
                ketQua.NgayCoKetQua = DateTime.Now;
                
                // Lấy mã kỹ thuật viên từ token
                var user = User.Claims.FirstOrDefault(c => c.Type == "MaNhanVien");
                if (user != null)
                {
                    ketQua.MaKyThuatVien = user.Value;
                }
                
                var maKetQua = await _repository.CreateAsync(ketQua);
                return Ok(ApiResponse<object>.SuccessResponse(new { maKetQua }, "Tạo kết quả thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cập nhật kết quả
        /// </summary>
        [HttpPut("{maKetQua}")]
        [Authorize(Roles = "VT_KYTHUATVIEN,VT_ADMIN")]
        public async Task<IActionResult> Update(string maKetQua, [FromBody] KetQuaCanLamSang ketQua)
        {
            try
            {
                ketQua.MaKetQua = maKetQua;
                ketQua.NgayCoKetQua = DateTime.Now;
                var result = await _repository.UpdateAsync(ketQua);
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy kết quả"));
                
                return Ok(ApiResponse<object>.SuccessResponse(null, "Cập nhật thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }
    }
}
