using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class YeuCauDatKhamRepository : IYeuCauDatKhamRepository
    {
        private readonly string _connectionString;

        public YeuCauDatKhamRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<string> CreateAsync(YeuCauDatKham yeuCau)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tự động generate MaYeuCau
            var getLastMaSql = "SELECT TOP 1 MaYeuCau FROM YeuCauDatKham ORDER BY MaYeuCau DESC";
            var lastMa = await connection.QueryFirstOrDefaultAsync<string>(getLastMaSql);
            
            int nextNum = 1;
            if (!string.IsNullOrEmpty(lastMa) && lastMa.StartsWith("YC"))
            {
                if (int.TryParse(lastMa.Substring(2), out int currentNum))
                {
                    nextNum = currentNum + 1;
                }
            }
            
            string maYeuCau = "YC" + nextNum.ToString("D6");
            yeuCau.MaYeuCau = maYeuCau;
            
            var sql = @"
                INSERT INTO YeuCauDatKham (MaYeuCau, MaBenhNhan, MaPhongKham, ThoiGianMongMuon, LyDoKham, GhiChu, TrangThai, NgayTao)
                VALUES (@MaYeuCau, @MaBenhNhan, @MaPhongKham, @ThoiGianMongMuon, @LyDoKham, @GhiChu, @TrangThai, GETDATE())";
            
            await connection.ExecuteAsync(sql, yeuCau);
            return maYeuCau;
        }

        public async Task<YeuCauDatKham?> GetByIdAsync(string maYeuCau)
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = @"
                SELECT 
                    yc.*,
                    bn.HoTen as TenBenhNhan,
                    bn.SoDienThoai,
                    pk.TenPhongKham,
                    nv.HoTen as TenNhanVienXuLy
                FROM YeuCauDatKham yc
                LEFT JOIN BenhNhan bn ON yc.MaBenhNhan = bn.MaBenhNhan
                LEFT JOIN PhongKham pk ON yc.MaPhongKham = pk.MaPhongKham
                LEFT JOIN NhanVien nv ON yc.MaNhanVienXuLy = nv.MaNhanVien
                WHERE yc.MaYeuCau = @MaYeuCau";
            
            return await connection.QueryFirstOrDefaultAsync<YeuCauDatKham>(sql, new { MaYeuCau = maYeuCau });
        }

        public async Task<IEnumerable<YeuCauDatKham>> GetByBenhNhanAsync(string maBenhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = @"
                SELECT 
                    yc.*,
                    bn.HoTen as TenBenhNhan,
                    bn.SoDienThoai,
                    pk.TenPhongKham,
                    nv.HoTen as TenNhanVienXuLy
                FROM YeuCauDatKham yc
                LEFT JOIN BenhNhan bn ON yc.MaBenhNhan = bn.MaBenhNhan
                LEFT JOIN PhongKham pk ON yc.MaPhongKham = pk.MaPhongKham
                LEFT JOIN NhanVien nv ON yc.MaNhanVienXuLy = nv.MaNhanVien
                WHERE yc.MaBenhNhan = @MaBenhNhan
                ORDER BY yc.NgayTao DESC";
            
            return await connection.QueryAsync<YeuCauDatKham>(sql, new { MaBenhNhan = maBenhNhan });
        }

        public async Task<IEnumerable<YeuCauDatKham>> GetByTrangThaiAsync(string trangThai)
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = @"
                SELECT 
                    yc.*,
                    bn.HoTen as TenBenhNhan,
                    bn.SoDienThoai,
                    pk.TenPhongKham,
                    nv.HoTen as TenNhanVienXuLy
                FROM YeuCauDatKham yc
                LEFT JOIN BenhNhan bn ON yc.MaBenhNhan = bn.MaBenhNhan
                LEFT JOIN PhongKham pk ON yc.MaPhongKham = pk.MaPhongKham
                LEFT JOIN NhanVien nv ON yc.MaNhanVienXuLy = nv.MaNhanVien
                WHERE yc.TrangThai = @TrangThai
                ORDER BY yc.ThoiGianMongMuon ASC";
            
            return await connection.QueryAsync<YeuCauDatKham>(sql, new { TrangThai = trangThai });
        }

        public async Task<IEnumerable<YeuCauDatKham>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = @"
                SELECT 
                    yc.*,
                    bn.HoTen as TenBenhNhan,
                    bn.SoDienThoai,
                    pk.TenPhongKham,
                    nv.HoTen as TenNhanVienXuLy
                FROM YeuCauDatKham yc
                LEFT JOIN BenhNhan bn ON yc.MaBenhNhan = bn.MaBenhNhan
                LEFT JOIN PhongKham pk ON yc.MaPhongKham = pk.MaPhongKham
                LEFT JOIN NhanVien nv ON yc.MaNhanVienXuLy = nv.MaNhanVien
                ORDER BY yc.NgayTao DESC";
            
            return await connection.QueryAsync<YeuCauDatKham>(sql);
        }

        public async Task<bool> UpdateAsync(YeuCauDatKham yeuCau)
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = @"
                UPDATE YeuCauDatKham
                SET ThoiGianMongMuon = @ThoiGianMongMuon,
                    LyDoKham = @LyDoKham,
                    GhiChu = @GhiChu,
                    MaPhongKham = @MaPhongKham
                WHERE MaYeuCau = @MaYeuCau";
            
            var rowsAffected = await connection.ExecuteAsync(sql, yeuCau);
            return rowsAffected > 0;
        }

        public async Task<bool> XacNhanAsync(string maYeuCau, string maNhanVienXuLy, string? maPhongKham)
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = @"
                UPDATE YeuCauDatKham
                SET TrangThai = N'Đã xác nhận',
                    MaNhanVienXuLy = @MaNhanVienXuLy,
                    NgayXuLy = GETDATE(),
                    MaPhongKham = COALESCE(@MaPhongKham, MaPhongKham)
                WHERE MaYeuCau = @MaYeuCau";
            
            var rowsAffected = await connection.ExecuteAsync(sql, new 
            { 
                MaYeuCau = maYeuCau, 
                MaNhanVienXuLy = maNhanVienXuLy,
                MaPhongKham = maPhongKham
            });
            return rowsAffected > 0;
        }

        public async Task<bool> TuChoiAsync(string maYeuCau, string maNhanVienXuLy, string lyDoTuChoi)
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = @"
                UPDATE YeuCauDatKham
                SET TrangThai = N'Đã từ chối',
                    MaNhanVienXuLy = @MaNhanVienXuLy,
                    NgayXuLy = GETDATE(),
                    LyDoTuChoi = @LyDoTuChoi
                WHERE MaYeuCau = @MaYeuCau";
            
            var rowsAffected = await connection.ExecuteAsync(sql, new 
            { 
                MaYeuCau = maYeuCau, 
                MaNhanVienXuLy = maNhanVienXuLy,
                LyDoTuChoi = lyDoTuChoi
            });
            return rowsAffected > 0;
        }

        public async Task<bool> HuyAsync(string maYeuCau)
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = @"
                UPDATE YeuCauDatKham
                SET TrangThai = N'Đã hủy'
                WHERE MaYeuCau = @MaYeuCau";
            
            var rowsAffected = await connection.ExecuteAsync(sql, new { MaYeuCau = maYeuCau });
            return rowsAffected > 0;
        }

        public async Task<bool> UpdateMaDotKhamAsync(string maYeuCau, string maDotKham)
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = @"
                UPDATE YeuCauDatKham
                SET MaDotKham = @MaDotKham,
                    TrangThai = N'Đã tạo đợt khám'
                WHERE MaYeuCau = @MaYeuCau";
            
            var rowsAffected = await connection.ExecuteAsync(sql, new 
            { 
                MaYeuCau = maYeuCau, 
                MaDotKham = maDotKham 
            });
            return rowsAffected > 0;
        }

        public async Task<int> CountByTrangThaiAsync(string trangThai)
        {
            using var connection = new SqlConnection(_connectionString);
            
            var sql = "SELECT COUNT(*) FROM YeuCauDatKham WHERE TrangThai = @TrangThai";
            
            return await connection.ExecuteScalarAsync<int>(sql, new { TrangThai = trangThai });
        }
    }
}
