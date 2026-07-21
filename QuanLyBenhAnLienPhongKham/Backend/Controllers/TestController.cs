using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DTOs;

namespace Controllers
{
    [ApiController]
    [Route("api")]
    public class TestController : ControllerBase
    {
        private readonly string _connectionString;

        public TestController(string connectionString)
        {
            _connectionString = connectionString;
        }

        /// <summary>
        /// API kiểm tra kết nối database
        /// Chạy thử: SELECT COUNT(*) FROM VaiTro
        /// </summary>
        [HttpGet("test-db")]
        public async Task<IActionResult> TestDatabase()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                // Chạy query đếm số vai trò
                using var command = new SqlCommand("SELECT COUNT(*) FROM VaiTro", connection);
                var count = (int)await command.ExecuteScalarAsync();

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    message = "Kết nối database thành công!",
                    soLuongVaiTro = count,
                    database = connection.Database,
                    server = connection.DataSource
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi kết nối database: {ex.Message}"));
            }
        }
    }
}
