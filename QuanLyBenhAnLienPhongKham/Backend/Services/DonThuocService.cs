using Models;
using Repositories;
using DTOs;

namespace Services
{
    public class DonThuocService : IDonThuocService
    {
        private readonly IDonThuocRepository _donThuocRepo;
        private readonly IChiTietDonThuocRepository _chiTietRepo;
        private readonly IThongTinDiUngRepository _diUngRepo;
        private readonly IDanhMucThuocRepository _thuocRepo;

        public DonThuocService(
            IDonThuocRepository donThuocRepo, 
            IChiTietDonThuocRepository chiTietRepo,
            IThongTinDiUngRepository diUngRepo,
            IDanhMucThuocRepository thuocRepo)
        {
            _donThuocRepo = donThuocRepo;
            _chiTietRepo = chiTietRepo;
            _diUngRepo = diUngRepo;
            _thuocRepo = thuocRepo;
        }

        public async Task<DonThuoc?> GetByDotKhamAsync(string maDotKham)
        {
            var donThuoc = await _donThuocRepo.GetByDotKhamAsync(maDotKham);
            if (donThuoc != null)
            {
                // Load chi tiết đơn thuốc
                var chiTiet = await _chiTietRepo.GetByDonThuocAsync(donThuoc.MaDonThuoc);
                // Note: DonThuoc model doesn't have ChiTiet property, so we return separately
            }
            return donThuoc;
        }

        public async Task<string> CreateAsync(DonThuoc donThuoc)
        {
            return await _donThuocRepo.CreateAsync(donThuoc);
        }

        public async Task<IEnumerable<ChiTietDonThuoc>> GetChiTietAsync(string maDonThuoc)
        {
            return await _chiTietRepo.GetByDonThuocAsync(maDonThuoc);
        }

        public async Task<bool> AddChiTietAsync(ChiTietDonThuoc chiTiet)
        {
            return await _chiTietRepo.CreateAsync(chiTiet);
        }

        public async Task<bool> DeleteChiTietAsync(string maDonThuoc, string maThuoc)
        {
            return await _chiTietRepo.DeleteAsync(maDonThuoc, maThuoc);
        }

        public async Task<CanhBaoDiUng?> KiemTraDiUngAsync(string maDonThuoc, string maThuoc)
        {
            Console.WriteLine($"[DEBUG] KiemTraDiUng - MaDonThuoc: {maDonThuoc}, MaThuoc: {maThuoc}");
            
            // Lấy thông tin đơn thuốc để biết mã bệnh nhân
            var donThuoc = await _donThuocRepo.GetByIdAsync(maDonThuoc);
            Console.WriteLine($"[DEBUG] DonThuoc found: {donThuoc != null}, MaBenhNhan: {donThuoc?.MaBenhNhan}");
            
            if (donThuoc == null || string.IsNullOrEmpty(donThuoc.MaBenhNhan))
            {
                Console.WriteLine("[DEBUG] No patient info, returning null");
                return null;
            }

            // Lấy thông tin thuốc
            var thuoc = await _thuocRepo.GetByIdAsync(maThuoc);
            Console.WriteLine($"[DEBUG] Thuoc found: {thuoc != null}, TenThuoc: {thuoc?.TenThuoc}");
            
            if (thuoc == null)
            {
                Console.WriteLine("[DEBUG] Medicine not found, returning null");
                return null;
            }

            // Lấy danh sách dị ứng của bệnh nhân
            var danhSachDiUng = await _diUngRepo.GetByMaBenhNhanAsync(donThuoc.MaBenhNhan);
            Console.WriteLine($"[DEBUG] Found {danhSachDiUng.Count()} allergies for patient");
            
            foreach (var d in danhSachDiUng)
            {
                Console.WriteLine($"[DEBUG] Allergy: TenDiUng='{d.TenDiUng}', MucDo='{d.MucDoDiUng}'");
            }
            
            // Kiểm tra xem thuốc có trong danh sách dị ứng không (so sánh TenDiUng với TenThuoc)
            var diUng = danhSachDiUng.FirstOrDefault(d => 
                !string.IsNullOrEmpty(d.TenDiUng) && 
                d.TenDiUng.Trim().Equals(thuoc.TenThuoc.Trim(), StringComparison.OrdinalIgnoreCase)
            );

            if (diUng != null)
            {
                Console.WriteLine($"[DEBUG] ALLERGY MATCH FOUND! TenDiUng: {diUng.TenDiUng}");
                
                // Kiểm tra mức độ nghiêm trọng
                // Coi "Nghiêm trọng", "Rất nặng", "Nặng" là nghiêm trọng
                bool nghiemTrong = !string.IsNullOrEmpty(diUng.MucDoDiUng) && 
                                   (diUng.MucDoDiUng.Equals("Nghiêm trọng", StringComparison.OrdinalIgnoreCase) ||
                                    diUng.MucDoDiUng.Equals("Rất nặng", StringComparison.OrdinalIgnoreCase) ||
                                    diUng.MucDoDiUng.Equals("Nặng", StringComparison.OrdinalIgnoreCase));

                Console.WriteLine($"[DEBUG] Is severe? {nghiemTrong} (MucDo: {diUng.MucDoDiUng})");

                return new CanhBaoDiUng
                {
                    TenDiUng = diUng.TenDiUng ?? string.Empty,
                    MucDoDiUng = diUng.MucDoDiUng ?? "Không xác định",
                    TacNhan = diUng.TacNhan,
                    BieuHien = diUng.BieuHien,
                    NghiemTrong = nghiemTrong
                };
            }

            Console.WriteLine("[DEBUG] No allergy match, returning null");
            return null;
        }
    }
}
