using Models;
using Repositories;

namespace Services
{
    public class PhongKhamService : IPhongKhamService
    {
        private readonly IPhongKhamRepository _repository;

        public PhongKhamService(IPhongKhamRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PhongKham>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<PhongKham?> GetByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<string> CreateAsync(PhongKham phongKham)
        {
            return await _repository.CreateAsync(phongKham);
        }

        public async Task<bool> UpdateAsync(PhongKham phongKham)
        {
            return await _repository.UpdateAsync(phongKham);
        }

        public async Task<bool> DeleteAsync(string id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}
