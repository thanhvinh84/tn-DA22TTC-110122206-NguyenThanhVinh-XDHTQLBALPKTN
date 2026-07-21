// Quản lý Chuyên khoa
const ChuyenKhoa = {
    currentData: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-hospital"></i> Danh sách Chuyên khoa
                    </h5>
                    <button class="btn btn-primary" onclick="ChuyenKhoa.showModalThem()">
                        <i class="bi bi-plus-circle"></i> Thêm chuyên khoa
                    </button>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-text bg-white">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" 
                                       id="searchChuyenKhoa" 
                                       placeholder="Tìm kiếm theo tên chuyên khoa...">
                            </div>
                        </div>
                        <div class="col-md-4 text-end">
                            <span class="badge bg-info fs-6">
                                Tổng: <span id="totalChuyenKhoa">0</span> chuyên khoa
                            </span>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th width="100">Mã CK</th>
                                    <th>Tên chuyên khoa</th>
                                    <th>Mô tả</th>
                                    <th width="150" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="tableChuyenKhoa">
                                <tr>
                                    <td colspan="4" class="text-center py-4">
                                        <div class="spinner-border text-primary" role="status"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalChuyenKhoa" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalChuyenKhoaTitle">
                                <i class="bi bi-hospital"></i> Thêm chuyên khoa mới
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formChuyenKhoa" onsubmit="ChuyenKhoa.handleSubmit(event)">
                            <div class="modal-body">
                                <input type="hidden" id="maChuyenKhoa" name="maChuyenKhoa">
                                
                                <div class="mb-3">
                                    <label class="form-label required">Tên chuyên khoa</label>
                                    <input type="text" class="form-control" 
                                           id="tenChuyenKhoa" name="tenChuyenKhoa" 
                                           placeholder="VD: Nội khoa" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Mô tả</label>
                                    <textarea class="form-control" 
                                              id="moTa" name="moTa" 
                                              rows="3" 
                                              placeholder="VD: Chuyên khoa điều trị các bệnh nội khoa..."></textarea>
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

        document.getElementById('searchChuyenKhoa').addEventListener('input', (e) => {
            this.handleSearchLocal(e.target.value);
        });

        await this.loadData();
    },

    async loadData() {
        try {
            const response = await API.get('/chuyen-khoa');
            
            if (response.success) {
                this.currentData = response.data || [];
                this.renderTable(this.currentData);
                document.getElementById('totalChuyenKhoa').textContent = this.currentData.length;
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi tải dữ liệu: ' + error.message, 'error');
        }
    },

    renderTable(data) {
        const tbody = document.getElementById('tableChuyenKhoa');
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-4">
                        <i class="bi bi-inbox"></i><br>
                        Chưa có chuyên khoa nào
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(ck => `
            <tr class="fade-in">
                <td><span class="badge bg-primary">${ck.maChuyenKhoa}</span></td>
                <td><strong>${ck.tenChuyenKhoa}</strong></td>
                <td><small>${ck.moTa || '-'}</small></td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-info" 
                                onclick="ChuyenKhoa.showModalSua(${ck.maChuyenKhoa})"
                                title="Sửa">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" 
                                onclick="ChuyenKhoa.handleXoa(${ck.maChuyenKhoa}, '${ck.tenChuyenKhoa}')"
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
            document.getElementById('totalChuyenKhoa').textContent = this.currentData.length;
            return;
        }

        const filtered = this.currentData.filter(ck => {
            const searchStr = keyword.toLowerCase();
            return (
                ck.tenChuyenKhoa?.toLowerCase().includes(searchStr) ||
                ck.moTa?.toLowerCase().includes(searchStr)
            );
        });

        this.renderTable(filtered);
        document.getElementById('totalChuyenKhoa').textContent = filtered.length;
    },

    showModalThem() {
        document.getElementById('modalChuyenKhoaTitle').innerHTML = 
            '<i class="bi bi-hospital"></i> Thêm chuyên khoa mới';
        document.getElementById('formChuyenKhoa').reset();
        document.getElementById('maChuyenKhoa').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('modalChuyenKhoa'));
        modal.show();
    },

    async showModalSua(maChuyenKhoa) {
        try {
            App.showLoading();
            const response = await API.get(`/chuyen-khoa/${maChuyenKhoa}`);
            
            if (response.success && response.data) {
                const ck = response.data;
                
                document.getElementById('modalChuyenKhoaTitle').innerHTML = 
                    '<i class="bi bi-pencil"></i> Sửa thông tin chuyên khoa';
                document.getElementById('maChuyenKhoa').value = ck.maChuyenKhoa;
                document.getElementById('tenChuyenKhoa').value = ck.tenChuyenKhoa || '';
                document.getElementById('moTa').value = ck.moTa || '';
                
                const modal = new bootstrap.Modal(document.getElementById('modalChuyenKhoa'));
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
            tenChuyenKhoa: formData.get('tenChuyenKhoa'),
            moTa: formData.get('moTa') || null
        };
        
        const maChuyenKhoa = formData.get('maChuyenKhoa');
        
        try {
            App.showLoading();
            
            let response;
            if (maChuyenKhoa) {
                data.maChuyenKhoa = parseInt(maChuyenKhoa);
                response = await API.put(`/chuyen-khoa/${maChuyenKhoa}`, data);
            } else {
                response = await API.post('/chuyen-khoa', data);
            }
            
            if (response.success) {
                App.showToast(
                    maChuyenKhoa ? 'Cập nhật thành công!' : 'Thêm chuyên khoa thành công!', 
                    'success'
                );
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalChuyenKhoa'));
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

    async handleXoa(maChuyenKhoa, tenChuyenKhoa) {
        if (!confirm(`Bạn có chắc muốn xóa chuyên khoa "${tenChuyenKhoa}"?`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.delete(`/chuyen-khoa/${maChuyenKhoa}`);
            
            if (response.success) {
                App.showToast('Xóa chuyên khoa thành công!', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể xóa chuyên khoa');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
