// Quản lý Khám bệnh (cho Bác sĩ)
const KhamBenh = {
    currentDotKham: null,
    currentBenhNhan: null,
    currentDonThuoc: null,
    
    async render() {
        const content = document.getElementById('mainContent');
        
        // Kiểm tra quyền
        const user = Auth.getUser();
        if (!user || user.maVaiTro !== 'VT_BACSI') {
            content.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Bạn không có quyền truy cập trang này.
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white">
                    <h5 class="mb-0">
                        <i class="bi bi-clipboard2-pulse"></i> Khám bệnh
                    </h5>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> 
                        Vui lòng chọn bệnh nhân từ danh sách "Bệnh nhân chờ khám" để bắt đầu khám.
                    </div>
                </div>
            </div>
        `;
    },
    
    // Hàm khám bệnh nhân (được gọi từ trang bệnh nhân chờ khám)
    async khamBenhNhan(maDotKham) {
        try {
            App.showLoading();
            
            // Lấy thông tin đợt khám
            const responseDK = await API.get(`/dot-kham/${maDotKham}`);
            if (!responseDK.success || !responseDK.data) {
                throw new Error('Không tìm thấy thông tin đợt khám');
            }
            
            this.currentDotKham = responseDK.data;
            
            // Lấy thông tin bệnh nhân
            const responseBN = await API.get(`/benh-nhan/${this.currentDotKham.maBenhNhan}`);
            if (!responseBN.success || !responseBN.data) {
                throw new Error('Không tìm thấy thông tin bệnh nhân');
            }
            
            this.currentBenhNhan = responseBN.data;
            
            // Chuyển sang trang khám bệnh
            App.navigate('kham-benh');
            
            // Render giao diện khám bệnh
            await this.renderKhamBenh();
            
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async renderKhamBenh() {
        const content = document.getElementById('mainContent');
        const bn = this.currentBenhNhan;
        const dk = this.currentDotKham;
        
        content.innerHTML = `
            <div class="row">
                <!-- Thông tin bệnh nhân -->
                <div class="col-md-12 mb-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h5 class="mb-3">
                                        <i class="bi bi-person-badge"></i> 
                                        Thông tin bệnh nhân
                                    </h5>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <p><strong>Họ tên:</strong> ${bn.hoTen}</p>
                                            <p><strong>Mã BN:</strong> <span class="badge bg-primary">${bn.maBenhNhan}</span></p>
                                            <p><strong>Ngày sinh:</strong> ${bn.ngaySinh ? new Date(bn.ngaySinh).toLocaleDateString('vi-VN') : '-'}</p>
                                            <p><strong>Giới tính:</strong> ${bn.gioiTinh || '-'}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <p><strong>Điện thoại:</strong> ${bn.soDienThoai || '-'}</p>
                                            <p><strong>Địa chỉ:</strong> ${bn.diaChi || '-'}</p>
                                            <p><strong>BHYT:</strong> ${bn.soBHYT || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 text-end">
                                    <p><strong>Lý do khám:</strong></p>
                                    <p class="text-primary">${dk.lyDoKham || '-'}</p>
                                    <p><strong>Thời gian đến:</strong></p>
                                    <p>${dk.thoiGianDen ? new Date(dk.thoiGianDen).toLocaleString('vi-VN') : '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form khám bệnh -->
                <div class="col-md-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">
                                <i class="bi bi-clipboard2-pulse"></i> Phiếu khám bệnh
                            </h5>
                        </div>
                        <div class="card-body">
                            <!-- Tabs -->
                            <ul class="nav nav-tabs mb-3" id="khamBenhTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="tab-chiso" data-bs-toggle="tab" 
                                            data-bs-target="#content-chiso" type="button">
                                        <i class="bi bi-heart-pulse"></i> Chỉ số sức sống
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-trieuchung" data-bs-toggle="tab" 
                                            data-bs-target="#content-trieuchung" type="button">
                                        <i class="bi bi-clipboard-check"></i> Triệu chứng & Khám
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-chandoan" data-bs-toggle="tab" 
                                            data-bs-target="#content-chandoan" type="button">
                                        <i class="bi bi-file-medical"></i> Chẩn đoán
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-donthuoc" data-bs-toggle="tab" 
                                            data-bs-target="#content-donthuoc" type="button">
                                        <i class="bi bi-capsule"></i> Đơn thuốc
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-cls" data-bs-toggle="tab" 
                                            data-bs-target="#content-cls" type="button">
                                        <i class="bi bi-clipboard-data"></i> Cận lâm sàng
                                    </button>
                                </li>
                            </ul>

                            <!-- Tab Contents -->
                            <div class="tab-content" id="khamBenhTabContent">
                                <!-- Tab 1: Chỉ số sức sống -->
                                <div class="tab-pane fade show active" id="content-chiso">
                                    <form id="formChiSo">
                                        <div class="row">
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Nhịp tim (lần/phút)</label>
                                                <input type="number" class="form-control" id="nhipTim" placeholder="VD: 75">
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Huyết áp tâm thu (mmHg)</label>
                                                <input type="number" class="form-control" id="huyetApTamThu" placeholder="VD: 120">
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Huyết áp tâm trương (mmHg)</label>
                                                <input type="number" class="form-control" id="huyetApTamTruong" placeholder="VD: 80">
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Nhiệt độ (°C)</label>
                                                <input type="number" step="0.1" class="form-control" id="nhietDo" placeholder="VD: 36.5">
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Nhịp thở (lần/phút)</label>
                                                <input type="number" class="form-control" id="nhipTho" placeholder="VD: 18">
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Cân nặng (kg)</label>
                                                <input type="number" step="0.1" class="form-control" id="canNang" placeholder="VD: 65.5">
                                            </div>
                                        </div>
                                        <button type="button" class="btn btn-primary" onclick="KhamBenh.luuChiSo()">
                                            <i class="bi bi-save"></i> Lưu chỉ số
                                        </button>
                                    </form>
                                </div>

                                <!-- Tab 2: Triệu chứng & Khám -->
                                <div class="tab-pane fade" id="content-trieuchung">
                                    <form id="formTrieuChung">
                                        <div class="mb-3">
                                            <label class="form-label">Triệu chứng chính</label>
                                            <textarea class="form-control" id="trieuChung" rows="3" 
                                                      placeholder="Mô tả các triệu chứng mà bệnh nhân trình bày..."></textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Khám lâm sàng</label>
                                            <textarea class="form-control" id="khamLamSang" rows="4" 
                                                      placeholder="Ghi chú kết quả khám lâm sàng..."></textarea>
                                        </div>
                                        <button type="button" class="btn btn-primary" onclick="KhamBenh.luuTrieuChung()">
                                            <i class="bi bi-save"></i> Lưu thông tin
                                        </button>
                                    </form>
                                </div>

                                <!-- Tab 3: Chẩn đoán -->
                                <div class="tab-pane fade" id="content-chandoan">
                                    <form id="formChanDoan">
                                        <div class="mb-3">
                                            <label class="form-label">Loại chẩn đoán</label>
                                            <select class="form-select" id="loaiChanDoan">
                                                <option value="Sơ bộ">Sơ bộ</option>
                                                <option value="Xác định">Xác định</option>
                                                <option value="Phân biệt">Phân biệt</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Chọn bệnh (ICD-10) <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control mb-2" id="searchBenh" 
                                                   placeholder="🔍 Tìm kiếm bệnh theo mã hoặc tên...">
                                            <div id="danhSachBenhCheckbox" style="max-height: 300px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.25rem; padding: 10px;">
                                                <p class="text-muted">Đang tải danh sách bệnh...</p>
                                            </div>
                                            <small class="text-muted">
                                                <i class="bi bi-info-circle"></i> Bạn có thể chọn nhiều bệnh cùng lúc
                                            </small>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Nội dung chẩn đoán</label>
                                            <textarea class="form-control" id="noiDungChanDoan" rows="4" 
                                                      placeholder="Mô tả chi tiết chẩn đoán..."></textarea>
                                        </div>
                                        <button type="button" class="btn btn-primary" onclick="KhamBenh.luuChanDoan()">
                                            <i class="bi bi-save"></i> Lưu chẩn đoán
                                        </button>
                                    </form>
                                    <hr>
                                    <div id="danhSachChanDoanDaLuu">
                                        <h6>Chẩn đoán đã lưu</h6>
                                        <div id="listChanDoan">
                                            <p class="text-muted">Chưa có chẩn đoán nào</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tab 4: Đơn thuốc -->
                                <div class="tab-pane fade" id="content-donthuoc">
                                    <div class="mb-3">
                                        <button class="btn btn-success" onclick="KhamBenh.themThuoc()">
                                            <i class="bi bi-plus-circle"></i> Thêm thuốc
                                        </button>
                                    </div>
                                    <div id="danhSachThuoc">
                                        <p class="text-muted">Chưa có thuốc nào được kê</p>
                                    </div>
                                </div>

                                <!-- Tab 5: Cận lâm sàng -->
                                <div class="tab-pane fade" id="content-cls">
                                    <form id="formCLS">
                                        <div class="mb-3">
                                            <label class="form-label">Loại chỉ định</label>
                                            <select class="form-select" id="loaiCLS">
                                                <option value="Xét nghiệm">Xét nghiệm</option>
                                                <option value="Chẩn đoán hình ảnh">Chẩn đoán hình ảnh</option>
                                                <option value="Thăm dò chức năng">Thăm dò chức năng</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Tên xét nghiệm/dịch vụ</label>
                                            <input type="text" class="form-control" id="tenCLS" 
                                                   placeholder="VD: Xét nghiệm máu, X-quang phổi...">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Ghi chú</label>
                                            <textarea class="form-control" id="ghiChuCLS" rows="2" 
                                                      placeholder="Ghi chú thêm..."></textarea>
                                        </div>
                                        <button type="button" class="btn btn-primary" onclick="KhamBenh.luuCLS()">
                                            <i class="bi bi-save"></i> Lưu chỉ định
                                        </button>
                                    </form>
                                    <hr>
                                    <div id="danhSachCLS">
                                        <h6>Danh sách chỉ định</h6>
                                        <p class="text-muted">Chưa có chỉ định nào</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-white text-end">
                            <button class="btn btn-secondary me-2" onclick="App.navigate('cho-kham')">
                                <i class="bi bi-arrow-left"></i> Quay lại
                            </button>
                            <button class="btn btn-info me-2" onclick="KhamBenh.inPhieuKham()">
                                <i class="bi bi-printer"></i> In phiếu khám
                            </button>
                            <button class="btn btn-success" onclick="KhamBenh.hoanTatKham()">
                                <i class="bi bi-check-circle"></i> Hoàn tất khám
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load dữ liệu đã có (nếu có)
        await this.loadExistingData();
        
        // Load danh sách thuốc
        await this.loadDanhSachThuoc();
        
        // Load danh sách bệnh
        await this.loadDanhSachBenh();
        
        // Load danh sách chẩn đoán đã lưu
        await this.loadDanhSachChanDoan();
        
        // Bind event cho tab Cận lâm sàng
        const tabCLS = document.getElementById('tab-cls');
        if (tabCLS) {
            tabCLS.addEventListener('shown.bs.tab', () => {
                this.loadDanhSachCLS();
            });
        }
        
        // Bind event cho tab Chẩn đoán
        const tabChanDoan = document.getElementById('tab-chandoan');
        if (tabChanDoan) {
            tabChanDoan.addEventListener('shown.bs.tab', () => {
                this.loadDanhSachChanDoan();
            });
        }
    },
    
    async loadExistingData() {
        // Load chỉ số sức sống
        try {
            const response = await API.get(`/chi-so-su-song/dot-kham/${this.currentDotKham.maDotKham}`);
            if (response.success && response.data) {
                const cs = response.data;
                if (cs.nhipTim) document.getElementById('nhipTim').value = cs.nhipTim;
                if (cs.huyetApTamThu) document.getElementById('huyetApTamThu').value = cs.huyetApTamThu;
                if (cs.huyetApTamTruong) document.getElementById('huyetApTamTruong').value = cs.huyetApTamTruong;
                if (cs.nhietDo) document.getElementById('nhietDo').value = cs.nhietDo;
                if (cs.nhipTho) document.getElementById('nhipTho').value = cs.nhipTho;
                if (cs.canNang) document.getElementById('canNang').value = cs.canNang;
            }
        } catch (error) {
            console.error('Error loading chi so:', error);
        }
        
        // Load đơn thuốc hiện tại (nếu có)
        try {
            const response = await API.get(`/don-thuoc/dot-kham/${this.currentDotKham.maDotKham}`);
            if (response.success && response.data && response.data.length > 0) {
                const donThuoc = response.data[0];
                this.currentDonThuoc = { maDonThuoc: donThuoc.maDonThuoc };
                console.log('Loaded existing prescription:', this.currentDonThuoc.maDonThuoc);
            } else {
                this.currentDonThuoc = null;
                console.log('No existing prescription found');
            }
        } catch (error) {
            console.error('Error loading prescription:', error);
            this.currentDonThuoc = null;
        }
        
        // Load danh sách cận lâm sàng
        await this.loadDanhSachCLS();
    },
    
    async loadDanhSachBenh() {
        try {
            const response = await API.get('/danh-muc/benh');
            if (response.success && response.data) {
                this.danhSachBenh = response.data;
                this.renderDanhSachBenhCheckbox(response.data);
                
                // Bind search event
                const searchInput = document.getElementById('searchBenh');
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        const keyword = e.target.value.toLowerCase();
                        const filtered = this.danhSachBenh.filter(benh => 
                            benh.maBenh.toLowerCase().includes(keyword) ||
                            benh.tenBenh.toLowerCase().includes(keyword)
                        );
                        this.renderDanhSachBenhCheckbox(filtered);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading danh sach benh:', error);
        }
    },
    
    renderDanhSachBenhCheckbox(danhSach) {
        const container = document.getElementById('danhSachBenhCheckbox');
        if (!container) return;
        
        if (!danhSach || danhSach.length === 0) {
            container.innerHTML = '<p class="text-muted">Không tìm thấy bệnh nào</p>';
            return;
        }
        
        const html = danhSach.map(benh => `
            <div class="form-check">
                <input class="form-check-input benh-checkbox" type="checkbox" 
                       value="${benh.maBenh}" id="benh_${benh.maBenh}">
                <label class="form-check-label" for="benh_${benh.maBenh}">
                    <strong>${benh.maBenh}</strong> - ${benh.tenBenh}
                </label>
            </div>
        `).join('');
        
        container.innerHTML = html;
    },
    
    async luuChiSo() {
        try {
            App.showLoading();
            
            const data = {
                MaDotKham: this.currentDotKham.maDotKham,
                NhipTim: parseInt(document.getElementById('nhipTim').value) || null,
                HuyetApTamThu: parseInt(document.getElementById('huyetApTamThu').value) || null,
                HuyetApTamTruong: parseInt(document.getElementById('huyetApTamTruong').value) || null,
                NhietDo: parseFloat(document.getElementById('nhietDo').value) || null,
                NhipTho: parseInt(document.getElementById('nhipTho').value) || null,
                CanNang: parseFloat(document.getElementById('canNang').value) || null
            };
            
            const response = await API.post('/chi-so-su-song', data);
            
            if (response.success) {
                App.showToast('Đã lưu chỉ số sức sống', 'success');
            } else {
                throw new Error(response.message || 'Không thể lưu chỉ số');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async luuTrieuChung() {
        // Lưu vào ghi chú của đợt khám
        try {
            App.showLoading();
            
            const trieuChung = document.getElementById('trieuChung').value;
            const khamLamSang = document.getElementById('khamLamSang').value;
            
            // TODO: Cần thêm API để update ghi chú đợt khám
            App.showToast('Đã lưu triệu chứng và khám lâm sàng', 'success');
            
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async luuChanDoan() {
        try {
            App.showLoading();
            
            // Lấy danh sách bệnh đã chọn
            const selectedCheckboxes = document.querySelectorAll('.benh-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                App.showToast('Vui lòng chọn ít nhất một bệnh', 'warning');
                App.hideLoading();
                return;
            }
            
            const user = Auth.getUser();
            const loaiChanDoan = document.getElementById('loaiChanDoan').value;
            const noiDungChanDoan = document.getElementById('noiDungChanDoan').value;
            
            // Lưu từng chẩn đoán
            let successCount = 0;
            let errorCount = 0;
            
            for (const checkbox of selectedCheckboxes) {
                const maBenh = checkbox.value;
                
                const data = {
                    MaHoSo: this.currentDotKham.maHoSo,
                    MaDotKham: this.currentDotKham.maDotKham,
                    MaBacSi: user.maNhanVien,
                    MaBenh: maBenh,
                    Loai: loaiChanDoan,
                    NoiDungChanDoan: noiDungChanDoan
                };
                
                try {
                    const response = await API.post('/chan-doan', data);
                    if (response.success) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    console.error('Error saving diagnosis for', maBenh, error);
                    errorCount++;
                }
            }
            
            if (successCount > 0) {
                App.showToast(`Đã lưu ${successCount} chẩn đoán thành công`, 'success');
                
                // Reset form
                selectedCheckboxes.forEach(cb => cb.checked = false);
                document.getElementById('noiDungChanDoan').value = '';
                document.getElementById('searchBenh').value = '';
                
                // Reload danh sách chẩn đoán đã lưu
                await this.loadDanhSachChanDoan();
            }
            
            if (errorCount > 0) {
                App.showToast(`Có ${errorCount} chẩn đoán không thể lưu`, 'warning');
            }
            
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async loadDanhSachChanDoan() {
        try {
            const response = await API.get(`/chan-doan/dot-kham/${this.currentDotKham.maDotKham}`);
            const listContainer = document.getElementById('listChanDoan');
            
            if (!listContainer) return;
            
            if (response.success && response.data && response.data.length > 0) {
                const html = response.data.map((cd, index) => `
                    <div class="card mb-2">
                        <div class="card-body py-2">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <span class="badge bg-primary">${index + 1}</span>
                                    <strong class="ms-2">${cd.maBenh || '-'}</strong>
                                    <span class="text-muted ms-2">${cd.loai || ''}</span>
                                    ${cd.noiDungChanDoan ? `<p class="mb-0 mt-1 small">${cd.noiDungChanDoan}</p>` : ''}
                                </div>
                                <button class="btn btn-sm btn-outline-danger" 
                                        onclick="KhamBenh.xoaChanDoan('${cd.maChanDoan}')"
                                        title="Xóa chẩn đoán">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
                listContainer.innerHTML = html;
            } else {
                listContainer.innerHTML = '<p class="text-muted">Chưa có chẩn đoán nào</p>';
            }
        } catch (error) {
            console.error('Error loading chan doan:', error);
        }
    },
    
    async xoaChanDoan(maChanDoan) {
        if (!confirm('Bạn có chắc muốn xóa chẩn đoán này?')) {
            return;
        }
        
        try {
            App.showLoading();
            const response = await API.delete(`/chan-doan/${maChanDoan}`);
            
            if (response.success) {
                App.showToast('Đã xóa chẩn đoán', 'success');
                await this.loadDanhSachChanDoan();
            } else {
                throw new Error(response.message || 'Không thể xóa chẩn đoán');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async themThuoc() {
        // Hiển thị modal thêm nhiều thuốc
        const modalHtml = `
            <div class="modal fade" id="modalThemThuoc" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-capsule"></i> Thêm thuốc vào đơn
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i> 
                                Nhập đầy đủ thông tin cho mỗi loại thuốc. Click "Thêm dòng" để nhập thêm thuốc khác.
                            </div>
                            
                            <div class="table-responsive">
                                <table class="table table-bordered" id="tableThuoc">
                                    <thead class="table-light">
                                        <tr>
                                            <th width="30%">Tên thuốc <span class="text-danger">*</span></th>
                                            <th width="10%">Số lượng <span class="text-danger">*</span></th>
                                            <th width="25%">Liều dùng <span class="text-danger">*</span></th>
                                            <th width="25%">Cách dùng <span class="text-danger">*</span></th>
                                            <th width="10%">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbodyThuoc">
                                        <!-- Dòng thuốc sẽ được thêm vào đây -->
                                    </tbody>
                                </table>
                            </div>
                            
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="KhamBenh.themDongThuoc()">
                                <i class="bi bi-plus-circle"></i> Thêm dòng
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-success" onclick="KhamBenh.luuDanhSachThuoc()">
                                <i class="bi bi-check-circle"></i> Lưu đơn thuốc
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal if exists
        const oldModal = document.getElementById('modalThemThuoc');
        if (oldModal) oldModal.remove();
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalThemThuoc'));
        modal.show();
        
        // Load danh sách thuốc từ database
        await this.loadThuocOptions();
        
        // Thêm dòng đầu tiên
        this.themDongThuoc();
    },
    
    async loadThuocOptions() {
        try {
            const response = await API.get(`/danh-muc/thuoc`);
            if (response.success && response.data) {
                this.danhSachThuocOptions = response.data;
            }
        } catch (error) {
            console.error('Error loading medications:', error);
            this.danhSachThuocOptions = [];
        }
    },
    
    themDongThuoc() {
        const tbody = document.getElementById('tbodyThuoc');
        const rowIndex = tbody.children.length;
        
        const optionsThuoc = this.danhSachThuocOptions?.map(t => 
            `<option value="${t.maThuoc}">${t.tenThuoc} - ${t.donViTinh || ''}</option>`
        ).join('') || '';
        
        const row = `
            <tr data-row="${rowIndex}">
                <td>
                    <select class="form-select form-select-sm thuoc-select" data-row="${rowIndex}" required>
                        <option value="">-- Chọn thuốc --</option>
                        ${optionsThuoc}
                    </select>
                </td>
                <td>
                    <input type="number" class="form-control form-control-sm thuoc-soluong" 
                           data-row="${rowIndex}" min="1" placeholder="10" required>
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm thuoc-lieudung" 
                           data-row="${rowIndex}" placeholder="1 viên/lần, 2 lần/ngày" required>
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm thuoc-cachdung" 
                           data-row="${rowIndex}" placeholder="Uống sau ăn" required>
                </td>
                <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm" 
                            onclick="KhamBenh.xoaDongThuoc(${rowIndex})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        
        tbody.insertAdjacentHTML('beforeend', row);
    },
    
    xoaDongThuoc(rowIndex) {
        const row = document.querySelector(`tr[data-row="${rowIndex}"]`);
        if (row) {
            row.remove();
        }
    },
    
    async luuDanhSachThuoc() {
        console.log('=== START luuDanhSachThuoc ===');
        console.log('currentDonThuoc:', this.currentDonThuoc);
        console.log('currentDotKham:', this.currentDotKham);
        
        try {
            const tbody = document.getElementById('tbodyThuoc');
            const rows = tbody.querySelectorAll('tr');
            
            if (rows.length === 0) {
                App.showToast('Vui lòng thêm ít nhất một loại thuốc', 'warning');
                return;
            }
            
            // Validate và thu thập dữ liệu
            const danhSachThuoc = [];
            
            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                const rowIndex = row.getAttribute('data-row');
                const selectElement = row.querySelector(`.thuoc-select[data-row="${rowIndex}"]`);
                const maThuoc = selectElement?.value;
                const tenThuoc = selectElement?.options[selectElement.selectedIndex]?.text;
                const soLuong = row.querySelector(`.thuoc-soluong[data-row="${rowIndex}"]`)?.value;
                const lieuDung = row.querySelector(`.thuoc-lieudung[data-row="${rowIndex}"]`)?.value;
                const cachDung = row.querySelector(`.thuoc-cachdung[data-row="${rowIndex}"]`)?.value;
                
                if (!maThuoc || !soLuong || !lieuDung || !cachDung) {
                    App.showToast(`Dòng ${index + 1}: Vui lòng điền đầy đủ thông tin`, 'error');
                    return;
                }
                
                danhSachThuoc.push({
                    maThuoc,
                    tenThuoc,
                    soLuong: parseInt(soLuong),
                    lieuDung,
                    cachDung
                });
            }
            
            console.log('Danh sách thuốc:', danhSachThuoc);
            
            if (danhSachThuoc.length === 0) {
                App.showToast('Vui lòng thêm ít nhất một loại thuốc', 'warning');
                return;
            }
            
            App.showLoading();
            
            // Kiểm tra đã có đơn thuốc chưa, nếu chưa thì tạo mới
            // currentDonThuoc có thể là null, undefined, hoặc mảng rỗng []
            const hasValidPrescription = this.currentDonThuoc && 
                                        !Array.isArray(this.currentDonThuoc) && 
                                        this.currentDonThuoc.maDonThuoc;
            
            console.log('hasValidPrescription:', hasValidPrescription);
            
            if (!hasValidPrescription) {
                const user = Auth.getUser();
                console.log('Creating prescription for:', this.currentDotKham.maDotKham);
                console.log('User info:', user);
                
                const responseDT = await API.post('/don-thuoc', {
                    MaDotKham: this.currentDotKham.maDotKham,
                    MaBacSi: user.maNhanVien
                });
                
                console.log('Full prescription response:', JSON.stringify(responseDT, null, 2));
                console.log('Response data:', responseDT.data);
                console.log('Response data type:', typeof responseDT.data);
                
                if (!responseDT.success) {
                    throw new Error(responseDT.message || 'Không thể tạo đơn thuốc');
                }
                
                // Kiểm tra nhiều cách để lấy maDonThuoc
                let maDonThuoc = null;
                if (responseDT.data) {
                    if (responseDT.data.maDonThuoc) {
                        maDonThuoc = responseDT.data.maDonThuoc;
                    } else if (responseDT.data.MaDonThuoc) {
                        maDonThuoc = responseDT.data.MaDonThuoc;
                    } else if (typeof responseDT.data === 'string') {
                        maDonThuoc = responseDT.data;
                    }
                }
                
                console.log('Extracted maDonThuoc:', maDonThuoc);
                
                if (!maDonThuoc) {
                    throw new Error('API không trả về mã đơn thuốc. Response: ' + JSON.stringify(responseDT));
                }
                
                this.currentDonThuoc = { maDonThuoc: maDonThuoc };
                console.log('Created prescription:', this.currentDonThuoc.maDonThuoc);
                
                // Đợi để đảm bảo database đã commit
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Verify đơn thuốc đã tồn tại
                const verifyResponse = await API.get(`/don-thuoc/dot-kham/${this.currentDotKham.maDotKham}`);
                console.log('Verify prescription exists:', verifyResponse);
                
                if (!verifyResponse.success || !verifyResponse.data || verifyResponse.data.length === 0) {
                    throw new Error('Đơn thuốc không tồn tại sau khi tạo');
                }
            }
            
            // Lưu từng thuốc
            let successCount = 0;
            let errorMessages = [];
            let warnings = [];
            
            for (const thuoc of danhSachThuoc) {
                try {
                    const data = {
                        MaDonThuoc: this.currentDonThuoc.maDonThuoc,
                        MaThuoc: thuoc.maThuoc,
                        SoLuong: thuoc.soLuong,
                        LieuDung: thuoc.lieuDung,
                        CachDung: thuoc.cachDung
                    };
                    
                    const response = await API.post(`/don-thuoc/${this.currentDonThuoc.maDonThuoc}/chi-tiet`, data);
                    
                    // Debug: Log response để kiểm tra
                    console.log('Response from add medication:', response);
                    console.log('Has canhBao?', response.canhBao);
                    
                    if (response.success) {
                        successCount++;
                        
                        // Kiểm tra cảnh báo dị ứng
                        if (response.canhBao) {
                            console.log('Warning detected:', response.canhBao);
                            const canhBao = response.canhBao;
                            const warningMessage = `
                                <div class="alert alert-warning" style="text-align: left;">
                                    <h5><i class="bi bi-exclamation-triangle-fill"></i> CẢNH BÁO DỊ ỨNG</h5>
                                    <p><strong>Thuốc:</strong> ${thuoc.tenThuoc || 'Không xác định'}</p>
                                    <p><strong>Tên dị ứng:</strong> ${canhBao.tenDiUng}</p>
                                    <p><strong>Mức độ:</strong> <span class="badge bg-warning">${canhBao.mucDoDiUng}</span></p>
                                    ${canhBao.tacNhan ? `<p><strong>Tác nhân:</strong> ${canhBao.tacNhan}</p>` : ''}
                                    ${canhBao.bieuHien ? `<p><strong>Biểu hiện:</strong> ${canhBao.bieuHien}</p>` : ''}
                                    <p class="mb-0"><em>Thuốc đã được thêm vào đơn. Vui lòng cân nhắc kỹ trước khi kê đơn cho bệnh nhân.</em></p>
                                </div>
                            `;
                            warnings.push(warningMessage);
                        }
                    } else {
                        errorMessages.push(`${thuoc.tenThuoc || 'Thuốc'}: ${response.message || 'Lỗi không xác định'}`);
                    }
                } catch (error) {
                    console.error('Error saving medication:', error);
                    const errorMsg = error.response?.data?.message || error.message;
                    errorMessages.push(`${thuoc.tenThuoc || 'Thuốc'}: ${errorMsg}`);
                }
            }
            
            // Hiển thị cảnh báo dị ứng nếu có
            if (warnings.length > 0) {
                Swal.fire({
                    title: 'Cảnh báo dị ứng thuốc!',
                    html: warnings.join('<hr>'),
                    icon: 'warning',
                    confirmButtonText: 'Đã hiểu',
                    width: '600px'
                });
            }
            
            if (successCount > 0) {
                App.showToast(`Đã thêm ${successCount}/${danhSachThuoc.length} loại thuốc vào đơn`, 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalThemThuoc'));
                modal.hide();
                
                // Reload prescription details
                await this.loadDanhSachThuoc();
            }
            
            // Hiển thị lỗi nếu có
            if (errorMessages.length > 0) {
                Swal.fire({
                    title: 'Có lỗi xảy ra',
                    html: errorMessages.join('<br>'),
                    icon: 'error',
                    confirmButtonText: 'Đóng'
                });
            }
            
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    

    
    async loadDanhSachThuoc() {
        if (!this.currentDonThuoc) {
        }
        
        if (!this.currentDonThuoc) {
            document.getElementById('danhSachThuoc').innerHTML = '<p class="text-muted">Chưa có thuốc nào được kê</p>';
            return;
        }
        
        try {
            const response = await API.get(`/don-thuoc/${this.currentDonThuoc.maDonThuoc}/chi-tiet`);
            if (response.success && response.data && response.data.length > 0) {
                const html = `
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered">
                            <thead class="table-light">
                                <tr>
                                    <th width="40">#</th>
                                    <th>Tên thuốc</th>
                                    <th width="80">Số lượng</th>
                                    <th>Liều dùng</th>
                                    <th>Cách dùng</th>
                                    <th width="70" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${response.data.map((thuoc, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td><strong>${thuoc.tenThuoc || '-'}</strong></td>
                                        <td class="text-center">${thuoc.soLuong || '-'}</td>
                                        <td>${thuoc.lieuDung || '-'}</td>
                                        <td>${thuoc.cachDung || '-'}</td>
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-danger" 
                                                    onclick="KhamBenh.xoaThuoc('${thuoc.maThuoc}')"
                                                    title="Xóa thuốc">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
                document.getElementById('danhSachThuoc').innerHTML = html;
            } else {
                document.getElementById('danhSachThuoc').innerHTML = '<p class="text-muted">Chưa có thuốc nào được kê</p>';
            }
        } catch (error) {
            console.error('Error loading danh sach thuoc:', error);
        }
    },

    async xoaThuoc(maThuoc) {
        if (!this.currentDonThuoc) {
            App.showToast('Chưa có đơn thuốc', 'error');
            return;
        }

        try {
            const result = await Swal.fire({
                title: 'Xác nhận xóa',
                text: 'Bạn có chắc muốn xóa thuốc này khỏi đơn?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                App.showLoading();
                const response = await API.delete(`/don-thuoc/${this.currentDonThuoc.maDonThuoc}/chi-tiet/${maThuoc}`);
                
                if (response.success) {
                    App.showToast('Đã xóa thuốc khỏi đơn', 'success');
                    await this.loadDanhSachThuoc();
                } else {
                    throw new Error(response.message || 'Không thể xóa thuốc');
                }
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async luuCLS() {
        try {
            App.showLoading();
            
            const user = Auth.getUser();
            const loaiChiDinh = document.getElementById('loaiCLS').value;
            const tenDichVu = document.getElementById('tenCLS').value;
            
            const data = {
                MaDotKham: this.currentDotKham.maDotKham,
                MaBacSi: user.maNhanVien,
                LoaiChiDinh: loaiChiDinh,  // Thêm LoaiChiDinh
                LoaiDichVu: loaiChiDinh,   // Giữ LoaiDichVu để tương thích
                TenDichVu: tenDichVu,
                GhiChu: document.getElementById('ghiChuCLS').value
            };
            
            const response = await API.post('/chi-dinh', data);
            
            if (response.success) {
                App.showToast('Đã lưu chỉ định cận lâm sàng', 'success');
                document.getElementById('formCLS').reset();
                await this.loadDanhSachCLS();
            } else {
                throw new Error(response.message || 'Không thể lưu chỉ định');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async loadDanhSachCLS() {
        try {
            console.log('Loading CLS for:', this.currentDotKham.maDotKham);
            const response = await API.get(`/chi-dinh/dot-kham/${this.currentDotKham.maDotKham}`);
            console.log('CLS Response:', response);
            
            if (response.success && response.data && response.data.length > 0) {
                const html = `
                    <h6>Danh sách chỉ định</h6>
                    <div class="list-group">
                        ${response.data.map(cls => `
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="flex-grow-1">
                                        <strong>${cls.loaiDichVu || cls.loaiChiDinh || 'N/A'}</strong>: ${cls.tenDichVu || 'N/A'}
                                        ${cls.ghiChu ? `<br><small class="text-muted">${cls.ghiChu}</small>` : ''}
                                    </div>
                                    <div class="d-flex gap-2 align-items-center">
                                        <span class="badge bg-info">${cls.trangThai || 'Chờ thực hiện'}</span>
                                        ${cls.trangThai === 'Đã có kết quả' ? `
                                            <button class="btn btn-sm btn-primary" onclick="KhamBenh.xemKetQuaCLS('${cls.maChiDinh}')">
                                                <i class="bi bi-eye"></i> Xem KQ
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                document.getElementById('danhSachCLS').innerHTML = html;
            } else {
                console.log('No CLS data found');
                document.getElementById('danhSachCLS').innerHTML = `
                    <h6>Danh sách chỉ định</h6>
                    <p class="text-muted">Chưa có chỉ định nào</p>
                `;
            }
        } catch (error) {
            console.error('Error loading CLS:', error);
            document.getElementById('danhSachCLS').innerHTML = `
                <h6>Danh sách chỉ định</h6>
                <p class="text-danger">Lỗi khi tải danh sách: ${error.message}</p>
            `;
        }
    },
    
    async xemKetQuaCLS(maChiDinh) {
        try {
            App.showLoading();
            
            const response = await API.get(`/ket-qua/chi-dinh/${maChiDinh}`);
            
            if (response.success && response.data) {
                const ketQua = response.data;
                
                // Parse hình ảnh
                const hinhAnhUrls = ketQua.hinhAnhKetQua ? ketQua.hinhAnhKetQua.split(';').filter(url => url) : [];
                
                const modalHtml = `
                    <div class="modal fade" id="modalXemKetQuaCLS" tabindex="-1">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header bg-primary text-white">
                                    <h5 class="modal-title">
                                        <i class="bi bi-file-medical"></i> Kết quả cận lâm sàng
                                    </h5>
                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label class="form-label"><strong>Loại xét nghiệm:</strong></label>
                                        <p>${ketQua.loaiDichVu || ketQua.loaiChiDinh || '-'}</p>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label"><strong>Tên xét nghiệm:</strong></label>
                                        <p>${ketQua.tenDichVu || '-'}</p>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label"><strong>Kết quả:</strong></label>
                                        <div class="card">
                                            <div class="card-body">
                                                <p class="mb-0" style="white-space: pre-wrap;">${ketQua.ketQua || ketQua.ketLuan || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    ${hinhAnhUrls.length > 0 ? `
                                        <div class="mb-3">
                                            <label class="form-label"><strong>Hình ảnh kết quả:</strong></label>
                                            <div class="row g-3">
                                                ${hinhAnhUrls.map(url => {
                                                    const fileName = url.split('/').pop();
                                                    const ext = fileName.split('.').pop().toLowerCase();
                                                    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
                                                    
                                                    if (isImage) {
                                                        return `
                                                            <div class="col-md-4">
                                                                <a href="http://localhost:5000${url}" target="_blank">
                                                                    <img src="http://localhost:5000${url}" 
                                                                         class="img-thumbnail" 
                                                                         style="width: 100%; height: 250px; object-fit: cover; cursor: pointer;"
                                                                         alt="Kết quả xét nghiệm">
                                                                </a>
                                                            </div>
                                                        `;
                                                    } else {
                                                        return `
                                                            <div class="col-md-4">
                                                                <a href="http://localhost:5000${url}" target="_blank" 
                                                                   class="btn btn-outline-primary w-100 py-3">
                                                                    <i class="bi bi-file-earmark-pdf fs-1 d-block mb-2"></i>
                                                                    <small>${fileName}</small>
                                                                </a>
                                                            </div>
                                                        `;
                                                    }
                                                }).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                    
                                    ${ketQua.ghiChu ? `
                                        <div class="mb-3">
                                            <label class="form-label"><strong>Ghi chú:</strong></label>
                                            <div class="card bg-light">
                                                <div class="card-body">
                                                    <p class="mb-0" style="white-space: pre-wrap;">${ketQua.ghiChu}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ` : ''}
                                    
                                    <div class="text-muted">
                                        <small>
                                            <i class="bi bi-person"></i> Kỹ thuật viên: ${ketQua.hoTenKyThuatVien || '-'}<br>
                                            <i class="bi bi-clock"></i> Ngày có kết quả: ${ketQua.ngayCoKetQua ? new Date(ketQua.ngayCoKetQua).toLocaleString('vi-VN') : '-'}
                                        </small>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Remove old modal if exists
                const oldModal = document.getElementById('modalXemKetQuaCLS');
                if (oldModal) oldModal.remove();
                
                // Add modal to body
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('modalXemKetQuaCLS'));
                modal.show();
            } else {
                throw new Error('Không tìm thấy kết quả');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async hoanTatKham() {
        if (!confirm('Xác nhận hoàn tất khám bệnh nhân này?')) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.put(`/dot-kham/${this.currentDotKham.maDotKham}/trang-thai`, {
                TrangThai: 'Hoàn tất'
            });
            
            if (response.success) {
                App.showToast('Đã hoàn tất khám!', 'success');
                this.currentDotKham = null;
                this.currentBenhNhan = null;
                this.currentDonThuoc = null;
                App.navigate('cho-kham');
            } else {
                throw new Error(response.message || 'Không thể hoàn tất');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async inPhieuKham() {
        // Hiển thị modal chọn ngày tái khám trước
        this.hienThiModalChonNgayTaiKham();
    },
    
    hienThiModalChonNgayTaiKham() {
        // Tính ngày mặc định (7 ngày sau)
        const ngayMacDinh = new Date();
        ngayMacDinh.setDate(ngayMacDinh.getDate() + 7);
        const ngayMacDinhStr = ngayMacDinh.toISOString().split('T')[0];
        
        const modalHtml = `
            <div class="modal fade" id="modalChonNgayTaiKham" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-calendar-check"></i> Chọn ngày tái khám
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i> 
                                Vui lòng chọn ngày tái khám cho bệnh nhân trước khi in phiếu.
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Ngày tái khám <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="ngayTaiKham" 
                                       value="${ngayMacDinhStr}" min="${new Date().toISOString().split('T')[0]}" required>
                                <small class="text-muted">Mặc định: Sau 7 ngày (${ngayMacDinh.toLocaleDateString('vi-VN')})</small>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Ghi chú tái khám (tùy chọn)</label>
                                <textarea class="form-control" id="ghiChuTaiKham" rows="2" 
                                          placeholder="VD: Mang theo kết quả xét nghiệm..."></textarea>
                            </div>
                            
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="khongCanTaiKham">
                                <label class="form-check-label" for="khongCanTaiKham">
                                    Không cần tái khám
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle"></i> Hủy
                            </button>
                            <button type="button" class="btn btn-info" onclick="KhamBenh.xacNhanVaInPhieu()">
                                <i class="bi bi-printer"></i> Xác nhận và In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal
        const oldModal = document.getElementById('modalChonNgayTaiKham');
        if (oldModal) oldModal.remove();
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalChonNgayTaiKham'));
        modal.show();
        
        // Bind event cho checkbox "Không cần tái khám"
        document.getElementById('khongCanTaiKham').addEventListener('change', function() {
            const ngayInput = document.getElementById('ngayTaiKham');
            const ghiChuInput = document.getElementById('ghiChuTaiKham');
            if (this.checked) {
                ngayInput.disabled = true;
                ghiChuInput.disabled = true;
            } else {
                ngayInput.disabled = false;
                ghiChuInput.disabled = false;
            }
        });
    },
    
    async xacNhanVaInPhieu() {
        try {
            // Lấy thông tin ngày tái khám
            const khongCanTaiKham = document.getElementById('khongCanTaiKham').checked;
            let ngayTaiKham = null;
            let ghiChuTaiKham = '';
            
            if (!khongCanTaiKham) {
                const ngayTaiKhamInput = document.getElementById('ngayTaiKham').value;
                if (!ngayTaiKhamInput) {
                    App.showToast('Vui lòng chọn ngày tái khám', 'warning');
                    return;
                }
                ngayTaiKham = new Date(ngayTaiKhamInput);
                ghiChuTaiKham = document.getElementById('ghiChuTaiKham').value;
            }
            
            // Đóng modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalChonNgayTaiKham'));
            modal.hide();
            
            // Tiếp tục in phiếu
            await this.thucHienInPhieu(ngayTaiKham, ghiChuTaiKham, khongCanTaiKham);
            
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        }
    },
    
    async thucHienInPhieu(ngayTaiKham, ghiChuTaiKham, khongCanTaiKham) {
        try {
            App.showLoading();
            
            // Lấy thông tin chi tiết
            const user = Auth.getUser();
            const bn = this.currentBenhNhan;
            const dk = this.currentDotKham;
            
            // Lấy thông tin chẩn đoán
            const chanDoanRes = await API.get(`/chan-doan/dot-kham/${dk.maDotKham}`);
            const danhSachChanDoan = chanDoanRes.success ? chanDoanRes.data : [];
            const chanDoanText = danhSachChanDoan.map(cd => cd.tenBenh || cd.noiDungChanDoan).join(', ') || 'Chưa có chẩn đoán';
            
            // Lấy danh sách thuốc
            let danhSachThuoc = [];
            if (this.currentDonThuoc) {
                const thuocRes = await API.get(`/don-thuoc/${this.currentDonThuoc.maDonThuoc}/chi-tiet`);
                danhSachThuoc = thuocRes.success && thuocRes.data ? thuocRes.data : [];
            }
            
            // Lấy chỉ số sức sống
            const chiSoRes = await API.get(`/chi-so-su-song/dot-kham/${dk.maDotKham}`);
            const chiSo = chiSoRes.success && chiSoRes.data ? chiSoRes.data : null;
            
            // Lấy thông tin phòng khám
            let tenPhongKham = 'PHÒNG KHÁM ĐA KHOA';
            let diaChiPhongKham = '';
            let dienThoaiPhongKham = '';
            
            if (user.maPhongKham) {
                try {
                    const pkRes = await API.get(`/phong-kham/${user.maPhongKham}`);
                    if (pkRes.success && pkRes.data) {
                        tenPhongKham = pkRes.data.tenPhongKham || tenPhongKham;
                        diaChiPhongKham = pkRes.data.diaChi || '';
                        dienThoaiPhongKham = pkRes.data.soDienThoai || '';
                    }
                } catch (error) {
                    console.error('Error loading clinic info:', error);
                }
            }
            
            // Tạo nội dung HTML cho phiếu khám
            const printContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Đơn Thuốc - ${bn.maBenhNhan}</title>
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
                    ${dk.maDotKham}
                </div>
            </div>
        </div>
    </div>
    
    <div class="title">ĐƠN THUỐC</div>
    
    <div class="patient-info">
        <div class="info-row">
            <span class="info-label">Họ tên:</span>
            <span><strong>${bn.hoTen.toUpperCase()}</strong></span>
        </div>
        <div class="info-row" style="align-items: flex-start;">
            <span class="info-label" style="padding-top: 2px;">Số định danh:</span>
            <div style="flex: 1;">
                <div style="margin-bottom: 3px;">
                    <span style="text-decoration: underline;">Số định danh cá nhân</span>/<span style="text-decoration: underline;">số căn cước công dân</span>/<span style="text-decoration: underline;">số hộ chiếu của người bệnh (nếu có)</span>
                    <strong style="margin-left: 20px; font-size: 14px;">${bn.cccd || '___________'}</strong>
                </div>
                <div style="font-size: 10px; font-style: italic; color: #555;">
                    (căn cước /hộ gia đình cộng đồng hoặc thẻ khám của người bệnh/thẻ cư trú)
                </div>
            </div>
        </div>
        <div class="info-row">
            <span class="info-label">Ngày sinh:</span>
            <span>${bn.ngaySinh ? new Date(bn.ngaySinh).toLocaleDateString('vi-VN') : '-'}</span>
            <span style="margin-left: 40px;" class="info-label">Cân nặng:</span>
            <span>${chiSo && chiSo.canNang ? chiSo.canNang + 'kg' : '-'}</span>
            <span style="margin-left: 20px;" class="info-label">Giới tính:</span>
            <span style="display: inline-flex; align-items: center;">
                <span style="border: 1px solid #000; width: 12px; height: 12px; display: inline-block; margin: 0 3px; text-align: center; line-height: 12px;">${bn.gioiTinh === 'Nam' ? 'X' : ''}</span> Nam
                <span style="border: 1px solid #000; width: 12px; height: 12px; display: inline-block; margin: 0 3px; text-align: center; line-height: 12px;">${bn.gioiTinh === 'Nữ' ? 'X' : ''}</span> Nữ
            </span>
        </div>
        <div class="info-row">
            <span class="info-label">Nơi thường trú:</span>
            <span>${bn.diaChi || '-'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Chẩn đoán:</span>
            <span>${chanDoanText}</span>
        </div>
    </div>
    
    <div class="prescription-section">
        <div class="section-title">Thuốc điều trị:</div>
        <div class="medication-list">
            ${danhSachThuoc.length > 0 ? danhSachThuoc.map((thuoc, index) => {
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
                
                // Nếu không parse được, không hiển thị số ngày
                
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
            ${khongCanTaiKham ? 
                '<div>Ngày tái khám: <strong>Không cần tái khám</strong></div>' :
                `<div>Ngày tái khám: <strong>${ngayTaiKham ? ngayTaiKham.toLocaleDateString('vi-VN') : this.getNgayTaiKham()}</strong></div>`
            }
            ${ghiChuTaiKham ? `<div style="font-size: 11px; margin-top: 3px;"><em>Ghi chú: ${ghiChuTaiKham}</em></div>` : ''}
        </div>
        <div class="footer-right">
            <div class="date-info">Ngày ${new Date().getDate().toString().padStart(2, '0')} tháng ${(new Date().getMonth() + 1).toString().padStart(2, '0')} năm ${new Date().getFullYear()}</div>
            <div style="font-weight: bold;">Bác sỹ/Y sỹ khám bệnh</div>
            <div style="font-style: italic; font-size: 11px;">(Ký, ghi rõ họ tên)</div>
            <div class="signature-area">
                <strong>${user.hoTen || ''}</strong>
            </div>
        </div>
    </div>
    
    <div class="notes">
        <div class="notes-title">- Khám bệnh lại xin mang theo đơn này.</div>
        <div class="note-item">- Số điện thoại liên hệ: ${dienThoaiPhongKham || '0123456789'}</div>
        <div class="note-item">- Hẹn và hỗ trợ người trẻ đến khám bệnh, không chích bệnh.</div>
    </div>
    
    <script>
        // Auto print when page loads (optional)
        // window.onload = function() {
        //     setTimeout(function() {
        //         window.print();
        //     }, 500);
        // }
    </script>
</body>
</html>
            `;
            
            // Mở cửa sổ mới và in
            const printWindow = window.open('', '_blank', 'width=800,height=1000');
            printWindow.document.write(printContent);
            printWindow.document.close();
            
            App.showToast('Đã mở phiếu khám để in', 'success');
            
        } catch (error) {
            console.error('Error printing:', error);
            App.showToast('Lỗi khi in phiếu khám: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    getNgayTaiKham() {
        // Tính ngày tái khám (sau 7 ngày)
        const ngayTaiKham = new Date();
        ngayTaiKham.setDate(ngayTaiKham.getDate() + 7);
        return ngayTaiKham.toLocaleDateString('vi-VN');
    }
};
