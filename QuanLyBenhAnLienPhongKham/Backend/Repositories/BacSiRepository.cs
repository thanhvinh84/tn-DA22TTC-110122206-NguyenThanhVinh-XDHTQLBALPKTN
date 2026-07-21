using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class BacSiRepository : IBacSiRepository
    {
        private readonly string _connectionString;

        public BacSiRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<BacSi>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT bs.*, nv.HoTen, nv.SoDienThoai, nv.Email, nv.MaPhongKham, ck.TenChuyenKhoa
                       FROM BacSi bs
                       INNER JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       LEFT JOIN ChuyenKhoa ck ON bs.MaChuyenKhoa = ck.MaChuyenKhoa";
            return await connection.QueryAsync<BacSi>(sql);
        }

        public async Task<BacSi?> GetByIdAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT bs.*, nv.HoTen, nv.SoDienThoai, nv.Email, nv.MaPhongKham, ck.TenChuyenKhoa
                       FROM BacSi bs
                       INNER JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       LEFT JOIN ChuyenKhoa ck ON bs.MaChuyenKhoa = ck.MaChuyenKhoa
                       WHERE bs.MaBacSi = @Id";
            return await connection.QueryFirstOrDefaultAsync<BacSi>(sql, new { Id = id });
        }

        public async Task<string> CreateAsync(BacSi bacSi)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"INSERT INTO BacSi (MaBacSi, MaChuyenKhoa, ChungChiHanhNghe, BangCap)
                       VALUES (@MaBacSi, @MaChuyenKhoa, @ChungChiHanhNghe, @BangCap)";
            await connection.ExecuteAsync(sql, bacSi);
            return bacSi.MaBacSi;
        }

        public async Task<bool> UpdateAsync(BacSi bacSi)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE BacSi 
                       SET MaChuyenKhoa = @MaChuyenKhoa, ChungChiHanhNghe = @ChungChiHanhNghe, BangCap = @BangCap
                       WHERE MaBacSi = @MaBacSi";
            var result = await connection.ExecuteAsync(sql, bacSi);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.ExecuteAsync(
                "DELETE FROM BacSi WHERE MaBacSi = @Id", new { Id = id });
            return result > 0;
        }
    }
}
