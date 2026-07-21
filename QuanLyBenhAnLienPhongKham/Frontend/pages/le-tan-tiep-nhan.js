// Trang Lễ tân - Tiếp nhận bệnh nhân mới
const LeTanTiepNhan = {
    async render() {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-person-plus"></i> Tiếp nhận Bệnh nhân mới
                    </h5>
                </div>
                <div class="card-body">
                    <form id="formTiepNhan">
                        <div class="row">
                            <!-- Thông tin cá nhân -->
                            <div class="col-md-12">
                                <h6 class="border-bottom pb-2 mb-3">
                                    <i class="bi bi-person-vcard"></i> Thông tin cá nhân
                                </h6>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="hoTen" required>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Ngày sinh <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="ngaySinh" required>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Giới tính <span class="text-danger">*</span></label>
                                <select class="form-select" id="gioiTinh" required>
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                                <input type="tel" class="form-control" id="soDienThoai" 
                                       placeholder="VD: 0901234567" 
                                       pattern="[0-9]{10,11}" required>
                                <small class="text-muted">10-11 số</small>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">CCCD/CMND</label>
                                <input type="text" class="form-control" id="cccd" 
                                       placeholder="VD: 001234567890" 
                                       pattern="[0-9]{9,12}">
                                <small class="text-muted">9-12 số</small>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Số BHYT</label>
                                <input type="text" class="form-control" id="soBHYT" 
                                       placeholder="VD: DN1234567890123">
                                <small class="text-muted">Mã thẻ bảo hiểm y tế</small>
                            </div>
                            
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" 
                                       placeholder="VD: email@example.com">
                            </div>
                            
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
                                <textarea class="form-control" id="diaChi" rows="2" 
                                          placeholder="VD: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM" required></textarea>
                            </div>
                            
                            <!-- Thông tin y tế -->
                            <div class="col-md-12 mt-3">
                                <h6 class="border-bottom pb-2 mb-3">
                                    <i class="bi bi-heart-pulse"></i> Thông tin y tế
                                </h6>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Nhóm máu</label>
                                <select class="form-select" id="nhomMau">
                                    <option value="">-- Chọn nhóm máu --</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Nghề nghiệp</label>
                                <input type="text" class="form-control" id="ngheNghiep" 
                                       placeholder="VD: Nhân viên văn phòng, Giáo viên...">
                            </div>
                            
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Tiền sử bệnh</label>
                                <textarea class="form-control" id="tienSuBenh" rows="2" 
                                          placeholder="VD: Tiểu đường, cao huyết áp, hen suyễn..."></textarea>
                            </div>
                            
                            <!-- Thông tin dị ứng -->
                            <div class="col-md-12 mt-2">
                                <div class="card border-warning">
                                    <div class="card-header bg-warning bg-opacity-10">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h6 class="mb-0">
                                                <i class="bi bi-exclamation-triangle-fill text-warning"></i> 
                                                Thông tin dị ứng (nếu có)
                                            </h6>
                                            <button type="button" class="btn btn-sm btn-warning" onclick="LeTanTiepNhan.themDiUng()">
                                                <i class="bi bi-plus-circle"></i> Thêm dị ứng
                                            </button>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div id="danhSachDiUng">
                                            <p class="text-muted mb-0">
                                                <i class="bi bi-info-circle"></i> 
                                                Chưa có thông tin dị ứng. Click "Thêm dị ứng" nếu bệnh nhân có dị ứng.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Thông tin liên hệ khẩn cấp -->
                            <div class="col-md-12 mt-3">
                                <h6 class="border-bottom pb-2 mb-3">
                                    <i class="bi bi-telephone-fill"></i> Liên hệ khẩn cấp
                                </h6>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Người liên hệ</label>
                                <input type="text" class="form-control" id="nguoiLienHe">
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Số điện thoại người liên hệ</label>
                                <input type="tel" class="form-control" id="sdtNguoiLienHe">
                            </div>
                        </div>
                        
                        <div class="mt-4 text-end">
                            <button type="button" class="btn btn-secondary me-2" onclick="App.loadPage('dashboard')">
                                <i class="bi bi-x-circle"></i> Hủy
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-circle"></i> Tiếp nhận
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Bind form submit
        document.getElementById('formTiepNhan').addEventListener('submit', (e) => {
            e.preventDefault();
            this.tiepNhanBenhNhan();
        });
    },
    
    async tiepNhanBenhNhan() {
        try {
            App.showLoading();
            
            const data = {
                hoTen: document.getElementById('hoTen').value.trim(),
                ngaySinh: document.getElementById('ngaySinh').value,
                gioiTinh: document.getElementById('gioiTinh').value,
                soDienThoai: document.getElementById('soDienThoai').value.trim(),
                cccd: document.getElementById('cccd').value.trim() || null,
                soBHYT: document.getElementById('soBHYT').value.trim() || null,
                email: document.getElementById('email').value.trim() || null,
                diaChi: document.getElementById('diaChi').value.trim(),
                ngheNghiep: document.getElementById('ngheNghiep').value.trim() || null,
                nhomMau: document.getElementById('nhomMau').value || null,
                tienSuBenh: document.getElementById('tienSuBenh').value.trim() || null,
                nguoiLienHe: document.getElementById('nguoiLienHe').value.trim() || null,
                sdtNguoiLienHe: document.getElementById('sdtNguoiLienHe').value.trim() || null
            };
            
            const response = await API.post('/benh-nhan', data);
            
            if (response.success) {
                const maBenhNhan = response.data.maBenhNhan;
                
                // Lưu thông tin dị ứng nếu có
                if (this.danhSachDiUng && this.danhSachDiUng.length > 0) {
                    await this.luuDanhSachDiUng(maBenhNhan);
                }
                
                App.showToast('Tiếp nhận bệnh nhân thành công! Mã bệnh nhân: ' + maBenhNhan, 'success');
                
                // Hỏi có muốn tạo lượt khám ngay không
                if (confirm('Bạn có muốn tạo lượt khám cho bệnh nhân này không?')) {
                    this.taoLuotKham(maBenhNhan);
                } else {
                    // Reset form
                    document.getElementById('formTiepNhan').reset();
                    this.danhSachDiUng = [];
                    this.renderDanhSachDiUng();
                }
            } else {
                throw new Error(response.message || 'Không thể tiếp nhận bệnh nhân');
            }
        } catch (error) {
            console.error('Error:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    danhSachDiUng: [],
    
    themDiUng() {
        const modalHtml = `
            <div class="modal fade" id="modalThemDiUng" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">
                                <i class="bi bi-exclamation-triangle-fill"></i> Thêm thông tin dị ứng
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formThemDiUng">
                            <div class="modal-body">
                                <div class="alert alert-warning">
                                    <i class="bi bi-info-circle"></i> 
                                    <strong>Lưu ý:</strong> Thông tin dị ứng rất quan trọng cho quá trình điều trị. Vui lòng nhập chính xác.
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Tên dị ứng <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="tenDiUng" 
                                               placeholder="VD: Dị ứng Penicillin" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Mức độ dị ứng <span class="text-danger">*</span></label>
                                        <select class="form-select" id="mucDoDiUng" required>
                                            <option value="">-- Chọn mức độ --</option>
                                            <option value="Nhẹ">Nhẹ</option>
                                            <option value="Trung bình">Trung bình</option>
                                            <option value="Nặng">Nặng</option>
                                            <option value="Rất nặng">Rất nặng</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Tác nhân gây dị ứng <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="tacNhan" 
                                           placeholder="VD: Thuốc kháng sinh Penicillin, Hải sản, Phấn hoa..." required>
                                    <small class="text-muted">Ghi rõ loại thuốc, thực phẩm, hoặc chất gây dị ứng</small>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Biểu hiện dị ứng</label>
                                    <textarea class="form-control" id="bieuHien" rows="3" 
                                              placeholder="VD: Nổi mẩn đỏ, ngứa, khó thở, sưng môi..."></textarea>
                                    <small class="text-muted">Mô tả các triệu chứng khi bị dị ứng</small>
                                </div>
                            </div>
                            <div class="modal-footer bg-light">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle"></i> Hủy
                                </button>
                                <button type="submit" class="btn btn-warning">
                                    <i class="bi bi-check-circle"></i> Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal if exists
        const oldModal = document.getElementById('modalThemDiUng');
        if (oldModal) oldModal.remove();
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalThemDiUng'));
        modal.show();
        
        // Bind form submit
        document.getElementById('formThemDiUng').addEventListener('submit', (e) => {
            e.preventDefault();
            this.luuDiUng();
        });
    },
    
    luuDiUng() {
        const diUng = {
            tenDiUng: document.getElementById('tenDiUng').value.trim(),
            mucDoDiUng: document.getElementById('mucDoDiUng').value,
            tacNhan: document.getElementById('tacNhan').value.trim(),
            bieuHien: document.getElementById('bieuHien').value.trim() || null
        };
        
        // Thêm vào danh sách
        this.danhSachDiUng.push(diUng);
        
        // Render lại danh sách
        this.renderDanhSachDiUng();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalThemDiUng'));
        modal.hide();
        
        App.showToast('Đã thêm thông tin dị ứng', 'success');
    },
    
    renderDanhSachDiUng() {
        const container = document.getElementById('danhSachDiUng');
        
        if (!this.danhSachDiUng || this.danhSachDiUng.length === 0) {
            container.innerHTML = `
                <p class="text-muted mb-0">
                    <i class="bi bi-info-circle"></i> 
                    Chưa có thông tin dị ứng. Click "Thêm dị ứng" nếu bệnh nhân có dị ứng.
                </p>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-sm table-bordered mb-0">
                    <thead class="table-warning">
                        <tr>
                            <th width="25%">Tên dị ứng</th>
                            <th width="15%">Mức độ</th>
                            <th width="25%">Tác nhân</th>
                            <th width="25%">Biểu hiện</th>
                            <th width="10%" class="text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.danhSachDiUng.map((diUng, index) => `
                            <tr>
                                <td><strong>${diUng.tenDiUng}</strong></td>
                                <td>
                                    <span class="badge ${
                                        diUng.mucDoDiUng === 'Nhẹ' ? 'bg-info' :
                                        diUng.mucDoDiUng === 'Trung bình' ? 'bg-warning' :
                                        diUng.mucDoDiUng === 'Nặng' ? 'bg-danger' :
                                        'bg-dark'
                                    }">${diUng.mucDoDiUng}</span>
                                </td>
                                <td>${diUng.tacNhan}</td>
                                <td>${diUng.bieuHien || '-'}</td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-sm btn-danger" 
                                            onclick="LeTanTiepNhan.xoaDiUng(${index})">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    xoaDiUng(index) {
        if (confirm('Bạn có chắc muốn xóa thông tin dị ứng này?')) {
            this.danhSachDiUng.splice(index, 1);
            this.renderDanhSachDiUng();
            App.showToast('Đã xóa thông tin dị ứng', 'success');
        }
    },
    
    async luuDanhSachDiUng(maBenhNhan) {
        try {
            // Lưu từng dị ứng trực tiếp với maBenhNhan
            for (const diUng of this.danhSachDiUng) {
                const data = {
                    MaBenhNhan: maBenhNhan,
                    TenDiUng: diUng.tenDiUng,
                    MucDoDiUng: diUng.mucDoDiUng,
                    TacNhan: diUng.tacNhan,
                    BieuHien: diUng.bieuHien,
                    NgayGhiNhan: new Date().toISOString()
                };
                
                await API.post('/di-ung', data);
            }
            
            console.log('Đã lưu thông tin dị ứng');
        } catch (error) {
            console.error('Error saving allergies:', error);
            // Không throw error để không ảnh hưởng đến việc tạo bệnh nhân
        }
    },
    
    async taoLuotKham(maBenhNhan) {
        try {
            App.showLoading();
            
            // Load danh sách bác sĩ và phòng khám
            const [bacSiResponse, phongKhamResponse] = await Promise.all([
                API.get('/bac-si'),
                API.get('/phong-kham')
            ]);
            
            if (!bacSiResponse.success || !phongKhamResponse.success) {
                throw new Error('Không thể tải danh sách bác sĩ hoặc phòng khám');
            }
            
            const danhSachBacSi = bacSiResponse.data || [];
            const danhSachPhongKham = phongKhamResponse.data || [];
            
            // Hiển thị modal chọn bác sĩ và phòng khám
            const modalHtml = `
                <div class="modal fade" id="modalTaoLuotKham" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header bg-warning">
                                <h5 class="modal-title">
                                    <i class="bi bi-calendar-plus"></i> Tạo lượt khám
                                </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="formTaoLuotKham">
                                    <div class="mb-3">
                                        <label class="form-label">Mã bệnh nhân</label>
                                        <input type="text" class="form-control" value="${maBenhNhan}" readonly>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label">Phòng khám <span class="text-danger">*</span></label>
                                        <select class="form-select" id="maPhongKham" required>
                                            <option value="">-- Chọn phòng khám --</option>
                                            ${danhSachPhongKham.map(pk => `
                                                <option value="${pk.maPhongKham}">${pk.tenPhongKham}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label">Bác sĩ <span class="text-danger">*</span></label>
                                        <select class="form-select" id="maBacSi" required>
                                            <option value="">-- Chọn bác sĩ --</option>
                                            ${danhSachBacSi.map(bs => `
                                                <option value="${bs.maBacSi}">${bs.hoTen} - ${bs.chuyenKhoa || 'Đa khoa'}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label">Lý do khám</label>
                                        <textarea class="form-control" id="lyDoKham" rows="3"></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button type="button" class="btn btn-warning" onclick="LeTanTiepNhan.luuLuotKham('${maBenhNhan}')">
                                    <i class="bi bi-check-circle"></i> Tạo lượt khám
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Remove old modal if exists
            const oldModal = document.getElementById('modalTaoLuotKham');
            if (oldModal) oldModal.remove();
            
            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('modalTaoLuotKham'));
            modal.show();
            
        } catch (error) {
            console.error('Error:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async luuLuotKham(maBenhNhan) {
        try {
            const maPhongKham = document.getElementById('maPhongKham').value;
            const maBacSi = document.getElementById('maBacSi').value;
            const lyDoKham = document.getElementById('lyDoKham').value.trim();
            
            if (!maPhongKham || !maBacSi) {
                App.showToast('Vui lòng chọn phòng khám và bác sĩ', 'warning');
                return;
            }
            
            App.showLoading();
            
            const data = {
                maBenhNhan: maBenhNhan,
                maPhongKham: maPhongKham,
                maBacSi: maBacSi,
                lyDoKham: lyDoKham || null,
                trangThai: 'Chờ khám'
            };
            
            const response = await API.post('/dot-kham', data);
            
            if (response.success) {
                App.showToast('Tạo lượt khám thành công!', 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalTaoLuotKham'));
                modal.hide();
                
                // Reset form tiếp nhận
                document.getElementById('formTiepNhan').reset();
            } else {
                throw new Error(response.message || 'Không thể tạo lượt khám');
            }
        } catch (error) {
            console.error('Error:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
