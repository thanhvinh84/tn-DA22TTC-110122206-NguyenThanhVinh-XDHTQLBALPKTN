// Trang quản lý yêu cầu truy cập hồ sơ liên phòng khám
const YeuCauTruyCapHoSo = {
    tabActive: 'da-gui', // da-gui hoặc cho-duyet
    danhSachYeuCau: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-shield-lock"></i> Quản lý yêu cầu truy cập hồ sơ
                    </h5>
                </div>
                <div class="card-body">
                    <!-- Tabs -->
                    <ul class="nav nav-tabs mb-3" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="tab-da-gui" data-bs-toggle="tab" href="#content-da-gui" 
                               onclick="YeuCauTruyCapHoSo.switchTab('da-gui')">
                                <i class="bi bi-send"></i> Yêu cầu đã gửi
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="tab-cho-duyet" data-bs-toggle="tab" href="#content-cho-duyet"
                               onclick="YeuCauTruyCapHoSo.switchTab('cho-duyet')">
                                <i class="bi bi-inbox"></i> Yêu cầu chờ duyệt
                                <span class="badge bg-danger ms-1" id="badge-cho-duyet">0</span>
                            </a>
                        </li>
                    </ul>
                    
                    <div class="tab-content">
                        <!-- Tab Yêu cầu đã gửi -->
                        <div class="tab-pane fade show active" id="content-da-gui">
                            <div id="list-da-gui">
                                <div class="text-center py-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tab Yêu cầu chờ duyệt -->
                        <div class="tab-pane fade" id="content-cho-duyet">
                            <div id="list-cho-duyet">
                                <div class="text-center py-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        await this.loadData();
    },
    
    switchTab(tab) {
        this.tabActive = tab;
        this.loadData();
    },
    
    async loadData() {
        try {
            if (this.tabActive === 'da-gui') {
                await this.loadYeuCauDaGui();
            } else {
                await this.loadYeuCauChoDuyet();
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    },
    
    async loadYeuCauDaGui() {
        try {
            const response = await API.get('/yeu-cau-truy-cap/da-gui');
            
            if (response.success && response.data) {
                this.danhSachYeuCau = response.data;
                this.renderYeuCauDaGui();
            }
        } catch (error) {
            document.getElementById('list-da-gui').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> Lỗi: ${error.message}
                </div>
            `;
        }
    },
    
    async loadYeuCauChoDuyet() {
        try {
            const response = await API.get('/yeu-cau-truy-cap/cho-duyet');
            
            if (response.success && response.data) {
                this.danhSachYeuCau = response.data;
                
                // Đếm số yêu cầu chờ duyệt
                const soCho = response.data.filter(y => y.trangThai === 'Chờ duyệt').length;
                document.getElementById('badge-cho-duyet').textContent = soCho;
                
                this.renderYeuCauChoDuyet();
            }
        } catch (error) {
            document.getElementById('list-cho-duyet').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> Lỗi: ${error.message}
                </div>
            `;
        }
    },
    
    renderYeuCauDaGui() {
        const container = document.getElementById('list-da-gui');
        
        if (!this.danhSachYeuCau || this.danhSachYeuCau.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Bạn chưa gửi yêu cầu nào
                </div>
            `;
            return;
        }
        
        const html = `
            <div class="table-responsive">
                <table class="table table-hover table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th width="100">Mã YC</th>
                            <th>Bệnh nhân</th>
                            <th>Phòng khám được yêu cầu</th>
                            <th>Bác sĩ được yêu cầu</th>
                            <th width="120">Ngày gửi</th>
                            <th width="120">Trạng thái</th>
                            <th width="150">Loại quyền</th>
                            <th width="120">Hết hạn</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.danhSachYeuCau.map(yc => `
                            <tr>
                                <td><strong>${yc.maYeuCau}</strong></td>
                                <td>${yc.tenBenhNhan || '-'}</td>
                                <td>${yc.tenPhongKhamDuocYeuCau || '-'}</td>
                                <td>${yc.tenBacSiDuocYeuCau || '-'}</td>
                                <td>${yc.ngayYeuCau ? new Date(yc.ngayYeuCau).toLocaleDateString('vi-VN') : '-'}</td>
                                <td>${this.getTrangThaiBadge(yc.trangThai)}</td>
                                <td>
                                    ${yc.loaiQuyen ? `<span class="badge bg-info">${yc.loaiQuyen}</span>` : '-'}
                                </td>
                                <td>
                                    ${yc.ngayHetHan ? new Date(yc.ngayHetHan).toLocaleDateString('vi-VN') : '-'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    renderYeuCauChoDuyet() {
        const container = document.getElementById('list-cho-duyet');
        
        if (!this.danhSachYeuCau || this.danhSachYeuCau.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Không có yêu cầu nào
                </div>
            `;
            return;
        }
        
        const html = `
            <div class="table-responsive">
                <table class="table table-hover table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th width="100">Mã YC</th>
                            <th>Bệnh nhân</th>
                            <th>Phòng khám yêu cầu</th>
                            <th>Bác sĩ yêu cầu</th>
                            <th width="120">Ngày gửi</th>
                            <th>Lý do</th>
                            <th width="120">Trạng thái</th>
                            <th width="150">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.danhSachYeuCau.map(yc => `
                            <tr>
                                <td><strong>${yc.maYeuCau}</strong></td>
                                <td>${yc.tenBenhNhan || '-'}</td>
                                <td>${yc.tenPhongKhamYeuCau || '-'}</td>
                                <td>${yc.tenBacSiYeuCau || '-'}</td>
                                <td>${yc.ngayYeuCau ? new Date(yc.ngayYeuCau).toLocaleDateString('vi-VN') : '-'}</td>
                                <td><small>${yc.lyDoYeuCau || '-'}</small></td>
                                <td>${this.getTrangThaiBadge(yc.trangThai)}</td>
                                <td>
                                    ${yc.trangThai === 'Chờ duyệt' ? `
                                        <button class="btn btn-sm btn-success me-1" 
                                                onclick="YeuCauTruyCapHoSo.chapNhan('${yc.maYeuCau}')">
                                            <i class="bi bi-check-circle"></i> Chấp nhận
                                        </button>
                                        <button class="btn btn-sm btn-danger" 
                                                onclick="YeuCauTruyCapHoSo.tuChoi('${yc.maYeuCau}')">
                                            <i class="bi bi-x-circle"></i> Từ chối
                                        </button>
                                    ` : '-'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    getTrangThaiBadge(trangThai) {
        const badges = {
            'Chờ duyệt': '<span class="badge bg-warning">Chờ duyệt</span>',
            'Đã chấp nhận': '<span class="badge bg-success">Đã chấp nhận</span>',
            'Từ chối': '<span class="badge bg-danger">Từ chối</span>',
            'Hết hạn': '<span class="badge bg-secondary">Hết hạn</span>'
        };
        return badges[trangThai] || '<span class="badge bg-secondary">' + trangThai + '</span>';
    },
    
    async chapNhan(maYeuCau) {
        // Hiển thị modal chọn loại quyền và thời hạn
        const modalHtml = `
            <div class="modal fade" id="modalChapNhan" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">Chấp nhận yêu cầu truy cập</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Loại quyền <span class="text-danger">*</span></label>
                                <select class="form-select" id="loaiQuyen" required>
                                    <option value="">-- Chọn loại quyền --</option>
                                    <option value="Xem tất cả">Xem tất cả hồ sơ</option>
                                    <option value="Xem 2 lần gần nhất">Xem 2 lần khám gần nhất</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Thời hạn (ngày) <span class="text-danger">*</span></label>
                                <select class="form-select" id="soNgayHetHan" required>
                                    <option value="7">7 ngày</option>
                                    <option value="14">14 ngày</option>
                                    <option value="30" selected>30 ngày</option>
                                    <option value="60">60 ngày</option>
                                    <option value="90">90 ngày</option>
                                    <option value="180">180 ngày (6 tháng)</option>
                                    <option value="365">365 ngày (1 năm)</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-success" onclick="YeuCauTruyCapHoSo.xacNhanChapNhan('${maYeuCau}')">
                                <i class="bi bi-check-circle"></i> Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal
        const oldModal = document.getElementById('modalChapNhan');
        if (oldModal) oldModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalChapNhan'));
        modal.show();
    },
    
    async xacNhanChapNhan(maYeuCau) {
        try {
            const loaiQuyen = document.getElementById('loaiQuyen').value;
            const soNgayHetHan = parseInt(document.getElementById('soNgayHetHan').value);
            
            if (!loaiQuyen) {
                App.showToast('Vui lòng chọn loại quyền', 'error');
                return;
            }
            
            App.showLoading();
            
            const response = await API.post(`/yeu-cau-truy-cap/${maYeuCau}/chap-nhan`, {
                loaiQuyen,
                soNgayHetHan
            });
            
            if (response.success) {
                App.showToast('Chấp nhận yêu cầu thành công', 'success');
                
                // Đóng modal
                const modalElement = document.getElementById('modalChapNhan');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                
                // Reload data
                await this.loadData();
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async tuChoi(maYeuCau) {
        const lyDo = prompt('Nhập lý do từ chối (tùy chọn):');
        
        if (lyDo === null) return; // User cancelled
        
        try {
            App.showLoading();
            
            const response = await API.post(`/yeu-cau-truy-cap/${maYeuCau}/tu-choi`, {
                lyDoTuChoi: lyDo || 'Không có lý do'
            });
            
            if (response.success) {
                App.showToast('Từ chối yêu cầu thành công', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
