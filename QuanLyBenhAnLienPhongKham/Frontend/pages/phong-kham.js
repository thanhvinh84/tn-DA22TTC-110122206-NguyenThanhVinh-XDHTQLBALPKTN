// Quản lý Phòng khám
const PhongKham = {
    currentData: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-building"></i> Danh sách Phòng khám
                    </h5>
                    <button class="btn btn-primary" onclick="PhongKham.showModalThem()">
                        <i class="bi bi-plus-circle"></i> Thêm phòng khám
                    </button>
                </div>
                <div class="card-body">
                    <!-- Tìm kiếm -->
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <div class="input-group">
                                <span class="input-group-text bg-white">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" 
                                       id="searchPhongKham" 
                                       placeholder="Tìm kiếm theo tên, địa chỉ, số điện thoại, email...">
                            </div>
                        </div>
                    </div>

                    <!-- Bảng danh sách -->
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th width="80">Mã</th>
                                    <th>Tên phòng khám</th>
                                    <th>Địa chỉ</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th width="150" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="tablePhongKham">
                                <tr>
                                    <td colspan="6" class="text-center py-4">
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

            <!-- Modal Thêm/Sửa -->
            <div class="modal fade" id="modalPhongKham" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalPhongKhamTitle">
                                <i class="bi bi-building"></i> Thêm phòng khám
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formPhongKham" onsubmit="PhongKham.handleSubmit(event)">
                            <div class="modal-body">
                                <input type="hidden" id="maPhongKham" name="maPhongKham">
                                
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label class="form-label required">Tên phòng khám</label>
                                        <input type="text" class="form-control" 
                                               id="tenPhongKham" name="tenPhongKham" 
                                               placeholder="VD: Phòng khám Đa khoa ABC" required>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label class="form-label required">Địa chỉ</label>
                                        <textarea class="form-control" 
                                                  id="diaChi" name="diaChi" 
                                                  rows="2" 
                                                  placeholder="VD: 123 Đường ABC, Quận XYZ, TP. HCM" 
                                                  required></textarea>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">Số điện thoại</label>
                                        <input type="tel" class="form-control" 
                                               id="soDienThoai" name="soDienThoai" 
                                               placeholder="VD: 0901234567" 
                                               pattern="[0-9]{10,11}" required>
                                        <small class="text-muted">10-11 số</small>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" 
                                               id="email" name="email" 
                                               placeholder="VD: phongkham@example.com">
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer bg-light">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle"></i> Hủy
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-save"></i> Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Bind search event
        document.getElementById('searchPhongKham').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Load data
        await this.loadData();
    },

    async loadData() {
        try {
            const response = await API.get('/phong-kham');
            
            if (response.success) {
                this.currentData = response.data || [];
                this.renderTable(this.currentData);
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi tải dữ liệu: ' + error.message, 'error');
            document.getElementById('tablePhongKham').innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> 
                        Không thể tải dữ liệu
                    </td>
                </tr>
            `;
        }
    },

    renderTable(data) {
        const tbody = document.getElementById('tablePhongKham');
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        <i class="bi bi-inbox"></i><br>
                        Chưa có phòng khám nào
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(pk => `
            <tr class="fade-in">
                <td><span class="badge bg-primary">${pk.maPhongKham}</span></td>
                <td>
                    <strong>${pk.tenPhongKham}</strong>
                </td>
                <td>
                    <small class="text-muted">
                        <i class="bi bi-geo-alt"></i> ${pk.diaChi || '-'}
                    </small>
                </td>
                <td>
                    <small>
                        <i class="bi bi-telephone"></i> ${pk.soDienThoai || '-'}
                    </small>
                </td>
                <td>
                    <small>
                        <i class="bi bi-envelope"></i> ${pk.email || '-'}
                    </small>
                </td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-info" 
                                onclick="PhongKham.showModalSua('${pk.maPhongKham}')"
                                title="Sửa">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" 
                                onclick="PhongKham.handleXoa('${pk.maPhongKham}', '${pk.tenPhongKham.replace(/'/g, "\\'")}')"
                                title="Xóa">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    handleSearch(keyword) {
        if (!keyword.trim()) {
            this.renderTable(this.currentData);
            return;
        }

        const filtered = this.currentData.filter(pk => {
            const searchStr = keyword.toLowerCase();
            return (
                pk.tenPhongKham?.toLowerCase().includes(searchStr) ||
                pk.diaChi?.toLowerCase().includes(searchStr) ||
                pk.soDienThoai?.includes(searchStr) ||
                pk.email?.toLowerCase().includes(searchStr)
            );
        });

        this.renderTable(filtered);
    },

    showModalThem() {
        document.getElementById('modalPhongKhamTitle').innerHTML = 
            '<i class="bi bi-plus-circle"></i> Thêm phòng khám mới';
        document.getElementById('formPhongKham').reset();
        document.getElementById('maPhongKham').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('modalPhongKham'));
        modal.show();
    },

    async showModalSua(maPhongKham) {
        try {
            const response = await API.get(`/phong-kham/${maPhongKham}`);
            
            if (response.success && response.data) {
                const pk = response.data;
                
                document.getElementById('modalPhongKhamTitle').innerHTML = 
                    '<i class="bi bi-pencil"></i> Sửa thông tin phòng khám';
                document.getElementById('maPhongKham').value = pk.maPhongKham;
                document.getElementById('tenPhongKham').value = pk.tenPhongKham || '';
                document.getElementById('diaChi').value = pk.diaChi || '';
                document.getElementById('soDienThoai').value = pk.soDienThoai || '';
                document.getElementById('email').value = pk.email || '';
                
                const modal = new bootstrap.Modal(document.getElementById('modalPhongKham'));
                modal.show();
            }
        } catch (error) {
            App.showToast('Lỗi tải thông tin: ' + error.message, 'error');
        }
    },

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            tenPhongKham: formData.get('tenPhongKham'),
            diaChi: formData.get('diaChi'),
            soDienThoai: formData.get('soDienThoai'),
            email: formData.get('email') || null
        };
        
        const maPhongKham = formData.get('maPhongKham');
        
        try {
            App.showLoading();
            
            let response;
            if (maPhongKham) {
                // Update
                data.maPhongKham = maPhongKham;
                response = await API.put(`/phong-kham/${maPhongKham}`, data);
            } else {
                // Create
                response = await API.post('/phong-kham', data);
            }
            
            if (response.success) {
                App.showToast(
                    maPhongKham ? 'Cập nhật thành công!' : 'Thêm phòng khám thành công!', 
                    'success'
                );
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalPhongKham'));
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

    async handleXoa(maPhongKham, tenPhongKham) {
        if (!confirm(`Bạn có chắc muốn xóa phòng khám "${tenPhongKham}"?\n\nLưu ý: Không thể xóa nếu phòng khám đang có nhân viên hoặc đợt khám.`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.delete(`/phong-kham/${maPhongKham}`);
            
            if (response.success) {
                App.showToast('Xóa phòng khám thành công!', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể xóa phòng khám');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
