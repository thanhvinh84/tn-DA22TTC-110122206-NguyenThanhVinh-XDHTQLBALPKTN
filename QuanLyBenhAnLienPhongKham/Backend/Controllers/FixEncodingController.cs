using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Controllers
{
    [ApiController]
    [Route("api/fix-encoding")]
    public class FixEncodingController : ControllerBase
    {
        private readonly string _connectionString;

        public FixEncodingController(string connectionString)
        {
            _connectionString = connectionString;
        }

        [HttpPost]
        public IActionResult FixEncoding()
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    
                    // Fix DanhMucBenh
                    var benh = new[] {
                        new { Ma = "DB001", Ten = "Cảm cúm" },
                        new { Ma = "DB002", Ten = "Viêm họng" },
                        new { Ma = "DB003", Ten = "Cao huyết áp" },
                        new { Ma = "DB004", Ten = "Đái tháo đường type 2" },
                        new { Ma = "DB005", Ten = "Viêm dạ dày" },
                        new { Ma = "DB006", Ten = "Viêm phổi" },
                        new { Ma = "DB007", Ten = "Đau đầu migraine" },
                        new { Ma = "DB008", Ten = "Viêm gan B" },
                        new { Ma = "DB009", Ten = "Sốt xuất huyết" },
                        new { Ma = "DB010", Ten = "Dị ứng thực phẩm" }
                    };
                    foreach (var item in benh)
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE DanhMucBenh SET TenBenh = @Ten WHERE MaBenh = @Ma";
                            cmd.Parameters.AddWithValue("@Ma", item.Ma);
                            cmd.Parameters.AddWithValue("@Ten", item.Ten);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    
                    // Fix DanhMucThuoc
                    var thuoc = new[] {
                        new { Ma = "TH001", Ten = "Paracetamol 500mg", CongDung = "Hạ sốt, giảm đau" },
                        new { Ma = "TH002", Ten = "Amoxicillin 500mg", CongDung = "Kháng sinh điều trị nhiễm khuẩn" },
                        new { Ma = "TH003", Ten = "Vitamin C 1000mg", CongDung = "Bổ sung vitamin C, tăng sức đề kháng" },
                        new { Ma = "TH004", Ten = "Omeprazole 20mg", CongDung = "Giảm acid dạ dày, điều trị viêm loét" },
                        new { Ma = "TH005", Ten = "Metformin 500mg", CongDung = "Điều trị đái tháo đường type 2" },
                        new { Ma = "TH006", Ten = "Amlodipine 5mg", CongDung = "Điều trị cao huyết áp" },
                        new { Ma = "TH007", Ten = "Cetirizine 10mg", CongDung = "Thuốc chống dị ứng" },
                        new { Ma = "TH008", Ten = "Ibuprofen 400mg", CongDung = "Giảm đau, hạ sốt, chống viêm" },
                        new { Ma = "TH009", Ten = "Azithromycin 250mg", CongDung = "Kháng sinh điều trị nhiễm khuẩn đường hô hấp" },
                        new { Ma = "TH010", Ten = "Loratadine 10mg", CongDung = "Thuốc chống dị ứng, viêm mũi" }
                    };
                    foreach (var item in thuoc)
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE DanhMucThuoc SET TenThuoc = @Ten, CongDung = @CongDung WHERE MaThuoc = @Ma";
                            cmd.Parameters.AddWithValue("@Ma", item.Ma);
                            cmd.Parameters.AddWithValue("@Ten", item.Ten);
                            cmd.Parameters.AddWithValue("@CongDung", item.CongDung);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    
                    // Fix NhanVien
                    var nhanvien = new[] {
                        new { Ma = "NV001", HoTen = "Nguyễn Văn Admin", DiaChi = "Hà Nội" },
                        new { Ma = "NV002", HoTen = "Trần Thị Bác Sĩ", DiaChi = "TP.HCM" },
                        new { Ma = "NV003", HoTen = "Lê Văn Lễ Tân", DiaChi = "Đà Nẵng" },
                        new { Ma = "NV004", HoTen = "Phạm Thị Nhi", DiaChi = "Hải Phòng" },
                        new { Ma = "NV005", HoTen = "Hoàng Văn Tim", DiaChi = "Cần Thơ" }
                    };
                    foreach (var item in nhanvien)
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE NhanVien SET HoTen = @HoTen, DiaChi = @DiaChi WHERE MaNhanVien = @Ma";
                            cmd.Parameters.AddWithValue("@Ma", item.Ma);
                            cmd.Parameters.AddWithValue("@HoTen", item.HoTen);
                            cmd.Parameters.AddWithValue("@DiaChi", item.DiaChi);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    
                    // Fix PhongKham
                    var phongkham = new[] {
                        new { Ma = "PK001", Ten = "Phòng Khám Đa Khoa", DiaChi = "123 Nguyễn Văn Linh, Q7, TP.HCM" },
                        new { Ma = "PK002", Ten = "Phòng Khám Nhi", DiaChi = "456 Lê Văn Việt, Q9, TP.HCM" },
                        new { Ma = "PK003", Ten = "Phòng Khám Tim Mạch", DiaChi = "789 Võ Văn Ngân, Thủ Đức, TP.HCM" }
                    };
                    foreach (var item in phongkham)
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE PhongKham SET TenPhongKham = @Ten, DiaChi = @DiaChi WHERE MaPhongKham = @Ma";
                            cmd.Parameters.AddWithValue("@Ma", item.Ma);
                            cmd.Parameters.AddWithValue("@Ten", item.Ten);
                            cmd.Parameters.AddWithValue("@DiaChi", item.DiaChi);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    
                    // Fix BenhNhan
                    var benhnhan = new[] {
                        new { Ma = "BN001", HoTen = "Nguyễn Văn An", GioiTinh = "Nam", DiaChi = "123 Lê Văn Việt, Q9, TP.HCM" },
                        new { Ma = "BN002", HoTen = "Trần Thị Bình", GioiTinh = "Nữ", DiaChi = "456 Võ Văn Ngân, Thủ Đức, TP.HCM" },
                        new { Ma = "BN003", HoTen = "Lê Văn Cường", GioiTinh = "Nam", DiaChi = "789 Nguyễn Thị Định, Q2, TP.HCM" },
                        new { Ma = "BN004", HoTen = "Phạm Thị Dung", GioiTinh = "Nữ", DiaChi = "321 Xa lộ Hà Nội, Q9, TP.HCM" },
                        new { Ma = "BN005", HoTen = "Hoàng Văn Em", GioiTinh = "Nam", DiaChi = "654 Quốc lộ 1A, Bình Thạnh, TP.HCM" },
                        new { Ma = "BN006", HoTen = "Võ Thị Phương", GioiTinh = "Nữ", DiaChi = "111 Điện Biên Phủ, Q3, TP.HCM" },
                        new { Ma = "BN007", HoTen = "Đặng Văn Giang", GioiTinh = "Nam", DiaChi = "222 Cách Mạng Tháng 8, Q10, TP.HCM" },
                        new { Ma = "BN008", HoTen = "Bùi Thị Hoa", GioiTinh = "Nữ", DiaChi = "333 Lý Thường Kiệt, Q11, TP.HCM" },
                        new { Ma = "BN009", HoTen = "Trương Văn Ích", GioiTinh = "Nam", DiaChi = "444 Trần Hưng Đạo, Q5, TP.HCM" },
                        new { Ma = "BN010", HoTen = "Ngô Thị Kim", GioiTinh = "Nữ", DiaChi = "555 Nguyễn Trãi, Q1, TP.HCM" }
                    };
                    foreach (var item in benhnhan)
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE BenhNhan SET HoTen = @HoTen, GioiTinh = @GioiTinh, DiaChi = @DiaChi WHERE MaBenhNhan = @Ma";
                            cmd.Parameters.AddWithValue("@Ma", item.Ma);
                            cmd.Parameters.AddWithValue("@HoTen", item.HoTen);
                            cmd.Parameters.AddWithValue("@GioiTinh", item.GioiTinh);
                            cmd.Parameters.AddWithValue("@DiaChi", item.DiaChi);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    
                    // Fix DotKham
                    var dotkham = new[] {
                        new { Ma = "DK001", LyDo = "Sốt, ho, đau họng", TrangThai = "Hoàn tất" },
                        new { Ma = "DK002", LyDo = "Khám định kỳ", TrangThai = "Hoàn tất" },
                        new { Ma = "DK003", LyDo = "Sốt cao", TrangThai = "Hoàn tất" },
                        new { Ma = "DK004", LyDo = "Đau dạ dày", TrangThai = "Hoàn tất" },
                        new { Ma = "DK005", LyDo = "Khó thở", TrangThai = "Hoàn tất" },
                        new { Ma = "DK006", LyDo = "Dị ứng da", TrangThai = "Hoàn tất" },
                        new { Ma = "DK007", LyDo = "Đau đầu", TrangThai = "Hoàn tất" },
                        new { Ma = "DK008", LyDo = "Viêm họng", TrangThai = "Hoàn tất" },
                        new { Ma = "DK009", LyDo = "Kiểm tra tim", TrangThai = "Hoàn tất" },
                        new { Ma = "DK010", LyDo = "Sốt, nôn", TrangThai = "Hoàn tất" }
                    };
                    foreach (var item in dotkham)
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE DotKham SET LyDoKham = @LyDo, TrangThai = @TrangThai WHERE MaDotKham = @Ma";
                            cmd.Parameters.AddWithValue("@Ma", item.Ma);
                            cmd.Parameters.AddWithValue("@LyDo", item.LyDo);
                            cmd.Parameters.AddWithValue("@TrangThai", item.TrangThai);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    
                    // Fix VaiTro
                    var vaitro = new[] {
                        new { Ma = "VT_ADMIN", Ten = "Quản trị viên" },
                        new { Ma = "VT_BACSI", Ten = "Bác sĩ" },
                        new { Ma = "VT_LETAN", Ten = "Lễ tân" },
                        new { Ma = "VT_KYTHUATVIEN", Ten = "Kỹ thuật viên" },
                        new { Ma = "VT_BENHNHAN", Ten = "Bệnh nhân" }
                    };
                    foreach (var item in vaitro)
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE VaiTro SET TenVaiTro = @Ten WHERE MaVaiTro = @Ma";
                            cmd.Parameters.AddWithValue("@Ma", item.Ma);
                            cmd.Parameters.AddWithValue("@Ten", item.Ten);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    
                    // Fix ChuyenKhoa
                    var chuyenkhoa = new[] {
                        new { Ma = "CK001", Ten = "Đa khoa" },
                        new { Ma = "CK002", Ten = "Nội khoa" },
                        new { Ma = "CK003", Ten = "Nhi khoa" },
                        new { Ma = "CK004", Ten = "Tim mạch" },
                        new { Ma = "CK005", Ten = "Da liễu" }
                    };
                    foreach (var item in chuyenkhoa)
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE ChuyenKhoa SET TenChuyenKhoa = @Ten WHERE MaChuyenKhoa = @Ma";
                            cmd.Parameters.AddWithValue("@Ma", item.Ma);
                            cmd.Parameters.AddWithValue("@Ten", item.Ten);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    
                    // Fix BacSi
                    var bacsi = new[] {
                        new { Ma = "NV002", BangCap = "Bác sĩ Đa khoa" },
                        new { Ma = "NV004", BangCap = "Bác sĩ Nhi khoa" },
                        new { Ma = "NV005", BangCap = "Bác sĩ Tim mạch" }
                    };
                    foreach (var item in bacsi)
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE BacSi SET BangCap = @BangCap WHERE MaBacSi = @Ma";
                            cmd.Parameters.AddWithValue("@Ma", item.Ma);
                            cmd.Parameters.AddWithValue("@BangCap", item.BangCap);
                            cmd.ExecuteNonQuery();
                        }
                    }
                }
                
                return Ok(new { success = true, message = "Đã sửa encoding cho tất cả bảng thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
