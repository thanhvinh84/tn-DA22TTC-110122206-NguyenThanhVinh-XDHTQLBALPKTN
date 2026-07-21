using Models;
using Repositories;

namespace Services
{
    public class ChanDoanService : IChanDoanService
    {
        private readonly IChanDoanRepository _repository;

        public ChanDoanService(IChanDoanRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ChanDoan>> GetByDotKhamAsync(string maDotKham)
        {
            return await _repository.GetByDotKhamAsync(maDotKham);
        }

        public async Task<string> CreateAsync(ChanDoan chanDoan)
        {
            return await _repository.CreateAsync(chanDoan);
        }

        public async Task<bool> UpdateAsync(ChanDoan chanDoan)
        {
            return await _repository.UpdateAsync(chanDoan);
        }

        public async Task<bool> DeleteAsync(string maChanDoan)
        {
            return await _repository.DeleteAsync(maChanDoan);
        }
    }
}
