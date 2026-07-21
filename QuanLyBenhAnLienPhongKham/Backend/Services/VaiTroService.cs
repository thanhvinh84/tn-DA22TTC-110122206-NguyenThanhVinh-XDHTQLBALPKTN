using Models;
using Repositories;

namespace Services
{
    public class VaiTroService : IVaiTroService
    {
        private readonly IVaiTroRepository _repository;

        public VaiTroService(IVaiTroRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<VaiTro>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<VaiTro?> GetByIdAsync(string maVaiTro)
        {
            return await _repository.GetByIdAsync(maVaiTro);
        }
    }
}
