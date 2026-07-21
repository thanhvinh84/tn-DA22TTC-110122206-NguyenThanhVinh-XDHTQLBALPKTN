using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class LichSuTruyCapHoSoRepository : ILichSuTruyCapHoSoRepository
    {
        private readonly string _connectionString;

        public LichSuTruyCapHoSoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<string> CreateAsync(LichSuTruyCapHoSo lichSu)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã lịch sử tự động (LS001, LS002, ...)
            var maxMaSql = "SELECT TOP 1 MaLichSu FROM LichSuTruyCapHoSo ORDER BY MaLichSu DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "LS001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"LS{(number + 1):D3}";
            }
            
            lichSu.MaLichSu = newMa;
            lichSu.NgayTruyCap = DateTime.Now;
            
            var sql = @"INSERT INTO LichSuTruyCapHoSo 
                       (MaLichSu, MaBenhNhan, MaBacSi, MaPhongKham, MaHoSo, MaDotKham, LoaiTruyCap, NgayTruyCap, DiaChiIP, ThongTinBosung)
                       VALUES 
                       (@MaLichSu, @MaBenhNhan, @MaBacSi, @MaPhongKham, @MaHoSo, @MaDotKham, @LoaiTruyCap, @NgayTruyCap, @DiaChiIP, @ThongTinBosung)";
            await connection.ExecuteAsync(sql, lichSu);
            return newMa;
        }

        public async Task<IEnumerable<LichSuTruyCapHoSo>> GetByBenhNhanAsync(string maBenhNhan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT ls.*, 
                       bn.HoTen as TenBenhNhan,
                       nv.HoTen as TenBacSi,
                       pk.TenPhongKham as TenPhongKham
                       FROM LichSuTruyCapHoSo ls
                       LEFT JOIN BenhNhan bn ON ls.MaBenhNhan = bn.MaBenhNhan
                       LEFT JOIN BacSi bs ON ls.MaBacSi = bs.MaBacSi
                       LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                       LEFT JOIN PhongKham pk ON ls.MaPhongKham = pk.MaPhongKham
                       WHERE ls.MaBenhNhan = @MaBenhNhan
                       ORDER BY ls.NgayTruyCap DESC";
            return await connection.QueryAsync<LichSuTruyCapHoSo>(sql, new { MaBenhNhan = maBenhNhan });
        }

        public async Task<IEnumerable<LichSuTruyCapHoSo>> GetByBacSiAsync(string maBacSi, int? limit = null)
        {
            using var connection = new SqlConnection(_connectionString);
            var limitClause = limit.HasValue ? $"TOP {limit.Value}" : "";
            var sql = $@"SELECT {limitClause} ls.*, 
                        bn.HoTen as TenBenhNhan,
                        nv.HoTen as TenBacSi,
                        pk.TenPhongKham as TenPhongKham
                        FROM LichSuTruyCapHoSo ls
                        LEFT JOIN BenhNhan bn ON ls.MaBenhNhan = bn.MaBenhNhan
                        LEFT JOIN BacSi bs ON ls.MaBacSi = bs.MaBacSi
                        LEFT JOIN NhanVien nv ON bs.MaBacSi = nv.MaNhanVien
                        LEFT JOIN PhongKham pk ON ls.MaPhongKham = pk.MaPhongKham
                        WHERE ls.MaBacSi = @MaBacSi
                        ORDER BY ls.NgayTruyCap DESC";
            return await connection.QueryAsync<LichSuTruyCapHoSo>(sql, new { MaBacSi = maBacSi });
        }
    }
}
