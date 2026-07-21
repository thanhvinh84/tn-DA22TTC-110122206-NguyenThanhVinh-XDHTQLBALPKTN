// Chức năng in hóa đơn
const PrintHoaDon = {
    
    // In hóa đơn
    async inHoaDon(maHoaDon) {
        try {
            App.showLoading();
            
            // Load dữ liệu hóa đơn
            const [hoaDon, dotKham, benhNhan, donThuoc, chiTietThuoc, chiDinh] = await Promise.all([
                API.get(`/hoa-don/${maHoaDon}`),
                this.getDotKhamByHoaDon(maHoaDon),
                this.getBenhNhanByHoaDon(maHoaDon),
                this.getDonThuocByHoaDon(maHoaDon),
                this.getChiTietThuocByHoaDon(maHoaDon),
                this.getChiDinhByHoaDon(maHoaDon)
            ]);
            
            if (!hoaDon.success || !benhNhan) {
                throw new Error('Không thể tải thông tin hóa đơn');
            }
            
            const html = this.generateHoaDonHTML(
                hoaDon.data,
                dotKham,
                benhNhan,
                chiTietThuoc,
                chiDinh
            );
            
            this.showPrintModal(html, 'Hóa Đơn Thanh Toán');
            
        } catch (error) {
            console.error('Error:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    // Lấy thông tin đợt khám
    async getDotKhamByHoaDon(maHoaDon) {
        try {
            const hdResponse = await API.get(`/hoa-don/${maHoaDon}`);
            if (hdResponse.success && hdResponse.data && hdResponse.data.maDotKham) {
                const dkResponse = await API.get(`/dot-kham/${hdResponse.data.maDotKham}`);
                return dkResponse.success ? dkResponse.data : null;
            }
            return null;
        } catch (error) {
            console.error('Error getting dot kham:', error);
            return null;
        }
    },
    
    // Lấy thông tin bệnh nhân
    async getBenhNhanByHoaDon(maHoaDon) {
        try {
            const hdResponse = await API.get(`/hoa-don/${maHoaDon}`);
            if (hdResponse.success && hdResponse.data && hdResponse.data.maBenhNhan) {
                const bnResponse = await API.get(`/benh-nhan/${hdResponse.data.maBenhNhan}`);
                return bnResponse.success ? bnResponse.data : null;
            }
            return null;
        } catch (error) {
            console.error('Error getting benh nhan:', error);
            return null;
        }
    },
    
    // Lấy đơn thuốc
    async getDonThuocByHoaDon(maHoaDon) {
        try {
            const hdResponse = await API.get(`/hoa-don/${maHoaDon}`);
            if (hdResponse.success && hdResponse.data && hdResponse.data.maDotKham) {
                const dtResponse = await API.get(`/don-thuoc/dot-kham/${hdResponse.data.maDotKham}`);
                return dtResponse.success && dtResponse.data && dtResponse.data.length > 0 ? dtResponse.data[0] : null;
            }
            return null;
        } catch (error) {
            console.error('Error getting don thuoc:', error);
            return null;
        }
    },
    
    // Lấy chi tiết thuốc
    async getChiTietThuocByHoaDon(maHoaDon) {
        try {
            const donThuoc = await this.getDonThuocByHoaDon(maHoaDon);
            if (donThuoc && donThuoc.maDonThuoc) {
                const response = await API.get(`/don-thuoc/${donThuoc.maDonThuoc}/chi-tiet`);
                return response.success ? response.data : [];
            }
            return [];
        } catch (error) {
            console.error('Error getting chi tiet thuoc:', error);
            return [];
        }
    },
    
    // Lấy chỉ định CLS
    async getChiDinhByHoaDon(maHoaDon) {
        try {
            const hdResponse = await API.get(`/hoa-don/${maHoaDon}`);
            if (hdResponse.success && hdResponse.data && hdResponse.data.maDotKham) {
                const response = await API.get(`/chi-dinh/dot-kham/${hdResponse.data.maDotKham}`);
                return response.success ? response.data : [];
            }
            return [];
        } catch (error) {
            console.error('Error getting chi dinh:', error);
            return [];
        }
    },
    
    // Format tiền
    formatMoney(amount) {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount || 0);
    },
    
    // Chuyển số thành chữ
    numberToWords(num) {
        if (num === 0) return 'Không đồng';
        
        const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        const teens = ['mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];
        const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
        const thousands = ['', 'nghìn', 'triệu', 'tỷ'];
        
        function convertGroup(n) {
            if (n === 0) return '';
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) {
                const ten = Math.floor(n / 10);
                const one = n % 10;
                return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
            }
            const hundred = Math.floor(n / 100);
            const rest = n % 100;
            return ones[hundred] + ' trăm' + (rest > 0 ? ' ' + convertGroup(rest) : '');
        }
        
        let result = '';
        let groupIndex = 0;
        
        while (num > 0) {
            const group = num % 1000;
            if (group > 0) {
                result = convertGroup(group) + (thousands[groupIndex] ? ' ' + thousands[groupIndex] : '') + (result ? ' ' + result : '');
            }
            num = Math.floor(num / 1000);
            groupIndex++;
        }
        
        return result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
    },
    
    // Tạo HTML hóa đơn
    generateHoaDonHTML(hoaDon, dotKham, benhNhan, chiTietThuoc, chiDinh) {
        const ngayLap = hoaDon.ngayLap ? new Date(hoaDon.ngayLap) : new Date();
        
        // Tính toán chi phí
        const phiKham = 200000; // Phí khám cố định
        
        let tongTienThuoc = 0;
        const thuocRows = chiTietThuoc.map((thuoc, idx) => {
            const donGia = thuoc.donGia || 50000;
            const soLuong = thuoc.soLuong || 1;
            const thanhTien = donGia * soLuong;
            tongTienThuoc += thanhTien;
            
            return `
                <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td>${thuoc.tenThuoc || '-'}</td>
                    <td class="text-center">${thuoc.donViTinh || 'Viên'}</td>
                    <td class="text-center">${soLuong}</td>
                    <td class="text-end">${this.formatMoney(donGia)}</td>
                    <td class="text-end"><strong>${this.formatMoney(thanhTien)}</strong></td>
                </tr>
            `;
        }).join('');
        
        let tongTienCLS = 0;
        const clsRows = chiDinh.map((cd, idx) => {
            const donGia = cd.donGia || 150000;
            tongTienCLS += donGia;
            
            return `
                <tr>
                    <td class="text-center">${chiTietThuoc.length + idx + 1}</td>
                    <td>${cd.tenDichVu || '-'} <small class="text-muted">(${cd.loaiDichVu || 'CLS'})</small></td>
                    <td class="text-center">Lần</td>
                    <td class="text-center">1</td>
                    <td class="text-end">${this.formatMoney(donGia)}</td>
                    <td class="text-end"><strong>${this.formatMoney(donGia)}</strong></td>
                </tr>
            `;
        }).join('');
        
        const tongCong = phiKham + tongTienThuoc + tongTienCLS;
        const tienBangChu = this.numberToWords(tongCong);
        
        return `
            <div class="hoa-don">
                <!-- Header -->
                <div class="hoa-don-header">
                    <div class="row">
                        <div class="col-7">
                            <div class="hoa-don-logo">
                                <h3>PHÒNG KHÁM ĐA KHOA</h3>
                                <p><strong>${dotKham?.tenPhongKham || 'Phòng khám'}</strong></p>
                                <p>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
                                <p>Điện thoại: 0123-456-789 | Email: info@phongkham.vn</p>
                                <p>MST: 0123456789</p>
                            </div>
                        </div>
                        <div class="col-5 text-end">
                            <div class="hoa-don-qr">
                                <div style="width: 100px; height: 100px; border: 2px solid #ddd; display: inline-block; margin-bottom: 10px;">
                                    <div style="padding: 10px; text-align: center; line-height: 80px; color: #999;">QR Code</div>
                                </div>
                                <p class="mb-0"><small>Mã số: <strong>${hoaDon.maHoaDon}</strong></small></p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hoa-don-title">
                        <h1>HÓA ĐƠN THANH TOÁN</h1>
                        <p class="mb-0">Ngày ${ngayLap.getDate()} tháng ${ngayLap.getMonth() + 1} năm ${ngayLap.getFullYear()}</p>
                    </div>
                </div>
                
                <!-- Thông tin khách hàng -->
                <div class="hoa-don-info">
                    <div class="row">
                        <div class="col-6">
                            <table class="info-table">
                                <tr>
                                    <td width="140"><strong>Họ tên KH:</strong></td>
                                    <td><strong>${benhNhan.hoTen || '-'}</strong></td>
                                </tr>
                                <tr>
                                    <td><strong>Mã bệnh nhân:</strong></td>
                                    <td>${benhNhan.maBenhNhan || '-'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Ngày sinh:</strong></td>
                                    <td>${benhNhan.ngaySinh ? new Date(benhNhan.ngaySinh).toLocaleDateString('vi-VN') : '-'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Giới tính:</strong></td>
                                    <td>${benhNhan.gioiTinh || '-'}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-6">
                            <table class="info-table">
                                <tr>
                                    <td width="140"><strong>Địa chỉ:</strong></td>
                                    <td>${benhNhan.diaChi || '-'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Điện thoại:</strong></td>
                                    <td>${benhNhan.soDienThoai || '-'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Số BHYT:</strong></td>
                                    <td>${benhNhan.soBHYT || 'Không có'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Bác sĩ điều trị:</strong></td>
                                    <td>${dotKham?.hoTenBacSi || '-'}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Chi tiết dịch vụ -->
                <div class="hoa-don-section">
                    <h3>CHI TIẾT DỊCH VỤ</h3>
                    <table class="hoa-don-table">
                        <thead>
                            <tr>
                                <th width="50" class="text-center">STT</th>
                                <th>Tên dịch vụ / Thuốc</th>
                                <th width="80" class="text-center">ĐVT</th>
                                <th width="80" class="text-center">SL</th>
                                <th width="120" class="text-end">Đơn giá</th>
                                <th width="140" class="text-end">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Phí khám -->
                            <tr>
                                <td class="text-center">1</td>
                                <td><strong>Khám bệnh tổng quát</strong></td>
                                <td class="text-center">Lần</td>
                                <td class="text-center">1</td>
                                <td class="text-end">${this.formatMoney(phiKham)}</td>
                                <td class="text-end"><strong>${this.formatMoney(phiKham)}</strong></td>
                            </tr>
                            
                            <!-- Thuốc -->
                            ${thuocRows}
                            
                            <!-- Xét nghiệm / CLS -->
                            ${clsRows}
                        </tbody>
                    </table>
                </div>
                
                <!-- Tổng cộng -->
                <div class="hoa-don-total">
                    <div class="row">
                        <div class="col-7">
                            <div class="tien-bang-chu">
                                <strong>Tổng tiền bằng chữ:</strong><br>
                                <em>${tienBangChu}</em>
                            </div>
                        </div>
                        <div class="col-5">
                            <table class="total-table">
                                <tr>
                                    <td><strong>Tổng cộng:</strong></td>
                                    <td class="text-end"><strong>${this.formatMoney(tongCong)}</strong></td>
                                </tr>
                                <tr class="discount-row">
                                    <td><strong>Giảm giá:</strong></td>
                                    <td class="text-end"><strong>0 VNĐ</strong></td>
                                </tr>
                                <tr class="grand-total">
                                    <td><strong>TỔNG THANH TOÁN:</strong></td>
                                    <td class="text-end"><strong>${this.formatMoney(tongCong)}</strong></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Trạng thái thanh toán -->
                <div class="hoa-don-status">
                    <div class="alert ${hoaDon.trangThai === 'Đã thanh toán' ? 'alert-success' : 'alert-warning'} mb-3">
                        <div class="row align-items-center">
                            <div class="col-6">
                                <strong>Trạng thái:</strong> 
                                <span class="badge ${hoaDon.trangThai === 'Đã thanh toán' ? 'bg-success' : 'bg-warning'} fs-6">
                                    ${hoaDon.trangThai || 'Chưa thanh toán'}
                                </span>
                            </div>
                            <div class="col-6 text-end">
                                ${hoaDon.trangThai === 'Đã thanh toán' ? `
                                    <strong>Hình thức:</strong> Tiền mặt
                                ` : `
                                    <strong>Vui lòng thanh toán tại quầy lễ tân</strong>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Chữ ký -->
                <div class="hoa-don-footer">
                    <div class="row text-center">
                        <div class="col-4">
                            <p><em>Người lập phiếu</em></p>
                            <br><br>
                            <p class="signature-name">Lễ tân</p>
                        </div>
                        <div class="col-4">
                            <p><em>Khách hàng</em></p>
                            <br><br>
                            <p class="signature-name">${benhNhan.hoTen || ''}</p>
                        </div>
                        <div class="col-4">
                            <p><em>Thủ quỹ</em></p>
                            <br><br>
                            <p class="signature-name">Kế toán</p>
                        </div>
                    </div>
                </div>
                
                <!-- Ghi chú -->
                <div class="hoa-don-note">
                    <p><strong>Lưu ý:</strong></p>
                    <ul>
                        <li>Hóa đơn này là bằng chứng thanh toán hợp lệ, vui lòng giữ lại để đối chiếu.</li>
                        <li>Thuốc đã mua không được đổi trả, trừ trường hợp lỗi từ phía phòng khám.</li>
                        <li>Vui lòng kiểm tra kỹ thông tin trước khi rời quầy thanh toán.</li>
                        <li>Mọi thắc mắc xin liên hệ: 0123-456-789</li>
                    </ul>
                    <p class="text-center mt-3"><em>Cảm ơn quý khách đã sử dụng dịch vụ!</em></p>
                </div>
            </div>
        `;
    },
    
    // Hiển thị modal in
    showPrintModal(html, title) {
        const modalHtml = `
            <div class="modal fade" id="modalPrintHoaDon" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="print-buttons no-print">
                                <button class="btn-print" onclick="window.print()">
                                    <i class="bi bi-printer"></i> In hóa đơn
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
        const oldModal = document.getElementById('modalPrintHoaDon');
        if (oldModal) oldModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalPrintHoaDon'));
        modal.show();
    }
};
