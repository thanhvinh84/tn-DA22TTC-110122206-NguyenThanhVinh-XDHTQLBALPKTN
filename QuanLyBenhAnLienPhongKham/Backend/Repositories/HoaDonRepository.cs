using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class HoaDonRepository : IHoaDonRepository
    {
        private readonly string _connectionString;

        public HoaDonRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<HoaDon?> GetByDotKhamAsync(string maDotKham)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT hd.*, bn.MaBenhNhan, bn.HoTen as HoTenBenhNhan
                       FROM HoaDon hd
                       INNER JOIN DotKham dk ON hd.MaDotKham = dk.MaDotKham
                       INNER JOIN HoSoBenhAn hs ON dk.MaHoSo = hs.MaHoSo
                       INNER JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       WHERE hd.MaDotKham = @MaDotKham";
            return await connection.QueryFirstOrDefaultAsync<HoaDon>(sql, new { MaDotKham = maDotKham });
        }

        public async Task<IEnumerable<HoaDon>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT hd.*, bn.MaBenhNhan, bn.HoTen as HoTenBenhNhan
                       FROM HoaDon hd
                       INNER JOIN DotKham dk ON hd.MaDotKham = dk.MaDotKham
                       INNER JOIN HoSoBenhAn hs ON dk.MaHoSo = hs.MaHoSo
                       INNER JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       ORDER BY hd.NgayLap DESC";
            return await connection.QueryAsync<HoaDon>(sql);
        }

        public async Task<HoaDon?> GetByIdAsync(string maHoaDon)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT hd.*, bn.MaBenhNhan, bn.HoTen as HoTenBenhNhan
                       FROM HoaDon hd
                       INNER JOIN DotKham dk ON hd.MaDotKham = dk.MaDotKham
                       INNER JOIN HoSoBenhAn hs ON dk.MaHoSo = hs.MaHoSo
                       INNER JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       WHERE hd.MaHoaDon = @MaHoaDon";
            return await connection.QueryFirstOrDefaultAsync<HoaDon>(sql, new { MaHoaDon = maHoaDon });
        }

        public async Task<string> CreateAsync(HoaDon hoaDon)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã hóa đơn tự động (HD001, HD002, ...)
            var maxMaSql = "SELECT TOP 1 MaHoaDon FROM HoaDon ORDER BY MaHoaDon DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "HD001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"HD{(number + 1):D3}";
            }
            
            hoaDon.MaHoaDon = newMa;
            
            var sql = @"INSERT INTO HoaDon (MaHoaDon, MaDotKham, NgayLap, TongTien, TrangThai)
                       VALUES (@MaHoaDon, @MaDotKham, @NgayLap, @TongTien, @TrangThai)";
            await connection.ExecuteAsync(sql, hoaDon);
            return newMa;
        }

        public async Task<bool> UpdateAsync(HoaDon hoaDon)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE HoaDon 
                       SET TongTien = @TongTien, TrangThai = @TrangThai
                       WHERE MaHoaDon = @MaHoaDon";
            var result = await connection.ExecuteAsync(sql, hoaDon);
            return result > 0;
        }

        public async Task<bool> UpdateTrangThaiAsync(string maHoaDon, string trangThai)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "UPDATE HoaDon SET TrangThai = @TrangThai WHERE MaHoaDon = @MaHoaDon";
            var result = await connection.ExecuteAsync(sql, new { MaHoaDon = maHoaDon, TrangThai = trangThai });
            return result > 0;
        }
    }
}
