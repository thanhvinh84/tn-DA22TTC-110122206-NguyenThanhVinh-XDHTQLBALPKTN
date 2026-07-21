using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class DonThuocRepository : IDonThuocRepository
    {
        private readonly string _connectionString;

        public DonThuocRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<DonThuoc?> GetByDotKhamAsync(string maDotKham)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT dt.*, nv.HoTen as HoTenBacSi, bn.MaBenhNhan, bn.HoTen as HoTenBenhNhan
                       FROM DonThuoc dt
                       LEFT JOIN BacSi bs ON dt.MaBacSi = bs.MaBacSi
                       LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       LEFT JOIN DotKham dk ON dt.MaDotKham = dk.MaDotKham
                       LEFT JOIN HoSoBenhAn hs ON dk.MaHoSo = hs.MaHoSo
                       LEFT JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       WHERE dt.MaDotKham = @MaDotKham";
            return await connection.QueryFirstOrDefaultAsync<DonThuoc>(sql, new { MaDotKham = maDotKham });
        }

        public async Task<DonThuoc?> GetByIdAsync(string maDonThuoc)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT dt.*, nv.HoTen as HoTenBacSi, bn.MaBenhNhan, bn.HoTen as HoTenBenhNhan
                       FROM DonThuoc dt
                       LEFT JOIN BacSi bs ON dt.MaBacSi = bs.MaBacSi
                       LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       LEFT JOIN DotKham dk ON dt.MaDotKham = dk.MaDotKham
                       LEFT JOIN HoSoBenhAn hs ON dk.MaHoSo = hs.MaHoSo
                       LEFT JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       WHERE dt.MaDonThuoc = @MaDonThuoc";
            return await connection.QueryFirstOrDefaultAsync<DonThuoc>(sql, new { MaDonThuoc = maDonThuoc });
        }

        public async Task<string> CreateAsync(DonThuoc donThuoc)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            try
            {
                // Tạo mã đơn thuốc tự động (DT001, DT002, ...)
                var maxMaSql = "SELECT TOP 1 MaDonThuoc FROM DonThuoc ORDER BY MaDonThuoc DESC";
                var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
                
                string newMa;
                if (string.IsNullOrEmpty(maxMa))
                {
                    newMa = "DT001";
                }
                else
                {
                    var number = int.Parse(maxMa.Substring(2));
                    newMa = $"DT{(number + 1):D3}";
                }
                
                donThuoc.MaDonThuoc = newMa;
                
                var sql = @"INSERT INTO DonThuoc (MaDonThuoc, MaDotKham, MaBacSi, NgayLap)
                           VALUES (@MaDonThuoc, @MaDotKham, @MaBacSi, @NgayLap)";
                var result = await connection.ExecuteAsync(sql, donThuoc);
                
                if (result == 0)
                {
                    throw new Exception("Không thể tạo đơn thuốc - INSERT không thành công");
                }
                
                // Verify đơn thuốc đã được tạo
                var verifySql = "SELECT COUNT(*) FROM DonThuoc WHERE MaDonThuoc = @MaDonThuoc";
                var count = await connection.ExecuteScalarAsync<int>(verifySql, new { MaDonThuoc = newMa });
                
                if (count == 0)
                {
                    throw new Exception($"Đơn thuốc {newMa} không tồn tại sau khi INSERT");
                }
                
                return newMa;
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi tạo đơn thuốc: {ex.Message}", ex);
            }
        }
    }
}
