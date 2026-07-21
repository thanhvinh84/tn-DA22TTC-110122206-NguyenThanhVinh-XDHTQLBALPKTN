using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class HoSoBenhAnRepository : IHoSoBenhAnRepository
    {
        private readonly string _connectionString;

        public HoSoBenhAnRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<HoSoBenhAn?> GetByIdAsync(string maHoSo)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT hs.MaHoSo, hs.MaBenhNhan, hs.NgayTao, hs.NhomMau, hs.TienSuBenh, hs.GhiChu,
                       bn.HoTen, bn.SoDienThoai, bn.NgaySinh, bn.GioiTinh, bn.DiaChi
                       FROM HoSoBenhAn hs
                       INNER JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       WHERE hs.MaHoSo = @MaHoSo";
            return await connection.QueryFirstOrDefaultAsync<HoSoBenhAn>(sql, new { MaHoSo = maHoSo });
        }

        public async Task<HoSoBenhAn?> GetByMaBenhNhanAsync(string maBenhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT hs.MaHoSo, hs.MaBenhNhan, hs.NgayTao, hs.NhomMau, hs.TienSuBenh, hs.GhiChu,
                       bn.HoTen, bn.SoDienThoai, bn.NgaySinh, bn.GioiTinh, bn.DiaChi
                       FROM HoSoBenhAn hs
                       INNER JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       WHERE hs.MaBenhNhan = @MaBenhNhan";
            return await connection.QueryFirstOrDefaultAsync<HoSoBenhAn>(sql, new { MaBenhNhan = maBenhNhan });
        }

        public async Task<string> CreateAsync(HoSoBenhAn hoSo)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã hồ sơ tự động (HS001, HS002, ...)
            var maxMaSql = "SELECT TOP 1 MaHoSo FROM HoSoBenhAn ORDER BY MaHoSo DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "HS001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"HS{(number + 1):D3}";
            }
            
            hoSo.MaHoSo = newMa;
            
            var sql = @"INSERT INTO HoSoBenhAn (MaHoSo, MaBenhNhan, NgayTao)
                       VALUES (@MaHoSo, @MaBenhNhan, @NgayTao)";
            await connection.ExecuteAsync(sql, hoSo);
            return newMa;
        }

        public async Task<bool> UpdateAsync(HoSoBenhAn hoSo)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE HoSoBenhAn 
                       SET NhomMau = @NhomMau, 
                           TienSuBenh = @TienSuBenh, 
                           GhiChu = @GhiChu
                       WHERE MaHoSo = @MaHoSo";
            var rowsAffected = await connection.ExecuteAsync(sql, hoSo);
            return rowsAffected > 0;
        }

        public async Task<IEnumerable<DotKham>> GetLichSuKhamAsync(string maHoSo)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT dk.*, bn.MaBenhNhan, bn.HoTen as HoTenBenhNhan, 
                       nv.HoTen as HoTenBacSi, pk.TenPhongKham
                       FROM DotKham dk
                       INNER JOIN HoSoBenhAn hs ON dk.MaHoSo = hs.MaHoSo
                       INNER JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       LEFT JOIN BacSi bs ON dk.MaBacSi = bs.MaBacSi
                       LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       LEFT JOIN PhongKham pk ON dk.MaPhongKham = pk.MaPhongKham
                       WHERE dk.MaHoSo = @MaHoSo
                       ORDER BY dk.ThoiGianDen DESC";
            return await connection.QueryAsync<DotKham>(sql, new { MaHoSo = maHoSo });
        }
    }
}
