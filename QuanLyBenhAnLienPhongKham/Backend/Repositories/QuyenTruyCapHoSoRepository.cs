using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class QuyenTruyCapHoSoRepository : IQuyenTruyCapHoSoRepository
    {
        private readonly string _connectionString;

        public QuyenTruyCapHoSoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<bool> CheckQuyenAsync(string maHoSo, string maTaiKhoan, string loaiQuyen)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT COUNT(*) FROM QuyenTruyCapHoSo 
                       WHERE MaHoSo = @MaHoSo AND MaTaiKhoan = @MaTaiKhoan 
                       AND (LoaiQuyen = @LoaiQuyen OR LoaiQuyen = N'Toàn quyền')";
            var count = await connection.ExecuteScalarAsync<int>(sql, 
                new { MaHoSo = maHoSo, MaTaiKhoan = maTaiKhoan, LoaiQuyen = loaiQuyen });
            return count > 0;
        }

        public async Task<IEnumerable<QuyenTruyCapHoSo>> GetByHoSoAsync(string maHoSo)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM QuyenTruyCapHoSo WHERE MaHoSo = @MaHoSo";
            return await connection.QueryAsync<QuyenTruyCapHoSo>(sql, new { MaHoSo = maHoSo });
        }

        public async Task<string> CreateAsync(QuyenTruyCapHoSo quyen)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã quyền tự động (QTC001, QTC002, ...)
            var maxMaSql = "SELECT TOP 1 MaQuyen FROM QuyenTruyCapHoSo ORDER BY MaQuyen DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "QTC001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(3));
                newMa = $"QTC{(number + 1):D3}";
            }
            
            quyen.MaQuyen = newMa;
            
            var sql = @"INSERT INTO QuyenTruyCapHoSo (MaQuyen, MaHoSo, MaTaiKhoan, MaPhongKham, LoaiQuyen, ThoiGianCap, GhiChu)
                       VALUES (@MaQuyen, @MaHoSo, @MaTaiKhoan, @MaPhongKham, @LoaiQuyen, @ThoiGianCap, @GhiChu)";
            await connection.ExecuteAsync(sql, quyen);
            return newMa;
        }

        public async Task<bool> DeleteAsync(string maQuyen)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.ExecuteAsync(
                "DELETE FROM QuyenTruyCapHoSo WHERE MaQuyen = @MaQuyen", new { MaQuyen = maQuyen });
            return result > 0;
        }
    }
}
