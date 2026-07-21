using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class TaiKhoanRepository : ITaiKhoanRepository
    {
        private readonly string _connectionString;

        public TaiKhoanRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<TaiKhoan?> GetByUsernameAsync(string tenNguoiDung)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT tk.*, vt.TenVaiTro,
                        CASE 
                            WHEN tk.MaNhanVien IS NOT NULL THEN nv.HoTen
                            WHEN tk.MaBenhNhan IS NOT NULL THEN bn.HoTen
                            ELSE NULL
                        END as HoTen,
                        nv.MaPhongKham
                        FROM TaiKhoan tk
                        LEFT JOIN VaiTro vt ON tk.MaVaiTro = vt.MaVaiTro
                        LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                        LEFT JOIN BenhNhan bn ON tk.MaBenhNhan = bn.MaBenhNhan
                        WHERE tk.TenNguoiDung = @TenNguoiDung";
            return await connection.QueryFirstOrDefaultAsync<TaiKhoan>(sql, new { TenNguoiDung = tenNguoiDung });
        }

        public async Task<TaiKhoan?> GetByIdAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT tk.*, vt.TenVaiTro,
                        CASE 
                            WHEN tk.MaNhanVien IS NOT NULL THEN nv.HoTen
                            WHEN tk.MaBenhNhan IS NOT NULL THEN bn.HoTen
                            ELSE NULL
                        END as HoTen
                        FROM TaiKhoan tk
                        LEFT JOIN VaiTro vt ON tk.MaVaiTro = vt.MaVaiTro
                        LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                        LEFT JOIN BenhNhan bn ON tk.MaBenhNhan = bn.MaBenhNhan
                        WHERE tk.MaTaiKhoan = @Id";
            return await connection.QueryFirstOrDefaultAsync<TaiKhoan>(sql, new { Id = id });
        }

        public async Task<IEnumerable<TaiKhoan>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"SELECT tk.*, vt.TenVaiTro,
                        CASE 
                            WHEN tk.MaNhanVien IS NOT NULL THEN nv.HoTen
                            WHEN tk.MaBenhNhan IS NOT NULL THEN bn.HoTen
                            ELSE NULL
                        END as HoTen
                        FROM TaiKhoan tk
                        LEFT JOIN VaiTro vt ON tk.MaVaiTro = vt.MaVaiTro
                        LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                        LEFT JOIN BenhNhan bn ON tk.MaBenhNhan = bn.MaBenhNhan";
            return await connection.QueryAsync<TaiKhoan>(sql);
        }

        public async Task<string> CreateAsync(TaiKhoan taiKhoan)
        {
            using var connection = new SqlConnection(_connectionString);
            
            // Tạo mã tài khoản tự động (TK001, TK002, ...)
            var maxMaSql = "SELECT TOP 1 MaTaiKhoan FROM TaiKhoan ORDER BY MaTaiKhoan DESC";
            var maxMa = await connection.QueryFirstOrDefaultAsync<string>(maxMaSql);
            
            string newMa;
            if (string.IsNullOrEmpty(maxMa))
            {
                newMa = "TK001";
            }
            else
            {
                var number = int.Parse(maxMa.Substring(2));
                newMa = $"TK{(number + 1):D3}";
            }
            
            taiKhoan.MaTaiKhoan = newMa;
            taiKhoan.NgayTao = DateTime.Now;
            
            var sql = @"INSERT INTO TaiKhoan (MaTaiKhoan, MaVaiTro, MaNhanVien, MaBenhNhan, TenNguoiDung, MatKhau, TrangThai, NgayTao)
                       VALUES (@MaTaiKhoan, @MaVaiTro, @MaNhanVien, @MaBenhNhan, @TenNguoiDung, @MatKhau, @TrangThai, @NgayTao)";
            await connection.ExecuteAsync(sql, taiKhoan);
            return newMa;
        }

        public async Task<bool> UpdateAsync(TaiKhoan taiKhoan)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE TaiKhoan 
                       SET MaVaiTro = @MaVaiTro,
                           MaNhanVien = @MaNhanVien,
                           MaBenhNhan = @MaBenhNhan,
                           TenNguoiDung = @TenNguoiDung,
                           MatKhau = @MatKhau,
                           TrangThai = @TrangThai
                       WHERE MaTaiKhoan = @MaTaiKhoan";
            var result = await connection.ExecuteAsync(sql, taiKhoan);
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "DELETE FROM TaiKhoan WHERE MaTaiKhoan = @Id";
            var result = await connection.ExecuteAsync(sql, new { Id = id });
            return result > 0;
        }
    }
}
