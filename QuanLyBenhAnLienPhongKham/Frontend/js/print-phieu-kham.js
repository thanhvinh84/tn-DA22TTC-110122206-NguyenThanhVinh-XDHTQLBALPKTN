// Chức năng in phiếu khám
const PrintPhieuKham = {
    
    // In phiếu khám bệnh
    async inPhieuKham(maDotKham) {
        try {
            App.showLoading();
            
            // Load dữ liệu đợt khám
            const [dotKham, benhNhan, chanDoan, donThuoc, chiTietThuoc, chiSo] = await Promise.all([
                API.get(`/dot-kham/${maDotKham}`),
                this.getBenhNhanByDotKham(maDotKham),
                API.get(`/chan-doan/dot-kham/${maDotKham}`),
                API.get(`/don-thuoc/dot-kham/${maDotKham}`),
                this.getChiTietThuoc(maDotKham),
                API.get(`/chi-so-su-song/dot-kham/${maDotKham}`)
            ]);
            
            console.log('Print - DotKham data:', dotKham);
            console.log('Print - Doctor name:', dotKham.data?.hoTenBacSi);
            
            if (!dotKham.success || !benhNhan) {
                throw new Error('Không thể tải thông tin đợt khám');
            }
            
            const html = this.generatePhieuKhamHTML(
                dotKham.data,
                benhNhan,
                chanDoan.success ? chanDoan.data : [],
                chiTietThuoc,
                chiSo.success ? chiSo.data : null
            );
            
            // Mở cửa sổ mới để in
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            printWindow.document.write(html);
            printWindow.document.close();
            
            App.showToast('Đã mở phiếu khám để in', 'success');
            
        } catch (error) {
            console.error('Error:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    // In phiếu chỉ định xét nghiệm
    async inPhieuChiDinh(maDotKham) {
        try {
            App.showLoading();
            
            // Load dữ liệu bao gồm cả kết quả CLS
            const [dotKham, benhNhan, chiDinh, ketQuaCLS] = await Promise.all([
                API.get(`/dot-kham/${maDotKham}`),
                this.getBenhNhanByDotKham(maDotKham),
                API.get(`/chi-dinh/dot-kham/${maDotKham}`),
                API.get(`/ket-qua/dot-kham/${maDotKham}`)
            ]);
            
            console.log('Print Chi Dinh - DotKham data:', dotKham);
            console.log('Print Chi Dinh - Doctor name:', dotKham.data?.hoTenBacSi);
            console.log('Print Chi Dinh - Ket qua CLS:', ketQuaCLS);
            
            if (!dotKham.success || !benhNhan) {
                throw new Error('Không thể tải thông tin đợt khám');
            }
            
            if (!chiDinh.success || !chiDinh.data || chiDinh.data.length === 0) {
                App.showToast('Đợt khám này chưa có chỉ định xét nghiệm', 'warning');
                return;
            }
            
            const html = this.generatePhieuChiDinhHTML(
                dotKham.data,
                benhNhan,
                chiDinh.data,
                ketQuaCLS.success ? ketQuaCLS.data : []
            );
            
            // Mở cửa sổ mới để in
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            printWindow.document.write(html);
            printWindow.document.close();
            
            App.showToast('Đã mở phiếu chỉ định để in', 'success');
            
        } catch (error) {
            console.error('Error:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    // Lấy thông tin bệnh nhân từ đợt khám
    async getBenhNhanByDotKham(maDotKham) {
        try {
            const response = await API.get(`/dot-kham/${maDotKham}`);
            if (response.success && response.data && response.data.maBenhNhan) {
                const bnResponse = await API.get(`/benh-nhan/${response.data.maBenhNhan}`);
                return bnResponse.success ? bnResponse.data : null;
            }
            return null;
        } catch (error) {
            console.error('Error getting benh nhan:', error);
            return null;
        }
    },
    
    // Lấy chi tiết thuốc
    async getChiTietThuoc(maDotKham) {
        try {
            const response = await API.get(`/don-thuoc/dot-kham/${maDotKham}`);
            if (response.success && response.data && response.data.length > 0) {
                const donThuoc = response.data[0];
                const chiTietResponse = await API.get(`/don-thuoc/${donThuoc.maDonThuoc}/chi-tiet`);
                return chiTietResponse.success ? chiTietResponse.data : [];
            }
            return [];
        } catch (error) {
            console.error('Error getting chi tiet thuoc:', error);
            return [];
        }
    },
    
    // Tạo HTML phiếu khám bệnh - Template hoàn thiện (đồng bộ với kham-benh.js)
    generatePhieuKhamHTML(dotKham, benhNhan, chanDoan, chiTietThuoc, chiSo) {
        const ngayKham = dotKham.thoiGianDen ? new Date(dotKham.thoiGianDen) : new Date();
        const tenBacSi = dotKham.hoTenBacSi || dotKham.tenBacSi || 'Chưa có bác sĩ';
        const tenPhongKham = dotKham.tenPhongKham || 'PHÒNG KHÁM ĐA KHOA';
        const diaChiPhongKham = dotKham.diaChiPhongKham || '';
        const dienThoaiPhongKham = dotKham.dienThoaiPhongKham || '';
        
        // Tính ngày tái khám (mặc định sau 7 ngày)
        const ngayTaiKham = new Date(ngayKham);
        ngayTaiKham.setDate(ngayTaiKham.getDate() + 7);
        
        // Xử lý chẩn đoán
        const chanDoanText = chanDoan.length > 0 
            ? chanDoan.map(cd => cd.tenBenh || cd.noiDungChanDoan).filter(Boolean).join(', ')
            : 'Chưa có chẩn đoán';
        
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Đơn Thuốc - ${benhNhan.maBenhNhan}</title>
    <style>
        @media print {
            @page {
                size: A5 portrait;
                margin: 10mm;
            }
            body {
                margin: 0;
                padding: 0;
            }
            .no-print {
                display: none;
            }
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 13px;
            line-height: 1.4;
            color: #000;
            padding: 15px;
            max-width: 148mm;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        
        .logo-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .logo-left {
            text-align: left;
            flex: 1;
        }
        
        .logo-circle {
            width: 60px;
            height: 60px;
            border: 2px solid #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .clinic-name {
            font-size: 11px;
            font-weight: bold;
            margin: 2px 0;
        }
        
        .clinic-info {
            font-size: 10px;
            margin: 1px 0;
        }
        
        .barcode-section {
            text-align: right;
            flex: 0 0 auto;
        }
        
        .barcode-number {
            font-size: 10px;
            margin-bottom: 3px;
        }
        
        .barcode-image {
            width: 100px;
            height: 40px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
        }
        
        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 15px 0 10px 0;
            letter-spacing: 2px;
        }
        
        .patient-info {
            margin: 10px 0;
            font-size: 12px;
        }
        
        .info-row {
            margin: 4px 0;
            display: flex;
        }
        
        .info-label {
            font-weight: bold;
            min-width: 110px;
        }
        
        .prescription-section {
            margin: 15px 0;
        }
        
        .section-title {
            font-weight: bold;
            margin: 10px 0 5px 0;
            text-decoration: underline;
        }
        
        .medication-list {
            margin: 5px 0 5px 15px;
        }
        
        .medication-item {
            margin: 8px 0;
            page-break-inside: avoid;
        }
        
        .medication-name {
            font-weight: bold;
        }
        
        .medication-usage {
            margin-left: 15px;
            font-size: 12px;
        }
        
        .footer-section {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
        }
        
        .footer-left {
            text-align: left;
            font-size: 11px;
        }
        
        .footer-right {
            text-align: center;
            flex: 1;
        }
        
        .date-info {
            font-size: 12px;
            margin-bottom: 5px;
        }
        
        .signature-area {
            margin-top: 50px;
            font-size: 12px;
        }
        
        .notes {
            margin-top: 15px;
            font-size: 11px;
            border-top: 1px dashed #000;
            padding-top: 10px;
        }
        
        .notes-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .note-item {
            margin: 2px 0 2px 10px;
        }
        
        .stamp-box {
            text-align: center;
            font-style: italic;
            font-size: 11px;
            margin-top: 15px;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
        }
        
        .print-button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">
        🖨️ In Đơn Thuốc
    </button>
    
    <div class="header">
        <div class="logo-section">
            <div class="logo-left">
                <div class="logo-circle">
                    🏥<br>LOGO
                </div>
                <div class="clinic-name">${tenPhongKham.toUpperCase()}</div>
                <div class="clinic-info">Địa chỉ: ${diaChiPhongKham || 'Vui lòng cập nhật địa chỉ'}</div>
                <div class="clinic-info">Điện thoại: ${dienThoaiPhongKham || 'Vui lòng cập nhật SĐT'}</div>
            </div>
            
            <div class="barcode-section">
                <div class="barcode-number">Mã phiếu</div>
                <div class="barcode-image">
                    ${dotKham.maDotKham}
                </div>
            </div>
        </div>
    </div>
    
    <div class="title">ĐƠN THUỐC</div>
    
    <div class="patient-info">
        <div class="info-row">
            <span class="info-label">Họ tên:</span>
            <span><strong>${benhNhan.hoTen.toUpperCase()}</strong></span>
        </div>
        <div class="info-row" style="align-items: flex-start;">
            <span class="info-label" style="padding-top: 2px;">Số định danh:</span>
            <div style="flex: 1;">
                <div style="margin-bottom: 3px;">
                    <span style="text-decoration: underline;">Số định danh cá nhân</span>/<span style="text-decoration: underline;">số căn cước công dân</span>/<span style="text-decoration: underline;">số hộ chiếu của người bệnh (nếu có)</span>
                    <strong style="margin-left: 20px; font-size: 14px;">${benhNhan.cccd || '___________'}</strong>
                </div>
                <div style="font-size: 10px; font-style: italic; color: #555;">
                    (căn cước /hộ gia đình cộng đồng hoặc thẻ khám của người bệnh/thẻ cư trú)
                </div>
            </div>
        </div>
        <div class="info-row">
            <span class="info-label">Ngày sinh:</span>
            <span>${benhNhan.ngaySinh ? new Date(benhNhan.ngaySinh).toLocaleDateString('vi-VN') : '-'}</span>
            <span style="margin-left: 40px;" class="info-label">Cân nặng:</span>
            <span>${chiSo && chiSo.canNang ? chiSo.canNang + 'kg' : '-'}</span>
            <span style="margin-left: 20px;" class="info-label">Giới tính:</span>
            <span style="display: inline-flex; align-items: center;">
                <span style="border: 1px solid #000; width: 12px; height: 12px; display: inline-block; margin: 0 3px; text-align: center; line-height: 12px;">${benhNhan.gioiTinh === 'Nam' ? 'X' : ''}</span> Nam
                <span style="border: 1px solid #000; width: 12px; height: 12px; display: inline-block; margin: 0 3px; text-align: center; line-height: 12px;">${benhNhan.gioiTinh === 'Nữ' ? 'X' : ''}</span> Nữ
            </span>
        </div>
        <div class="info-row">
            <span class="info-label">Nơi thường trú:</span>
            <span>${benhNhan.diaChi || '-'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Chẩn đoán:</span>
            <span>${chanDoanText}</span>
        </div>
    </div>
    
    <div class="prescription-section">
        <div class="section-title">Thuốc điều trị:</div>
        <div class="medication-list">
            ${chiTietThuoc.length > 0 ? chiTietThuoc.map((thuoc, index) => {
                // Tính số ngày dựa trên liều dùng
                let soNgay = thuoc.soLuong;
                let displayNgay = '';
                
                // Parse liều dùng để tính số ngày thực tế
                const lieuDung = (thuoc.lieuDung || '').trim();
                
                if (lieuDung && thuoc.soLuong > 0) {
                    // Pattern 1: "X viên/ngày" hoặc "X lần/ngày"
                    const matchViênNgay = lieuDung.match(/(\d+)\s*(viên|lần)\/ngày/i);
                    if (matchViênNgay) {
                        const soViênMoiNgay = parseInt(matchViênNgay[1]);
                        if (soViênMoiNgay > 0) {
                            soNgay = Math.ceil(thuoc.soLuong / soViênMoiNgay);
                            displayNgay = `x <strong>${soNgay}</strong> ngày`;
                        }
                    }
                    
                    // Pattern 2: "SÁNG X TRƯA Y TỐI Z" (3 lần/ngày)
                    if (!displayNgay) {
                        const matchSangTruaToi = lieuDung.match(/sáng\s*(\d+).*?trưa\s*(\d+).*?tối\s*(\d+)/i);
                        if (matchSangTruaToi) {
                            const tong = parseInt(matchSangTruaToi[1]) + parseInt(matchSangTruaToi[2]) + parseInt(matchSangTruaToi[3]);
                            if (tong > 0) {
                                soNgay = Math.ceil(thuoc.soLuong / tong);
                                displayNgay = `x <strong>${soNgay}</strong> ngày`;
                            }
                        }
                    }
                    
                    // Pattern 3: "SÁNG X CHIỀU Y" hoặc "SÁNG X TỐI Y" (2 lần/ngày)
                    if (!displayNgay) {
                        const matchSangChieu = lieuDung.match(/sáng\s*(\d+).*?chiều\s*(\d+)/i);
                        const matchSangToi = lieuDung.match(/sáng\s*(\d+).*?tối\s*(\d+)/i);
                        const matchTruaToi = lieuDung.match(/trưa\s*(\d+).*?tối\s*(\d+)/i);
                        
                        const match = matchSangChieu || matchSangToi || matchTruaToi;
                        if (match) {
                            const tong = parseInt(match[1]) + parseInt(match[2]);
                            if (tong > 0) {
                                soNgay = Math.ceil(thuoc.soLuong / tong);
                                displayNgay = `x <strong>${soNgay}</strong> ngày`;
                            }
                        }
                    }
                }
                
                return `
                <div class="medication-item">
                    <div>${index + 1}) <span class="medication-name">${thuoc.tenThuoc.toUpperCase()}</span> ${displayNgay} <strong>SL: ${thuoc.soLuong || '-'} Viên</strong></div>
                    <div class="medication-usage">Cách dùng: ${thuoc.cachDung || '-'}</div>
                    <div class="medication-usage">${thuoc.lieuDung || '-'}</div>
                </div>
            `}).join('') : '<div class="medication-item"><em>Chưa có thuốc được kê đơn</em></div>'}
        </div>
    </div>
    
    <div class="footer-section">
        <div class="footer-left">
            <div>Ngày tái khám: <strong>${ngayTaiKham.toLocaleDateString('vi-VN')}</strong></div>
        </div>
        <div class="footer-right">
            <div class="date-info">Ngày ${ngayKham.getDate().toString().padStart(2, '0')} tháng ${(ngayKham.getMonth() + 1).toString().padStart(2, '0')} năm ${ngayKham.getFullYear()}</div>
            <div style="font-weight: bold;">Bác sỹ/Y sỹ khám bệnh</div>
            <div style="font-style: italic; font-size: 11px;">(Ký, ghi rõ họ tên)</div>
            <div class="signature-area">
                <strong>${tenBacSi}</strong>
            </div>
        </div>
    </div>
    
    <div class="notes">
        <div class="notes-title">- Khám bệnh lại xin mang theo đơn này.</div>
        <div class="note-item">- Số điện thoại liên hệ: ${dienThoaiPhongKham || '0123456789'}</div>
        <div class="note-item">- Hẹn và hỗ trợ người trẻ đến khám bệnh, không chích bệnh.</div>
    </div>
</body>
</html>
        `;
    },
    
    // Tạo HTML phiếu chỉ định - Template hoàn thiện với kết quả CLS
    generatePhieuChiDinhHTML(dotKham, benhNhan, chiDinh, ketQuaCLS = []) {
        const ngayKham = dotKham.thoiGianDen ? new Date(dotKham.thoiGianDen) : new Date();
        const tenBacSi = dotKham.hoTenBacSi || dotKham.tenBacSi || 'Chưa có bác sĩ';
        const tenPhongKham = dotKham.tenPhongKham || 'PHÒNG KHÁM ĐA KHOA';
        const diaChiPhongKham = dotKham.diaChiPhongKham || '';
        const dienThoaiPhongKham = dotKham.dienThoaiPhongKham || '';
        
        // Kiểm tra có kết quả CLS không
        const hasKetQua = ketQuaCLS && ketQuaCLS.length > 0;
        
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Phiếu Chỉ Định - ${benhNhan.maBenhNhan}</title>
    <style>
        @media print {
            @page {
                size: A5 portrait;
                margin: 10mm;
            }
            body {
                margin: 0;
                padding: 0;
            }
            .no-print {
                display: none;
            }
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 13px;
            line-height: 1.4;
            color: #000;
            padding: 15px;
            max-width: 148mm;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        
        .logo-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .logo-left {
            text-align: left;
            flex: 1;
        }
        
        .logo-circle {
            width: 60px;
            height: 60px;
            border: 2px solid #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .clinic-name {
            font-size: 11px;
            font-weight: bold;
            margin: 2px 0;
        }
        
        .clinic-info {
            font-size: 10px;
            margin: 1px 0;
        }
        
        .barcode-section {
            text-align: right;
            flex: 0 0 auto;
        }
        
        .barcode-number {
            font-size: 10px;
            margin-bottom: 3px;
        }
        
        .barcode-image {
            width: 100px;
            height: 40px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
        }
        
        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 15px 0 10px 0;
            letter-spacing: 2px;
        }
        
        .date-line {
            text-align: center;
            font-size: 12px;
            font-style: italic;
            margin-bottom: 15px;
        }
        
        .patient-info {
            margin: 10px 0;
            font-size: 12px;
        }
        
        .info-row {
            margin: 4px 0;
            display: flex;
        }
        
        .info-label {
            font-weight: bold;
            min-width: 80px;
        }
        
        .indication-section {
            margin: 20px 0;
        }
        
        .section-title {
            font-weight: bold;
            font-size: 14px;
            margin: 15px 0 10px 0;
            text-align: center;
            text-decoration: underline;
        }
        
        .indication-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 12px;
        }
        
        .indication-table th,
        .indication-table td {
            border: 1px solid #000;
            padding: 6px 8px;
            text-align: left;
        }
        
        .indication-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        
        .indication-table td:first-child {
            text-align: center;
            width: 40px;
        }
        
        .footer-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
        }
        
        .footer-left {
            text-align: center;
            flex: 1;
        }
        
        .footer-right {
            text-align: center;
            flex: 1;
        }
        
        .signature-title {
            font-style: italic;
            font-size: 11px;
            margin-bottom: 5px;
        }
        
        .signature-area {
            margin-top: 50px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .notes {
            margin-top: 20px;
            font-size: 11px;
            border-top: 1px dashed #000;
            padding-top: 10px;
        }
        
        .notes-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
        }
        
        .print-button:hover {
            background: #0056b3;
        }
        
        .result-section {
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        .result-item {
            margin: 15px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            page-break-inside: avoid;
        }
        
        .result-header {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 8px;
            color: #0066cc;
        }
        
        .result-content {
            font-size: 12px;
            margin: 5px 0;
        }
        
        .result-image {
            margin: 10px 0;
            text-align: center;
        }
        
        .result-image img {
            max-width: 100%;
            max-height: 400px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        
        .no-result {
            color: #666;
            font-style: italic;
            text-align: center;
            padding: 10px;
        }
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">
        🖨️ In Phiếu Chỉ Định
    </button>
    
    <div class="header">
        <div class="logo-section">
            <div class="logo-left">
                <div class="logo-circle">
                    🏥<br>LOGO
                </div>
                <div class="clinic-name">${tenPhongKham.toUpperCase()}</div>
                <div class="clinic-info">Địa chỉ: ${diaChiPhongKham || 'Vui lòng cập nhật địa chỉ'}</div>
                <div class="clinic-info">Điện thoại: ${dienThoaiPhongKham || 'Vui lòng cập nhật SĐT'}</div>
            </div>
            
            <div class="barcode-section">
                <div class="barcode-number">Mã phiếu</div>
                <div class="barcode-image">
                    ${dotKham.maDotKham}
                </div>
            </div>
        </div>
    </div>
    
    <div class="title">PHIẾU CHỈ ĐỊNH XÉT NGHIỆM</div>
    <div class="date-line">Ngày ${ngayKham.getDate().toString().padStart(2, '0')} tháng ${(ngayKham.getMonth() + 1).toString().padStart(2, '0')} năm ${ngayKham.getFullYear()}</div>
    
    <div class="patient-info">
        <div class="info-row">
            <span class="info-label">Họ và tên:</span>
            <span><strong>${benhNhan.hoTen.toUpperCase()}</strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">Mã BN:</span>
            <span><strong>${benhNhan.maBenhNhan}</strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">Ngày sinh:</span>
            <span>${benhNhan.ngaySinh ? new Date(benhNhan.ngaySinh).toLocaleDateString('vi-VN') : '-'}</span>
            <span style="margin-left: 40px;" class="info-label">Giới tính:</span>
            <span>${benhNhan.gioiTinh || '-'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Địa chỉ:</span>
            <span>${benhNhan.diaChi || '-'}</span>
        </div>
    </div>
    
    <div class="indication-section">
        <div class="section-title">DANH SÁCH CHỈ ĐỊNH</div>
        <table class="indication-table">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Loại dịch vụ</th>
                    <th>Tên xét nghiệm/dịch vụ</th>
                    <th>Ghi chú</th>
                </tr>
            </thead>
            <tbody>
                ${chiDinh.length > 0 ? chiDinh.map((cd, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${cd.loaiDichVu || '-'}</td>
                        <td>${cd.tenDichVu || '-'}</td>
                        <td>${cd.ghiChu || '-'}</td>
                    </tr>
                `).join('') : '<tr><td colspan="4" style="text-align: center;"><em>Chưa có chỉ định nào</em></td></tr>'}
            </tbody>
        </table>
    </div>
    
    ${hasKetQua ? `
    <div class="result-section">
        <div class="section-title">KẾT QUẢ XÉT NGHIỆM / CẬN LÂM SÀNG</div>
        ${ketQuaCLS.map((kq, index) => `
            <div class="result-item">
                <div class="result-header">${kq.tenDichVu || kq.loaiDichVu || 'Xét nghiệm'}</div>
                ${kq.ketQua ? `<div class="result-content"><strong>Kết quả:</strong> ${kq.ketQua}</div>` : ''}
                ${kq.ketLuan ? `<div class="result-content"><strong>Kết luận:</strong> ${kq.ketLuan}</div>` : ''}
                ${kq.ghiChu ? `<div class="result-content"><strong>Ghi chú:</strong> ${kq.ghiChu}</div>` : ''}
                ${kq.hinhAnhKetQua ? `
                    <div class="result-image">
                        ${kq.hinhAnhKetQua.split(';').filter(img => img.trim()).map(imgPath => `
                            <img src="${imgPath.trim()}" alt="Hình ảnh kết quả ${kq.tenDichVu || ''}" onerror="this.style.display='none'" style="margin: 5px;">
                        `).join('')}
                    </div>
                ` : ''}
                ${kq.hoTenKyThuatVien ? `<div class="result-content" style="font-size: 11px; color: #666;"><em>Kỹ thuật viên: ${kq.hoTenKyThuatVien}</em></div>` : ''}
                ${kq.ngayCoKetQua ? `<div class="result-content" style="font-size: 11px; color: #666;"><em>Ngày có kết quả: ${new Date(kq.ngayCoKetQua).toLocaleString('vi-VN')}</em></div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : '<div class="no-result">Chưa có kết quả xét nghiệm</div>'}
    
    <div class="footer-section">
        <div class="footer-left">
            <div class="signature-title">Bệnh nhân/Người nhà</div>
            <div class="signature-area">${benhNhan.hoTen}</div>
        </div>
        <div class="footer-right">
            <div class="signature-title">Bác sĩ chỉ định</div>
            <div style="font-style: italic; font-size: 11px;">(Ký, ghi rõ họ tên)</div>
            <div class="signature-area">${tenBacSi}</div>
        </div>
    </div>
    
    <div class="notes">
        <div class="notes-title">Lưu ý:</div>
        <div>- Vui lòng mang theo phiếu này đến phòng xét nghiệm.</div>
        <div>- Kết quả sẽ có sau 24-48 giờ.</div>
        <div>- Liên hệ: ${dienThoaiPhongKham || '0123456789'}</div>
    </div>
</body>
</html>
        `;
    },
    
    // Hiển thị modal in
    showPrintModal(html, title) {
        const modalHtml = `
            <div class="modal fade" id="modalPrint" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="print-buttons no-print">
                                <button class="btn-print" onclick="window.print()">
                                    <i class="bi bi-printer"></i> In phiếu
                                </button>
                                <button class="btn-close" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle"></i> Đóng
                                </button>
                            </div>
                            <div id="printArea">
                                ${html}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal
        const oldModal = document.getElementById('modalPrint');
        if (oldModal) oldModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalPrint'));
        modal.show();
    }
};
