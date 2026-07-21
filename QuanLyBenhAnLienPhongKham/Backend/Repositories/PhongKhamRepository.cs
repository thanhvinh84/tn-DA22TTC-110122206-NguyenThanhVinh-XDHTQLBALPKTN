using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class PhongKhamRepository : IPhongKhamRepository
    {
        private readonly string _connectionString;

        public PhongKhamRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<PhongKham>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM PhongKham";
            return await connection.QueryAsync<PhongKham>(sql);
        }

        public async Task<PhongKham?> GetByIdAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM PhongKham WHERE MaPhongKham = @Id";
            return await connection.QueryFirstOrDefaultAsync<PhongKham>(sql, new { Id = id });
        }

        public async Task<string> CreateAsync(PhongKham phongKham)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã phòng khám tự động
            var maxIdSql = "SELECT TOP 1 MaPhongKham FROM PhongKham ORDER BY MaPhongKham DESC";
            var maxId = await connection.QueryFirstOrDefaultAsync<string>(maxIdSql);
            
            int nextNumber = 1;
            if (!string.IsNullOrEmpty(maxId) && maxId.StartsWith("PK"))
            {
                if (int.TryParse(maxId.Substring(2), out int currentNumber))
                {
                    nextNumber = currentNumber + 1;
                }
            }
            
            phongKham.MaPhongKham = $"PK{nextNumber:D3}";
            
            var sql = @"INSERT INTO PhongKham (MaPhongKham, TenPhongKham, DiaChi, SoDienThoai, Email, TrangThaiLienKet)
                       VALUES (@MaPhongKham, @TenPhongKham, @DiaChi, @SoDienThoai, @Email, @TrangThaiLienKet)";
            await connection.ExecuteAsync(sql, phongKham);
            return phongKham.MaPhongKham;
        }

        public async Task<bool> UpdateAsync(PhongKham phongKham)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE PhongKham 
                       SET TenPhongKham = @TenPhongKham, 
                           DiaChi = @DiaChi, 
                           SoDienThoai = @SoDienThoai, 
                           Email = @Email, 
                           TrangThaiLienKet = @TrangThaiLienKet
                       WHERE MaPhongKham = @MaPhongKham";
            var result = await connection.ExecuteAsync(sql, phongKham);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "DELETE FROM PhongKham WHERE MaPhongKham = @Id";
            var result = await connection.ExecuteAsync(sql, new { Id = id });
            return result > 0;
        }
    }
}
