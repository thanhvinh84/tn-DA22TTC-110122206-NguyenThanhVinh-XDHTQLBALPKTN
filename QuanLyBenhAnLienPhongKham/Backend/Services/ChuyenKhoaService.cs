using Models;
using Repositories;

namespace Services
{
    public class ChuyenKhoaService : IChuyenKhoaService
    {
        private readonly IChuyenKhoaRepository _repository;

        public ChuyenKhoaService(IChuyenKhoaRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ChuyenKhoa>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<ChuyenKhoa?> GetByIdAsync(string maChuyenKhoa)
        {
            return await _repository.GetByIdAsync(maChuyenKhoa);
        }

        public async Task<string> CreateAsync(ChuyenKhoa chuyenKhoa)
        {
            return await _repository.CreateAsync(chuyenKhoa);
        }

        public async Task<bool> UpdateAsync(ChuyenKhoa chuyenKhoa)
        {
            return await _repository.UpdateAsync(chuyenKhoa);
        }

        public async Task<bool> DeleteAsync(string maChuyenKhoa)
        {
            return await _repository.DeleteAsync(maChuyenKhoa);
        }
    }
}
