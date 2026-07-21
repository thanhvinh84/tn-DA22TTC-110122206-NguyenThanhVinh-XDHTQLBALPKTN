using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class DanhMucBenhRepository : IDanhMucBenhRepository
    {
        private readonly string _connectionString;

        public DanhMucBenhRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<DanhMucBenh>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<DanhMucBenh>("SELECT * FROM DanhMucBenh");
        }

        public async Task<DanhMucBenh?> GetByIdAsync(string maBenh)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<DanhMucBenh>(
                "SELECT * FROM DanhMucBenh WHERE MaBenh = @MaBenh", new { MaBenh = maBenh });
        }

        public async Task<bool> CreateAsync(DanhMucBenh benh)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã bệnh tự động (DB001, DB002, ...)
            var maxMaSql = "SELECT TOP 1 MaBenh FROM DanhMucBenh ORDER BY MaBenh DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "DB001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"DB{(number + 1):D3}";
            }
            
            benh.MaBenh = newMa;
            
            var sql = "INSERT INTO DanhMucBenh (MaBenh, TenBenh) VALUES (@MaBenh, @TenBenh)";
            var result = await connection.ExecuteAsync(sql, benh);
            return result > 0;
        }

        public async Task<bool> UpdateAsync(DanhMucBenh benh)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "UPDATE DanhMucBenh SET TenBenh = @TenBenh WHERE MaBenh = @MaBenh";
            var result = await connection.ExecuteAsync(sql, benh);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string maBenh)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.ExecuteAsync(
                "DELETE FROM DanhMucBenh WHERE MaBenh = @MaBenh", new { MaBenh = maBenh });
            return result > 0;
        }
    }
}
