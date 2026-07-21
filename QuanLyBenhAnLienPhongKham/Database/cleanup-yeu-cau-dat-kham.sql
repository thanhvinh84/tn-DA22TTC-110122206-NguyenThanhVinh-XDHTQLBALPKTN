-- Script xóa trigger và bảng YeuCauDatKham cũ
USE QuanLyBenhAnLienPhongKham;
GO

-- Xóa trigger nếu tồn tại
IF OBJECT_ID('trg_YeuCauDatKham_GenerateId', 'TR') IS NOT NULL
BEGIN
    DROP TRIGGER trg_YeuCauDatKham_GenerateId;
    PRINT N'✅ Đã xóa trigger trg_YeuCauDatKham_GenerateId';
END
ELSE
BEGIN
    PRINT N'ℹ️ Trigger không tồn tại';
END
GO

-- Xóa bảng nếu tồn tại
IF OBJECT_ID('dbo.YeuCauDatKham', 'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.YeuCauDatKham;
    PRINT N'✅ Đã xóa bảng YeuCauDatKham';
END
ELSE
BEGIN
    PRINT N'ℹ️ Bảng không tồn tại';
END
GO

PRINT N'========================================';
PRINT N'✅ CLEANUP HOÀN TẤT!';
PRINT N'👉 Bây giờ hãy chạy file create-yeu-cau-dat-kham.sql';
PRINT N'========================================';
GO
