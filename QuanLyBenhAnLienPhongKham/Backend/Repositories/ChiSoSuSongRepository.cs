using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class ChiSoSuSongRepository : IChiSoSuSongRepository
    {
        private readonly string _connectionString;

        public ChiSoSuSongRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<ChiSoSuSong?> GetByDotKhamAsync(string maDotKham)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM ChiSoSuSong WHERE MaDotKham = @MaDotKham";
            return await connection.QueryFirstOrDefaultAsync<ChiSoSuSong>(sql, new { MaDotKham = maDotKham });
        }

        public async Task<string> CreateAsync(ChiSoSuSong chiSo)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã chỉ số tự động (CSS001, CSS002, ...)
            var maxMaSql = "SELECT TOP 1 MaChiSo FROM ChiSoSuSong ORDER BY MaChiSo DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "CSS001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(3));
                newMa = $"CSS{(number + 1):D3}";
            }
            
            chiSo.MaChiSo = newMa;
            
            var sql = @"INSERT INTO ChiSoSuSong (MaChiSo, MaDotKham, NhipTim, HuyetApTamThu, HuyetApTamTruong, CanNang, NhipTho, NhietDo)
                       VALUES (@MaChiSo, @MaDotKham, @NhipTim, @HuyetApTamThu, @HuyetApTamTruong, @CanNang, @NhipTho, @NhietDo)";
            await connection.ExecuteAsync(sql, chiSo);
            return newMa;
        }

        public async Task<bool> UpdateAsync(ChiSoSuSong chiSo)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE ChiSoSuSong 
                       SET NhipTim = @NhipTim, HuyetApTamThu = @HuyetApTamThu, HuyetApTamTruong = @HuyetApTamTruong,
                           CanNang = @CanNang, NhipTho = @NhipTho, NhietDo = @NhietDo
                       WHERE MaChiSo = @MaChiSo";
            var result = await connection.ExecuteAsync(sql, chiSo);
            return result > 0;
        }
    }
}
