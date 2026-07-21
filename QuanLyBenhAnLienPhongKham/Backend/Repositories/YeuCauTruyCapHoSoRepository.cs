using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class YeuCauTruyCapHoSoRepository : IYeuCauTruyCapHoSoRepository
    {
        private readonly string _connectionString;

        public YeuCauTruyCapHoSoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<string> CreateAsync(YeuCauTruyCapHoSo yeuCau)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã yêu cầu tự động (YC001, YC002, ...)
            var maxMaSql = "SELECT TOP 1 MaYeuCau FROM YeuCauTruyCapHoSo ORDER BY MaYeuCau DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "YC001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"YC{(number + 1):D3}";
            }
            
            yeuCau.MaYeuCau = newMa;
            yeuCau.NgayYeuCau = DateTime.Now;
            yeuCau.TrangThai = "Chờ duyệt";
            
            var sql = @"INSERT INTO YeuCauTruyCapHoSo 
                       (MaYeuCau, MaBenhNhan, MaBacSiYeuCau, MaPhongKhamYeuCau, MaBacSiDuocYeuCau, MaPhongKhamDuocYeuCau, 
                        NgayYeuCau, TrangThai, LyDoYeuCau, GhiChu)
                       VALUES 
                       (@MaYeuCau, @MaBenhNhan, @MaBacSiYeuCau, @MaPhongKhamYeuCau, @MaBacSiDuocYeuCau, @MaPhongKhamDuocYeuCau, 
                        @NgayYeuCau, @TrangThai, @LyDoYeuCau, @GhiChu)";
            await connection.ExecuteAsync(sql, yeuCau);
            return newMa;
        }

        public async Task<YeuCauTruyCapHoSo?> GetByIdAsync(string maYeuCau)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT yc.*, 
                       bn.HoTen as TenBenhNhan,
                       nv1.HoTen as TenBacSiYeuCau,
                       pk1.TenPhongKham as TenPhongKhamYeuCau,
                       nv2.HoTen as TenBacSiDuocYeuCau,
                       pk2.TenPhongKham as TenPhongKhamDuocYeuCau
                       FROM YeuCauTruyCapHoSo yc
                       LEFT JOIN BenhNhan bn ON yc.MaBenhNhan = bn.MaBenhNhan
                       LEFT JOIN BacSi bs1 ON yc.MaBacSiYeuCau = bs1.MaBacSi
                       LEFT JOIN NhanVien nv1 ON bs1.MaBacSi = nv1.MaNhanVien
                       LEFT JOIN PhongKham pk1 ON yc.MaPhongKhamYeuCau = pk1.MaPhongKham
                       LEFT JOIN BacSi bs2 ON yc.MaBacSiDuocYeuCau = bs2.MaBacSi
                       LEFT JOIN NhanVien nv2 ON bs2.MaBacSi = nv2.MaNhanVien
                       LEFT JOIN PhongKham pk2 ON yc.MaPhongKhamDuocYeuCau = pk2.MaPhongKham
                       WHERE yc.MaYeuCau = @MaYeuCau";
            return await connection.QueryFirstOrDefaultAsync<YeuCauTruyCapHoSo>(sql, new { MaYeuCau = maYeuCau });
        }

        public async Task<IEnumerable<YeuCauTruyCapHoSo>> GetByBacSiYeuCauAsync(string maBacSi)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT yc.*, 
                       bn.HoTen as TenBenhNhan,
                       nv1.HoTen as TenBacSiYeuCau,
                       pk1.TenPhongKham as TenPhongKhamYeuCau,
                       nv2.HoTen as TenBacSiDuocYeuCau,
                       pk2.TenPhongKham as TenPhongKhamDuocYeuCau
                       FROM YeuCauTruyCapHoSo yc
                       LEFT JOIN BenhNhan bn ON yc.MaBenhNhan = bn.MaBenhNhan
                       LEFT JOIN BacSi bs1 ON yc.MaBacSiYeuCau = bs1.MaBacSi
                       LEFT JOIN NhanVien nv1 ON bs1.MaBacSi = nv1.MaNhanVien
                       LEFT JOIN PhongKham pk1 ON yc.MaPhongKhamYeuCau = pk1.MaPhongKham
                       LEFT JOIN BacSi bs2 ON yc.MaBacSiDuocYeuCau = bs2.MaBacSi
                       LEFT JOIN NhanVien nv2 ON bs2.MaBacSi = nv2.MaNhanVien
                       LEFT JOIN PhongKham pk2 ON yc.MaPhongKhamDuocYeuCau = pk2.MaPhongKham
                       WHERE yc.MaBacSiYeuCau = @MaBacSi
                       ORDER BY yc.NgayYeuCau DESC";
            return await connection.QueryAsync<YeuCauTruyCapHoSo>(sql, new { MaBacSi = maBacSi });
        }

        public async Task<IEnumerable<YeuCauTruyCapHoSo>> GetByBacSiDuocYeuCauAsync(string maBacSi)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT yc.*, 
                       bn.HoTen as TenBenhNhan,
                       nv1.HoTen as TenBacSiYeuCau,
                       pk1.TenPhongKham as TenPhongKhamYeuCau,
                       nv2.HoTen as TenBacSiDuocYeuCau,
                       pk2.TenPhongKham as TenPhongKhamDuocYeuCau
                       FROM YeuCauTruyCapHoSo yc
                       LEFT JOIN BenhNhan bn ON yc.MaBenhNhan = bn.MaBenhNhan
                       LEFT JOIN BacSi bs1 ON yc.MaBacSiYeuCau = bs1.MaBacSi
                       LEFT JOIN NhanVien nv1 ON bs1.MaBacSi = nv1.MaNhanVien
                       LEFT JOIN PhongKham pk1 ON yc.MaPhongKhamYeuCau = pk1.MaPhongKham
                       LEFT JOIN BacSi bs2 ON yc.MaBacSiDuocYeuCau = bs2.MaBacSi
                       LEFT JOIN NhanVien nv2 ON bs2.MaBacSi = nv2.MaNhanVien
                       LEFT JOIN PhongKham pk2 ON yc.MaPhongKhamDuocYeuCau = pk2.MaPhongKham
                       WHERE yc.MaBacSiDuocYeuCau = @MaBacSi
                       ORDER BY yc.NgayYeuCau DESC";
            return await connection.QueryAsync<YeuCauTruyCapHoSo>(sql, new { MaBacSi = maBacSi });
        }

        public async Task<bool> UpdateAsync(YeuCauTruyCapHoSo yeuCau)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE YeuCauTruyCapHoSo 
                       SET TrangThai = @TrangThai, LoaiQuyen = @LoaiQuyen, NgayBatDau = @NgayBatDau, 
                           NgayHetHan = @NgayHetHan, LyDoTuChoi = @LyDoTuChoi, NgayDuyet = @NgayDuyet, GhiChu = @GhiChu
                       WHERE MaYeuCau = @MaYeuCau";
            var result = await connection.ExecuteAsync(sql, yeuCau);
            return result > 0;
        }

        public async Task<bool> ChapNhanYeuCauAsync(string maYeuCau, string loaiQuyen, DateTime ngayHetHan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE YeuCauTruyCapHoSo 
                       SET TrangThai = N'Đã chấp nhận', LoaiQuyen = @LoaiQuyen, 
                           NgayBatDau = GETDATE(), NgayHetHan = @NgayHetHan, NgayDuyet = GETDATE()
                       WHERE MaYeuCau = @MaYeuCau";
            var result = await connection.ExecuteAsync(sql, new { MaYeuCau = maYeuCau, LoaiQuyen = loaiQuyen, NgayHetHan = ngayHetHan });
            return result > 0;
        }

        public async Task<bool> TuChoiYeuCauAsync(string maYeuCau, string lyDoTuChoi)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE YeuCauTruyCapHoSo 
                       SET TrangThai = N'Từ chối', LyDoTuChoi = @LyDoTuChoi, NgayDuyet = GETDATE()
                       WHERE MaYeuCau = @MaYeuCau";
            var result = await connection.ExecuteAsync(sql, new { MaYeuCau = maYeuCau, LyDoTuChoi = lyDoTuChoi });
            return result > 0;
        }

        public async Task<YeuCauTruyCapHoSo?> KiemTraQuyenTruyCapAsync(string maBacSi, string maBenhNhan, string maPhongKhamCuaBenhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT TOP 1 yc.*
                       FROM YeuCauTruyCapHoSo yc
                       WHERE yc.MaBacSiYeuCau = @MaBacSi 
                       AND yc.MaBenhNhan = @MaBenhNhan
                       AND yc.MaPhongKhamDuocYeuCau = @MaPhongKhamCuaBenhNhan
                       AND yc.TrangThai = N'Đã chấp nhận'
                       AND yc.NgayHetHan > GETDATE()
                       ORDER BY yc.NgayDuyet DESC";
            return await connection.QueryFirstOrDefaultAsync<YeuCauTruyCapHoSo>(sql, 
                new { MaBacSi = maBacSi, MaBenhNhan = maBenhNhan, MaPhongKhamCuaBenhNhan = maPhongKhamCuaBenhNhan });
        }
    }
}
