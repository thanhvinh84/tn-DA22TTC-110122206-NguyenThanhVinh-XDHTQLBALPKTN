namespace DTOs
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public CanhBaoDiUng? CanhBao { get; set; }

        public static ApiResponse<T> SuccessResponse(T data, string message = "Thành công")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse<T> SuccessWithWarning(T data, CanhBaoDiUng canhBao, string message = "Thành công")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                CanhBao = canhBao
            };
        }

        public static ApiResponse<T> ErrorResponse(string message)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Data = default
            };
        }
    }

    public class CanhBaoDiUng
    {
        public string TenDiUng { get; set; } = string.Empty;
        public string MucDoDiUng { get; set; } = string.Empty;
        public string? TacNhan { get; set; }
        public string? BieuHien { get; set; }
        public bool NghiemTrong { get; set; }
    }
}
