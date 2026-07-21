using Models;
using DTOs;
using Repositories;

namespace Services
{
    public class BenhNhanService : IBenhNhanService
    {
        private readonly IBenhNhanRepository _repository;
        private readonly IHoSoBenhAnRepository _hoSoRepository;

        public BenhNhanService(IBenhNhanRepository repository, IHoSoBenhAnRepository hoSoRepository)
        {
            _repository = repository;
            _hoSoRepository = hoSoRepository;
        }

        public async Task<IEnumerable<BenhNhan>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<BenhNhan?> GetByIdAsync(string maBenhNhan)
        {
            return await _repository.GetByIdAsync(maBenhNhan);
        }

        public async Task<IEnumerable<BenhNhan>> SearchAsync(string keyword)
        {
            return await _repository.SearchAsync(keyword);
        }

        public async Task<string> CreateAsync(BenhNhanCreateDTO dto)
        {
            // Tạo bệnh nhân mới
            var benhNhan = new BenhNhan
            {
                HoTen = dto.HoTen,
                CCCD = dto.CCCD,
                SoDienThoai = dto.SoDienThoai,
                Email = dto.Email,
                DiaChi = dto.DiaChi,
                NgaySinh = dto.NgaySinh,
                GioiTinh = dto.GioiTinh,
                SoBHYT = dto.SoBHYT,
                NgheNghiep = dto.NgheNghiep
            };
            
            var maBenhNhan = await _repository.CreateAsync(benhNhan);
            
            // Tự động tạo hồ sơ bệnh án
            var hoSo = new HoSoBenhAn
            {
                MaBenhNhan = maBenhNhan,
                NgayTao = DateTime.Now
            };
            
            await _hoSoRepository.CreateAsync(hoSo);
            
            return maBenhNhan;
        }

        public async Task<bool> UpdateAsync(BenhNhanUpdateDTO dto)
        {
            var benhNhan = new BenhNhan
            {
                MaBenhNhan = dto.MaBenhNhan,
                HoTen = dto.HoTen,
                CCCD = dto.CCCD,
                SoDienThoai = dto.SoDienThoai,
                Email = dto.Email,
                DiaChi = dto.DiaChi,
                NgaySinh = dto.NgaySinh,
                GioiTinh = dto.GioiTinh,
                SoBHYT = dto.SoBHYT,
                NgheNghiep = dto.NgheNghiep
            };
            return await _repository.UpdateAsync(benhNhan);
        }

        public async Task<bool> DeleteAsync(string maBenhNhan)
        {
            return await _repository.DeleteAsync(maBenhNhan);
        }
    }
}
