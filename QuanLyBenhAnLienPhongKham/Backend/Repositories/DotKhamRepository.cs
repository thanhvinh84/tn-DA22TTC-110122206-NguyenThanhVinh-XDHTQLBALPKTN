using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class DotKhamRepository : IDotKhamRepository
    {
        private readonly string _connectionString;

        public DotKhamRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<DotKham>> GetAllAsync()
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
                       ORDER BY dk.ThoiGianDen DESC";
            return await connection.QueryAsync<DotKham>(sql);
        }

        public async Task<DotKham?> GetByIdAsync(string maDotKham)
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
                       WHERE dk.MaDotKham = @MaDotKham";
            return await connection.QueryFirstOrDefaultAsync<DotKham>(sql, new { MaDotKham = maDotKham });
        }

        public async Task<IEnumerable<DotKham>> GetByBacSiAsync(string maBacSi, string? trangThai)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT dk.*, bn.MaBenhNhan, bn.HoTen as HoTenBenhNhan, bn.GioiTinh, 
                       nv.HoTen as HoTenBacSi, pk.TenPhongKham
                       FROM DotKham dk
                       INNER JOIN HoSoBenhAn hs ON dk.MaHoSo = hs.MaHoSo
                       INNER JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       LEFT JOIN BacSi bs ON dk.MaBacSi = bs.MaBacSi
                       LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       LEFT JOIN PhongKham pk ON dk.MaPhongKham = pk.MaPhongKham
                       WHERE dk.MaBacSi = @MaBacSi";
            
            if (!string.IsNullOrEmpty(trangThai))
            {
                sql += " AND dk.TrangThai = @TrangThai";
            }
            
            sql += " ORDER BY dk.ThoiGianDen DESC";
            
            return await connection.QueryAsync<DotKham>(sql, new { MaBacSi = maBacSi, TrangThai = trangThai });
        }

        public async Task<IEnumerable<DotKham>> GetByHoSoAsync(string maHoSo)
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

        public async Task<IEnumerable<DotKham>> GetByBenhNhanAsync(string maBenhNhan)
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
                       WHERE bn.MaBenhNhan = @MaBenhNhan
                       ORDER BY dk.ThoiGianDen DESC";
            
            return await connection.QueryAsync<DotKham>(sql, new { MaBenhNhan = maBenhNhan });
        }

        public async Task<string> GetOrCreateHoSoByMaBenhNhanAsync(string maBenhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Kiểm tra xem bệnh nhân đã có hồ sơ chưa
            var checkSql = "SELECT MaHoSo FROM HoSoBenhAn WHERE MaBenhNhan = @MaBenhNhan";
            var existingMaHoSo = await connection.QueryFirstOrDefaultAsync<string>(checkSql, new { MaBenhNhan = maBenhNhan });
            
            if (!string.IsNullOrEmpty(existingMaHoSo))
            {
                return existingMaHoSo;
            }
            
            // Tạo hồ sơ mới nếu chưa có
            var maxMaSql = "SELECT TOP 1 MaHoSo FROM HoSoBenhAn ORDER BY MaHoSo DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMaHoSo;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMaHoSo = "HS001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMaHoSo = $"HS{(number + 1):D3}";
            }
            
            var insertSql = @"INSERT INTO HoSoBenhAn (MaHoSo, MaBenhNhan, NgayTao)
                             VALUES (@MaHoSo, @MaBenhNhan, @NgayTao)";
            await connection.ExecuteAsync(insertSql, new 
            { 
                MaHoSo = newMaHoSo, 
                MaBenhNhan = maBenhNhan, 
                NgayTao = DateTime.Now 
            });
            
            return newMaHoSo;
        }

        public async Task<string> CreateAsync(DotKham dotKham)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã đợt khám tự động (DK001, DK002, ...)
            var maxMaSql = "SELECT TOP 1 MaDotKham FROM DotKham ORDER BY MaDotKham DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "DK001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"DK{(number + 1):D3}";
            }
            
            dotKham.MaDotKham = newMa;
            
            var sql = @"INSERT INTO DotKham (MaDotKham, MaHoSo, MaPhongKham, MaBacSi, MaLeTan, ThoiGianDen, LyDoKham, TrangThai)
                       VALUES (@MaDotKham, @MaHoSo, @MaPhongKham, @MaBacSi, @MaLeTan, @ThoiGianDen, @LyDoKham, @TrangThai)";
            await connection.ExecuteAsync(sql, dotKham);
            return newMa;
        }

        public async Task<bool> UpdateAsync(DotKham dotKham)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Sử dụng anonymous object để chỉ update những field không null
            var parameters = new
            {
                MaDotKham = dotKham.MaDotKham,
                MaBacSi = dotKham.MaBacSi,
                LyDoKham = dotKham.LyDoKham,
                TrangThai = dotKham.TrangThai
            };
            
            var sql = @"UPDATE DotKham 
                       SET MaBacSi = @MaBacSi,
                           LyDoKham = @LyDoKham,
                           TrangThai = @TrangThai
                       WHERE MaDotKham = @MaDotKham";
            var result = await connection.ExecuteAsync(sql, parameters);
            return result > 0;
        }

        public async Task<bool> UpdateTrangThaiAsync(string maDotKham, string trangThai)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "UPDATE DotKham SET TrangThai = @TrangThai WHERE MaDotKham = @MaDotKham";
            var result = await connection.ExecuteAsync(sql, new { MaDotKham = maDotKham, TrangThai = trangThai });
            return result > 0;
        }
    }
}
