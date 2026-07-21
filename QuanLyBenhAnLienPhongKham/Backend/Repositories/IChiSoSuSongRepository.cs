using Models;

namespace Repositories
{
    public interface IChiSoSuSongRepository
    {
        Task<ChiSoSuSong?> GetByDotKhamAsync(string maDotKham);
        Task<string> CreateAsync(ChiSoSuSong chiSo);
        Task<bool> UpdateAsync(ChiSoSuSong chiSo);
    }
}
