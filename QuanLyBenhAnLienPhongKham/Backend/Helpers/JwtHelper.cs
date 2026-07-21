using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Helpers
{
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(string maTaiKhoan, string tenNguoiDung, string maVaiTro, string? maNhanVien, string? maBenhNhan)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            var claims = new List<Claim>
            {
                new Claim("MaTaiKhoan", maTaiKhoan),
                new Claim("TenNguoiDung", tenNguoiDung),
                new Claim("MaVaiTro", maVaiTro),
                new Claim(ClaimTypes.Role, maVaiTro)
            };

            if (!string.IsNullOrEmpty(maNhanVien))
            {
                claims.Add(new Claim("MaNhanVien", maNhanVien));
            }

            if (!string.IsNullOrEmpty(maBenhNhan))
            {
                claims.Add(new Claim("MaBenhNhan", maBenhNhan));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpireMinutes"])),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
