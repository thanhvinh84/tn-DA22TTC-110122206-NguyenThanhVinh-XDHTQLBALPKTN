// Trang Lễ tân - Quản lý yêu cầu đặt khám online
const LeTanDatKham = {
    danhSachYeuCau: [],
    danhSachPhongKham: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        // Kiểm tra quyền
        const user = Auth.getUser();
        if (!user || user.maVaiTro !== 'VT_LETAN') {
            content.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Bạn không có quyền truy cập trang này.
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-calendar-check"></i> Quản lý yêu cầu đặt khám online
                    </h5>
                </div>
                <div class="card-body">
                    <!-- Bộ lọc -->
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Trạng thái</label>
                            <select class="form-select" id="filterTrangThai">
                                <option value="">Tất cả</option>
                                <option value="Chờ xác nhận" selected>Chờ xác nhận</option>
                                <option value="Đã xác nhận">Đã xác nhận</option>
                                <option value="Đã từ chối">Đã từ chối</option>
                                <option value="Đã tạo đợt khám">Đã tạo đợt khám</option>
                                <option value="Đã hủy">Đã hủy</option>
                            </select>
                        </div>
                        <div class="col-md-8 d-flex align-items-end">
                            <button class="btn btn-primary me-2" id="btnTimKiem">
                                <i class="bi bi-search"></i> Tìm kiếm
                            </button>
                            <button class="btn btn-outline-primary" id="btnLamMoi">
                                <i class="bi bi-arrow-clockwise"></i> Làm mới
                            </button>
                            <div class="ms-auto">
                                <span class="badge bg-warning fs-6" id="badgeChoXacNhan">0</span>
                                <span class="text-muted ms-2">yêu cầu chờ xác nhận</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> 
                        <strong>Hướng dẫn:</strong> 
                        Xác nhận yêu cầu → Tạo đợt khám cho bệnh nhân tại trang "Bệnh nhân chờ khám"
                    </div>
                    
                    <!-- Danh sách yêu cầu -->
                    <div id="danhSachYeuCau">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load danh sách phòng khám
        await this.loadPhongKham();
        
        // Load dữ liệu
        await this.loadData();
        
        // Load count
        await this.loadCount();
        
        // Bind events
        document.getElementById('btnTimKiem').addEventListener('click', () => {
            this.loadData();
        });
        
        document.getElementById('btnLamMoi').addEventListener('click', () => {
            this.loadData();
        });
        
        document.getElementById('filterTrangThai').addEventListener('change', () => {
            this.loadData();
        });
    },
    
    async loadPhongKham() {
        try {
            const response = await API.get('/phong-kham');
            if (response.success && response.data) {
                this.danhSachPhongKham = response.data;
            }
        } catch (error) {
            console.error('Error loading phong kham:', error);
        }
    },
    
    async loadData() {
        try {
            const trangThai = document.getElementById('filterTrangThai')?.value || '';
            
            let url = '/yeu-cau-dat-kham';
            if (trangThai) {
                url += '?trangThai=' + encodeURIComponent(trangThai);
            }
            
            const response = await API.get(url);
            
            if (response.success && response.data) {
                this.danhSachYeuCau = response.data;
                this.renderTable();
            } else {
                throw new Error(response.message || 'Không thể tải danh sách yêu cầu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('danhSachYeuCau').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Lỗi: ${error.message}
                </div>
            `;
        }
    },
    
    async loadCount() {
        try {
            const response = await API.get('/yeu-cau-dat-kham/thong-ke/count?trangThai=Chờ xác nhận');
            if (response.success && response.data) {
                document.getElementById('badgeChoXacNhan').textContent = response.data.count || 0;
            }
        } catch (error) {
            console.error('Error loading count:', error);
        }
    },
    
    renderTable() {
        const container = document.getElementById('danhSachYeuCau');
        
        if (!this.danhSachYeuCau || this.danhSachYeuCau.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    Không có yêu cầu đặt khám nào
                </div>
            `;
            return;
        }
        
        const html = `
            <div class="table-responsive">
                <table class="table table-hover table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th width="100">Mã YC</th>
                            <th>Bệnh nhân</th>
                            <th>Thời gian mong muốn</th>
                            <th>Lý do khám</th>
                            <th width="120">Trạng thái</th>
                            <th width="200">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.danhSachYeuCau.map(yc => `
                            <tr>
                                <td><strong>${yc.maYeuCau}</strong></td>
                                <td>
                                    <strong>${yc.tenBenhNhan || '-'}</strong><br>
                                    <small class="text-muted">${yc.maBenhNhan || '-'}</small><br>
                                    <small><i class="bi bi-telephone"></i> ${yc.soDienThoai || '-'}</small>
                                </td>
                                <td>
                                    <i class="bi bi-calendar-event"></i> 
                                    ${new Date(yc.thoiGianMongMuon).toLocaleString('vi-VN')}
                                    <br>
                                    <small class="text-muted">Đã tạo: ${new Date(yc.ngayTao).toLocaleString('vi-VN')}</small>
                                </td>
                                <td>
                                    ${yc.lyDoKham}
                                    ${yc.ghiChu ? `<br><small class="text-muted">GC: ${yc.ghiChu}</small>` : ''}
                                </td>
                                <td>
                                    ${this.getTrangThaiBadge(yc.trangThai)}
                                    ${yc.tenPhongKham ? `<br><small class="text-muted">${yc.tenPhongKham}</small>` : ''}
                                </td>
                                <td>
                                    ${yc.trangThai === 'Chờ xác nhận' ? `
                                        <button class="btn btn-sm btn-success mb-1" 
                                                onclick="LeTanDatKham.xacNhan('${yc.maYeuCau}')"
                                                title="Xác nhận yêu cầu">
                                            <i class="bi bi-check-circle"></i> Xác nhận
                                        </button>
                                        <button class="btn btn-sm btn-danger" 
                                                onclick="LeTanDatKham.tuChoi('${yc.maYeuCau}')"
                                                title="Từ chối yêu cầu">
                                            <i class="bi bi-x-circle"></i> Từ chối
                                        </button>
                                    ` : ''}
                                    
                                    ${yc.trangThai === 'Đã xác nhận' ? `
                                        <button class="btn btn-sm btn-primary" 
                                                onclick="LeTanDatKham.taoDotKham('${yc.maYeuCau}', '${yc.maBenhNhan}')"
                                                title="Tạo đợt khám">
                                            <i class="bi bi-plus-circle"></i> Tạo đợt khám
                                        </button>
                                    ` : ''}
                                    
                                    ${yc.lyDoTuChoi ? `
                                        <div class="text-danger small mt-1">
                                            <strong>Lý do:</strong> ${yc.lyDoTuChoi}
                                        </div>
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
            'Chờ xác nhận': '<span class="badge bg-warning">Chờ xác nhận</span>',
            'Đã xác nhận': '<span class="badge bg-info">Đã xác nhận</span>',
            'Đã từ chối': '<span class="badge bg-danger">Đã từ chối</span>',
            'Đã tạo đợt khám': '<span class="badge bg-success">Đã tạo đợt khám</span>',
            'Đã hủy': '<span class="badge bg-secondary">Đã hủy</span>'
        };
        return badges[trangThai] || '<span class="badge bg-secondary">' + trangThai + '</span>';
    },
    
    async xacNhan(maYeuCau) {
        // Hiển thị modal chọn phòng khám
        const modalHtml = `
            <div class="modal fade" id="modalXacNhan" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-check-circle"></i> Xác nhận yêu cầu
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Chọn phòng khám</label>
                                <select class="form-select" id="selectPhongKham">
                                    <option value="">-- Chọn phòng khám --</option>
                                    ${this.danhSachPhongKham.map(pk => `
                                        <option value="${pk.maPhongKham}">${pk.tenPhongKham}</option>
                                    `).join('')}
                                </select>
                                <small class="text-muted">Bạn có thể chọn phòng khám hoặc để trống</small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-success" onclick="LeTanDatKham.confirmXacNhan('${maYeuCau}')">
                                <i class="bi bi-check-circle"></i> Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal
        const oldModal = document.getElementById('modalXacNhan');
        if (oldModal) oldModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalXacNhan'));
        modal.show();
    },
    
    async confirmXacNhan(maYeuCau) {
        try {
            App.showLoading();
            
            const maPhongKham = document.getElementById('selectPhongKham').value || null;
            
            const response = await API.put(`/yeu-cau-dat-kham/${maYeuCau}/xac-nhan`, {
                maPhongKham: maPhongKham
            });
            
            if (response.success) {
                App.showToast('Xác nhận yêu cầu thành công', 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalXacNhan'));
                modal.hide();
                
                // Reload data
                await this.loadData();
                await this.loadCount();
            } else {
                throw new Error(response.message || 'Không thể xác nhận yêu cầu');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async tuChoi(maYeuCau) {
        // Hiển thị modal nhập lý do từ chối
        const modalHtml = `
            <div class="modal fade" id="modalTuChoi" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-danger text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-x-circle"></i> Từ chối yêu cầu
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Lý do từ chối <span class="text-danger">*</span></label>
                                <textarea class="form-control" id="lyDoTuChoi" rows="3" 
                                          placeholder="VD: Giờ khám đã đầy, vui lòng chọn giờ khác..." required></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-danger" onclick="LeTanDatKham.confirmTuChoi('${maYeuCau}')">
                                <i class="bi bi-x-circle"></i> Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal
        const oldModal = document.getElementById('modalTuChoi');
        if (oldModal) oldModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalTuChoi'));
        modal.show();
    },
    
    async confirmTuChoi(maYeuCau) {
        try {
            App.showLoading();
            
            const lyDoTuChoi = document.getElementById('lyDoTuChoi').value.trim();
            
            if (!lyDoTuChoi) {
                App.showToast('Vui lòng nhập lý do từ chối', 'warning');
                return;
            }
            
            const response = await API.put(`/yeu-cau-dat-kham/${maYeuCau}/tu-choi`, {
                lyDoTuChoi: lyDoTuChoi
            });
            
            if (response.success) {
                App.showToast('Đã từ chối yêu cầu', 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalTuChoi'));
                modal.hide();
                
                // Reload data
                await this.loadData();
                await this.loadCount();
            } else {
                throw new Error(response.message || 'Không thể từ chối yêu cầu');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async taoDotKham(maYeuCau, maBenhNhan) {
        try {
            App.showLoading();
            
            // Lấy thông tin yêu cầu
            const yeuCau = this.danhSachYeuCau.find(yc => yc.maYeuCau === maYeuCau);
            if (!yeuCau) {
                throw new Error('Không tìm thấy yêu cầu');
            }
            
            console.log('Yêu cầu đặt khám:', yeuCau);
            console.log('Lý do khám:', yeuCau.lyDoKham);
            
            // Lấy thông tin bệnh nhân
            const bnResponse = await API.get(`/benh-nhan/${maBenhNhan}`);
            if (!bnResponse.success || !bnResponse.data) {
                throw new Error('Không tìm thấy thông tin bệnh nhân');
            }
            
            const benhNhan = bnResponse.data;
            
            // Lấy hoặc tạo hồ sơ bệnh án - SỬA LẠI ENDPOINT
            let maHoSo = null;
            const hsResponse = await API.get(`/ho-so/by-benh-nhan/${maBenhNhan}`);
            
            if (hsResponse.success && hsResponse.data) {
                // Có hồ sơ rồi
                maHoSo = hsResponse.data.maHoSo;
            } else {
                // Tạo hồ sơ bệnh án mới - SỬA LẠI PAYLOAD
                const createHsResponse = await API.post('/ho-so', {
                    maBenhNhan: maBenhNhan  // lowercase theo Backend
                });
                
                if (createHsResponse.success && createHsResponse.data) {
                    maHoSo = createHsResponse.data.maHoSo;
                } else {
                    throw new Error('Không thể tạo hồ sơ bệnh án: ' + (createHsResponse.message || 'Unknown error'));
                }
            }
            
            if (!maHoSo) {
                throw new Error('Không thể tạo hồ sơ bệnh án');
            }
            
            // Lấy mã lễ tân từ user hiện tại
            const user = Auth.getUser();
            const maLeTan = user?.maNhanVien || null;
            
            // Tạo đợt khám - DÙNG PascalCase THEO DTO
            const dotKhamData = {
                MaHoSo: maHoSo,
                MaBenhNhan: maBenhNhan,
                MaPhongKham: yeuCau.maPhongKham,
                MaLeTan: maLeTan,
                ThoiGianDen: yeuCau.thoiGianMongMuon,  // Thời gian bệnh nhân muốn đến
                LyDoKham: yeuCau.lyDoKham,
                TrangThai: 'Chờ khám'
            };
            
            const dotKhamResponse = await API.post('/dot-kham', dotKhamData);
            
            if (!dotKhamResponse.success) {
                throw new Error(dotKhamResponse.message || 'Không thể tạo đợt khám');
            }
            
            const maDotKham = dotKhamResponse.data.maDotKham;
            
            // Cập nhật mã đợt khám vào yêu cầu
            const updateResponse = await API.put(`/yeu-cau-dat-kham/${maYeuCau}/dot-kham`, {
                maDotKham: maDotKham
            });
            
            if (updateResponse.success) {
                App.showToast('Tạo đợt khám thành công! Đang chuyển đến trang nhập chỉ số sự sống...', 'success');
                
                // Chuyển sang trang tạo lượt khám với thông tin đã tạo
                setTimeout(() => {
                    App.navigate('tao-dot-kham', {
                        maDotKham: maDotKham,
                        maBenhNhan: maBenhNhan,
                        maYeuCau: maYeuCau,
                        autoFill: true
                    });
                }, 1500);
            } else {
                throw new Error('Không thể cập nhật mã đợt khám: ' + (updateResponse.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating dot kham:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
