// Danh mục Bệnh
const DanhMucBenh = {
    currentData: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-clipboard2-pulse"></i> Danh mục Bệnh
                    </h5>
                    <button class="btn btn-primary" onclick="DanhMucBenh.showModalThem()">
                        <i class="bi bi-plus-circle"></i> Thêm bệnh
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
                                       id="searchBenh" 
                                       placeholder="Tìm kiếm theo mã, tên bệnh...">
                            </div>
                        </div>
                        <div class="col-md-4 text-end">
                            <span class="badge bg-info fs-6">
                                Tổng: <span id="totalBenh">0</span> bệnh
                            </span>
                        </div>
                    </div>

                    <!-- Bảng danh sách -->
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th width="100">Mã bệnh</th>
                                    <th>Tên bệnh</th>
                                    <th width="150" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="tableBenh">
                                <tr>
                                    <td colspan="3" class="text-center py-4">
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
            <div class="modal fade" id="modalBenh" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalBenhTitle">
                                <i class="bi bi-clipboard2-pulse"></i> Thêm bệnh mới
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formBenh" onsubmit="DanhMucBenh.handleSubmit(event)">
                            <div class="modal-body">
                                <input type="hidden" id="maBenh" name="maBenh">
                                
                                <div class="mb-3">
                                    <label class="form-label required">Tên bệnh</label>
                                    <input type="text" class="form-control" 
                                           id="tenBenh" name="tenBenh" 
                                           placeholder="VD: Viêm họng cấp" required>
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
        document.getElementById('searchBenh').addEventListener('input', (e) => {
            this.handleSearchLocal(e.target.value);
        });

        // Load data
        await this.loadData();
    },

    async loadData() {
        try {
            const response = await API.get('/danh-muc/benh');
            
            if (response.success) {
                this.currentData = response.data || [];
                this.renderTable(this.currentData);
                document.getElementById('totalBenh').textContent = this.currentData.length;
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi tải dữ liệu: ' + error.message, 'error');
            document.getElementById('tableBenh').innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> 
                        Không thể tải dữ liệu
                    </td>
                </tr>
            `;
        }
    },

    renderTable(data) {
        const tbody = document.getElementById('tableBenh');
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted py-4">
                        <i class="bi bi-inbox"></i><br>
                        Chưa có bệnh nào
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(benh => `
            <tr class="fade-in">
                <td><span class="badge bg-primary">${benh.maBenh}</span></td>
                <td><strong>${benh.tenBenh}</strong></td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-info" 
                                onclick="DanhMucBenh.showModalSua('${benh.maBenh}')"
                                title="Sửa">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" 
                                onclick="DanhMucBenh.handleXoa('${benh.maBenh}', '${benh.tenBenh.replace(/'/g, "\\'")}')"
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
            document.getElementById('totalBenh').textContent = this.currentData.length;
            return;
        }

        const filtered = this.currentData.filter(benh => {
            const searchStr = keyword.toLowerCase();
            return benh.tenBenh?.toLowerCase().includes(searchStr);
        });

        this.renderTable(filtered);
        document.getElementById('totalBenh').textContent = filtered.length;
    },

    showModalThem() {
        document.getElementById('modalBenhTitle').innerHTML = 
            '<i class="bi bi-clipboard2-pulse"></i> Thêm bệnh mới';
        document.getElementById('formBenh').reset();
        document.getElementById('maBenh').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('modalBenh'));
        modal.show();
    },

    async showModalSua(maBenh) {
        try {
            App.showLoading();
            const response = await API.get(`/danh-muc/benh/${maBenh}`);
            
            if (response.success && response.data) {
                const benh = response.data;
                
                document.getElementById('modalBenhTitle').innerHTML = 
                    '<i class="bi bi-pencil"></i> Sửa thông tin bệnh';
                document.getElementById('maBenh').value = benh.maBenh;
                document.getElementById('tenBenh').value = benh.tenBenh || '';
                
                const modal = new bootstrap.Modal(document.getElementById('modalBenh'));
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
            tenBenh: formData.get('tenBenh')
        };
        
        const maBenh = formData.get('maBenh');
        
        try {
            App.showLoading();
            
            let response;
            if (maBenh) {
                // Cập nhật - maBenh là STRING (DB001, DB002...)
                data.maBenh = maBenh;
                response = await API.put(`/danh-muc/benh/${maBenh}`, data);
            } else {
                // Tạo mới
                response = await API.post('/danh-muc/benh', data);
            }
            
            if (response.success) {
                App.showToast(
                    maBenh ? 'Cập nhật thành công!' : 'Thêm bệnh thành công!', 
                    'success'
                );
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalBenh'));
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

    async handleXoa(maBenh, tenBenh) {
        if (!confirm(`Bạn có chắc muốn xóa bệnh "${tenBenh}"?`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.delete(`/danh-muc/benh/${maBenh}`);
            
            if (response.success) {
                App.showToast('Xóa bệnh thành công!', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể xóa bệnh');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
