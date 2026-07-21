using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class ChiTietDonThuocRepository : IChiTietDonThuocRepository
    {
        private readonly string _connectionString;

        public ChiTietDonThuocRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ChiTietDonThuoc>> GetByDonThuocAsync(string maDonThuoc)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT ct.*, t.TenThuoc, t.CongDung
                       FROM ChiTietDonThuoc ct
                       INNER JOIN DanhMucThuoc t ON ct.MaThuoc = t.MaThuoc
                       WHERE ct.MaDonThuoc = @MaDonThuoc";
            return await connection.QueryAsync<ChiTietDonThuoc>(sql, new { MaDonThuoc = maDonThuoc });
        }

        public async Task<bool> CreateAsync(ChiTietDonThuoc chiTiet)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            try
            {
                // Kiểm tra xem đơn thuốc có tồn tại không
                var checkSql = "SELECT COUNT(*) FROM DonThuoc WHERE MaDonThuoc = @MaDonThuoc";
                var exists = await connection.ExecuteScalarAsync<int>(checkSql, new { chiTiet.MaDonThuoc });
                
                if (exists == 0)
                {
                    throw new Exception($"Không tìm thấy đơn thuốc với mã: {chiTiet.MaDonThuoc}");
                }
                
                var sql = @"INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung)
                           VALUES (@MaDonThuoc, @MaThuoc, @MaHoaDon, @SoLuong, @LieuDung, @CachDung)";
                var result = await connection.ExecuteAsync(sql, chiTiet);
                return result > 0;
            }
            catch (SqlException ex)
            {
                throw new Exception($"Lỗi SQL khi thêm chi tiết đơn thuốc: {ex.Message} (MaDonThuoc: {chiTiet.MaDonThuoc}, MaThuoc: {chiTiet.MaThuoc})", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi thêm chi tiết đơn thuốc: {ex.Message}", ex);
            }
        }

        public async Task<bool> UpdateAsync(ChiTietDonThuoc chiTiet)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE ChiTietDonThuoc 
                       SET SoLuong = @SoLuong, LieuDung = @LieuDung, CachDung = @CachDung
                       WHERE MaDonThuoc = @MaDonThuoc AND MaThuoc = @MaThuoc";
            var result = await connection.ExecuteAsync(sql, chiTiet);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string maDonThuoc, string maThuoc)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "DELETE FROM ChiTietDonThuoc WHERE MaDonThuoc = @MaDonThuoc AND MaThuoc = @MaThuoc";
            var result = await connection.ExecuteAsync(sql, new { MaDonThuoc = maDonThuoc, MaThuoc = maThuoc });
            return result > 0;
        }
    }
}
