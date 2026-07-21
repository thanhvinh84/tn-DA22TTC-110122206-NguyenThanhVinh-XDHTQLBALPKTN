// Danh mục Thuốc
const DanhMucThuoc = {
    currentData: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-capsule"></i> Danh mục Thuốc
                    </h5>
                    <button class="btn btn-primary" onclick="DanhMucThuoc.showModalThem()">
                        <i class="bi bi-plus-circle"></i> Thêm thuốc
                    </button>
                </div>
                <div class="card-body">
                    <!-- Tìm kiếm -->
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-text bg-white">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" 
                                       id="searchThuoc" 
                                       placeholder="Tìm kiếm theo mã, tên thuốc...">
                            </div>
                        </div>
                        <div class="col-md-4 text-end">
                            <span class="badge bg-info fs-6">
                                Tổng: <span id="totalThuoc">0</span> thuốc
                            </span>
                        </div>
                    </div>

                    <!-- Bảng danh sách -->
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th width="100">Mã thuốc</th>
                                    <th>Tên thuốc</th>
                                    <th>Công dụng</th>
                                    <th width="150" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="tableThuoc">
                                <tr>
                                    <td colspan="4" class="text-center py-4">
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
            <div class="modal fade" id="modalThuoc" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalThuocTitle">
                                <i class="bi bi-capsule"></i> Thêm thuốc mới
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formThuoc" onsubmit="DanhMucThuoc.handleSubmit(event)">
                            <div class="modal-body">
                                <input type="hidden" id="maThuoc" name="maThuoc">
                                
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label class="form-label required">Tên thuốc</label>
                                        <input type="text" class="form-control" 
                                               id="tenThuoc" name="tenThuoc" 
                                               placeholder="VD: Paracetamol 500mg" required>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label class="form-label">Công dụng</label>
                                        <textarea class="form-control" 
                                                  id="congDung" name="congDung" 
                                                  rows="4" 
                                                  placeholder="VD: Giảm đau, hạ sốt..."></textarea>
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
        document.getElementById('searchThuoc').addEventListener('input', (e) => {
            this.handleSearchLocal(e.target.value);
        });

        // Load data
        await this.loadData();
    },

    async loadData() {
        try {
            const response = await API.get('/danh-muc/thuoc');
            
            if (response.success) {
                this.currentData = response.data || [];
                this.renderTable(this.currentData);
                document.getElementById('totalThuoc').textContent = this.currentData.length;
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi tải dữ liệu: ' + error.message, 'error');
            document.getElementById('tableThuoc').innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> 
                        Không thể tải dữ liệu
                    </td>
                </tr>
            `;
        }
    },

    renderTable(data) {
        const tbody = document.getElementById('tableThuoc');
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-4">
                        <i class="bi bi-inbox"></i><br>
                        Chưa có thuốc nào
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(thuoc => `
            <tr class="fade-in">
                <td><span class="badge bg-primary">${thuoc.maThuoc}</span></td>
                <td><strong>${thuoc.tenThuoc}</strong></td>
                <td><small>${thuoc.congDung || '-'}</small></td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-info" 
                                onclick="DanhMucThuoc.showModalSua('${thuoc.maThuoc}')"
                                title="Sửa">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" 
                                onclick="DanhMucThuoc.handleXoa('${thuoc.maThuoc}', '${thuoc.tenThuoc.replace(/'/g, "\\'")}')"
                                title="Xóa">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    handleSearchLocal(keyword) {
        if (!keyword.trim()) {
            this.renderTable(this.currentData);
            document.getElementById('totalThuoc').textContent = this.currentData.length;
            return;
        }

        const filtered = this.currentData.filter(thuoc => {
            const searchStr = keyword.toLowerCase();
            return (
                thuoc.tenThuoc?.toLowerCase().includes(searchStr) ||
                thuoc.congDung?.toLowerCase().includes(searchStr)
            );
        });

        this.renderTable(filtered);
        document.getElementById('totalThuoc').textContent = filtered.length;
    },

    showModalThem() {
        document.getElementById('modalThuocTitle').innerHTML = 
            '<i class="bi bi-capsule"></i> Thêm thuốc mới';
        document.getElementById('formThuoc').reset();
        document.getElementById('maThuoc').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('modalThuoc'));
        modal.show();
    },

    async showModalSua(maThuoc) {
        try {
            App.showLoading();
            const response = await API.get(`/danh-muc/thuoc/${maThuoc}`);
            
            if (response.success && response.data) {
                const thuoc = response.data;
                
                document.getElementById('modalThuocTitle').innerHTML = 
                    '<i class="bi bi-pencil"></i> Sửa thông tin thuốc';
                document.getElementById('maThuoc').value = thuoc.maThuoc;
                document.getElementById('tenThuoc').value = thuoc.tenThuoc || '';
                document.getElementById('congDung').value = thuoc.congDung || '';
                
                const modal = new bootstrap.Modal(document.getElementById('modalThuoc'));
                modal.show();
            }
        } catch (error) {
            App.showToast('Lỗi tải thông tin: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            tenThuoc: formData.get('tenThuoc'),
            congDung: formData.get('congDung') || null
        };
        
        const maThuoc = formData.get('maThuoc');
        
        try {
            App.showLoading();
            
            let response;
            if (maThuoc) {
                // Cập nhật - maThuoc là STRING (TH001, TH002...)
                data.maThuoc = maThuoc;
                response = await API.put(`/danh-muc/thuoc/${maThuoc}`, data);
            } else {
                // Tạo mới
                response = await API.post('/danh-muc/thuoc', data);
            }
            
            if (response.success) {
                App.showToast(
                    maThuoc ? 'Cập nhật thành công!' : 'Thêm thuốc thành công!', 
                    'success'
                );
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalThuoc'));
                modal.hide();
                
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

    async handleXoa(maThuoc, tenThuoc) {
        if (!confirm(`Bạn có chắc muốn xóa thuốc "${tenThuoc}"?`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.delete(`/danh-muc/thuoc/${maThuoc}`);
            
            if (response.success) {
                App.showToast('Xóa thuốc thành công!', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể xóa thuốc');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
