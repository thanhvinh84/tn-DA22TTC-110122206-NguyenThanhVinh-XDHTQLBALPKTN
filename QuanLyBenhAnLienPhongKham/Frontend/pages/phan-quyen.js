// Giao diện Phân quyền hồ sơ
const PhanQuyen = {
    hoSoList: [],
    taiKhoanList: [],
    phongKhamList: [],
    currentData: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white">
                    <h5 class="mb-0">
                        <i class="bi bi-shield-lock"></i> Phân quyền truy cập Hồ sơ bệnh án
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>Hướng dẫn:</strong> Chọn hồ sơ bệnh án, tài khoản, phòng khám và loại quyền để cấp quyền truy cập.
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header bg-primary text-white">
                                    <h6 class="mb-0"><i class="bi bi-plus-circle"></i> Cấp quyền mới</h6>
                                </div>
                                <div class="card-body">
                                    <form id="formPhanQuyen" onsubmit="PhanQuyen.handleCapQuyen(event)">
                                        <div class="mb-3">
                                            <label class="form-label required">Hồ sơ bệnh án</label>
                                            <select class="form-select" id="maHoSo" name="maHoSo" required>
                                                <option value="">-- Chọn hồ sơ --</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label required">Tài khoản được cấp quyền</label>
                                            <select class="form-select" id="maTaiKhoan" name="maTaiKhoan" required>
                                                <option value="">-- Chọn tài khoản --</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label required">Phòng khám</label>
                                            <select class="form-select" id="maPhongKham" name="maPhongKham" required>
                                                <option value="">-- Chọn phòng khám --</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label required">Loại quyền</label>
                                            <select class="form-select" id="loaiQuyen" name="loaiQuyen" required>
                                                <option value="">-- Chọn loại quyền --</option>
                                                <option value="Xem">Xem</option>
                                                <option value="Sửa">Sửa</option>
                                                <option value="Toàn quyền">Toàn quyền</option>
                                            </select>
                                        </div>
                                        <button type="submit" class="btn btn-primary w-100">
                                            <i class="bi bi-shield-check"></i> Cấp quyền
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header bg-success text-white">
                                    <h6 class="mb-0"><i class="bi bi-list-check"></i> Danh sách quyền đã cấp</h6>
                                </div>
                                <div class="card-body" style="max-height: 500px; overflow-y: auto;">
                                    <div id="danhSachQuyen">
                                        <div class="text-center py-4">
                                            <div class="spinner-border text-primary" role="status"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        await this.loadHoSo();
        await this.loadTaiKhoan();
        await this.loadPhongKham();
        await this.loadDanhSachQuyen();
    },

    async loadHoSo() {
        try {
            const response = await API.get('/ho-so-benh-an');
            if (response.success) {
                this.hoSoList = response.data || [];
                const select = document.getElementById('maHoSo');
                select.innerHTML = '<option value="">-- Chọn hồ sơ --</option>' +
                    this.hoSoList.map(hs => 
                        `<option value="${hs.maHoSo}">Hồ sơ ${hs.maHoSo} - ${hs.maBenhNhan || 'N/A'}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error loading ho so:', error);
        }
    },

    async loadTaiKhoan() {
        try {
            const response = await API.get('/tai-khoan');
            if (response.success) {
                this.taiKhoanList = response.data || [];
                const select = document.getElementById('maTaiKhoan');
                select.innerHTML = '<option value="">-- Chọn tài khoản --</option>' +
                    this.taiKhoanList.map(tk => 
                        `<option value="${tk.maTaiKhoan}">${tk.tenNguoiDung} - ${tk.hoTen || 'N/A'}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error loading tai khoan:', error);
        }
    },

    async loadPhongKham() {
        try {
            const response = await API.get('/phong-kham');
            if (response.success) {
                this.phongKhamList = response.data || [];
                const select = document.getElementById('maPhongKham');
                select.innerHTML = '<option value="">-- Chọn phòng khám --</option>' +
                    this.phongKhamList.map(pk => 
                        `<option value="${pk.maPhongKham}">${pk.tenPhongKham}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error loading phong kham:', error);
        }
    },

    async loadDanhSachQuyen() {
        try {
            const response = await API.get('/quyen-truy-cap-ho-so');
            
            if (response.success) {
                this.currentData = response.data || [];
                this.renderDanhSachQuyen();
            }
        } catch (error) {
            console.error('Error loading quyen:', error);
            document.getElementById('danhSachQuyen').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> Không thể tải dữ liệu
                </div>
            `;
        }
    },

    renderDanhSachQuyen() {
        const container = document.getElementById('danhSachQuyen');
        
        if (!this.currentData || this.currentData.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-inbox"></i><br>
                    Chưa có quyền nào được cấp
                </div>
            `;
            return;
        }

        container.innerHTML = this.currentData.map(q => {
            const tk = this.taiKhoanList.find(t => t.maTaiKhoan === q.maTaiKhoan);
            const pk = this.phongKhamList.find(p => p.maPhongKham === q.maPhongKham);
            
            return `
                <div class="card mb-2">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1">Hồ sơ: ${q.maHoSo}</h6>
                                <small class="text-muted">
                                    <i class="bi bi-person"></i> ${tk ? tk.tenNguoiDung : 'N/A'}<br>
                                    <i class="bi bi-building"></i> ${pk ? pk.tenPhongKham : 'N/A'}<br>
                                    <i class="bi bi-shield"></i> ${q.loaiQuyen}
                                </small>
                            </div>
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="PhanQuyen.handleXoaQuyen(${q.maQuyen})"
                                    title="Xóa quyền">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    async handleCapQuyen(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            maHoSo: parseInt(formData.get('maHoSo')),
            maTaiKhoan: parseInt(formData.get('maTaiKhoan')),
            maPhongKham: parseInt(formData.get('maPhongKham')),
            loaiQuyen: formData.get('loaiQuyen')
        };
        
        try {
            App.showLoading();
            
            const response = await API.post('/quyen-truy-cap-ho-so', data);
            
            if (response.success) {
                App.showToast('Cấp quyền thành công!', 'success');
                document.getElementById('formPhanQuyen').reset();
                await this.loadDanhSachQuyen();
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async handleXoaQuyen(maQuyen) {
        if (!confirm('Bạn có chắc muốn xóa quyền này?')) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.delete(`/quyen-truy-cap-ho-so/${maQuyen}`);
            
            if (response.success) {
                App.showToast('Xóa quyền thành công!', 'success');
                await this.loadDanhSachQuyen();
            } else {
                throw new Error(response.message || 'Không thể xóa quyền');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
