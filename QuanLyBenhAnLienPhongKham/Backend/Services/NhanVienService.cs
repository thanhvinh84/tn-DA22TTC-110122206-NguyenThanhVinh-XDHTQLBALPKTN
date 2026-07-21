using Models;
using DTOs;
using Repositories;

namespace Services
{
    public class NhanVienService : INhanVienService
    {
        private readonly INhanVienRepository _repository;
        private readonly IBacSiRepository _bacSiRepository;
        private readonly IDotKhamRepository _dotKhamRepository;

        public NhanVienService(INhanVienRepository repository, IBacSiRepository bacSiRepository, IDotKhamRepository dotKhamRepository)
        {
            _repository = repository;
            _bacSiRepository = bacSiRepository;
            _dotKhamRepository = dotKhamRepository;
        }

        public async Task<IEnumerable<NhanVienDetailDTO>> GetAllAsync()
        {
            var nhanViens = await _repository.GetAllAsync();
            var bacSis = await _bacSiRepository.GetAllAsync();
            var bacSiMaNhanViens = bacSis.Select(bs => bs.MaBacSi).ToHashSet();
            
            return nhanViens.Select(nv => new NhanVienDetailDTO
            {
                MaNhanVien = nv.MaNhanVien,
                MaPhongKham = nv.MaPhongKham,
                HoTen = nv.HoTen,
                CCCD = nv.CCCD,
                SoDienThoai = nv.SoDienThoai,
                Email = nv.Email,
                DiaChi = nv.DiaChi,
                NgayVaoLam = nv.NgayVaoLam,
                ChucVu = nv.ChucVu,
                LaBacSi = bacSiMaNhanViens.Contains(nv.MaNhanVien)
            });
        }

        public async Task<NhanVienDetailDTO?> GetByIdAsync(string maNhanVien)
        {
            var nhanVien = await _repository.GetByIdAsync(maNhanVien);
            if (nhanVien == null) return null;

            var bacSi = await _bacSiRepository.GetByIdAsync(maNhanVien);

            return new NhanVienDetailDTO
            {
                MaNhanVien = nhanVien.MaNhanVien,
                MaPhongKham = nhanVien.MaPhongKham,
                HoTen = nhanVien.HoTen,
                CCCD = nhanVien.CCCD,
                SoDienThoai = nhanVien.SoDienThoai,
                Email = nhanVien.Email,
                DiaChi = nhanVien.DiaChi,
                NgayVaoLam = nhanVien.NgayVaoLam,
                ChucVu = nhanVien.ChucVu,
                LaBacSi = bacSi != null
            };
        }

        public async Task<IEnumerable<NhanVienDetailDTO>> SearchAsync(string keyword)
        {
            var allNhanViens = await _repository.GetAllAsync();
            var bacSis = await _bacSiRepository.GetAllAsync();
            var bacSiMaNhanViens = bacSis.Select(bs => bs.MaBacSi).ToHashSet();
            
            if (string.IsNullOrWhiteSpace(keyword))
                return allNhanViens.Select(nv => new NhanVienDetailDTO
                {
                    MaNhanVien = nv.MaNhanVien,
                    MaPhongKham = nv.MaPhongKham,
                    HoTen = nv.HoTen,
                    CCCD = nv.CCCD,
                    SoDienThoai = nv.SoDienThoai,
                    Email = nv.Email,
                    DiaChi = nv.DiaChi,
                    NgayVaoLam = nv.NgayVaoLam,
                    ChucVu = nv.ChucVu,
                    LaBacSi = bacSiMaNhanViens.Contains(nv.MaNhanVien)
                });

            keyword = keyword.ToLower();
            var filtered = allNhanViens.Where(nv =>
                nv.HoTen.ToLower().Contains(keyword) ||
                (nv.CCCD != null && nv.CCCD.Contains(keyword)) ||
                (nv.SoDienThoai != null && nv.SoDienThoai.Contains(keyword)) ||
                (nv.Email != null && nv.Email.ToLower().Contains(keyword))
            );

            return filtered.Select(nv => new NhanVienDetailDTO
            {
                MaNhanVien = nv.MaNhanVien,
                MaPhongKham = nv.MaPhongKham,
                HoTen = nv.HoTen,
                CCCD = nv.CCCD,
                SoDienThoai = nv.SoDienThoai,
                Email = nv.Email,
                DiaChi = nv.DiaChi,
                NgayVaoLam = nv.NgayVaoLam,
                ChucVu = nv.ChucVu,
                LaBacSi = bacSiMaNhanViens.Contains(nv.MaNhanVien)
            });
        }

        public async Task<IEnumerable<NhanVienDetailDTO>> GetByPhongKhamAsync(string maPhongKham)
        {
            var allNhanViens = await _repository.GetAllAsync();
            var bacSis = await _bacSiRepository.GetAllAsync();
            var bacSiMaNhanViens = bacSis.Select(bs => bs.MaBacSi).ToHashSet();
            var filtered = allNhanViens.Where(nv => nv.MaPhongKham == maPhongKham);

            return filtered.Select(nv => new NhanVienDetailDTO
            {
                MaNhanVien = nv.MaNhanVien,
                MaPhongKham = nv.MaPhongKham,
                HoTen = nv.HoTen,
                CCCD = nv.CCCD,
                SoDienThoai = nv.SoDienThoai,
                Email = nv.Email,
                DiaChi = nv.DiaChi,
                NgayVaoLam = nv.NgayVaoLam,
                ChucVu = nv.ChucVu,
                LaBacSi = bacSiMaNhanViens.Contains(nv.MaNhanVien)
            });
        }

        public async Task<string> CreateAsync(NhanVienCreateDTO dto)
        {
            // Kiểm tra CCCD đã tồn tại chưa
            if (!string.IsNullOrWhiteSpace(dto.CCCD))
            {
                var existingNhanVien = await _repository.GetByCCCDAsync(dto.CCCD);
                if (existingNhanVien != null)
                {
                    throw new InvalidOperationException($"Số CCCD '{dto.CCCD}' đã được sử dụng bởi nhân viên {existingNhanVien.HoTen} ({existingNhanVien.MaNhanVien})");
                }
            }

            var nhanVien = new NhanVien
            {
                MaPhongKham = dto.MaPhongKham,
                HoTen = dto.HoTen,
                CCCD = dto.CCCD,
                SoDienThoai = dto.SoDienThoai,
                Email = dto.Email,
                DiaChi = dto.DiaChi,
                NgayVaoLam = dto.NgayVaoLam ?? DateTime.Now,
                ChucVu = dto.ChucVu
            };
            
            var maNhanVien = await _repository.CreateAsync(nhanVien);
            
            Console.WriteLine($"[NhanVienService] Created NhanVien: {maNhanVien}");
            Console.WriteLine($"[NhanVienService] dto.LaBacSi: {dto.LaBacSi}");
            
            // Nếu là bác sĩ, tạo bản ghi trong bảng BacSi
            if (dto.LaBacSi)
            {
                Console.WriteLine($"[NhanVienService] Creating BacSi record...");
                Console.WriteLine($"[NhanVienService] MaBacSi: {maNhanVien}");
                Console.WriteLine($"[NhanVienService] MaChuyenKhoa: {dto.ChuyenKhoa}");
                Console.WriteLine($"[NhanVienService] ChungChiHanhNghe: {dto.ChungChiHanhNghe}");
                Console.WriteLine($"[NhanVienService] BangCap: {dto.BangCap}");
                
                var bacSi = new BacSi
                {
                    MaBacSi = maNhanVien,
                    MaChuyenKhoa = dto.ChuyenKhoa,
                    BangCap = dto.BangCap,
                    ChungChiHanhNghe = dto.ChungChiHanhNghe
                };
                await _bacSiRepository.CreateAsync(bacSi);
                Console.WriteLine($"[NhanVienService] BacSi record created successfully!");
            }
            
            return maNhanVien;
        }

        public async Task<bool> UpdateAsync(NhanVienUpdateDTO dto)
        {
            // Kiểm tra CCCD đã tồn tại chưa (trừ chính nhân viên này)
            if (!string.IsNullOrWhiteSpace(dto.CCCD))
            {
                var existingNhanVien = await _repository.GetByCCCDAsync(dto.CCCD);
                if (existingNhanVien != null && existingNhanVien.MaNhanVien != dto.MaNhanVien)
                {
                    throw new InvalidOperationException($"Số CCCD '{dto.CCCD}' đã được sử dụng bởi nhân viên {existingNhanVien.HoTen} ({existingNhanVien.MaNhanVien})");
                }
            }

            var nhanVien = new NhanVien
            {
                MaNhanVien = dto.MaNhanVien,
                MaPhongKham = dto.MaPhongKham,
                HoTen = dto.HoTen,
                CCCD = dto.CCCD,
                SoDienThoai = dto.SoDienThoai,
                Email = dto.Email,
                DiaChi = dto.DiaChi,
                NgayVaoLam = dto.NgayVaoLam,
                ChucVu = dto.ChucVu
            };
            var result = await _repository.UpdateAsync(nhanVien);
            
            Console.WriteLine($"[NhanVienService.UpdateAsync] Updated NhanVien: {dto.MaNhanVien}, Result: {result}");
            
            return result;
        }

        public async Task<bool> DeleteAsync(string maNhanVien)
        {
            Console.WriteLine($"[NhanVienService.DeleteAsync] Deleting NhanVien: {maNhanVien}");
            
            // Kiểm tra xem nhân viên này có là bác sĩ không
            var bacSi = await _bacSiRepository.GetByIdAsync(maNhanVien);
            
            if (bacSi != null)
            {
                Console.WriteLine($"[NhanVienService.DeleteAsync] Nhân viên này là bác sĩ");
                
                // Kiểm tra xem bác sĩ có lịch sử khám bệnh không
                var dotKhamList = await _dotKhamRepository.GetByBacSiAsync(maNhanVien, null);
                
                if (dotKhamList != null && dotKhamList.Any())
                {
                    Console.WriteLine($"[NhanVienService.DeleteAsync] Bác sĩ đã có {dotKhamList.Count()} đợt khám, KHÔNG THỂ XÓA");
                    throw new InvalidOperationException(
                        $"Không thể xóa bác sĩ '{bacSi.HoTen}' vì đã có {dotKhamList.Count()} lượt khám bệnh. " +
                        "Dữ liệu lịch sử khám bệnh cần được lưu trữ theo quy định."
                    );
                }
                
                Console.WriteLine($"[NhanVienService.DeleteAsync] Bác sĩ chưa có lịch sử khám, xóa bản ghi BacSi trước");
                // Xóa bản ghi BacSi trước
                await _bacSiRepository.DeleteAsync(maNhanVien);
            }
            
            // Sau đó xóa bản ghi NhanVien
            var result = await _repository.DeleteAsync(maNhanVien);
            Console.WriteLine($"[NhanVienService.DeleteAsync] Deleted NhanVien: {result}");
            
            return result;
        }
    }
}
