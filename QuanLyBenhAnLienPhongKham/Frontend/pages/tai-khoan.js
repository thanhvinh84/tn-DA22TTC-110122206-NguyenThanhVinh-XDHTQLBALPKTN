// Quản lý Tài khoản
const TaiKhoan = {
    currentData: [],
    vaiTroList: [],
    nhanVienList: [],
    benhNhanList: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-person-lock"></i> Danh sách Tài khoản
                    </h5>
                    <button class="btn btn-primary" onclick="TaiKhoan.showModalThem()">
                        <i class="bi bi-plus-circle"></i> Tạo tài khoản
                    </button>
                </div>
                <div class="card-body">
                    <!-- Tìm kiếm và filter -->
                    <div class="row mb-3">
                        <div class="col-md-5">
                            <div class="input-group">
                                <span class="input-group-text bg-white">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" 
                                       id="searchTaiKhoan" 
                                       placeholder="Tìm kiếm theo tên đăng nhập, họ tên...">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="filterVaiTro" onchange="TaiKhoan.handleFilter()">
                                <option value="">-- Tất cả vai trò --</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="filterTrangThai" onchange="TaiKhoan.handleFilter()">
                                <option value="">-- Tất cả trạng thái --</option>
                                <option value="true">Hoạt động</option>
                                <option value="false">Bị khóa</option>
                            </select>
                        </div>
                        <div class="col-md-2 text-end">
                            <span class="badge bg-info fs-6">
                                Tổng: <span id="totalTaiKhoan">0</span>
                            </span>
                        </div>
                    </div>

                    <!-- Bảng danh sách -->
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th width="80">Mã TK</th>
                                    <th>Tên đăng nhập</th>
                                    <th>Họ tên</th>
                                    <th>Vai trò</th>
                                    <th width="120">Trạng thái</th>
                                    <th width="150">Ngày tạo</th>
                                    <th width="250" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="tableTaiKhoan">
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
                </div>
            </div>

            <!-- Modal Tạo tài khoản -->
            <div class="modal fade" id="modalTaiKhoan" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-person-plus"></i> Tạo tài khoản mới
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formTaiKhoan" onsubmit="TaiKhoan.handleSubmit(event)">
                            <div class="modal-body">
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i> 
                                    <strong>Lưu ý:</strong> Mật khẩu mặc định là <code>123456</code>. 
                                    Người dùng nên đổi mật khẩu sau lần đăng nhập đầu tiên.
                                </div>
                                
                                <h6 class="border-bottom pb-2 mb-3">
                                    <i class="bi bi-person-lock"></i> Thông tin đăng nhập
                                </h6>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">Tên đăng nhập</label>
                                        <input type="text" class="form-control" 
                                               id="tenNguoiDung" name="tenNguoiDung" 
                                               placeholder="VD: nguyenvana" 
                                               pattern="[a-zA-Z0-9_]{4,50}" required>
                                        <small class="text-muted">4-50 ký tự, chỉ chữ, số và gạch dưới</small>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">Vai trò</label>
                                        <select class="form-select" id="maVaiTro" name="maVaiTro" required>
                                            <option value="">-- Chọn vai trò --</option>
                                        </select>
                                    </div>
                                </div>

                                <h6 class="border-bottom pb-2 mb-3 mt-3">
                                    <i class="bi bi-person-badge"></i> Liên kết với
                                </h6>
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" 
                                                   name="loaiLienKet" id="lienKetNhanVien" 
                                                   value="nhanvien" checked 
                                                   onchange="TaiKhoan.toggleLienKet()">
                                            <label class="form-check-label" for="lienKetNhanVien">
                                                Nhân viên
                                            </label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" 
                                                   name="loaiLienKet" id="lienKetBenhNhan" 
                                                   value="benhnhan" 
                                                   onchange="TaiKhoan.toggleLienKet()">
                                            <label class="form-check-label" for="lienKetBenhNhan">
                                                Bệnh nhân
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="row" id="selectNhanVien">
                                    <div class="col-md-12 mb-3">
                                        <label class="form-label">Chọn nhân viên</label>
                                        <select class="form-select" id="maNhanVien" name="maNhanVien">
                                            <option value="">-- Chọn nhân viên --</option>
                                        </select>
                                        <small class="text-muted">Chỉ hiển thị nhân viên chưa có tài khoản</small>
                                    </div>
                                </div>

                                <div class="row" id="selectBenhNhan" style="display: none;">
                                    <div class="col-md-12 mb-3">
                                        <label class="form-label">Chọn bệnh nhân</label>
                                        <select class="form-select" id="maBenhNhan" name="maBenhNhan">
                                            <option value="">-- Chọn bệnh nhân --</option>
                                        </select>
                                        <small class="text-muted">Chỉ hiển thị bệnh nhân chưa có tài khoản</small>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer bg-light">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle"></i> Hủy
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-save"></i> Tạo tài khoản
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Modal Reset mật khẩu -->
            <div class="modal fade" id="modalResetPassword" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title">
                                <i class="bi bi-key"></i> Reset mật khẩu
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Bạn có chắc muốn reset mật khẩu về <code>123456</code> cho tài khoản này?</p>
                            <input type="hidden" id="resetMaTaiKhoan">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-warning" onclick="TaiKhoan.confirmResetPassword()">
                                <i class="bi bi-key"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind search event
        document.getElementById('searchTaiKhoan').addEventListener('input', (e) => {
            this.handleSearchLocal(e.target.value);
        });

        // Load data
        await this.loadVaiTro();
        await this.loadNhanVien();
        await this.loadBenhNhan();
        await this.loadData();
    },

    async loadVaiTro() {
        try {
            const response = await API.get('/vai-tro');
            if (response.success) {
                this.vaiTroList = response.data || [];
                
                // Populate dropdown trong form
                const select = document.getElementById('maVaiTro');
                select.innerHTML = '<option value="">-- Chọn vai trò --</option>' +
                    this.vaiTroList.map(vt => 
                        `<option value="${vt.maVaiTro}">${vt.tenVaiTro}</option>`
                    ).join('');
                
                // Populate filter dropdown
                const filterSelect = document.getElementById('filterVaiTro');
                filterSelect.innerHTML = '<option value="">-- Tất cả vai trò --</option>' +
                    this.vaiTroList.map(vt => 
                        `<option value="${vt.maVaiTro}">${vt.tenVaiTro}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error loading vai tro:', error);
        }
    },

    async loadNhanVien() {
        try {
            const response = await API.get('/nhan-vien');
            if (response.success) {
                this.nhanVienList = response.data || [];
            }
        } catch (error) {
            console.error('Error loading nhan vien:', error);
        }
    },

    async loadBenhNhan() {
        try {
            const response = await API.get('/benh-nhan');
            if (response.success) {
                this.benhNhanList = response.data || [];
            }
        } catch (error) {
            console.error('Error loading benh nhan:', error);
        }
    },

    async loadData() {
        try {
            const response = await API.get('/tai-khoan');
            
            if (response.success) {
                this.currentData = response.data || [];
                this.renderTable(this.currentData);
                document.getElementById('totalTaiKhoan').textContent = this.currentData.length;
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi tải dữ liệu: ' + error.message, 'error');
            document.getElementById('tableTaiKhoan').innerHTML = `
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
        const tbody = document.getElementById('tableTaiKhoan');
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        <i class="bi bi-inbox"></i><br>
                        Chưa có tài khoản nào
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(tk => {
            const vaiTro = this.vaiTroList.find(vt => vt.maVaiTro === tk.maVaiTro);
            const tenVaiTro = vaiTro ? vaiTro.tenVaiTro : 'N/A';
            const trangThaiClass = tk.trangThai ? 'success' : 'danger';
            const trangThaiText = tk.trangThai ? 'Hoạt động' : 'Bị khóa';
            const trangThaiIcon = tk.trangThai ? 'check-circle' : 'x-circle';
            
            return `
                <tr class="fade-in">
                    <td><span class="badge bg-primary">${tk.maTaiKhoan}</span></td>
                    <td><strong>${tk.tenNguoiDung}</strong></td>
                    <td>${tk.hoTen || '-'}</td>
                    <td><span class="badge bg-info">${tenVaiTro}</span></td>
                    <td>
                        <span class="badge bg-${trangThaiClass}">
                            <i class="bi bi-${trangThaiIcon}"></i> ${trangThaiText}
                        </span>
                    </td>
                    <td><small>${tk.ngayTao ? new Date(tk.ngayTao).toLocaleDateString('vi-VN') : '-'}</small></td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm" role="group">
                            ${tk.trangThai ? 
                                `<button class="btn btn-outline-warning" 
                                        onclick="TaiKhoan.handleKhoa('${tk.maTaiKhoan}', '${tk.tenNguoiDung.replace(/'/g, "\\'")}')"
                                        title="Khóa tài khoản">
                                    <i class="bi bi-lock"></i>
                                </button>` :
                                `<button class="btn btn-outline-success" 
                                        onclick="TaiKhoan.handleMo('${tk.maTaiKhoan}', '${tk.tenNguoiDung.replace(/'/g, "\\'")}')"
                                        title="Mở khóa">
                                    <i class="bi bi-unlock"></i>
                                </button>`
                            }
                            <button class="btn btn-outline-info" 
                                    onclick="TaiKhoan.showModalResetPassword('${tk.maTaiKhoan}', '${tk.tenNguoiDung.replace(/'/g, "\\'")}')"
                                    title="Reset mật khẩu">
                                <i class="bi bi-key"></i>
                            </button>
                            <button class="btn btn-outline-danger" 
                                    onclick="TaiKhoan.handleXoa('${tk.maTaiKhoan}', '${tk.tenNguoiDung.replace(/'/g, "\\'")}')"
                                    title="Xóa">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    handleSearchLocal(keyword) {
        if (!keyword.trim()) {
            this.renderTable(this.currentData);
            document.getElementById('totalTaiKhoan').textContent = this.currentData.length;
            return;
        }

        const filtered = this.currentData.filter(tk => {
            const searchStr = keyword.toLowerCase();
            return (
                tk.tenNguoiDung?.toLowerCase().includes(searchStr) ||
                tk.hoTen?.toLowerCase().includes(searchStr)
            );
        });

        this.renderTable(filtered);
        document.getElementById('totalTaiKhoan').textContent = filtered.length;
    },

    handleFilter() {
        const maVaiTro = document.getElementById('filterVaiTro').value;
        const trangThai = document.getElementById('filterTrangThai').value;
        
        let filtered = this.currentData;
        
        if (maVaiTro) {
            filtered = filtered.filter(tk => tk.maVaiTro == maVaiTro);
        }
        
        if (trangThai !== '') {
            const status = trangThai === 'true';
            filtered = filtered.filter(tk => tk.trangThai === status);
        }
        
        this.renderTable(filtered);
        document.getElementById('totalTaiKhoan').textContent = filtered.length;
    },

    toggleLienKet() {
        const loaiLienKet = document.querySelector('input[name="loaiLienKet"]:checked').value;
        
        if (loaiLienKet === 'nhanvien') {
            document.getElementById('selectNhanVien').style.display = 'block';
            document.getElementById('selectBenhNhan').style.display = 'none';
            document.getElementById('maBenhNhan').value = '';
            this.populateNhanVienSelect();
        } else {
            document.getElementById('selectNhanVien').style.display = 'none';
            document.getElementById('selectBenhNhan').style.display = 'block';
            document.getElementById('maNhanVien').value = '';
            this.populateBenhNhanSelect();
        }
    },

    populateNhanVienSelect() {
        // Lọc nhân viên chưa có tài khoản
        const nhanVienChuaCoTK = this.nhanVienList.filter(nv => 
            !this.currentData.some(tk => tk.maNhanVien === nv.maNhanVien)
        );
        
        const select = document.getElementById('maNhanVien');
        select.innerHTML = '<option value="">-- Chọn nhân viên --</option>' +
            nhanVienChuaCoTK.map(nv => 
                `<option value="${nv.maNhanVien}">${nv.hoTen} (${nv.maNhanVien})</option>`
            ).join('');
    },

    populateBenhNhanSelect() {
        // Lọc bệnh nhân chưa có tài khoản
        const benhNhanChuaCoTK = this.benhNhanList.filter(bn => 
            !this.currentData.some(tk => tk.maBenhNhan === bn.maBenhNhan)
        );
        
        const select = document.getElementById('maBenhNhan');
        select.innerHTML = '<option value="">-- Chọn bệnh nhân --</option>' +
            benhNhanChuaCoTK.map(bn => 
                `<option value="${bn.maBenhNhan}">${bn.hoTen} (${bn.maBenhNhan})</option>`
            ).join('');
    },

    showModalThem() {
        document.getElementById('formTaiKhoan').reset();
        document.getElementById('lienKetNhanVien').checked = true;
        this.toggleLienKet();
        
        const modal = new bootstrap.Modal(document.getElementById('modalTaiKhoan'));
        modal.show();
    },

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const loaiLienKet = document.querySelector('input[name="loaiLienKet"]:checked').value;
        
        const data = {
            tenNguoiDung: formData.get('tenNguoiDung'),
            matKhau: '123456', // Mật khẩu mặc định
            maVaiTro: formData.get('maVaiTro'), // STRING: VT_ADMIN, VT_LETAN, etc.
            trangThai: true
        };
        
        // Thêm liên kết - VALIDATION: Phải chọn nhân viên hoặc bệnh nhân
        if (loaiLienKet === 'nhanvien') {
            const maNhanVien = formData.get('maNhanVien');
            if (!maNhanVien) {
                App.showToast('Vui lòng chọn nhân viên để liên kết tài khoản!', 'warning');
                return;
            }
            data.maNhanVien = maNhanVien; // STRING: NV001, NV002, etc.
        } else {
            const maBenhNhan = formData.get('maBenhNhan');
            if (!maBenhNhan) {
                App.showToast('Vui lòng chọn bệnh nhân để liên kết tài khoản!', 'warning');
                return;
            }
            data.maBenhNhan = maBenhNhan; // STRING: BN001, BN002, etc.
        }
        
        try {
            App.showLoading();
            
            const response = await API.post('/tai-khoan', data);
            
            if (response.success) {
                App.showToast('Tạo tài khoản thành công! Mật khẩu mặc định: 123456', 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalTaiKhoan'));
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

    async handleKhoa(maTaiKhoan, tenNguoiDung) {
        if (!confirm(`Bạn có chắc muốn khóa tài khoản "${tenNguoiDung}"?`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.put(`/tai-khoan/${maTaiKhoan}/khoa`, {});
            
            if (response.success) {
                App.showToast('Khóa tài khoản thành công!', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể khóa tài khoản');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async handleMo(maTaiKhoan, tenNguoiDung) {
        if (!confirm(`Bạn có chắc muốn mở khóa tài khoản "${tenNguoiDung}"?`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.put(`/tai-khoan/${maTaiKhoan}/mo`, {});
            
            if (response.success) {
                App.showToast('Mở khóa tài khoản thành công!', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể mở khóa tài khoản');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    showModalResetPassword(maTaiKhoan, tenNguoiDung) {
        document.getElementById('resetMaTaiKhoan').value = maTaiKhoan;
        const modal = new bootstrap.Modal(document.getElementById('modalResetPassword'));
        modal.show();
    },

    async confirmResetPassword() {
        const maTaiKhoan = document.getElementById('resetMaTaiKhoan').value;
        
        try {
            App.showLoading();
            
            const response = await API.put(`/tai-khoan/${maTaiKhoan}/reset-password`, {});
            
            if (response.success) {
                App.showToast('Reset mật khẩu thành công! Mật khẩu mới: 123456', 'success');
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalResetPassword'));
                modal.hide();
            } else {
                throw new Error(response.message || 'Không thể reset mật khẩu');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async handleXoa(maTaiKhoan, tenNguoiDung) {
        if (!confirm(`Bạn có chắc muốn xóa tài khoản "${tenNguoiDung}"?\n\nCảnh báo: Hành động này không thể hoàn tác!`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.delete(`/tai-khoan/${maTaiKhoan}`);
            
            if (response.success) {
                App.showToast('Xóa tài khoản thành công!', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể xóa tài khoản');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
