using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class ChuyenKhoaRepository : IChuyenKhoaRepository
    {
        private readonly string _connectionString;

        public ChuyenKhoaRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ChuyenKhoa>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<ChuyenKhoa>("SELECT * FROM ChuyenKhoa");
        }

        public async Task<ChuyenKhoa?> GetByIdAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<ChuyenKhoa>(
                "SELECT * FROM ChuyenKhoa WHERE MaChuyenKhoa = @Id", new { Id = id });
        }

        public async Task<string> CreateAsync(ChuyenKhoa chuyenKhoa)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã chuyên khoa tự động (CK001, CK002, ...)
            var maxMaSql = "SELECT TOP 1 MaChuyenKhoa FROM ChuyenKhoa ORDER BY MaChuyenKhoa DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "CK001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"CK{(number + 1):D3}";
            }
            
            chuyenKhoa.MaChuyenKhoa = newMa;
            
            var sql = @"INSERT INTO ChuyenKhoa (MaChuyenKhoa, TenChuyenKhoa, MoTa)
                       VALUES (@MaChuyenKhoa, @TenChuyenKhoa, @MoTa)";
            await connection.ExecuteAsync(sql, chuyenKhoa);
            return newMa;
        }

        public async Task<bool> UpdateAsync(ChuyenKhoa chuyenKhoa)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE ChuyenKhoa 
                       SET TenChuyenKhoa = @TenChuyenKhoa, MoTa = @MoTa
                       WHERE MaChuyenKhoa = @MaChuyenKhoa";
            var result = await connection.ExecuteAsync(sql, chuyenKhoa);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.ExecuteAsync(
                "DELETE FROM ChuyenKhoa WHERE MaChuyenKhoa = @Id", new { Id = id });
            return result > 0;
        }
    }
}
