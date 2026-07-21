using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class BenhNhanRepository : IBenhNhanRepository
    {
        private readonly string _connectionString;

        public BenhNhanRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<BenhNhan>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM BenhNhan ORDER BY MaBenhNhan DESC";
            return await connection.QueryAsync<BenhNhan>(sql);
        }

        public async Task<BenhNhan?> GetByIdAsync(string maBenhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM BenhNhan WHERE MaBenhNhan = @MaBenhNhan";
            return await connection.QueryFirstOrDefaultAsync<BenhNhan>(sql, new { MaBenhNhan = maBenhNhan });
        }

        public async Task<IEnumerable<BenhNhan>> SearchAsync(string keyword)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT * FROM BenhNhan 
                       WHERE MaBenhNhan LIKE @Keyword 
                       OR HoTen LIKE @Keyword 
                       OR CCCD LIKE @Keyword 
                       OR SoDienThoai LIKE @Keyword
                       ORDER BY MaBenhNhan DESC";
            return await connection.QueryAsync<BenhNhan>(sql, new { Keyword = $"%{keyword}%" });
        }

        public async Task<string> CreateAsync(BenhNhan benhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã bệnh nhân tự động theo số thứ tự (BN001, BN002, ...)
            var maxMaSql = "SELECT TOP 1 MaBenhNhan FROM BenhNhan ORDER BY MaBenhNhan DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string maBenhNhan;
            if (string.IsNullOrEmpty(maxMa))
            {
                maBenhNhan = "BN001";
            }
            else
            {
                // Extract number from BN001, BN002, etc.
                var numberPart = maxMa.Substring(2);
                if (int.TryParse(numberPart, out int number))
                {
                    maBenhNhan = $"BN{(number + 1):D3}";
                }
                else
                {
                    // Fallback if format is different
                    maBenhNhan = "BN001";
                }
            }
            
            var sql = @"INSERT INTO BenhNhan (MaBenhNhan, HoTen, CCCD, SoDienThoai, Email, DiaChi, NgaySinh, GioiTinh, SoBHYT, NgheNghiep)
                       VALUES (@MaBenhNhan, @HoTen, @CCCD, @SoDienThoai, @Email, @DiaChi, @NgaySinh, @GioiTinh, @SoBHYT, @NgheNghiep)";
            
            await connection.ExecuteAsync(sql, new
            {
                MaBenhNhan = maBenhNhan,
                benhNhan.HoTen,
                benhNhan.CCCD,
                benhNhan.SoDienThoai,
                benhNhan.Email,
                benhNhan.DiaChi,
                benhNhan.NgaySinh,
                benhNhan.GioiTinh,
                benhNhan.SoBHYT,
                benhNhan.NgheNghiep
            });
            
            return maBenhNhan;
        }

        public async Task<bool> UpdateAsync(BenhNhan benhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE BenhNhan 
                       SET HoTen = @HoTen,
                           CCCD = @CCCD,
                           SoDienThoai = @SoDienThoai,
                           Email = @Email,
                           DiaChi = @DiaChi,
                           NgaySinh = @NgaySinh,
                           GioiTinh = @GioiTinh,
                           SoBHYT = @SoBHYT,
                           NgheNghiep = @NgheNghiep
                       WHERE MaBenhNhan = @MaBenhNhan";
            var result = await connection.ExecuteAsync(sql, benhNhan);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string maBenhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "DELETE FROM BenhNhan WHERE MaBenhNhan = @MaBenhNhan";
            var result = await connection.ExecuteAsync(sql, new { MaBenhNhan = maBenhNhan });
            return result > 0;
        }
    }
}
