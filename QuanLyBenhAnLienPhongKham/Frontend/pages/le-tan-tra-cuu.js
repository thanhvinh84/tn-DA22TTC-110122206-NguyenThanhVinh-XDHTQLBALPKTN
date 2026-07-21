// Trang Lễ tân - Tra cứu bệnh nhân
const LeTanTraCuu = {
    danhSachBenhNhan: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-search"></i> Tra cứu Bệnh nhân
                    </h5>
                </div>
                <div class="card-body">
                    <!-- Tìm kiếm -->
                    <div class="row mb-4">
                        <div class="col-md-10">
                            <input type="text" class="form-control form-control-lg" 
                                   id="searchInput" 
                                   placeholder="Tìm kiếm theo mã BN, họ tên, số điện thoại...">
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-success btn-lg w-100" onclick="LeTanTraCuu.timKiem()">
                                <i class="bi bi-search"></i> Tìm
                            </button>
                        </div>
                    </div>
                    
                    <!-- Kết quả tìm kiếm -->
                    <div id="ketQuaTimKiem">
                        <div class="text-center text-muted py-5">
                            <i class="bi bi-search" style="font-size: 3rem;"></i>
                            <p class="mt-3">Nhập thông tin để tìm kiếm bệnh nhân</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Bind enter key
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.timKiem();
            }
        });
        
        // Load all patients initially
        await this.loadAllPatients();
    },
    
    async loadAllPatients() {
        try {
            const response = await API.get('/benh-nhan');
            if (response.success && response.data) {
                this.danhSachBenhNhan = response.data;
            }
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    },
    
    async timKiem() {
        const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
        
        if (!keyword) {
            App.showToast('Vui lòng nhập từ khóa tìm kiếm', 'warning');
            return;
        }
        
        try {
            App.showLoading();
            
            // Filter patients
            const ketQua = this.danhSachBenhNhan.filter(bn => {
                return (
                    bn.maBenhNhan?.toLowerCase().includes(keyword) ||
                    bn.hoTen?.toLowerCase().includes(keyword) ||
                    bn.soDienThoai?.includes(keyword) ||
                    bn.email?.toLowerCase().includes(keyword)
                );
            });
            
            this.hienThiKetQua(ketQua);
        } catch (error) {
            console.error('Error:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    hienThiKetQua(danhSach) {
        const container = document.getElementById('ketQuaTimKiem');
        
        if (!danhSach || danhSach.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    Không tìm thấy bệnh nhân nào phù hợp
                </div>
            `;
            return;
        }
        
        const html = `
            <div class="alert alert-success">
                <i class="bi bi-check-circle"></i> 
                Tìm thấy <strong>${danhSach.length}</strong> bệnh nhân
            </div>
            
            <div class="table-responsive">
                <table class="table table-hover table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th width="100">Mã BN</th>
                            <th>Họ và tên</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th width="200">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${danhSach.map(bn => `
                            <tr>
                                <td><strong>${bn.maBenhNhan}</strong></td>
                                <td>${bn.hoTen}</td>
                                <td>${this.formatDate(bn.ngaySinh)}</td>
                                <td>${bn.gioiTinh}</td>
                                <td>${bn.soDienThoai}</td>
                                <td>${bn.diaChi || '-'}</td>
                                <td>
                                    <button class="btn btn-sm btn-info" 
                                            onclick="LeTanTraCuu.xemChiTiet('${bn.maBenhNhan}')"
                                            title="Xem chi tiết">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    },
    
    async xemChiTiet(maBenhNhan) {
        try {
            App.showLoading();
            
            const response = await API.get('/benh-nhan/' + maBenhNhan);
            
            if (!response.success || !response.data) {
                throw new Error('Không thể tải thông tin bệnh nhân');
            }
            
            const bn = response.data;
            
            // Hiển thị modal chi tiết
            const modalHtml = `
                <div class="modal fade" id="modalChiTiet" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-info text-white">
                                <h5 class="modal-title">
                                    <i class="bi bi-person-vcard"></i> Thông tin Bệnh nhân
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <h6 class="border-bottom pb-2">Thông tin cá nhân</h6>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>Mã bệnh nhân:</strong> ${bn.maBenhNhan}
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>Họ và tên:</strong> ${bn.hoTen}
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>Ngày sinh:</strong> ${this.formatDate(bn.ngaySinh)}
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>Giới tính:</strong> ${bn.gioiTinh}
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>Số điện thoại:</strong> ${bn.soDienThoai}
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>Email:</strong> ${bn.email || '-'}
                                    </div>
                                    <div class="col-md-12 mb-2">
                                        <strong>Địa chỉ:</strong> ${bn.diaChi || '-'}
                                    </div>
                                    
                                    <div class="col-md-12 mt-3 mb-3">
                                        <h6 class="border-bottom pb-2">Thông tin y tế</h6>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>Nhóm máu:</strong> ${bn.nhomMau || '-'}
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>Tiền sử bệnh:</strong> ${bn.tienSuBenh || '-'}
                                    </div>
                                    <div class="col-md-12 mb-2">
                                        <strong>Dị ứng:</strong> ${bn.diUng || '-'}
                                    </div>
                                    
                                    <div class="col-md-12 mt-3 mb-3">
                                        <h6 class="border-bottom pb-2">Liên hệ khẩn cấp</h6>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>Người liên hệ:</strong> ${bn.nguoiLienHe || '-'}
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong>SĐT người liên hệ:</strong> ${bn.sdtNguoiLienHe || '-'}
                                    </div>
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
            const oldModal = document.getElementById('modalChiTiet');
            if (oldModal) oldModal.remove();
            
            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('modalChiTiet'));
            modal.show();
            
        } catch (error) {
            console.error('Error:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async taoLuotKham(maBenhNhan) {
        // Close detail modal if open
        const detailModal = document.getElementById('modalChiTiet');
        if (detailModal) {
            const modal = bootstrap.Modal.getInstance(detailModal);
            if (modal) modal.hide();
        }
        
        // Use the same function from LeTanTiepNhan
        LeTanTiepNhan.taoLuotKham(maBenhNhan);
    }
};
