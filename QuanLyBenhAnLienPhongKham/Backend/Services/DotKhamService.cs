using Models;
using DTOs;
using Repositories;

namespace Services
{
    public class DotKhamService : IDotKhamService
    {
        private readonly IDotKhamRepository _repository;

        public DotKhamService(IDotKhamRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<DotKham>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<DotKham?> GetByIdAsync(string maDotKham)
        {
            return await _repository.GetByIdAsync(maDotKham);
        }

        public async Task<IEnumerable<DotKham>> GetByBacSiAsync(string maBacSi, string? trangThai)
        {
            return await _repository.GetByBacSiAsync(maBacSi, trangThai);
        }

        public async Task<IEnumerable<DotKham>> GetByHoSoAsync(string maHoSo)
        {
            return await _repository.GetByHoSoAsync(maHoSo);
        }

        public async Task<IEnumerable<DotKham>> GetByBenhNhanAsync(string maBenhNhan)
        {
            return await _repository.GetByBenhNhanAsync(maBenhNhan);
        }

        public async Task<string> CreateAsync(DotKhamCreateDTO dto)
        {
            // Xác định MaHoSo
            string maHoSo;
            if (!string.IsNullOrEmpty(dto.MaHoSo))
            {
                maHoSo = dto.MaHoSo;
            }
            else if (!string.IsNullOrEmpty(dto.MaBenhNhan))
            {
                // Tìm hoặc tạo hồ sơ bệnh án cho bệnh nhân
                var hoSo = await _repository.GetOrCreateHoSoByMaBenhNhanAsync(dto.MaBenhNhan);
                maHoSo = hoSo;
            }
            else
            {
                throw new ArgumentException("Phải cung cấp MaHoSo hoặc MaBenhNhan");
            }
            
            // Nếu không có MaPhongKham, lấy phòng khám đầu tiên
            string maPhongKham = dto.MaPhongKham;
            if (string.IsNullOrEmpty(maPhongKham))
            {
                // TODO: Lấy phòng khám mặc định từ database
                // Tạm thời dùng PK001
                maPhongKham = "PK001";
            }
            
            var dotKham = new DotKham
            {
                MaHoSo = maHoSo,
                MaPhongKham = maPhongKham,
                MaBacSi = dto.MaBacSi,
                MaLeTan = dto.MaLeTan,
                ThoiGianDen = dto.ThoiGianDen ?? DateTime.Now,
                LyDoKham = dto.LyDoKham ?? "Khám tổng quát",
                TrangThai = dto.TrangThai ?? "Chờ khám"
            };
            return await _repository.CreateAsync(dotKham);
        }

        public async Task<bool> UpdateAsync(DotKhamUpdateDTO dto)
        {
            // Validation: Đảm bảo TrangThai không null
            if (string.IsNullOrWhiteSpace(dto.TrangThai))
            {
                throw new ArgumentException("TrangThai không được để trống");
            }
            
            var dotKham = new DotKham
            {
                MaDotKham = dto.MaDotKham,
                MaBacSi = dto.MaBacSi,
                LyDoKham = dto.LyDoKham,
                TrangThai = dto.TrangThai
            };
            return await _repository.UpdateAsync(dotKham);
        }

        public async Task<bool> UpdateTrangThaiAsync(string maDotKham, string trangThai)
        {
            return await _repository.UpdateTrangThaiAsync(maDotKham, trangThai);
        }
    }
}
