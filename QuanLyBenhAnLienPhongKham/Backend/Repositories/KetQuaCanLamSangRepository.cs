using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class KetQuaCanLamSangRepository : IKetQuaCanLamSangRepository
    {
        private readonly string _connectionString;

        public KetQuaCanLamSangRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<KetQuaCanLamSang?> GetByChiDinhAsync(string maChiDinh)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT kq.*, nv.HoTen as HoTenKyThuatVien, 
                       cd.LoaiChiDinh, cd.LoaiDichVu, cd.TenDichVu,
                       kq.KetLuan as ketQua
                       FROM KetQuaCanLamSang kq
                       LEFT JOIN NhanVien nv ON kq.MaKyThuatVien = nv.MaNhanVien
                       LEFT JOIN ChiDinhCanLamSang cd ON kq.MaChiDinh = cd.MaChiDinh
                       WHERE kq.MaChiDinh = @MaChiDinh";
            return await connection.QueryFirstOrDefaultAsync<KetQuaCanLamSang>(sql, new { MaChiDinh = maChiDinh });
        }

        public async Task<IEnumerable<KetQuaCanLamSang>> GetByDotKhamAsync(string maDotKham)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT kq.*, nv.HoTen as HoTenKyThuatVien, 
                       cd.LoaiChiDinh, cd.LoaiDichVu, cd.TenDichVu,
                       kq.KetLuan as ketQua
                       FROM KetQuaCanLamSang kq
                       INNER JOIN ChiDinhCanLamSang cd ON kq.MaChiDinh = cd.MaChiDinh
                       LEFT JOIN NhanVien nv ON kq.MaKyThuatVien = nv.MaNhanVien
                       WHERE cd.MaDotKham = @MaDotKham
                       ORDER BY kq.NgayCoKetQua DESC";
            return await connection.QueryAsync<KetQuaCanLamSang>(sql, new { MaDotKham = maDotKham });
        }

        public async Task<string> CreateAsync(KetQuaCanLamSang ketQua)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã kết quả tự động (KQ001, KQ002, ...)
            var maxMaSql = "SELECT TOP 1 MaKetQua FROM KetQuaCanLamSang ORDER BY MaKetQua DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "KQ001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"KQ{(number + 1):D3}";
            }
            
            ketQua.MaKetQua = newMa;
            
            // Use KetQua if provided, otherwise use KetLuan
            if (!string.IsNullOrEmpty(ketQua.KetQua))
            {
                ketQua.KetLuan = ketQua.KetQua;
            }
            
            var sql = @"INSERT INTO KetQuaCanLamSang (MaKetQua, MaChiDinh, MaHoSo, MaKyThuatVien, NgayCoKetQua, KetLuan, TepDinhKem, LoaiKetQua, HinhAnhKetQua, GhiChu)
                       VALUES (@MaKetQua, @MaChiDinh, @MaHoSo, @MaKyThuatVien, @NgayCoKetQua, @KetLuan, @TepDinhKem, @LoaiKetQua, @HinhAnhKetQua, @GhiChu)";
            await connection.ExecuteAsync(sql, ketQua);
            return newMa;
        }

        public async Task<bool> UpdateAsync(KetQuaCanLamSang ketQua)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE KetQuaCanLamSang 
                       SET NgayCoKetQua = @NgayCoKetQua, KetLuan = @KetLuan, TepDinhKem = @TepDinhKem, LoaiKetQua = @LoaiKetQua, HinhAnhKetQua = @HinhAnhKetQua, GhiChu = @GhiChu
                       WHERE MaKetQua = @MaKetQua";
            var result = await connection.ExecuteAsync(sql, ketQua);
            return result > 0;
        }
    }
}
