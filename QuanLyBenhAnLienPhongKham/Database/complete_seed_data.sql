-- =============================================
-- COMPLETE SEED DATA - Dữ liệu mẫu đầy đủ
-- Database: QL_BenhAnLienPhongKham
-- =============================================

USE QL_BenhAnLienPhongKham;
GO

PRINT N'========================================';
PRINT N'BẮT ĐẦU THÊM DỮ LIỆU MẪU ĐẦY ĐỦ';
PRINT N'========================================';
PRINT N'';

-- =============================================
-- 1. BÁC SĨ (3 bác sĩ từ NhanVien)
-- MaBacSi = MaNhanVien (FOREIGN KEY)
-- =============================================
PRINT N'=== 1. INSERT BÁC SĨ ===';

IF NOT EXISTS (SELECT 1 FROM BacSi WHERE MaBacSi = '3')
    INSERT INTO BacSi (MaBacSi, MaChuyenKhoa, ChungChiHanhNghe, BangCap) 
    VALUES ('3', 'CK001', N'BS-001-2020', N'Bác sĩ Đa khoa');

IF NOT EXISTS (SELECT 1 FROM BacSi WHERE MaBacSi = '4')
    INSERT INTO BacSi (MaBacSi, MaChuyenKhoa, ChungChiHanhNghe, BangCap) 
    VALUES ('4', 'CK002', N'BS-002-2019', N'Bác sĩ Chuyên khoa I');

IF NOT EXISTS (SELECT 1 FROM BacSi WHERE MaBacSi = 'NV005')
    INSERT INTO BacSi (MaBacSi, MaChuyenKhoa, ChungChiHanhNghe, BangCap) 
    VALUES ('NV005', 'CK003', N'BS-003-2021', N'Bác sĩ Chuyên khoa II');

PRINT N'✓ Đã thêm 3 bác sĩ';
PRINT N'';

-- =============================================
-- 2. ĐỢT KHÁM (8 đợt khám)
-- TrangThai: 'Chờ khám', 'Đang khám', 'Chờ xét nghiệm', 'Đã có kết quả', 'Hoàn tất', 'Hủy'
-- =============================================
PRINT N'=== 2. INSERT ĐỢT KHÁM ===';

IF NOT EXISTS (SELECT 1 FROM DotKham WHERE MaDotKham = 'DK001')
    INSERT INTO DotKham (MaDotKham, MaHoSo, MaPhongKham, MaBacSi, MaLeTan, ThoiGianDen, LyDoKham, TrangThai) 
    VALUES ('DK001', 'HS001', '1', '3', '2', '2024-01-15 09:00', N'Khám sức khỏe định kỳ', N'Hoàn tất');

IF NOT EXISTS (SELECT 1 FROM DotKham WHERE MaDotKham = 'DK002')
    INSERT INTO DotKham (MaDotKham, MaHoSo, MaPhongKham, MaBacSi, MaLeTan, ThoiGianDen, LyDoKham, TrangThai) 
    VALUES ('DK002', 'HS001', '1', '3', '2', '2024-03-20 10:30', N'Sốt, ho, đau họng', N'Hoàn tất');

IF NOT EXISTS (SELECT 1 FROM DotKham WHERE MaDotKham = 'DK003')
    INSERT INTO DotKham (MaDotKham, MaHoSo, MaPhongKham, MaBacSi, MaLeTan, ThoiGianDen, LyDoKham, TrangThai) 
    VALUES ('DK003', 'HS002', '1', '3', '2', '2024-01-20 14:00', N'Đau đầu, chóng mặt', N'Hoàn tất');

IF NOT EXISTS (SELECT 1 FROM DotKham WHERE MaDotKham = 'DK004')
    INSERT INTO DotKham (MaDotKham, MaHoSo, MaPhongKham, MaBacSi, MaLeTan, ThoiGianDen, LyDoKham, TrangThai) 
    VALUES ('DK004', 'HS002', '1', '3', '2', '2024-02-20 09:30', N'Tái khám cao huyết áp', N'Hoàn tất');

IF NOT EXISTS (SELECT 1 FROM DotKham WHERE MaDotKham = 'DK005')
    INSERT INTO DotKham (MaDotKham, MaHoSo, MaPhongKham, MaBacSi, MaLeTan, ThoiGianDen, LyDoKham, TrangThai) 
    VALUES ('DK005', 'HS003', 'PK002', '4', '2', '2024-02-01 11:00', N'Đau bụng, buồn nôn', N'Hoàn tất');

IF NOT EXISTS (SELECT 1 FROM DotKham WHERE MaDotKham = 'DK006')
    INSERT INTO DotKham (MaDotKham, MaHoSo, MaPhongKham, MaBacSi, MaLeTan, ThoiGianDen, LyDoKham, TrangThai) 
    VALUES ('DK006', 'HS004', 'PK002', '4', '2', '2024-02-10 15:30', N'Ngứa, nổi mẩn đỏ', N'Hoàn tất');

IF NOT EXISTS (SELECT 1 FROM DotKham WHERE MaDotKham = 'DK007')
    INSERT INTO DotKham (MaDotKham, MaHoSo, MaPhongKham, MaBacSi, MaLeTan, ThoiGianDen, LyDoKham, TrangThai) 
    VALUES ('DK007', 'HS005', 'PK003', 'NV005', '2', '2024-03-01 08:30', N'Khát nước nhiều, tiểu nhiều', N'Hoàn tất');

IF NOT EXISTS (SELECT 1 FROM DotKham WHERE MaDotKham = 'DK008')
    INSERT INTO DotKham (MaDotKham, MaHoSo, MaPhongKham, MaBacSi, MaLeTan, ThoiGianDen, LyDoKham, TrangThai) 
    VALUES ('DK008', 'HS001', '1', '3', '2', '2024-05-17 10:00', N'Đau họng, sốt nhẹ', N'Đang khám');

PRINT N'✓ Đã thêm 8 đợt khám';
PRINT N'';

-- =============================================
-- 3. CHỈ SỐ SỐNG (8 chỉ số)
-- =============================================
PRINT N'=== 3. INSERT CHỈ SỐ SỐNG ===';

IF NOT EXISTS (SELECT 1 FROM ChiSoSuSong WHERE MaChiSo = 'CS001')
    INSERT INTO ChiSoSuSong (MaChiSo, MaDotKham, NhipTim, HuyetApTamThu, HuyetApTamTruong, CanNang, NhipTho, NhietDo) 
    VALUES ('CS001', 'DK001', 75, 120, 80, 65.0, 18, 36.5);

IF NOT EXISTS (SELECT 1 FROM ChiSoSuSong WHERE MaChiSo = 'CS002')
    INSERT INTO ChiSoSuSong (MaChiSo, MaDotKham, NhipTim, HuyetApTamThu, HuyetApTamTruong, CanNang, NhipTho, NhietDo) 
    VALUES ('CS002', 'DK002', 88, 125, 82, 64.5, 22, 38.5);

IF NOT EXISTS (SELECT 1 FROM ChiSoSuSong WHERE MaChiSo = 'CS003')
    INSERT INTO ChiSoSuSong (MaChiSo, MaDotKham, NhipTim, HuyetApTamThu, HuyetApTamTruong, CanNang, NhipTho, NhietDo) 
    VALUES ('CS003', 'DK003', 92, 160, 100, 70.0, 20, 36.8);

IF NOT EXISTS (SELECT 1 FROM ChiSoSuSong WHERE MaChiSo = 'CS004')
    INSERT INTO ChiSoSuSong (MaChiSo, MaDotKham, NhipTim, HuyetApTamThu, HuyetApTamTruong, CanNang, NhipTho, NhietDo) 
    VALUES ('CS004', 'DK004', 78, 135, 85, 69.0, 18, 36.6);

IF NOT EXISTS (SELECT 1 FROM ChiSoSuSong WHERE MaChiSo = 'CS005')
    INSERT INTO ChiSoSuSong (MaChiSo, MaDotKham, NhipTim, HuyetApTamThu, HuyetApTamTruong, CanNang, NhipTho, NhietDo) 
    VALUES ('CS005', 'DK005', 72, 118, 75, 58.0, 17, 36.7);

IF NOT EXISTS (SELECT 1 FROM ChiSoSuSong WHERE MaChiSo = 'CS006')
    INSERT INTO ChiSoSuSong (MaChiSo, MaDotKham, NhipTim, HuyetApTamThu, HuyetApTamTruong, CanNang, NhipTho, NhietDo) 
    VALUES ('CS006', 'DK006', 80, 122, 78, 55.0, 19, 37.2);

IF NOT EXISTS (SELECT 1 FROM ChiSoSuSong WHERE MaChiSo = 'CS007')
    INSERT INTO ChiSoSuSong (MaChiSo, MaDotKham, NhipTim, HuyetApTamThu, HuyetApTamTruong, CanNang, NhipTho, NhietDo) 
    VALUES ('CS007', 'DK007', 85, 130, 85, 75.0, 19, 36.9);

IF NOT EXISTS (SELECT 1 FROM ChiSoSuSong WHERE MaChiSo = 'CS008')
    INSERT INTO ChiSoSuSong (MaChiSo, MaDotKham, NhipTim, HuyetApTamThu, HuyetApTamTruong, CanNang, NhipTho, NhietDo) 
    VALUES ('CS008', 'DK008', 82, 120, 80, 65.0, 20, 37.8);

PRINT N'✓ Đã thêm 8 chỉ số sống';
PRINT N'';

-- =============================================
-- 4. CHẨN ĐOÁN (8 chẩn đoán)
-- =============================================
PRINT N'=== 4. INSERT CHẨN ĐOÁN ===';

IF NOT EXISTS (SELECT 1 FROM ChanDoan WHERE MaChanDoan = 'CD001')
    INSERT INTO ChanDoan (MaChanDoan, MaHoSo, MaDotKham, MaBacSi, MaBenh, Loai, NoiDungChanDoan) 
    VALUES ('CD001', 'HS001', 'DK001', '3', NULL, N'Xác định', N'Sức khỏe tốt, không phát hiện bệnh lý. Khuyến cáo khám định kỳ 6 tháng/lần');

IF NOT EXISTS (SELECT 1 FROM ChanDoan WHERE MaChanDoan = 'CD002')
    INSERT INTO ChanDoan (MaChanDoan, MaHoSo, MaDotKham, MaBacSi, MaBenh, Loai, NoiDungChanDoan) 
    VALUES ('CD002', 'HS001', 'DK002', '3', 'B001', N'Xác định', N'Cảm cúm do virus, không biến chứng. Nghỉ ngơi, uống nhiều nước');

IF NOT EXISTS (SELECT 1 FROM ChanDoan WHERE MaChanDoan = 'CD003')
    INSERT INTO ChanDoan (MaChanDoan, MaHoSo, MaDotKham, MaBacSi, MaBenh, Loai, NoiDungChanDoan) 
    VALUES ('CD003', 'HS002', 'DK003', '3', 'B004', N'Xác định', N'Tăng huyết áp độ 2, chưa có biến chứng. Cần theo dõi và điều trị dài hạn');

IF NOT EXISTS (SELECT 1 FROM ChanDoan WHERE MaChanDoan = 'CD004')
    INSERT INTO ChanDoan (MaChanDoan, MaHoSo, MaDotKham, MaBacSi, MaBenh, Loai, NoiDungChanDoan) 
    VALUES ('CD004', 'HS002', 'DK004', '3', 'B004', N'Xác định', N'Cao huyết áp kiểm soát tốt với thuốc. Tiếp tục dùng thuốc, tái khám 1 tháng');

IF NOT EXISTS (SELECT 1 FROM ChanDoan WHERE MaChanDoan = 'CD005')
    INSERT INTO ChanDoan (MaChanDoan, MaHoSo, MaDotKham, MaBacSi, MaBenh, Loai, NoiDungChanDoan) 
    VALUES ('CD005', 'HS003', 'DK005', '4', 'B006', N'Xác định', N'Viêm dạ dày cấp do stress. Ăn uống điều độ, tránh cay nóng');

IF NOT EXISTS (SELECT 1 FROM ChanDoan WHERE MaChanDoan = 'CD006')
    INSERT INTO ChanDoan (MaChanDoan, MaHoSo, MaDotKham, MaBacSi, MaBenh, Loai, NoiDungChanDoan) 
    VALUES ('CD006', 'HS004', 'DK006', '4', 'B009', N'Xác định', N'Viêm da dị ứng, nguyên nhân chưa rõ. Tránh tiếp xúc chất gây dị ứng');

IF NOT EXISTS (SELECT 1 FROM ChanDoan WHERE MaChanDoan = 'CD007')
    INSERT INTO ChanDoan (MaChanDoan, MaHoSo, MaDotKham, MaBacSi, MaBenh, Loai, NoiDungChanDoan) 
    VALUES ('CD007', 'HS005', 'DK007', 'NV005', 'B005', N'Xác định', N'Đái tháo đường type 2, mới phát hiện. Cần điều chỉnh chế độ ăn và tập luyện');

IF NOT EXISTS (SELECT 1 FROM ChanDoan WHERE MaChanDoan = 'CD008')
    INSERT INTO ChanDoan (MaChanDoan, MaHoSo, MaDotKham, MaBacSi, MaBenh, Loai, NoiDungChanDoan) 
    VALUES ('CD008', 'HS001', 'DK008', '3', 'B002', N'Sơ bộ', N'Viêm họng cấp do virus. Uống nhiều nước, súc miệng nước muối');

PRINT N'✓ Đã thêm 8 chẩn đoán';
PRINT N'';

-- =============================================
-- 5. CHỈ ĐỊNH CẬN LÂM SÀNG (5 chỉ định)
-- TrangThai: 'Chờ thực hiện', 'Đang thực hiện', 'Đã có kết quả', 'Đã hủy'
-- =============================================
PRINT N'=== 5. INSERT CHỈ ĐỊNH CẬN LÂM SÀNG ===';

IF NOT EXISTS (SELECT 1 FROM ChiDinhCanLamSang WHERE MaChiDinh = 'CLS001')
    INSERT INTO ChiDinhCanLamSang (MaChiDinh, MaDotKham, MaBacSi, NgayChiDinh, LoaiChiDinh, GhiChu, TrangThai) 
    VALUES ('CLS001', 'DK001', '3', '2024-01-15', N'Xét nghiệm máu - Công thức máu', N'Xét nghiệm định kỳ', N'Đã có kết quả');

IF NOT EXISTS (SELECT 1 FROM ChiDinhCanLamSang WHERE MaChiDinh = 'CLS002')
    INSERT INTO ChiDinhCanLamSang (MaChiDinh, MaDotKham, MaBacSi, NgayChiDinh, LoaiChiDinh, GhiChu, TrangThai) 
    VALUES ('CLS002', 'DK003', '3', '2024-01-20', N'Xét nghiệm máu - Lipid máu', N'Đánh giá nguy cơ tim mạch', N'Đã có kết quả');

IF NOT EXISTS (SELECT 1 FROM ChiDinhCanLamSang WHERE MaChiDinh = 'CLS003')
    INSERT INTO ChiDinhCanLamSang (MaChiDinh, MaDotKham, MaBacSi, NgayChiDinh, LoaiChiDinh, GhiChu, TrangThai) 
    VALUES ('CLS003', 'DK003', '3', '2024-01-20', N'Điện tim đồ', N'Đánh giá chức năng tim', N'Đã có kết quả');

IF NOT EXISTS (SELECT 1 FROM ChiDinhCanLamSang WHERE MaChiDinh = 'CLS004')
    INSERT INTO ChiDinhCanLamSang (MaChiDinh, MaDotKham, MaBacSi, NgayChiDinh, LoaiChiDinh, GhiChu, TrangThai) 
    VALUES ('CLS004', 'DK005', '4', '2024-02-01', N'Nội soi dạ dày', N'Đánh giá tổn thương dạ dày', N'Đã có kết quả');

IF NOT EXISTS (SELECT 1 FROM ChiDinhCanLamSang WHERE MaChiDinh = 'CLS005')
    INSERT INTO ChiDinhCanLamSang (MaChiDinh, MaDotKham, MaBacSi, NgayChiDinh, LoaiChiDinh, GhiChu, TrangThai) 
    VALUES ('CLS005', 'DK007', 'NV005', '2024-03-01', N'Xét nghiệm máu - Đường huyết, HbA1c', N'Chẩn đoán đái tháo đường', N'Đã có kết quả');

PRINT N'✓ Đã thêm 5 chỉ định cận lâm sàng';
PRINT N'';

-- =============================================
-- 6. KẾT QUẢ CẬN LÂM SÀNG (5 kết quả)
-- =============================================
PRINT N'=== 6. INSERT KẾT QUẢ CẬN LÂM SÀNG ===';

IF NOT EXISTS (SELECT 1 FROM KetQuaCanLamSang WHERE MaKetQua = 'KQ001')
    INSERT INTO KetQuaCanLamSang (MaKetQua, MaChiDinh, MaHoSo, MaKyThuatVien, NgayCoKetQua, KetLuan, TepDinhKem, LoaiKetQua) 
    VALUES ('KQ001', 'CLS001', 'HS001', '4', '2024-01-15', N'WBC: 7.5, RBC: 4.8, Hb: 14.2, HCT: 42%. Các chỉ số trong giới hạn bình thường', NULL, N'Xét nghiệm máu');

IF NOT EXISTS (SELECT 1 FROM KetQuaCanLamSang WHERE MaKetQua = 'KQ002')
    INSERT INTO KetQuaCanLamSang (MaKetQua, MaChiDinh, MaHoSo, MaKyThuatVien, NgayCoKetQua, KetLuan, TepDinhKem, LoaiKetQua) 
    VALUES ('KQ002', 'CLS002', 'HS002', '4', '2024-01-20', N'Cholesterol: 240 mg/dL, LDL: 160 mg/dL, HDL: 45 mg/dL, Triglyceride: 180 mg/dL. Cholesterol và LDL cao, cần điều chỉnh chế độ ăn', NULL, N'Xét nghiệm máu');

IF NOT EXISTS (SELECT 1 FROM KetQuaCanLamSang WHERE MaKetQua = 'KQ003')
    INSERT INTO KetQuaCanLamSang (MaKetQua, MaChiDinh, MaHoSo, MaKyThuatVien, NgayCoKetQua, KetLuan, TepDinhKem, LoaiKetQua) 
    VALUES ('KQ003', 'CLS003', 'HS002', '4', '2024-01-20', N'Nhịp xoang đều, tần số 78 lần/phút, không có rối loạn nhịp. Điện tim bình thường', NULL, N'Điện tim');

IF NOT EXISTS (SELECT 1 FROM KetQuaCanLamSang WHERE MaKetQua = 'KQ004')
    INSERT INTO KetQuaCanLamSang (MaKetQua, MaChiDinh, MaHoSo, MaKyThuatVien, NgayCoKetQua, KetLuan, TepDinhKem, LoaiKetQua) 
    VALUES ('KQ004', 'CLS004', 'HS003', '4', '2024-02-01', N'Niêm mạc dạ dày sung huyết, phù nề, có vài điểm xuất huyết nhỏ. Viêm dạ dày cấp, không có loét', NULL, N'Nội soi');

IF NOT EXISTS (SELECT 1 FROM KetQuaCanLamSang WHERE MaKetQua = 'KQ005')
    INSERT INTO KetQuaCanLamSang (MaKetQua, MaChiDinh, MaHoSo, MaKyThuatVien, NgayCoKetQua, KetLuan, TepDinhKem, LoaiKetQua) 
    VALUES ('KQ005', 'CLS005', 'HS005', '4', '2024-03-01', N'Glucose lúc đói: 145 mg/dL, HbA1c: 7.2%. Đái tháo đường type 2, kiểm soát chưa tốt', NULL, N'Xét nghiệm máu');

PRINT N'✓ Đã thêm 5 kết quả cận lâm sàng';
PRINT N'';

-- =============================================
-- 7. ĐƠN THUỐC (7 đơn thuốc)
-- =============================================
PRINT N'=== 7. INSERT ĐƠN THUỐC ===';

IF NOT EXISTS (SELECT 1 FROM DonThuoc WHERE MaDonThuoc = 'DT001')
    INSERT INTO DonThuoc (MaDonThuoc, MaDotKham, MaBacSi, NgayLap) 
    VALUES ('DT001', 'DK002', '3', '2024-03-20');

IF NOT EXISTS (SELECT 1 FROM DonThuoc WHERE MaDonThuoc = 'DT002')
    INSERT INTO DonThuoc (MaDonThuoc, MaDotKham, MaBacSi, NgayLap) 
    VALUES ('DT002', 'DK003', '3', '2024-01-20');

IF NOT EXISTS (SELECT 1 FROM DonThuoc WHERE MaDonThuoc = 'DT003')
    INSERT INTO DonThuoc (MaDonThuoc, MaDotKham, MaBacSi, NgayLap) 
    VALUES ('DT003', 'DK004', '3', '2024-02-20');

IF NOT EXISTS (SELECT 1 FROM DonThuoc WHERE MaDonThuoc = 'DT004')
    INSERT INTO DonThuoc (MaDonThuoc, MaDotKham, MaBacSi, NgayLap) 
    VALUES ('DT004', 'DK005', '4', '2024-02-01');

IF NOT EXISTS (SELECT 1 FROM DonThuoc WHERE MaDonThuoc = 'DT005')
    INSERT INTO DonThuoc (MaDonThuoc, MaDotKham, MaBacSi, NgayLap) 
    VALUES ('DT005', 'DK006', '4', '2024-02-10');

IF NOT EXISTS (SELECT 1 FROM DonThuoc WHERE MaDonThuoc = 'DT006')
    INSERT INTO DonThuoc (MaDonThuoc, MaDotKham, MaBacSi, NgayLap) 
    VALUES ('DT006', 'DK007', 'NV005', '2024-03-01');

IF NOT EXISTS (SELECT 1 FROM DonThuoc WHERE MaDonThuoc = 'DT007')
    INSERT INTO DonThuoc (MaDonThuoc, MaDotKham, MaBacSi, NgayLap) 
    VALUES ('DT007', 'DK008', '3', '2024-05-17');

PRINT N'✓ Đã thêm 7 đơn thuốc';
PRINT N'';

-- =============================================
-- 8. HÓA ĐƠN (7 hóa đơn)
-- TrangThai: 'Chưa thanh toán', 'Đã thanh toán', 'Đã hủy'
-- =============================================
PRINT N'=== 8. INSERT HÓA ĐƠN ===';

IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHoaDon = 'HD001')
    INSERT INTO HoaDon (MaHoaDon, MaDotKham, NgayLap, TongTien, TrangThai) 
    VALUES ('HD001', 'DK001', '2024-01-15', 350000, N'Đã thanh toán');

IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHoaDon = 'HD002')
    INSERT INTO HoaDon (MaHoaDon, MaDotKham, NgayLap, TongTien, TrangThai) 
    VALUES ('HD002', 'DK002', '2024-03-20', 285000, N'Đã thanh toán');

IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHoaDon = 'HD003')
    INSERT INTO HoaDon (MaHoaDon, MaDotKham, NgayLap, TongTien, TrangThai) 
    VALUES ('HD003', 'DK003', '2024-01-20', 680000, N'Đã thanh toán');

IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHoaDon = 'HD004')
    INSERT INTO HoaDon (MaHoaDon, MaDotKham, NgayLap, TongTien, TrangThai) 
    VALUES ('HD004', 'DK004', '2024-02-20', 380000, N'Đã thanh toán');

IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHoaDon = 'HD005')
    INSERT INTO HoaDon (MaHoaDon, MaDotKham, NgayLap, TongTien, TrangThai) 
    VALUES ('HD005', 'DK005', '2024-02-01', 820000, N'Đã thanh toán');

IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHoaDon = 'HD006')
    INSERT INTO HoaDon (MaHoaDon, MaDotKham, NgayLap, TongTien, TrangThai) 
    VALUES ('HD006', 'DK006', '2024-02-10', 270000, N'Đã thanh toán');

IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHoaDon = 'HD007')
    INSERT INTO HoaDon (MaHoaDon, MaDotKham, NgayLap, TongTien, TrangThai) 
    VALUES ('HD007', 'DK007', '2024-03-01', 520000, N'Đã thanh toán');

PRINT N'✓ Đã thêm 7 hóa đơn';
PRINT N'';

-- =============================================
-- 9. CHI TIẾT ĐƠN THUỐC (11 chi tiết)
-- =============================================
PRINT N'=== 9. INSERT CHI TIẾT ĐƠN THUỐC ===';

-- Đơn thuốc DT001 (Cảm cúm)
IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT001' AND MaThuoc = 'T001')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT001', 'T001', 'HD002', 20, N'2 viên/lần', N'Uống 2 lần/ngày sau ăn, dùng trong 5 ngày');

IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT001' AND MaThuoc = 'T002')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT001', 'T002', 'HD002', 15, N'1 viên/lần', N'Uống 3 lần/ngày sau ăn, dùng trong 5 ngày');

IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT001' AND MaThuoc = 'T003')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT001', 'T003', 'HD002', 10, N'1 viên/ngày', N'Uống 1 lần/ngày sau ăn, dùng trong 10 ngày');

-- Đơn thuốc DT002 (Cao huyết áp)
IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT002' AND MaThuoc = 'T006')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT002', 'T006', 'HD003', 30, N'1 viên/ngày', N'Uống vào buổi sáng, dùng trong 30 ngày');

-- Đơn thuốc DT003 (Cao huyết áp - tái khám)
IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT003' AND MaThuoc = 'T006')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT003', 'T006', 'HD004', 30, N'1 viên/ngày', N'Uống vào buổi sáng, dùng trong 30 ngày');

-- Đơn thuốc DT004 (Viêm dạ dày)
IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT004' AND MaThuoc = 'T004')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT004', 'T004', 'HD005', 15, N'1 viên/ngày', N'Uống trước ăn sáng 30 phút, dùng trong 15 ngày');

-- Đơn thuốc DT005 (Dị ứng da)
IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT005' AND MaThuoc = 'T007')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT005', 'T007', 'HD006', 10, N'1 viên/ngày', N'Uống vào buổi tối, dùng trong 10 ngày');

IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT005' AND MaThuoc = 'T010')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT005', 'T010', 'HD006', 10, N'1 viên khi ngứa', N'Uống khi có triệu chứng ngứa');

-- Đơn thuốc DT006 (Đái tháo đường)
IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT006' AND MaThuoc = 'T005')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT006', 'T005', 'HD007', 60, N'2 viên/lần', N'Uống 2 lần/ngày sau ăn, dùng trong 30 ngày');

-- Đơn thuốc DT007 (Viêm họng - chưa có hóa đơn)
IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT007' AND MaThuoc = 'T001')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT007', 'T001', NULL, 10, N'2 viên/lần', N'Uống 2 lần/ngày sau ăn, dùng trong 5 ngày');

IF NOT EXISTS (SELECT 1 FROM ChiTietDonThuoc WHERE MaDonThuoc = 'DT007' AND MaThuoc = 'T009')
    INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, MaHoaDon, SoLuong, LieuDung, CachDung) 
    VALUES ('DT007', 'T009', NULL, 15, N'1 viên/lần', N'Uống 3 lần/ngày sau ăn, dùng trong 5 ngày');

PRINT N'✓ Đã thêm 11 chi tiết đơn thuốc';
PRINT N'';

-- =============================================
-- KẾT QUẢ TỔNG HỢP
-- =============================================
PRINT N'========================================';
PRINT N'KẾT QUẢ SEED DATA';
PRINT N'========================================';
PRINT N'';

SELECT 'PhongKham' AS Bang, COUNT(*) AS SoLuong FROM PhongKham
UNION ALL
SELECT 'ChuyenKhoa', COUNT(*) FROM ChuyenKhoa
UNION ALL
SELECT 'DanhMucBenh', COUNT(*) FROM DanhMucBenh
UNION ALL
SELECT 'DanhMucThuoc', COUNT(*) FROM DanhMucThuoc
UNION ALL
SELECT 'NhanVien', COUNT(*) FROM NhanVien
UNION ALL
SELECT 'BacSi', COUNT(*) FROM BacSi
UNION ALL
SELECT 'BenhNhan', COUNT(*) FROM BenhNhan
UNION ALL
SELECT 'TaiKhoan', COUNT(*) FROM TaiKhoan
UNION ALL
SELECT 'HoSoBenhAn', COUNT(*) FROM HoSoBenhAn
UNION ALL
SELECT 'ThongTinDiUng', COUNT(*) FROM ThongTinDiUng
UNION ALL
SELECT 'QuyenTruyCapHoSo', COUNT(*) FROM QuyenTruyCapHoSo
UNION ALL
SELECT 'DotKham', COUNT(*) FROM DotKham
UNION ALL
SELECT 'ChiSoSuSong', COUNT(*) FROM ChiSoSuSong
UNION ALL
SELECT 'ChanDoan', COUNT(*) FROM ChanDoan
UNION ALL
SELECT 'ChiDinhCanLamSang', COUNT(*) FROM ChiDinhCanLamSang
UNION ALL
SELECT 'KetQuaCanLamSang', COUNT(*) FROM KetQuaCanLamSang
UNION ALL
SELECT 'DonThuoc', COUNT(*) FROM DonThuoc
UNION ALL
SELECT 'ChiTietDonThuoc', COUNT(*) FROM ChiTietDonThuoc
UNION ALL
SELECT 'HoaDon', COUNT(*) FROM HoaDon;

PRINT N'';
PRINT N'========================================';
PRINT N'HOÀN TẤT SEED DATA!';
PRINT N'========================================';
PRINT N'✓ Đã thêm đầy đủ dữ liệu mẫu cho demo';
PRINT N'✓ Hãy reload trang web để xem dữ liệu mới';
PRINT N'';
