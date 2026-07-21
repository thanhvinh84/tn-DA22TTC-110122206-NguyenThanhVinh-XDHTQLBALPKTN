// Trang Kỹ thuật viên - Cập nhật kết quả (filter mặc định: Đang thực hiện)
const KyThuatVienKetQua = {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    danhSachChiDinh: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-file-earmark-medical"></i> Cập nhật kết quả xét nghiệm
                    </h5>
                </div>
                <div class="card-body">
                    <!-- Bộ lọc -->
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Loại dịch vụ</label>
                            <select class="form-select" id="filterLoaiDichVu">
                                <option value="">Tất cả</option>
                                <option value="Xét nghiệm máu">Xét nghiệm máu</option>
                                <option value="Xét nghiệm nước tiểu">Xét nghiệm nước tiểu</option>
                                <option value="Siêu âm">Siêu âm</option>
                                <option value="X-quang">X-quang</option>
                                <option value="CT Scan">CT Scan</option>
                                <option value="MRI">MRI</option>
                                <option value="Nội soi">Nội soi</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Trạng thái</label>
                            <select class="form-select" id="filterTrangThai">
                                <option value="Đang thực hiện" selected>Đang thực hiện</option>
                                <option value="Chờ thực hiện">Chờ thực hiện</option>
                                <option value="Đã có kết quả">Đã có kết quả</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">&nbsp;</label>
                            <button class="btn btn-success w-100" onclick="KyThuatVienKetQua.loadData()">
                                <i class="bi bi-search"></i> Tìm kiếm
                            </button>
                        </div>
                    </div>
                    
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> 
                        Trang này hiển thị các chỉ định <strong>đang thực hiện</strong> để bạn cập nhật kết quả.
                    </div>
                    
                    <!-- Danh sách chỉ định -->
                    <div id="danhSachChiDinh">
                        <div class="text-center py-4">
                            <div class="spinner-border text-success" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        await this.loadData();
    },
    
    async loadData() {
        try {
            const loaiDichVu = document.getElementById('filterLoaiDichVu')?.value || '';
            const trangThai = document.getElementById('filterTrangThai')?.value || 'Đang thực hiện';
            
            let url = '/chi-dinh?trangThai=' + encodeURIComponent(trangThai);
            if (loaiDichVu) {
                url += '&loaiDichVu=' + encodeURIComponent(loaiDichVu);
            }
            
            const response = await API.get(url);
            
            if (response.success && response.data) {
                this.danhSachChiDinh = response.data;
                this.renderTable();
            } else {
                throw new Error(response.message || 'Không thể tải danh sách chỉ định');
            }
        } catch (error) {
            console.error('Error loading chi dinh:', error);
            document.getElementById('danhSachChiDinh').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Lỗi: ${error.message}
                </div>
            `;
        }
    },
    
    renderTable() {
        const container = document.getElementById('danhSachChiDinh');
        
        if (!this.danhSachChiDinh || this.danhSachChiDinh.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    Không có chỉ định nào cần cập nhật kết quả
                </div>
            `;
            return;
        }
        
        const html = `
            <div class="table-responsive">
                <table class="table table-hover table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th width="100">Mã chỉ định</th>
                            <th>Bệnh nhân</th>
                            <th>Loại dịch vụ</th>
                            <th>Tên dịch vụ</th>
                            <th width="120">Trạng thái</th>
                            <th width="150">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.danhSachChiDinh.map(cd => `
                            <tr>
                                <td><strong>${cd.maChiDinh}</strong></td>
                                <td>
                                    <strong>${cd.tenBenhNhan || '-'}</strong><br>
                                    <small class="text-muted">${cd.maBenhNhan || '-'}</small>
                                </td>
                                <td><span class="badge bg-info">${cd.loaiDichVu || '-'}</span></td>
                                <td>${cd.tenDichVu || '-'}</td>
                                <td>
                                    ${this.getTrangThaiBadge(cd.trangThai)}
                                </td>
                                <td>
                                    ${cd.trangThai === 'Đang thực hiện' ? `
                                        <button class="btn btn-sm btn-success" 
                                                onclick="KyThuatVienKetQua.capNhatKetQua('${cd.maChiDinh}')">
                                            <i class="bi bi-check-circle"></i> Cập nhật KQ
                                        </button>
                                    ` : ''}
                                    ${cd.trangThai === 'Đã có kết quả' ? `
                                        <button class="btn btn-sm btn-info" 
                                                onclick="KyThuatVienKetQua.xemKetQua('${cd.maChiDinh}')">
                                            <i class="bi bi-eye"></i> Xem KQ
                                        </button>
                                        <button class="btn btn-sm btn-primary" 
                                                onclick="KyThuatVienKetQua.inPhieuChiDinh('${cd.maDotKham}')"
                                                title="In phiếu chỉ định">
                                            <i class="bi bi-printer"></i>
                                        </button>
                                    ` : ''}
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
            'Chờ thực hiện': '<span class="badge bg-warning">Chờ thực hiện</span>',
            'Đang thực hiện': '<span class="badge bg-primary">Đang thực hiện</span>',
            'Đã có kết quả': '<span class="badge bg-success">Đã có kết quả</span>',
            'Đã hủy': '<span class="badge bg-danger">Đã hủy</span>'
        };
        return badges[trangThai] || '<span class="badge bg-secondary">' + trangThai + '</span>';
    },
    
    capNhatKetQua(maChiDinh) {
        // Sử dụng hàm từ KyThuatVienChiDinh
        KyThuatVienChiDinh.danhSachChiDinh = this.danhSachChiDinh;
        KyThuatVienChiDinh.capNhatKetQua(maChiDinh);
        
        // Override callback để reload trang này
        const originalCallback = KyThuatVienChiDinh.loadData;
        KyThuatVienChiDinh.loadData = async () => {
            await this.loadData();
            KyThuatVienChiDinh.loadData = originalCallback;
        };
    },
    
    async xemKetQua(maChiDinh) {
        try {
            App.showLoading();
            
            // Tìm chỉ định trong danh sách
            const chiDinh = this.danhSachChiDinh.find(cd => cd.maChiDinh === maChiDinh);
            if (!chiDinh) {
                throw new Error('Không tìm thấy chỉ định');
            }
            
            // Lấy kết quả CLS
            const ketQuaRes = await API.get(`/ket-qua/chi-dinh/${maChiDinh}`);
            
            let ketQua = null;
            if (ketQuaRes.success && ketQuaRes.data) {
                ketQua = ketQuaRes.data;
            }
            
            // Hiển thị modal xem kết quả
            const modalHtml = `
                <div class="modal fade" id="modalXemKetQua" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-info text-white">
                                <h5 class="modal-title">
                                    <i class="bi bi-file-earmark-medical"></i> Xem kết quả: ${chiDinh.tenDichVu}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                ${ketQua ? `
                                    <div class="mb-3">
                                        <strong>Bệnh nhân:</strong> ${chiDinh.tenBenhNhan || '-'} (${chiDinh.maBenhNhan || '-'})
                                    </div>
                                    <div class="mb-3">
                                        <strong>Loại dịch vụ:</strong> <span class="badge bg-info">${chiDinh.loaiDichVu || '-'}</span>
                                    </div>
                                    <div class="mb-3">
                                        <strong>Tên dịch vụ:</strong> ${chiDinh.tenDichVu || '-'}
                                    </div>
                                    <hr>
                                    <div class="mb-3">
                                        <label class="form-label"><strong>Kết quả:</strong></label>
                                        <div class="border rounded p-3 bg-light">
                                            ${ketQua.ketQua || 'Chưa có kết quả'}
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label"><strong>Kết luận:</strong></label>
                                        <div class="border rounded p-3 bg-light">
                                            ${ketQua.ketLuan || 'Chưa có kết luận'}
                                        </div>
                                    </div>
                                    ${ketQua.ghiChu ? `
                                        <div class="mb-3">
                                            <label class="form-label"><strong>Ghi chú:</strong></label>
                                            <div class="border rounded p-3 bg-light">
                                                ${ketQua.ghiChu}
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${ketQua.hinhAnhKetQua ? `
                                        <div class="mb-3">
                                            <label class="form-label"><strong>Hình ảnh kết quả:</strong></label>
                                            <div>
                                                ${ketQua.hinhAnhKetQua.split(';').filter(img => img.trim()).map(img => {
                                                    const ext = img.split('.').pop().toLowerCase();
                                                    if (ext === 'pdf') {
                                                        return `<a href="${img}" target="_blank" class="btn btn-outline-danger me-2 mb-2">
                                                            <i class="bi bi-file-pdf"></i> Xem PDF
                                                        </a>`;
                                                    } else {
                                                        return `<a href="${img}" target="_blank" class="me-2 mb-2">
                                                            <img src="${img}" alt="KQ" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
                                                        </a>`;
                                                    }
                                                }).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                ` : `
                                    <div class="alert alert-warning">
                                        <i class="bi bi-exclamation-triangle"></i> 
                                        Chưa có kết quả cho chỉ định này
                                    </div>
                                `}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Remove old modal
            const oldModal = document.getElementById('modalXemKetQua');
            if (oldModal) oldModal.remove();
            
            // Add new modal
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('modalXemKetQua'));
            modal.show();
            
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    // In phiếu chỉ định với kết quả
    async inPhieuChiDinh(maDotKham) {
        try {
            // Gọi hàm in phiếu chỉ định từ PrintPhieuKham
            await PrintPhieuKham.inPhieuChiDinh(maDotKham);
        } catch (error) {
            App.showToast('Lỗi khi in phiếu: ' + error.message, 'error');
        }
    }
};
