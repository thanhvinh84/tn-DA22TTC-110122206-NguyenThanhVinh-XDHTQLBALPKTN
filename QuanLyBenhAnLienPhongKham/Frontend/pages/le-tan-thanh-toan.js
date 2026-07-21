// Trang Quản lý Thanh toán - Lễ tân
const LeTanThanhToan = {
    currentData: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-credit-card"></i> Quản lý Thanh toán
                    </h5>
                    <div>
                        <span class="badge bg-danger fs-6 me-2">
                            Chưa thanh toán: <span id="chuaThanhToan">0</span>
                        </span>
                        <span class="badge bg-success fs-6 me-2">
                            Đã thanh toán: <span id="daThanhToan">0</span>
                        </span>
                        <button class="btn btn-outline-primary btn-sm" onclick="LeTanThanhToan.loadData()">
                            <i class="bi bi-arrow-clockwise"></i> Làm mới
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <!-- Bộ lọc -->
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <label class="form-label">Trạng thái</label>
                            <select class="form-select" id="filterTrangThai" onchange="LeTanThanhToan.loadData()">
                                <option value="">Tất cả</option>
                                <option value="Chưa thanh toán" selected>Chưa thanh toán</option>
                                <option value="Đã thanh toán">Đã thanh toán</option>
                                <option value="Đã hủy">Đã hủy</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Từ ngày</label>
                            <input type="date" class="form-control" id="filterTuNgay" onchange="LeTanThanhToan.loadData()">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Đến ngày</label>
                            <input type="date" class="form-control" id="filterDenNgay" onchange="LeTanThanhToan.loadData()">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Tìm kiếm</label>
                            <input type="text" class="form-control" id="searchInput" 
                                   placeholder="Tên BN, Mã HĐ..." onkeyup="LeTanThanhToan.search()">
                        </div>
                    </div>

                    <!-- Bảng danh sách -->
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th width="100">Mã HĐ</th>
                                    <th width="100">Mã ĐK</th>
                                    <th>Bệnh nhân</th>
                                    <th width="150">Ngày lập</th>
                                    <th width="120" class="text-end">Tổng tiền</th>
                                    <th width="120">Trạng thái</th>
                                    <th width="200" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="tableHoaDon">
                                <tr>
                                    <td colspan="7" class="text-center py-4">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Tổng kết -->
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <div class="alert alert-info mb-0">
                                <strong>Tổng cộng:</strong> 
                                <span id="tongTien" class="fs-5 text-primary">0 VNĐ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // KHÔNG set ngày mặc định nữa - để user tự chọn
        // const today = new Date();
        // const weekAgo = new Date(today);
        // weekAgo.setDate(weekAgo.getDate() - 7);
        // document.getElementById('filterTuNgay').value = weekAgo.toISOString().split('T')[0];
        // document.getElementById('filterDenNgay').value = today.toISOString().split('T')[0];

        await this.loadData();
    },

    async loadData() {
        try {
            const trangThai = document.getElementById('filterTrangThai')?.value || '';
            const tuNgay = document.getElementById('filterTuNgay')?.value || '';
            const denNgay = document.getElementById('filterDenNgay')?.value || '';
            
            let url = '/hoa-don';
            const params = [];
            
            if (trangThai) params.push(`trangThai=${encodeURIComponent(trangThai)}`);
            if (tuNgay) params.push(`tuNgay=${tuNgay}`);
            if (denNgay) params.push(`denNgay=${denNgay}`);
            
            if (params.length > 0) {
                url += '?' + params.join('&');
            }
            
            console.log('Loading data with URL:', url);
            console.log('Filters:', { trangThai, tuNgay, denNgay });
            
            const response = await API.get(url);
            
            console.log('Full API Response:', response);
            console.log('Response success:', response.success);
            console.log('Response data:', response.data);
            console.log('Data length:', response.data?.length);
            
            if (response.success) {
                this.currentData = response.data || [];
                console.log('Current data set to:', this.currentData);
                this.renderTable(this.currentData);
                this.updateStats();
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi tải dữ liệu: ' + error.message, 'error');
            document.getElementById('tableHoaDon').innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> 
                        Không thể tải dữ liệu
                    </td>
                </tr>
            `;
        }
    },

    renderTable(data) {
        console.log('renderTable called with data:', data);
        const tbody = document.getElementById('tableHoaDon');
        
        if (!tbody) {
            console.error('Table body element not found!');
            return;
        }
        
        if (!data || data.length === 0) {
            console.log('No data to display');
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        <i class="bi bi-inbox"></i><br>
                        Không có hóa đơn nào
                    </td>
                </tr>
            `;
            return;
        }
        
        console.log('Rendering', data.length, 'rows');

        const html = data.map(hd => {
            const statusClass = 
                hd.trangThai === 'Đã thanh toán' ? 'success' : 
                hd.trangThai === 'Chưa thanh toán' ? 'danger' : 
                hd.trangThai === 'Đã hủy' ? 'secondary' : 'warning';
            
            return `
                <tr class="fade-in">
                    <td><span class="badge bg-info">${hd.maHoaDon || '-'}</span></td>
                    <td><span class="badge bg-secondary">${hd.maDotKham || '-'}</span></td>
                    <td><strong>${hd.hoTenBenhNhan || '-'}</strong><br>
                        <small class="text-muted">${hd.maBenhNhan || ''}</small>
                    </td>
                    <td><small>${hd.ngayLap ? new Date(hd.ngayLap).toLocaleString('vi-VN') : '-'}</small></td>
                    <td class="text-end">
                        <strong class="text-primary">${this.formatMoney(hd.tongTien || 0)}</strong>
                    </td>
                    <td><span class="badge bg-${statusClass}">${hd.trangThai || '-'}</span></td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-outline-primary" 
                                    onclick="LeTanThanhToan.xemChiTiet('${hd.maHoaDon}')"
                                    title="Xem chi tiết">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-success" 
                                    onclick="LeTanThanhToan.inHoaDon('${hd.maHoaDon}')"
                                    title="In hóa đơn">
                                <i class="bi bi-printer"></i>
                            </button>
                            ${hd.trangThai === 'Chưa thanh toán' ? `
                                <button class="btn btn-outline-success" 
                                        onclick="LeTanThanhToan.thanhToan('${hd.maHoaDon}')"
                                        title="Thanh toán">
                                    <i class="bi bi-check-circle"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        console.log('Generated HTML length:', html.length);
        console.log('Setting innerHTML to tbody');
        tbody.innerHTML = html;
        console.log('innerHTML set complete. tbody.children.length:', tbody.children.length);
    },

    search() {
        const keyword = document.getElementById('searchInput').value.toLowerCase();
        if (!keyword) {
            this.renderTable(this.currentData);
            return;
        }

        const filtered = this.currentData.filter(hd => 
            (hd.hoTenBenhNhan && hd.hoTenBenhNhan.toLowerCase().includes(keyword)) ||
            (hd.maBenhNhan && hd.maBenhNhan.toLowerCase().includes(keyword)) ||
            (hd.maHoaDon && hd.maHoaDon.toLowerCase().includes(keyword)) ||
            (hd.maDotKham && hd.maDotKham.toLowerCase().includes(keyword))
        );

        this.renderTable(filtered);
    },

    updateStats() {
        const chuaThanhToan = this.currentData.filter(hd => hd.trangThai === 'Chưa thanh toán').length;
        const daThanhToan = this.currentData.filter(hd => hd.trangThai === 'Đã thanh toán').length;
        const tongTien = this.currentData.reduce((sum, hd) => sum + (hd.tongTien || 0), 0);

        document.getElementById('chuaThanhToan').textContent = chuaThanhToan;
        document.getElementById('daThanhToan').textContent = daThanhToan;
        document.getElementById('tongTien').textContent = this.formatMoney(tongTien);
    },

    formatMoney(amount) {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount);
    },

    async xemChiTiet(maHoaDon) {
        try {
            App.showLoading();
            
            const response = await API.get(`/hoa-don/${maHoaDon}`);
            
            if (response.success && response.data) {
                const hd = response.data;
                
                // Load chi tiết đợt khám
                const dotKhamRes = await API.get(`/dot-kham/${hd.maDotKham}`);
                const dotKham = dotKhamRes.success ? dotKhamRes.data : null;
                
                // Load đơn thuốc
                const donThuocRes = await API.get(`/don-thuoc/dot-kham/${hd.maDotKham}`);
                let chiTietThuoc = [];
                if (donThuocRes.success && donThuocRes.data && donThuocRes.data.length > 0) {
                    const donThuoc = donThuocRes.data[0];
                    const chiTietRes = await API.get(`/don-thuoc/${donThuoc.maDonThuoc}/chi-tiet`);
                    if (chiTietRes.success) chiTietThuoc = chiTietRes.data || [];
                }
                
                // Load chỉ định CLS
                const chiDinhRes = await API.get(`/chi-dinh/dot-kham/${hd.maDotKham}`);
                const chiDinh = chiDinhRes.success ? chiDinhRes.data || [] : [];
                
                const modalHtml = `
                    <div class="modal fade" id="modalChiTietHoaDon" tabindex="-1">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header bg-primary text-white">
                                    <h5 class="modal-title">
                                        <i class="bi bi-receipt"></i> Chi tiết Hóa đơn ${hd.maHoaDon}
                                    </h5>
                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <!-- Thông tin hóa đơn -->
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <h6 class="border-bottom pb-2 mb-3">Thông tin hóa đơn</h6>
                                            <table class="table table-sm">
                                                <tr><th width="150">Mã hóa đơn:</th><td><span class="badge bg-info">${hd.maHoaDon}</span></td></tr>
                                                <tr><th>Mã đợt khám:</th><td><span class="badge bg-secondary">${hd.maDotKham}</span></td></tr>
                                                <tr><th>Ngày lập:</th><td>${hd.ngayLap ? new Date(hd.ngayLap).toLocaleString('vi-VN') : '-'}</td></tr>
                                                <tr><th>Trạng thái:</th><td><span class="badge bg-${hd.trangThai === 'Đã thanh toán' ? 'success' : 'danger'}">${hd.trangThai}</span></td></tr>
                                            </table>
                                        </div>
                                        <div class="col-md-6">
                                            <h6 class="border-bottom pb-2 mb-3">Thông tin bệnh nhân</h6>
                                            <table class="table table-sm">
                                                <tr><th width="150">Mã BN:</th><td>${hd.maBenhNhan || '-'}</td></tr>
                                                <tr><th>Họ tên:</th><td><strong>${hd.hoTenBenhNhan || '-'}</strong></td></tr>
                                                ${dotKham ? `
                                                    <tr><th>Bác sĩ:</th><td>${dotKham.hoTenBacSi || '-'}</td></tr>
                                                    <tr><th>Phòng khám:</th><td>${dotKham.tenPhongKham || '-'}</td></tr>
                                                ` : ''}
                                            </table>
                                        </div>
                                    </div>
                                    
                                    <!-- Chi tiết dịch vụ -->
                                    <h6 class="border-bottom pb-2 mb-3">Chi tiết dịch vụ</h6>
                                    
                                    <!-- Phí khám -->
                                    <div class="mb-3">
                                        <h6 class="text-primary"><i class="bi bi-clipboard2-pulse"></i> Phí khám bệnh</h6>
                                        <table class="table table-sm table-bordered">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Dịch vụ</th>
                                                    <th width="150" class="text-end">Đơn giá</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Khám bệnh tổng quát</td>
                                                    <td class="text-end">200,000 VNĐ</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <!-- Thuốc -->
                                    ${chiTietThuoc.length > 0 ? `
                                        <div class="mb-3">
                                            <h6 class="text-success"><i class="bi bi-capsule"></i> Thuốc</h6>
                                            <table class="table table-sm table-bordered">
                                                <thead class="table-light">
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Tên thuốc</th>
                                                        <th width="100" class="text-center">Số lượng</th>
                                                        <th width="150" class="text-end">Đơn giá</th>
                                                        <th width="150" class="text-end">Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${chiTietThuoc.map((thuoc, idx) => {
                                                        const donGia = thuoc.donGia || 50000;
                                                        const soLuong = thuoc.soLuong || 1;
                                                        const thanhTien = donGia * soLuong;
                                                        return `
                                                        <tr>
                                                            <td>${idx + 1}</td>
                                                            <td>${thuoc.tenThuoc || '-'}</td>
                                                            <td class="text-center">${soLuong}</td>
                                                            <td class="text-end">${this.formatMoney(donGia)}</td>
                                                            <td class="text-end"><strong>${this.formatMoney(thanhTien)}</strong></td>
                                                        </tr>
                                                    `}).join('')}
                                                </tbody>
                                            </table>
                                        </div>
                                    ` : ''}
                                    
                                    <!-- Xét nghiệm -->
                                    ${chiDinh.length > 0 ? `
                                        <div class="mb-3">
                                            <h6 class="text-info"><i class="bi bi-file-earmark-medical"></i> Xét nghiệm / Cận lâm sàng</h6>
                                            <table class="table table-sm table-bordered">
                                                <thead class="table-light">
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Loại dịch vụ</th>
                                                        <th>Tên dịch vụ</th>
                                                        <th width="150" class="text-end">Đơn giá</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${chiDinh.map((cd, idx) => {
                                                        const donGia = cd.donGia || 150000;
                                                        return `
                                                        <tr>
                                                            <td>${idx + 1}</td>
                                                            <td>${cd.loaiDichVu || '-'}</td>
                                                            <td>${cd.tenDichVu || '-'}</td>
                                                            <td class="text-end">${this.formatMoney(donGia)}</td>
                                                        </tr>
                                                    `}).join('')}
                                                </tbody>
                                            </table>
                                        </div>
                                    ` : ''}
                                    
                                    <!-- Tổng cộng -->
                                    <div class="row">
                                        <div class="col-md-8"></div>
                                        <div class="col-md-4">
                                            <table class="table table-sm">
                                                <tr>
                                                    <th>Tổng cộng:</th>
                                                    <td class="text-end">
                                                        <h4 class="text-primary mb-0">${this.formatMoney(hd.tongTien || 0)}</h4>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    <button type="button" class="btn btn-success" onclick="LeTanThanhToan.inHoaDon('${hd.maHoaDon}')">
                                        <i class="bi bi-printer"></i> In hóa đơn
                                    </button>
                                    ${hd.trangThai === 'Chưa thanh toán' ? `
                                        <button type="button" class="btn btn-primary" onclick="LeTanThanhToan.thanhToan('${hd.maHoaDon}')">
                                            <i class="bi bi-check-circle"></i> Thanh toán
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Remove old modal
                const oldModal = document.getElementById('modalChiTietHoaDon');
                if (oldModal) oldModal.remove();
                
                // Add new modal
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('modalChiTietHoaDon'));
                modal.show();
            }
        } catch (error) {
            App.showToast('Lỗi xem chi tiết: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async thanhToan(maHoaDon) {
        if (!confirm('Xác nhận đã nhận thanh toán cho hóa đơn này?')) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.put(`/hoa-don/${maHoaDon}/thanh-toan`);
            
            if (response.success) {
                App.showToast('Thanh toán thành công!', 'success');
                
                // Close modal if open
                const modal = document.getElementById('modalChiTietHoaDon');
                if (modal) {
                    bootstrap.Modal.getInstance(modal)?.hide();
                }
                
                // Reload data
                await this.loadData();
            } else {
                throw new Error(response.message || 'Thanh toán thất bại');
            }
        } catch (error) {
            App.showToast('Lỗi thanh toán: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async inHoaDon(maHoaDon) {
        await PrintHoaDon.inHoaDon(maHoaDon);
    }
};
