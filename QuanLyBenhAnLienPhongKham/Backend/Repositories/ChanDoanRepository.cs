using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class ChanDoanRepository : IChanDoanRepository
    {
        private readonly string _connectionString;

        public ChanDoanRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ChanDoan>> GetByDotKhamAsync(string maDotKham)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT cd.*, dmb.TenBenh, nv.HoTen as HoTenBacSi
                       FROM ChanDoan cd
                       LEFT JOIN DanhMucBenh dmb ON cd.MaBenh = dmb.MaBenh
                       LEFT JOIN BacSi bs ON cd.MaBacSi = bs.MaBacSi
                       LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       WHERE cd.MaDotKham = @MaDotKham";
            return await connection.QueryAsync<ChanDoan>(sql, new { MaDotKham = maDotKham });
        }

        public async Task<string> CreateAsync(ChanDoan chanDoan)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã tự động (CD001, CD002, ...)
            var maxMaSql = "SELECT TOP 1 MaChanDoan FROM ChanDoan ORDER BY MaChanDoan DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "CD001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"CD{(number + 1):D3}";
            }
            
            chanDoan.MaChanDoan = newMa;
            
            var sql = @"INSERT INTO ChanDoan (MaChanDoan, MaHoSo, MaDotKham, MaBacSi, MaBenh, Loai, NoiDungChanDoan)
                       VALUES (@MaChanDoan, @MaHoSo, @MaDotKham, @MaBacSi, @MaBenh, @Loai, @NoiDungChanDoan)";
            await connection.ExecuteAsync(sql, chanDoan);
            return newMa;
        }

        public async Task<bool> UpdateAsync(ChanDoan chanDoan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE ChanDoan 
                       SET MaBenh = @MaBenh, Loai = @Loai, NoiDungChanDoan = @NoiDungChanDoan
                       WHERE MaChanDoan = @MaChanDoan";
            var result = await connection.ExecuteAsync(sql, chanDoan);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string maChanDoan)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.ExecuteAsync(
                "DELETE FROM ChanDoan WHERE MaChanDoan = @MaChanDoan", new { MaChanDoan = maChanDoan });
            return result > 0;
        }
    }
}
