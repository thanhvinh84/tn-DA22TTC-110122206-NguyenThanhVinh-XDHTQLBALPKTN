using Dapper;
using Microsoft.Data.SqlClient;
using Models;

namespace Repositories
{
    public class VaiTroRepository : IVaiTroRepository
    {
        private readonly string _connectionString;

        public VaiTroRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<VaiTro>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<VaiTro>("SELECT * FROM VaiTro");
        }

        public async Task<VaiTro?> GetByIdAsync(string maVaiTro)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<VaiTro>(
                "SELECT * FROM VaiTro WHERE MaVaiTro = @MaVaiTro", 
                new { MaVaiTro = maVaiTro });
        }
    }
}
