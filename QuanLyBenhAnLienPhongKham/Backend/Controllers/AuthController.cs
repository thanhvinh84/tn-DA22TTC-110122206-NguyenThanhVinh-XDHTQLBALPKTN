using Microsoft.AspNetCore.Mvc;
using DTOs;
using Services;

namespace Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Đăng nhập hệ thống
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);
                
                if (result == null)
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("Tên đăng nhập hoặc mật khẩu không đúng"));
                }

                return Ok(ApiResponse<LoginResponse>.SuccessResponse(result, "Đăng nhập thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi: {ex.Message}"));
            }
        }

        /// <summary>
        /// Lấy thông tin người dùng hiện tại
        /// </summary>
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var maTaiKhoan = User.FindFirst("MaTaiKhoan")?.Value;
            var tenNguoiDung = User.FindFirst("TenNguoiDung")?.Value;
            var maVaiTro = User.FindFirst("MaVaiTro")?.Value;

            if (string.IsNullOrEmpty(maTaiKhoan))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("Chưa đăng nhập"));
            }

            return Ok(ApiResponse<object>.SuccessResponse(new
            {
                maTaiKhoan,
                tenNguoiDung,
                maVaiTro
            }));
        }
    }
}
