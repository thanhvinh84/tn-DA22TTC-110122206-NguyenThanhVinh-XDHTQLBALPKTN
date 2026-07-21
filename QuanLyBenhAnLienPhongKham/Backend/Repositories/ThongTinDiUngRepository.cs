using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class ThongTinDiUngRepository : IThongTinDiUngRepository
    {
        private readonly string _connectionString;

        public ThongTinDiUngRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ThongTinDiUng>> GetByMaBenhNhanAsync(string maBenhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM ThongTinDiUng WHERE MaBenhNhan = @MaBenhNhan ORDER BY NgayGhiNhan DESC";
            return await connection.QueryAsync<ThongTinDiUng>(sql, new { MaBenhNhan = maBenhNhan });
        }

        public async Task<string> CreateAsync(ThongTinDiUng diUng)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã tự động (DU001, DU002, ...)
            var maxMaSql = "SELECT TOP 1 MaDiUng FROM ThongTinDiUng ORDER BY MaDiUng DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "DU001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"DU{(number + 1):D3}";
            }
            
            diUng.MaDiUng = newMa;
            
            var sql = @"INSERT INTO ThongTinDiUng (MaDiUng, MaBenhNhan, TacNhan, BieuHien, NgayGhiNhan, MucDoDiUng, TenDiUng)
                       VALUES (@MaDiUng, @MaBenhNhan, @TacNhan, @BieuHien, @NgayGhiNhan, @MucDoDiUng, @TenDiUng)";
            await connection.ExecuteAsync(sql, diUng);
            return newMa;
        }

        public async Task<bool> DeleteAsync(string maDiUng)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.ExecuteAsync(
                "DELETE FROM ThongTinDiUng WHERE MaDiUng = @MaDiUng", new { MaDiUng = maDiUng });
            return result > 0;
        }
    }
}
