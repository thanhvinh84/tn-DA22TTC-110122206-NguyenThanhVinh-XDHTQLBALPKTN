namespace DTOs
{
    public class ChangePasswordDTO
    {
        public string MatKhauCu { get; set; } = string.Empty;
        public string MatKhauMoi { get; set; } = string.Empty;
    }

    public class UpdateStatusDTO
    {
        public bool TrangThai { get; set; }
    }
}
