-- Tạo bảng YeuCauDatKham cho chức năng đăng ký khám online
-- PHIÊN BẢN ĐƠN GIẢN - Backend tự generate MaYeuCau
USE QuanLyBenhAnLienPhongKham;
GO

-- Kiểm tra và xóa bảng nếu đã tồn tại
IF OBJECT_ID('dbo.YeuCauDatKham', 'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.YeuCauDatKham;
    PRINT N'🗑️ Đã xóa bảng YeuCauDatKham cũ';
END
GO

-- Tạo bảng YeuCauDatKham đơn giản
CREATE TABLE YeuCauDatKham (
    MaYeuCau NVARCHAR(50) PRIMARY KEY,
    MaBenhNhan NVARCHAR(50) NOT NULL,
    MaPhongKham NVARCHAR(50) NULL,
    ThoiGianMongMuon DATETIME NOT NULL,
    LyDoKham NVARCHAR(500) NOT NULL,
    GhiChu NVARCHAR(500) NULL,
    TrangThai NVARCHAR(50) DEFAULT N'Chờ xác nhận',
    NgayTao DATETIME DEFAULT GETDATE(),
    MaNhanVienXuLy NVARCHAR(50) NULL,
    NgayXuLy DATETIME NULL,
    LyDoTuChoi NVARCHAR(500) NULL,
    MaDotKham NVARCHAR(50) NULL
);
GO

PRINT N'✅ Đã tạo bảng YeuCauDatKham thành công!';
GO

-- Tạo index để tăng tốc truy vấn
CREATE INDEX IX_YeuCauDatKham_MaBenhNhan ON YeuCauDatKham(MaBenhNhan);
CREATE INDEX IX_YeuCauDatKham_TrangThai ON YeuCauDatKham(TrangThai);
CREATE INDEX IX_YeuCauDatKham_ThoiGianMongMuon ON YeuCauDatKham(ThoiGianMongMuon);
CREATE INDEX IX_YeuCauDatKham_NgayTao ON YeuCauDatKham(NgayTao);
GO

PRINT N'✅ Đã tạo các index thành công!';
GO

-- Thêm dữ liệu mẫu
INSERT INTO YeuCauDatKham (MaYeuCau, MaBenhNhan, MaPhongKham, ThoiGianMongMuon, LyDoKham, GhiChu, TrangThai, NgayTao)
VALUES 
    ('YC000001', 'BN009', 'PK001', DATEADD(DAY, 1, GETDATE()), N'Tái khám sau 1 tuần', N'Đã khám lần trước, cần tái khám', N'Chờ xác nhận', GETDATE()),
    ('YC000002', 'BN002', 'PK001', DATEADD(DAY, 2, GETDATE()), N'Đau đầu kéo dài', N'Đau đầu 3 ngày liên tục', N'Chờ xác nhận', GETDATE());
GO

PRINT N'✅ Đã thêm dữ liệu mẫu thành công!';
GO

PRINT N'========================================';
PRINT N'✅ TẠO BẢNG YeuCauDatKham HOÀN TẤT!';
PRINT N'📋 Cấu trúc: MaYeuCau, MaBenhNhan, ThoiGianMongMuon, LyDoKham, TrangThai, etc.';
PRINT N'📊 Trạng thái: Chờ xác nhận → Đã xác nhận/Từ chối → Đã tạo đợt khám';
PRINT N'🎉 Sẵn sàng để sử dụng!';
PRINT N'========================================';
GO

-- Hiển thị dữ liệu mẫu
SELECT * FROM YeuCauDatKham;
GO
