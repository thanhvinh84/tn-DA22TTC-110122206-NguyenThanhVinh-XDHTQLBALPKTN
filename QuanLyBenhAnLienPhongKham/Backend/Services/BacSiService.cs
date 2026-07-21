using Models;
using Repositories;

namespace Services
{
    public class BacSiService : IBacSiService
    {
        private readonly IBacSiRepository _repository;

        public BacSiService(IBacSiRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<BacSi>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<BacSi?> GetByIdAsync(string maBacSi)
        {
            return await _repository.GetByIdAsync(maBacSi);
        }

        public async Task<string> CreateAsync(BacSi bacSi)
        {
            return await _repository.CreateAsync(bacSi);
        }

        public async Task<bool> UpdateAsync(BacSi bacSi)
        {
            return await _repository.UpdateAsync(bacSi);
        }

        public async Task<bool> DeleteAsync(string maBacSi)
        {
            return await _repository.DeleteAsync(maBacSi);
        }
    }
}
