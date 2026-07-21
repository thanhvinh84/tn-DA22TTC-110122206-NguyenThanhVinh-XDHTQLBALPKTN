// Trang Bệnh nhân - Đặt khám online
const BenhNhanDatKham = {
    danhSachYeuCau: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        // Kiểm tra quyền
        const user = Auth.getUser();
        if (!user || user.maVaiTro !== 'VT_BENHNHAN') {
            content.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Bạn không có quyền truy cập trang này.
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <div class="row">
                <!-- Form đặt khám -->
                <div class="col-md-5">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">
                                <i class="bi bi-calendar-plus"></i> Đặt khám online
                            </h5>
                        </div>
                        <div class="card-body">
                            <form id="formDatKham">
                                <div class="mb-3">
                                    <label class="form-label">Thời gian mong muốn <span class="text-danger">*</span></label>
                                    <input type="datetime-local" class="form-control" id="thoiGianMongMuon" required>
                                    <small class="text-muted">Chọn ngày giờ bạn muốn đến khám</small>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Lý do khám <span class="text-danger">*</span></label>
                                    <textarea class="form-control" id="lyDoKham" rows="3" 
                                              placeholder="VD: Tái khám sau 1 tuần, Đau đầu kéo dài..." required></textarea>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Ghi chú thêm</label>
                                    <textarea class="form-control" id="ghiChu" rows="2" 
                                              placeholder="Thông tin bổ sung (nếu có)"></textarea>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i> 
                                    <strong>Lưu ý:</strong>
                                    <ul class="mb-0 mt-2">
                                        <li>Yêu cầu sẽ được gửi đến lễ tân để xác nhận</li>
                                        <li>Vui lòng đợi xác nhận trước khi đến phòng khám</li>
                                        <li>Bạn có thể hủy yêu cầu nếu chưa được xác nhận</li>
                                    </ul>
                                </div>
                                
                                <button type="submit" class="btn btn-primary w-100">
                                    <i class="bi bi-send"></i> Gửi yêu cầu
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <!-- Lịch sử đặt khám -->
                <div class="col-md-7">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="bi bi-clock-history"></i> Lịch sử đặt khám
                            </h5>
                            <button class="btn btn-sm btn-outline-primary" id="btnLamMoi">
                                <i class="bi bi-arrow-clockwise"></i> Làm mới
                            </button>
                        </div>
                        <div class="card-body">
                            <div id="lichSuDatKham">
                                <div class="text-center py-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Bind form submit
        document.getElementById('formDatKham').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guiYeuCau();
        });
        
        // Bind button làm mới
        document.getElementById('btnLamMoi').addEventListener('click', () => {
            this.loadLichSu();
        });
        
        // Set min datetime là ngày mai
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0); // Default 8:00 AM
        document.getElementById('thoiGianMongMuon').min = this.formatDateTimeLocal(new Date());
        document.getElementById('thoiGianMongMuon').value = this.formatDateTimeLocal(tomorrow);
        
        // Load lịch sử
        await this.loadLichSu();
    },
    
    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    
    async guiYeuCau() {
        try {
            App.showLoading();
            
            const data = {
                thoiGianMongMuon: document.getElementById('thoiGianMongMuon').value,
                lyDoKham: document.getElementById('lyDoKham').value,
                ghiChu: document.getElementById('ghiChu').value || null
            };
            
            // Validate thời gian
            const selectedTime = new Date(data.thoiGianMongMuon);
            if (selectedTime <= new Date()) {
                App.showToast('Thời gian đặt khám phải trong tương lai', 'warning');
                return;
            }
            
            const response = await API.post('/yeu-cau-dat-kham', data);
            
            if (response.success) {
                App.showToast('Gửi yêu cầu đặt khám thành công! Vui lòng đợi lễ tân xác nhận.', 'success');
                
                // Reset form
                document.getElementById('formDatKham').reset();
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(8, 0, 0, 0);
                document.getElementById('thoiGianMongMuon').value = this.formatDateTimeLocal(tomorrow);
                
                // Reload lịch sử
                await this.loadLichSu();
            } else {
                throw new Error(response.message || 'Không thể gửi yêu cầu');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async loadLichSu() {
        try {
            const response = await API.get('/yeu-cau-dat-kham/benh-nhan');
            
            if (response.success && response.data) {
                this.danhSachYeuCau = response.data;
                this.renderLichSu();
            } else {
                throw new Error(response.message || 'Không thể tải lịch sử');
            }
        } catch (error) {
            console.error('Error loading lich su:', error);
            document.getElementById('lichSuDatKham').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Lỗi: ${error.message}
                </div>
            `;
        }
    },
    
    renderLichSu() {
        const container = document.getElementById('lichSuDatKham');
        
        if (!this.danhSachYeuCau || this.danhSachYeuCau.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    Bạn chưa có yêu cầu đặt khám nào. Hãy tạo yêu cầu mới bên trái!
                </div>
            `;
            return;
        }
        
        const html = this.danhSachYeuCau.map(yc => `
            <div class="card mb-3 border-start border-3 ${this.getBorderColor(yc.trangThai)}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0">
                            <i class="bi bi-calendar-event"></i> 
                            ${new Date(yc.thoiGianMongMuon).toLocaleString('vi-VN')}
                        </h6>
                        ${this.getTrangThaiBadge(yc.trangThai)}
                    </div>
                    
                    <p class="mb-2"><strong>Lý do:</strong> ${yc.lyDoKham}</p>
                    
                    ${yc.ghiChu ? `<p class="mb-2 text-muted"><strong>Ghi chú:</strong> ${yc.ghiChu}</p>` : ''}
                    
                    ${yc.tenPhongKham ? `
                        <p class="mb-2">
                            <i class="bi bi-hospital"></i> 
                            <strong>Phòng khám:</strong> ${yc.tenPhongKham}
                        </p>
                    ` : ''}
                    
                    ${yc.lyDoTuChoi ? `
                        <div class="alert alert-warning mb-2">
                            <strong>Lý do từ chối:</strong> ${yc.lyDoTuChoi}
                        </div>
                    ` : ''}
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-clock"></i> 
                            Đã tạo: ${new Date(yc.ngayTao).toLocaleString('vi-VN')}
                        </small>
                        
                        ${yc.trangThai === 'Chờ xác nhận' ? `
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="BenhNhanDatKham.huyYeuCau('${yc.maYeuCau}')">
                                <i class="bi bi-x-circle"></i> Hủy
                            </button>
                        ` : ''}
                        
                        ${yc.trangThai === 'Đã tạo đợt khám' && yc.maDotKham ? `
                            <button class="btn btn-sm btn-primary" 
                                    onclick="App.navigate('lich-su')">
                                <i class="bi bi-eye"></i> Xem đợt khám
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    },
    
    getTrangThaiBadge(trangThai) {
        const badges = {
            'Chờ xác nhận': '<span class="badge bg-warning">Chờ xác nhận</span>',
            'Đã xác nhận': '<span class="badge bg-info">Đã xác nhận</span>',
            'Đã từ chối': '<span class="badge bg-danger">Đã từ chối</span>',
            'Đã tạo đợt khám': '<span class="badge bg-success">Đã tạo đợt khám</span>',
            'Đã hủy': '<span class="badge bg-secondary">Đã hủy</span>'
        };
        return badges[trangThai] || '<span class="badge bg-secondary">' + trangThai + '</span>';
    },
    
    getBorderColor(trangThai) {
        const colors = {
            'Chờ xác nhận': 'border-warning',
            'Đã xác nhận': 'border-info',
            'Đã từ chối': 'border-danger',
            'Đã tạo đợt khám': 'border-success',
            'Đã hủy': 'border-secondary'
        };
        return colors[trangThai] || 'border-secondary';
    },
    
    async huyYeuCau(maYeuCau) {
        if (!confirm('Bạn có chắc muốn hủy yêu cầu này?')) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.put(`/yeu-cau-dat-kham/${maYeuCau}/huy`);
            
            if (response.success) {
                App.showToast('Đã hủy yêu cầu thành công', 'success');
                await this.loadLichSu();
            } else {
                throw new Error(response.message || 'Không thể hủy yêu cầu');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
