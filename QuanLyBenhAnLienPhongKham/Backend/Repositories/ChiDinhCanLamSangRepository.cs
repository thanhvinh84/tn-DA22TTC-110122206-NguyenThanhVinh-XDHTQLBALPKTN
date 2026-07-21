using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class ChiDinhCanLamSangRepository : IChiDinhCanLamSangRepository
    {
        private readonly string _connectionString;

        public ChiDinhCanLamSangRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ChiDinhCanLamSang>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT cd.*, 
                       nv.HoTen as HoTenBacSi, 
                       bn.MaBenhNhan, 
                       bn.HoTen as HoTenBenhNhan,
                       bn.HoTen as TenBenhNhan
                       FROM ChiDinhCanLamSang cd
                       LEFT JOIN BacSi bs ON cd.MaBacSi = bs.MaBacSi
                       LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       LEFT JOIN DotKham dk ON cd.MaDotKham = dk.MaDotKham
                       LEFT JOIN HoSoBenhAn hs ON dk.MaHoSo = hs.MaHoSo
                       LEFT JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       ORDER BY cd.NgayChiDinh DESC";
            return await connection.QueryAsync<ChiDinhCanLamSang>(sql);
        }

        public async Task<IEnumerable<ChiDinhCanLamSang>> GetByDotKhamAsync(string maDotKham)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT cd.*, 
                       nv.HoTen as HoTenBacSi
                       FROM ChiDinhCanLamSang cd
                       LEFT JOIN BacSi bs ON cd.MaBacSi = bs.MaBacSi
                       LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       WHERE cd.MaDotKham = @MaDotKham
                       ORDER BY cd.NgayChiDinh DESC";
            return await connection.QueryAsync<ChiDinhCanLamSang>(sql, new { MaDotKham = maDotKham });
        }

        public async Task<ChiDinhCanLamSang?> GetByIdAsync(string maChiDinh)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT cd.*, nv.HoTen as HoTenBacSi, bn.MaBenhNhan, bn.HoTen as HoTenBenhNhan
                       FROM ChiDinhCanLamSang cd
                       LEFT JOIN BacSi bs ON cd.MaBacSi = bs.MaBacSi
                       LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       LEFT JOIN DotKham dk ON cd.MaDotKham = dk.MaDotKham
                       LEFT JOIN HoSoBenhAn hs ON dk.MaHoSo = hs.MaHoSo
                       LEFT JOIN BenhNhan bn ON hs.MaBenhNhan = bn.MaBenhNhan
                       WHERE cd.MaChiDinh = @MaChiDinh";
            return await connection.QueryFirstOrDefaultAsync<ChiDinhCanLamSang>(sql, new { MaChiDinh = maChiDinh });
        }

        public async Task<string> CreateAsync(ChiDinhCanLamSang chiDinh)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã chỉ định tự động (CD001, CD002, ...)
            var maxMaSql = "SELECT TOP 1 MaChiDinh FROM ChiDinhCanLamSang ORDER BY MaChiDinh DESC";
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
            
            chiDinh.MaChiDinh = newMa;
            
            var sql = @"INSERT INTO ChiDinhCanLamSang (MaChiDinh, MaDotKham, MaBacSi, NgayChiDinh, LoaiChiDinh, LoaiDichVu, TenDichVu, GhiChu, TrangThai)
                       VALUES (@MaChiDinh, @MaDotKham, @MaBacSi, @NgayChiDinh, @LoaiChiDinh, @LoaiDichVu, @TenDichVu, @GhiChu, @TrangThai)";
            await connection.ExecuteAsync(sql, chiDinh);
            return newMa;
        }

        public async Task<bool> UpdateTrangThaiAsync(string maChiDinh, string trangThai)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "UPDATE ChiDinhCanLamSang SET TrangThai = @TrangThai WHERE MaChiDinh = @MaChiDinh";
            var result = await connection.ExecuteAsync(sql, new { MaChiDinh = maChiDinh, TrangThai = trangThai });
            return result > 0;
        }
    }
}
