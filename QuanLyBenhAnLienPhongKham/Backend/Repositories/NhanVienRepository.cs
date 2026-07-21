using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class NhanVienRepository : INhanVienRepository
    {
        private readonly string _connectionString;

        public NhanVienRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<NhanVien>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<NhanVien>("SELECT * FROM NhanVien");
        }

        public async Task<NhanVien?> GetByIdAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<NhanVien>(
                "SELECT * FROM NhanVien WHERE MaNhanVien = @Id", new { Id = id });
        }

        public async Task<NhanVien?> GetByCCCDAsync(string cccd)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<NhanVien>(
                "SELECT * FROM NhanVien WHERE CCCD = @CCCD", new { CCCD = cccd });
        }

        public async Task<string> CreateAsync(NhanVien nhanVien)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã nhân viên tự động (NV001, NV002, ...)
            var maxMaSql = "SELECT TOP 1 MaNhanVien FROM NhanVien ORDER BY MaNhanVien DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "NV001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"NV{(number + 1):D3}";
            }
            
            nhanVien.MaNhanVien = newMa;
            
            var sql = @"INSERT INTO NhanVien (MaNhanVien, MaPhongKham, HoTen, CCCD, SoDienThoai, Email, DiaChi, NgayVaoLam, ChucVu)
                       VALUES (@MaNhanVien, @MaPhongKham, @HoTen, @CCCD, @SoDienThoai, @Email, @DiaChi, @NgayVaoLam, @ChucVu)";
            await connection.ExecuteAsync(sql, nhanVien);
            return newMa;
        }

        public async Task<bool> UpdateAsync(NhanVien nhanVien)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE NhanVien 
                       SET MaPhongKham = @MaPhongKham, HoTen = @HoTen, CCCD = @CCCD, 
                           SoDienThoai = @SoDienThoai, Email = @Email, DiaChi = @DiaChi, 
                           NgayVaoLam = @NgayVaoLam, ChucVu = @ChucVu
                       WHERE MaNhanVien = @MaNhanVien";
            var result = await connection.ExecuteAsync(sql, nhanVien);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.ExecuteAsync(
                "DELETE FROM NhanVien WHERE MaNhanVien = @Id", new { Id = id });
            return result > 0;
        }
    }
}
