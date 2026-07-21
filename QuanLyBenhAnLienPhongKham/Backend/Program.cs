using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Đảm bảo UTF-8 encoding cho tiếng Việt
        options.JsonSerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = false;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// Đăng ký Connection String
builder.Services.AddSingleton<string>(builder.Configuration.GetConnectionString("DefaultConnection"));

// Đăng ký Repositories
builder.Services.AddScoped<Repositories.IPhongKhamRepository, Repositories.PhongKhamRepository>();
builder.Services.AddScoped<Repositories.IVaiTroRepository, Repositories.VaiTroRepository>();
builder.Services.AddScoped<Repositories.IChuyenKhoaRepository, Repositories.ChuyenKhoaRepository>();
builder.Services.AddScoped<Repositories.IDanhMucBenhRepository, Repositories.DanhMucBenhRepository>();
builder.Services.AddScoped<Repositories.IDanhMucThuocRepository, Repositories.DanhMucThuocRepository>();
builder.Services.AddScoped<Repositories.IBenhNhanRepository, Repositories.BenhNhanRepository>();
builder.Services.AddScoped<Repositories.INhanVienRepository, Repositories.NhanVienRepository>();
builder.Services.AddScoped<Repositories.IBacSiRepository, Repositories.BacSiRepository>();
builder.Services.AddScoped<Repositories.ITaiKhoanRepository, Repositories.TaiKhoanRepository>();
builder.Services.AddScoped<Repositories.IHoSoBenhAnRepository, Repositories.HoSoBenhAnRepository>();
builder.Services.AddScoped<Repositories.IThongTinDiUngRepository, Repositories.ThongTinDiUngRepository>();
builder.Services.AddScoped<Repositories.IQuyenTruyCapHoSoRepository, Repositories.QuyenTruyCapHoSoRepository>();
builder.Services.AddScoped<Repositories.IDotKhamRepository, Repositories.DotKhamRepository>();
builder.Services.AddScoped<Repositories.IChiSoSuSongRepository, Repositories.ChiSoSuSongRepository>();
builder.Services.AddScoped<Repositories.IChanDoanRepository, Repositories.ChanDoanRepository>();
builder.Services.AddScoped<Repositories.IChiDinhCanLamSangRepository, Repositories.ChiDinhCanLamSangRepository>();
builder.Services.AddScoped<Repositories.IKetQuaCanLamSangRepository, Repositories.KetQuaCanLamSangRepository>();
builder.Services.AddScoped<Repositories.IDonThuocRepository, Repositories.DonThuocRepository>();
builder.Services.AddScoped<Repositories.IChiTietDonThuocRepository, Repositories.ChiTietDonThuocRepository>();
builder.Services.AddScoped<Repositories.IHoaDonRepository, Repositories.HoaDonRepository>();
builder.Services.AddScoped<Repositories.IYeuCauTruyCapHoSoRepository, Repositories.YeuCauTruyCapHoSoRepository>();
builder.Services.AddScoped<Repositories.ILichSuTruyCapHoSoRepository, Repositories.LichSuTruyCapHoSoRepository>();
builder.Services.AddScoped<Repositories.IYeuCauDatKhamRepository, Repositories.YeuCauDatKhamRepository>();

// Đăng ký Services
builder.Services.AddScoped<Services.IAuthService, Services.AuthService>();
builder.Services.AddScoped<Services.IVaiTroService, Services.VaiTroService>();
builder.Services.AddScoped<Services.IPhongKhamService, Services.PhongKhamService>();
builder.Services.AddScoped<Services.IBenhNhanService, Services.BenhNhanService>();
builder.Services.AddScoped<Services.INhanVienService, Services.NhanVienService>();
builder.Services.AddScoped<Services.IBacSiService, Services.BacSiService>();
builder.Services.AddScoped<Services.ITaiKhoanService, Services.TaiKhoanService>();
builder.Services.AddScoped<Services.IChuyenKhoaService, Services.ChuyenKhoaService>();
builder.Services.AddScoped<Services.IHoSoBenhAnService, Services.HoSoBenhAnService>();
builder.Services.AddScoped<Services.IDotKhamService, Services.DotKhamService>();
builder.Services.AddScoped<Services.IChanDoanService, Services.ChanDoanService>();
builder.Services.AddScoped<Services.IChiDinhCanLamSangService, Services.ChiDinhCanLamSangService>();
builder.Services.AddScoped<Services.IDonThuocService, Services.DonThuocService>();
builder.Services.AddScoped<Services.IHoaDonService, Services.HoaDonService>();
builder.Services.AddScoped<Services.IQuyenTruyCapService, Services.QuyenTruyCapService>();
builder.Services.AddScoped<Services.IQuyenTruyCapHoSoService, Services.QuyenTruyCapHoSoService>();
builder.Services.AddScoped<Services.IThongTinDiUngService, Services.ThongTinDiUngService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files from Frontend folder
var frontendPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "Frontend");
if (Directory.Exists(frontendPath))
{
    app.UseDefaultFiles(new DefaultFilesOptions
    {
        DefaultFileNames = new List<string> { "index.html" },
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(frontendPath)
    });
    
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(frontendPath),
        RequestPath = ""
    });
}

// Serve uploaded files from wwwroot/uploads
app.UseStaticFiles(); // Serve files from wwwroot

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Fallback to index.html for SPA routing (chỉ cho non-API routes)
app.MapFallback(async context =>
{
    // Không fallback cho API requests
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.StatusCode = 404;
        return;
    }
    
    // Serve index.html cho các routes khác
    var indexPath = Path.Combine(frontendPath, "index.html");
    if (File.Exists(indexPath))
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(indexPath);
    }
    else
    {
        context.Response.StatusCode = 404;
    }
});

app.Run();
