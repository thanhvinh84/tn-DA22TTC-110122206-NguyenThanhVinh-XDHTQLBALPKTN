// Trang Kỹ thuật viên - Chỉ định chờ thực hiện
const KyThuatVienChiDinh = {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    danhSachChiDinh: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-list-check"></i> Chỉ định chờ thực hiện
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
                                <option value="Chờ thực hiện">Chờ thực hiện</option>
                                <option value="Đang thực hiện">Đang thực hiện</option>
                                <option value="Đã có kết quả">Đã có kết quả</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">&nbsp;</label>
                            <button class="btn btn-primary w-100" onclick="KyThuatVienChiDinh.loadData()">
                                <i class="bi bi-search"></i> Tìm kiếm
                            </button>
                        </div>
                    </div>
                    
                    <!-- Danh sách chỉ định -->
                    <div id="danhSachChiDinh">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
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
            const trangThai = document.getElementById('filterTrangThai')?.value || 'Chờ thực hiện';
            
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
                    Không có chỉ định nào cần thực hiện
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
                            <th width="120">Mã đợt khám</th>
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
                                <td>${cd.maDotKham || '-'}</td>
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
                                    ${cd.trangThai === 'Chờ thực hiện' ? `
                                        <button class="btn btn-sm btn-warning" 
                                                onclick="KyThuatVienChiDinh.batDauThucHien('${cd.maChiDinh}')">
                                            <i class="bi bi-play-circle"></i> Bắt đầu
                                        </button>
                                    ` : ''}
                                    ${cd.trangThai === 'Đang thực hiện' ? `
                                        <button class="btn btn-sm btn-success" 
                                                onclick="KyThuatVienChiDinh.capNhatKetQua('${cd.maChiDinh}')">
                                            <i class="bi bi-check-circle"></i> Cập nhật KQ
                                        </button>
                                    ` : ''}
                                    ${cd.trangThai === 'Đã có kết quả' ? `
                                        <button class="btn btn-sm btn-info" 
                                                onclick="KyThuatVienChiDinh.xemKetQua('${cd.maChiDinh}')">
                                            <i class="bi bi-eye"></i> Xem KQ
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
    
    async batDauThucHien(maChiDinh) {
        if (!confirm('Bắt đầu thực hiện chỉ định này?')) return;
        
        try {
            App.showLoading();
            
            const response = await API.put(`/chi-dinh/${maChiDinh}/trang-thai`, {
                TrangThai: 'Đang thực hiện'
            });
            
            if (response.success) {
                App.showToast('Đã chuyển sang trạng thái "Đang thực hiện"', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể cập nhật trạng thái');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    capNhatKetQua(maChiDinh) {
        const chiDinh = this.danhSachChiDinh.find(cd => cd.maChiDinh === maChiDinh);
        if (!chiDinh) return;
        
        const modalHtml = `
            <div class="modal fade" id="modalCapNhatKetQua" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-file-earmark-medical"></i> Cập nhật kết quả
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label"><strong>Thông tin chỉ định:</strong></label>
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <p class="mb-1"><strong>Mã chỉ định:</strong> ${chiDinh.maChiDinh}</p>
                                        <p class="mb-1"><strong>Bệnh nhân:</strong> ${chiDinh.tenBenhNhan || '-'}</p>
                                        <p class="mb-1"><strong>Loại dịch vụ:</strong> ${chiDinh.loaiDichVu || '-'}</p>
                                        <p class="mb-0"><strong>Tên dịch vụ:</strong> ${chiDinh.tenDichVu || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Kết quả <span class="text-danger">*</span></label>
                                <textarea class="form-control" id="ketQuaChiDinh" rows="5" 
                                          placeholder="Nhập kết quả xét nghiệm/chẩn đoán hình ảnh..."></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Hình ảnh kết quả</label>
                                <input type="file" class="form-control" id="fileUpload" 
                                       accept="image/*,.pdf,.doc,.docx" multiple>
                                <small class="text-muted">
                                    <i class="bi bi-info-circle"></i> 
                                    Chấp nhận: JPG, PNG, PDF, DOC, DOCX. Tối đa 10MB/file
                                </small>
                                <div id="uploadedFiles" class="mt-2"></div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Ghi chú</label>
                                <textarea class="form-control" id="ghiChuKetQua" rows="3" 
                                          placeholder="Ghi chú thêm (nếu có)..."></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-success" onclick="KyThuatVienChiDinh.luuKetQua('${maChiDinh}')">
                                <i class="bi bi-check-circle"></i> Lưu kết quả
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal if exists
        const oldModal = document.getElementById('modalCapNhatKetQua');
        if (oldModal) oldModal.remove();
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalCapNhatKetQua'));
        modal.show();
        
        // Setup file upload handler
        this.setupFileUpload();
    },
    
    uploadedFileUrls: [],
    
    setupFileUpload() {
        const fileInput = document.getElementById('fileUpload');
        const uploadedFilesDiv = document.getElementById('uploadedFiles');
        
        fileInput.addEventListener('change', async (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            
            App.showLoading();
            
            for (let file of files) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    const response = await fetch('http://localhost:5000/api/upload/ket-qua', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + Auth.getToken()
                        },
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        this.uploadedFileUrls.push(result.data.fileUrl);
                        this.renderUploadedFiles();
                        App.showToast(`Đã upload: ${result.data.originalName}`, 'success');
                    } else {
                        throw new Error(result.message || 'Upload thất bại');
                    }
                } catch (error) {
                    App.showToast('Lỗi upload: ' + error.message, 'error');
                }
            }
            
            App.hideLoading();
            fileInput.value = ''; // Reset input
        });
    },
    
    renderUploadedFiles() {
        const uploadedFilesDiv = document.getElementById('uploadedFiles');
        if (this.uploadedFileUrls.length === 0) {
            uploadedFilesDiv.innerHTML = '';
            return;
        }
        
        const html = `
            <div class="alert alert-success">
                <strong><i class="bi bi-check-circle"></i> Đã upload ${this.uploadedFileUrls.length} file:</strong>
                <ul class="mb-0 mt-2">
                    ${this.uploadedFileUrls.map((url, index) => `
                        <li>
                            <a href="http://localhost:5000${url}" target="_blank">${url.split('/').pop()}</a>
                            <button type="button" class="btn btn-sm btn-danger ms-2" 
                                    onclick="KyThuatVienChiDinh.removeUploadedFile(${index})">
                                <i class="bi bi-x"></i>
                            </button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        uploadedFilesDiv.innerHTML = html;
    },
    
    removeUploadedFile(index) {
        this.uploadedFileUrls.splice(index, 1);
        this.renderUploadedFiles();
    },
    
    async luuKetQua(maChiDinh) {
        try {
            const ketQua = document.getElementById('ketQuaChiDinh').value.trim();
            const ghiChu = document.getElementById('ghiChuKetQua').value.trim();
            
            if (!ketQua) {
                App.showToast('Vui lòng nhập kết quả', 'warning');
                return;
            }
            
            App.showLoading();
            
            // Lưu kết quả với hình ảnh (không cần gửi MaHoSo, backend sẽ tự lấy)
            const response = await API.post('/ket-qua', {
                MaChiDinh: maChiDinh,
                KetQua: ketQua,
                GhiChu: ghiChu,
                HinhAnhKetQua: this.uploadedFileUrls.join(';') // Nối các URL bằng dấu ;
            });
            
            if (response.success) {
                // Cập nhật trạng thái chỉ định
                await API.put(`/chi-dinh/${maChiDinh}/trang-thai`, {
                    TrangThai: 'Đã có kết quả'
                });
                
                App.showToast('Đã lưu kết quả thành công', 'success');
                
                // Reset uploaded files
                this.uploadedFileUrls = [];
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalCapNhatKetQua'));
                modal.hide();
                
                // Reload data
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể lưu kết quả');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async xemKetQua(maChiDinh) {
        try {
            App.showLoading();
            
            const response = await API.get(`/ket-qua/chi-dinh/${maChiDinh}`);
            
            if (response.success && response.data) {
                const ketQua = response.data;
                const chiDinh = this.danhSachChiDinh.find(cd => cd.maChiDinh === maChiDinh);
                
                // Parse hình ảnh
                const hinhAnhUrls = ketQua.hinhAnhKetQua ? ketQua.hinhAnhKetQua.split(';').filter(url => url) : [];
                
                const modalHtml = `
                    <div class="modal fade" id="modalXemKetQua" tabindex="-1">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header bg-info text-white">
                                    <h5 class="modal-title">
                                        <i class="bi bi-eye"></i> Xem kết quả
                                    </h5>
                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label class="form-label"><strong>Thông tin chỉ định:</strong></label>
                                        <div class="card bg-light">
                                            <div class="card-body">
                                                <p class="mb-1"><strong>Mã chỉ định:</strong> ${chiDinh?.maChiDinh || '-'}</p>
                                                <p class="mb-1"><strong>Bệnh nhân:</strong> ${chiDinh?.tenBenhNhan || '-'}</p>
                                                <p class="mb-1"><strong>Loại dịch vụ:</strong> ${chiDinh?.loaiDichVu || '-'}</p>
                                                <p class="mb-0"><strong>Tên dịch vụ:</strong> ${chiDinh?.tenDichVu || '-'}</p>
                                            </div>
                                        </div>
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
                                            <div class="row g-2">
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
                                                                         style="width: 100%; height: 200px; object-fit: cover;"
                                                                         alt="Kết quả">
                                                                </a>
                                                            </div>
                                                        `;
                                                    } else {
                                                        return `
                                                            <div class="col-md-4">
                                                                <a href="http://localhost:5000${url}" target="_blank" class="btn btn-outline-primary w-100">
                                                                    <i class="bi bi-file-earmark-pdf"></i> ${fileName}
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
                                            <i class="bi bi-clock"></i> 
                                            Cập nhật: ${ketQua.ngayCoKetQua ? new Date(ketQua.ngayCoKetQua).toLocaleString('vi-VN') : '-'}
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
                const oldModal = document.getElementById('modalXemKetQua');
                if (oldModal) oldModal.remove();
                
                // Add modal to body
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('modalXemKetQua'));
                modal.show();
            } else {
                throw new Error('Không tìm thấy kết quả');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
