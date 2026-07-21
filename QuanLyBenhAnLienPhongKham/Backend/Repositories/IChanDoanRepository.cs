using Models;

namespace Repositories
{
    public interface IChanDoanRepository
    {
        Task<IEnumerable<ChanDoan>> GetByDotKhamAsync(string maDotKham);
        Task<string> CreateAsync(ChanDoan chanDoan);
        Task<bool> UpdateAsync(ChanDoan chanDoan);
        Task<bool> DeleteAsync(string maChanDoan);
    }
}
