using Models;

namespace Services
{
    public interface IChanDoanService
    {
        Task<IEnumerable<ChanDoan>> GetByDotKhamAsync(string maDotKham);
        Task<string> CreateAsync(ChanDoan chanDoan);
        Task<bool> UpdateAsync(ChanDoan chanDoan);
        Task<bool> DeleteAsync(string maChanDoan);
    }
}
