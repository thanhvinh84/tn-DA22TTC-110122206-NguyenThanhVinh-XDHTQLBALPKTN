// Trang Bệnh nhân - Hồ sơ của tôi
const BenhNhanHoSo = {
    hoSo: null,
    benhNhan: null,
    
    async render() {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-file-person"></i> Hồ sơ bệnh án của tôi
                    </h5>
                </div>
                <div class="card-body">
                    <div id="hoSoContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        await this.loadHoSo();
    },
    
    async loadHoSo() {
        try {
            const user = Auth.getUser();
            
            // Kiểm tra xem user có MaBenhNhan không
            if (!user.maBenhNhan) {
                throw new Error('Tài khoản này không liên kết với bệnh nhân nào');
            }
            
            // Lấy thông tin bệnh nhân
            const responseBN = await API.get(`/benh-nhan/${user.maBenhNhan}`);
            
            if (responseBN.success && responseBN.data) {
                this.benhNhan = responseBN.data;
                
                // Lấy hồ sơ bệnh án
                const responseHS = await API.get(`/ho-so/by-benh-nhan/${this.benhNhan.maBenhNhan}`);
                
                if (responseHS.success && responseHS.data) {
                    this.hoSo = responseHS.data;
                }
                
                this.renderHoSo();
            } else {
                throw new Error('Không tìm thấy thông tin bệnh nhân');
            }
        } catch (error) {
            console.error('Error loading ho so:', error);
            document.getElementById('hoSoContent').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Lỗi: ${error.message}
                </div>
            `;
        }
    },
    
    renderHoSo() {
        const container = document.getElementById('hoSoContent');
        
        if (!this.benhNhan) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Không tìm thấy thông tin bệnh nhân
                </div>
            `;
            return;
        }
        
        const html = `
            <!-- Thông tin cá nhân -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="bi bi-person-circle"></i> Thông tin cá nhân</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p class="mb-2"><strong>Mã bệnh nhân:</strong> ${this.benhNhan.maBenhNhan}</p>
                            <p class="mb-2"><strong>Họ và tên:</strong> ${this.benhNhan.hoTen}</p>
                            <p class="mb-2"><strong>Ngày sinh:</strong> ${this.benhNhan.ngaySinh ? new Date(this.benhNhan.ngaySinh).toLocaleDateString('vi-VN') : '-'}</p>
                            <p class="mb-2"><strong>Giới tính:</strong> ${this.benhNhan.gioiTinh || '-'}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-2"><strong>CCCD:</strong> ${this.benhNhan.cccd || '-'}</p>
                            <p class="mb-2"><strong>Số điện thoại:</strong> ${this.benhNhan.soDienThoai || '-'}</p>
                            <p class="mb-2"><strong>Email:</strong> ${this.benhNhan.email || '-'}</p>
                            <p class="mb-2"><strong>Địa chỉ:</strong> ${this.benhNhan.diaChi || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Thông tin y tế -->
            ${this.hoSo ? `
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <h6 class="mb-0"><i class="bi bi-heart-pulse"></i> Thông tin y tế</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="mb-2"><strong>Nhóm máu:</strong> ${this.hoSo.nhomMau || 'Chưa xác định'}</p>
                                <p class="mb-2"><strong>Chiều cao:</strong> ${this.hoSo.chieuCao ? this.hoSo.chieuCao + ' cm' : '-'}</p>
                                <p class="mb-2"><strong>Cân nặng:</strong> ${this.hoSo.canNang ? this.hoSo.canNang + ' kg' : '-'}</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-2"><strong>Tiền sử bệnh:</strong></p>
                                <p class="text-muted">${this.hoSo.tienSuBenh || 'Không có'}</p>
                            </div>
                        </div>
                        
                        ${this.hoSo.diUng ? `
                            <div class="alert alert-warning mt-3 mb-0">
                                <i class="bi bi-exclamation-triangle"></i> 
                                <strong>Dị ứng:</strong> ${this.hoSo.diUng}
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    Chưa có hồ sơ bệnh án. Vui lòng liên hệ lễ tân để tạo hồ sơ.
                </div>
            `}
            
            <!-- Nút xem lịch sử khám -->
            <div class="text-center mt-4">
                <button class="btn btn-primary btn-lg" onclick="App.loadPage('lich-su')">
                    <i class="bi bi-clock-history"></i> Xem lịch sử khám bệnh
                </button>
            </div>
        `;
        
        container.innerHTML = html;
    }
};
