using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class DanhMucThuocRepository : IDanhMucThuocRepository
    {
        private readonly string _connectionString;

        public DanhMucThuocRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<DanhMucThuoc>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<DanhMucThuoc>("SELECT * FROM DanhMucThuoc");
        }

        public async Task<DanhMucThuoc?> GetByIdAsync(string maThuoc)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<DanhMucThuoc>(
                "SELECT * FROM DanhMucThuoc WHERE MaThuoc = @MaThuoc", new { MaThuoc = maThuoc });
        }

        public async Task<bool> CreateAsync(DanhMucThuoc thuoc)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã thuốc tự động (TH001, TH002, ...)
            var maxMaSql = "SELECT TOP 1 MaThuoc FROM DanhMucThuoc ORDER BY MaThuoc DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "TH001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"TH{(number + 1):D3}";
            }
            
            thuoc.MaThuoc = newMa;
            
            var sql = "INSERT INTO DanhMucThuoc (MaThuoc, TenThuoc, CongDung) VALUES (@MaThuoc, @TenThuoc, @CongDung)";
            var result = await connection.ExecuteAsync(sql, thuoc);
            return result > 0;
        }

        public async Task<bool> UpdateAsync(DanhMucThuoc thuoc)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "UPDATE DanhMucThuoc SET TenThuoc = @TenThuoc, CongDung = @CongDung WHERE MaThuoc = @MaThuoc";
            var result = await connection.ExecuteAsync(sql, thuoc);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string maThuoc)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.ExecuteAsync(
                "DELETE FROM DanhMucThuoc WHERE MaThuoc = @MaThuoc", new { MaThuoc = maThuoc });
            return result > 0;
        }
    }
}
