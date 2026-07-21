using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DTOs;

namespace Controllers
{
    [ApiController]
    [Route("api/upload")]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly long _maxFileSize = 10 * 1024 * 1024; // 10MB
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx" };

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("ket-qua")]
        public async Task<IActionResult> UploadKetQua(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Không có file nào được upload"));
                }

                // Kiểm tra kích thước file
                if (file.Length > _maxFileSize)
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("File quá lớn. Kích thước tối đa là 10MB"));
                }

                // Kiểm tra extension
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!_allowedExtensions.Contains(extension))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse($"Định dạng file không được hỗ trợ. Chỉ chấp nhận: {string.Join(", ", _allowedExtensions)}"));
                }

                // Tạo tên file unique
                var fileName = $"{Guid.NewGuid()}{extension}";
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                
                // Tạo thư mục nếu chưa tồn tại
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, fileName);

                // Lưu file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Trả về đường dẫn file
                var fileUrl = $"/uploads/{fileName}";
                
                return Ok(ApiResponse<object>.SuccessResponse(new 
                { 
                    fileName = fileName,
                    fileUrl = fileUrl,
                    originalName = file.FileName
                }, "Upload file thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi upload file: {ex.Message}"));
            }
        }

        [HttpDelete("ket-qua/{fileName}")]
        public IActionResult DeleteFile(string fileName)
        {
            try
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                var filePath = Path.Combine(uploadsFolder, fileName);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(ApiResponse<object>.SuccessResponse(null, "Xóa file thành công"));
                }

                return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy file"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse($"Lỗi xóa file: {ex.Message}"));
            }
        }
    }
}
