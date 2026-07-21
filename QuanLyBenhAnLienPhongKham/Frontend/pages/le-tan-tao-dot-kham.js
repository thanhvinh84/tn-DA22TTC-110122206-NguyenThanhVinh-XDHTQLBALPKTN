// Trang Lễ tân - Tạo lượt khám mới
const LeTanTaoDotKham = {
    danhSachBenhNhan: [],
    danhSachBacSi: [],
    danhSachPhongKham: [],
    
    async render(params = {}) {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="card">
                <div class="card-header bg-warning">
                    <h5 class="mb-0">
                        <i class="bi bi-calendar-plus"></i> Tạo lượt khám mới
                    </h5>
                </div>
                <div class="card-body">
                    <form id="formTaoDotKham">
                        <div class="row">
                            <!-- Chọn bệnh nhân -->
                            <div class="col-md-12 mb-3">
                                <h6 class="border-bottom pb-2 mb-3">
                                    <i class="bi bi-person"></i> Thông tin bệnh nhân
                                </h6>
                            </div>
                            
                            <div class="col-md-8 mb-3">
                                <label class="form-label">Tìm bệnh nhân <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="searchBenhNhan" 
                                           placeholder="Nhập mã BN, họ tên hoặc số điện thoại...">
                                    <button class="btn btn-outline-secondary" type="button" onclick="LeTanTaoDotKham.timBenhNhan()">
                                        <i class="bi bi-search"></i> Tìm
                                    </button>
                                </div>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">&nbsp;</label>
                                <button type="button" class="btn btn-primary w-100" onclick="App.loadPage('tiep-nhan')">
                                    <i class="bi bi-person-plus"></i> Thêm BN mới
                                </button>
                            </div>
                            
                            <div class="col-md-12 mb-3">
                                <div id="thongTinBenhNhan" class="alert alert-secondary">
                                    <i class="bi bi-info-circle"></i> Chưa chọn bệnh nhân
                                </div>
                            </div>
                            
                            <!-- Thông tin lượt khám -->
                            <div class="col-md-12 mb-3">
                                <h6 class="border-bottom pb-2 mb-3">
                                    <i class="bi bi-calendar-check"></i> Thông tin lượt khám
                                </h6>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Phòng khám <span class="text-danger">*</span></label>
                                <select class="form-select" id="maPhongKham" required disabled>
                                    <option value="">-- Chọn phòng khám --</option>
                                </select>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Bác sĩ <span class="text-danger">*</span></label>
                                <select class="form-select" id="maBacSi" required disabled>
                                    <option value="">-- Chọn bác sĩ --</option>
                                </select>
                            </div>
                            
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Lý do khám</label>
                                <textarea class="form-control" id="lyDoKham" rows="3" disabled></textarea>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ngày khám</label>
                                <input type="date" class="form-control" id="ngayKham" disabled>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Giờ khám (dự kiến)</label>
                                <input type="time" class="form-control" id="gioKham" disabled>
                            </div>
                            
                            <!-- Chỉ số sức sống -->
                            <div class="col-md-12 mb-3 mt-3">
                                <h6 class="border-bottom pb-2 mb-3">
                                    <i class="bi bi-heart-pulse"></i> Chỉ số sức sống
                                </h6>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Nhịp tim (lần/phút)</label>
                                <input type="number" class="form-control" id="nhipTim" placeholder="70" disabled>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Huyết áp tâm thu (mmHg)</label>
                                <input type="number" class="form-control" id="huyetApTamThu" placeholder="120" disabled>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Huyết áp tâm trương (mmHg)</label>
                                <input type="number" class="form-control" id="huyetApTamTruong" placeholder="80" disabled>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Nhiệt độ (°C)</label>
                                <input type="number" step="0.1" class="form-control" id="nhietDo" placeholder="36.5" disabled>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Nhịp thở (lần/phút)</label>
                                <input type="number" class="form-control" id="nhipTho" placeholder="18" disabled>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Cân nặng (kg)</label>
                                <input type="number" step="0.1" class="form-control" id="canNang" placeholder="60" disabled>
                            </div>
                        </div>
                        
                        <div class="mt-4 text-end">
                            <button type="button" class="btn btn-secondary me-2" onclick="App.loadPage('dashboard')">
                                <i class="bi bi-x-circle"></i> Hủy
                            </button>
                            <button type="submit" class="btn btn-warning" disabled id="btnTaoLuotKham">
                                <i class="bi bi-check-circle"></i> Tạo lượt khám
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Load data
        await this.loadData();
        
        // Xử lý auto-fill nếu có params từ trang đặt khám online
        if (params.autoFill && params.maDotKham && params.maBenhNhan) {
            await this.autoFillFromDatKham(params);
        }
        
        // Bind form submit
        document.getElementById('formTaoDotKham').addEventListener('submit', (e) => {
            e.preventDefault();
            this.taoLuotKham();
        });
        
        // Bind enter key for search
        document.getElementById('searchBenhNhan').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.timBenhNhan();
            }
        });
        
        // Set default date to today
        document.getElementById('ngayKham').valueAsDate = new Date();
    },
    
    async loadData() {
        try {
            App.showLoading();
            
            const [benhNhanRes, bacSiRes, phongKhamRes] = await Promise.all([
                API.get('/benh-nhan'),
                API.get('/bac-si'),
                API.get('/phong-kham')
            ]);
            
            if (benhNhanRes.success) this.danhSachBenhNhan = benhNhanRes.data || [];
            if (bacSiRes.success) this.danhSachBacSi = bacSiRes.data || [];
            if (phongKhamRes.success) this.danhSachPhongKham = phongKhamRes.data || [];
            
            // Populate dropdowns
            this.populateDropdowns();
            
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    populateDropdowns() {
        // Phòng khám
        const selectPhongKham = document.getElementById('maPhongKham');
        selectPhongKham.innerHTML = '<option value="">-- Chọn phòng khám --</option>' +
            this.danhSachPhongKham.map(pk => `
                <option value="${pk.maPhongKham}">${pk.tenPhongKham}</option>
            `).join('');
        
        // Bác sĩ
        const selectBacSi = document.getElementById('maBacSi');
        selectBacSi.innerHTML = '<option value="">-- Chọn bác sĩ --</option>' +
            this.danhSachBacSi.map(bs => `
                <option value="${bs.maBacSi}">${bs.hoTen} - ${bs.chuyenKhoa || 'Đa khoa'}</option>
            `).join('');
    },
    
    timBenhNhan() {
        const keyword = document.getElementById('searchBenhNhan').value.trim().toLowerCase();
        
        if (!keyword) {
            App.showToast('Vui lòng nhập từ khóa tìm kiếm', 'warning');
            return;
        }
        
        // Filter patients
        const ketQua = this.danhSachBenhNhan.filter(bn => {
            return (
                bn.maBenhNhan?.toLowerCase().includes(keyword) ||
                bn.hoTen?.toLowerCase().includes(keyword) ||
                bn.soDienThoai?.includes(keyword)
            );
        });
        
        if (ketQua.length === 0) {
            App.showToast('Không tìm thấy bệnh nhân', 'warning');
            return;
        }
        
        if (ketQua.length === 1) {
            // Chọn luôn nếu chỉ có 1 kết quả
            this.chonBenhNhan(ketQua[0]);
        } else {
            // Hiển thị danh sách để chọn
            this.hienThiDanhSachChon(ketQua);
        }
    },
    
    hienThiDanhSachChon(danhSach) {
        const html = `
            <div class="list-group">
                <div class="list-group-item bg-light">
                    <strong>Tìm thấy ${danhSach.length} bệnh nhân. Chọn một:</strong>
                </div>
                ${danhSach.map(bn => `
                    <a href="#" class="list-group-item list-group-item-action" 
                       onclick="event.preventDefault(); LeTanTaoDotKham.chonBenhNhanById('${bn.maBenhNhan}')">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${bn.hoTen}</h6>
                            <small>${bn.maBenhNhan}</small>
                        </div>
                        <p class="mb-1">
                            <i class="bi bi-telephone"></i> ${bn.soDienThoai} | 
                            <i class="bi bi-calendar"></i> ${this.formatDate(bn.ngaySinh)} | 
                            ${bn.gioiTinh}
                        </p>
                        <small>${bn.diaChi || '-'}</small>
                    </a>
                `).join('')}
            </div>
        `;
        
        document.getElementById('thongTinBenhNhan').innerHTML = html;
    },
    
    chonBenhNhanById(maBenhNhan) {
        const benhNhan = this.danhSachBenhNhan.find(bn => bn.maBenhNhan === maBenhNhan);
        if (benhNhan) {
            this.chonBenhNhan(benhNhan);
        }
    },
    
    chonBenhNhan(benhNhan) {
        // Hiển thị thông tin bệnh nhân đã chọn
        const html = `
            <div class="alert alert-success mb-0">
                <div class="row">
                    <div class="col-md-12 mb-2">
                        <h6 class="mb-0">
                            <i class="bi bi-check-circle"></i> Đã chọn bệnh nhân
                        </h6>
                    </div>
                    <div class="col-md-6">
                        <strong>Mã BN:</strong> ${benhNhan.maBenhNhan}<br>
                        <strong>Họ tên:</strong> ${benhNhan.hoTen}<br>
                        <strong>Ngày sinh:</strong> ${this.formatDate(benhNhan.ngaySinh)}
                    </div>
                    <div class="col-md-6">
                        <strong>Giới tính:</strong> ${benhNhan.gioiTinh}<br>
                        <strong>SĐT:</strong> ${benhNhan.soDienThoai}<br>
                        <strong>Địa chỉ:</strong> ${benhNhan.diaChi || '-'}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('thongTinBenhNhan').innerHTML = html;
        
        // Lưu mã bệnh nhân đã chọn
        document.getElementById('formTaoDotKham').dataset.maBenhNhan = benhNhan.maBenhNhan;
        
        // Enable form fields
        document.getElementById('maPhongKham').disabled = false;
        document.getElementById('maBacSi').disabled = false;
        document.getElementById('lyDoKham').disabled = false;
        document.getElementById('ngayKham').disabled = false;
        document.getElementById('gioKham').disabled = false;
        document.getElementById('nhipTim').disabled = false;
        document.getElementById('huyetApTamThu').disabled = false;
        document.getElementById('huyetApTamTruong').disabled = false;
        document.getElementById('nhietDo').disabled = false;
        document.getElementById('nhipTho').disabled = false;
        document.getElementById('canNang').disabled = false;
        document.getElementById('btnTaoLuotKham').disabled = false;
    },
    
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    },
    
    async autoFillFromDatKham(params) {
        try {
            App.showLoading();
            
            // Lấy thông tin bệnh nhân
            const bnResponse = await API.get(`/benh-nhan/${params.maBenhNhan}`);
            if (!bnResponse.success || !bnResponse.data) {
                throw new Error('Không tìm thấy thông tin bệnh nhân');
            }
            
            const benhNhan = bnResponse.data;
            
            // Lấy thông tin đợt khám đã tạo
            const dotKhamResponse = await API.get(`/dot-kham/${params.maDotKham}`);
            if (!dotKhamResponse.success || !dotKhamResponse.data) {
                throw new Error('Không tìm thấy thông tin đợt khám');
            }
            
            const dotKham = dotKhamResponse.data;
            
            // Hiển thị alert thông báo
            const alertHtml = `
                <div class="alert alert-info alert-dismissible fade show" role="alert">
                    <i class="bi bi-info-circle"></i> 
                    <strong>Đợt khám đã được tạo từ yêu cầu đặt khám online!</strong><br>
                    Vui lòng chọn <strong>Bác sĩ</strong>, nhập <strong>Chỉ số sự sống</strong> và nhấn <strong>"Cập nhật chỉ số"</strong> để hoàn tất.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            
            document.querySelector('.card-body').insertAdjacentHTML('afterbegin', alertHtml);
            
            // Tự động điền thông tin bệnh nhân
            this.chonBenhNhan(benhNhan);
            
            // Điền thông tin đợt khám
            if (dotKham.maPhongKham) {
                document.getElementById('maPhongKham').value = dotKham.maPhongKham;
            }
            
            if (dotKham.maBacSi) {
                document.getElementById('maBacSi').value = dotKham.maBacSi;
            }
            
            if (dotKham.lyDoKham) {
                document.getElementById('lyDoKham').value = dotKham.lyDoKham;
            }
            
            // Lưu mã đợt khám và mã yêu cầu vào form để cập nhật sau
            const form = document.getElementById('formTaoDotKham');
            form.dataset.maDotKham = params.maDotKham;
            form.dataset.maYeuCau = params.maYeuCau || '';
            form.dataset.updateMode = 'true';  // Chế độ cập nhật, không tạo mới
            
            // Đổi text nút submit
            const btnSubmit = document.getElementById('btnTaoLuotKham');
            btnSubmit.innerHTML = '<i class="bi bi-check-circle"></i> Cập nhật chỉ số';
            
            // Focus vào ô nhập chỉ số đầu tiên
            setTimeout(() => {
                document.getElementById('nhipTim').focus();
            }, 500);
            
            App.showToast('Đã tải thông tin đợt khám. Hãy chọn bác sĩ và nhập chỉ số sự sống!', 'info');
            
        } catch (error) {
            console.error('Error auto-filling:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    async taoLuotKham() {
        try {
            const form = document.getElementById('formTaoDotKham');
            const maBenhNhan = form.dataset.maBenhNhan;
            const updateMode = form.dataset.updateMode === 'true';
            const maDotKham = form.dataset.maDotKham;
            
            if (!maBenhNhan) {
                App.showToast('Vui lòng chọn bệnh nhân', 'warning');
                return;
            }
            
            App.showLoading();
            
            // Nếu là chế độ cập nhật (từ đặt khám online)
            if (updateMode && maDotKham) {
                // Chỉ cập nhật chỉ số sức sống
                const nhipTim = document.getElementById('nhipTim').value;
                const huyetApTamThu = document.getElementById('huyetApTamThu').value;
                const huyetApTamTruong = document.getElementById('huyetApTamTruong').value;
                const nhietDo = document.getElementById('nhietDo').value;
                const nhipTho = document.getElementById('nhipTho').value;
                const canNang = document.getElementById('canNang').value;
                
                // Kiểm tra bác sĩ đã chọn chưa
                const maBacSi = document.getElementById('maBacSi').value;
                if (!maBacSi) {
                    App.showToast('Vui lòng chọn bác sĩ', 'warning');
                    App.hideLoading();
                    return;
                }
                
                if (!nhipTim && !huyetApTamThu && !huyetApTamTruong && !nhietDo && !nhipTho && !canNang) {
                    App.showToast('Vui lòng nhập ít nhất một chỉ số sự sống', 'warning');
                    App.hideLoading();
                    return;
                }
                
                // Lấy lý do khám từ form
                const lyDoKham = document.getElementById('lyDoKham').value.trim() || 'Khám theo đặt lịch online';
                
                // Cập nhật bác sĩ và trạng thái cho đợt khám
                const updateDotKhamPayload = {
                    MaDotKham: maDotKham,
                    MaBacSi: maBacSi,
                    LyDoKham: lyDoKham,
                    TrangThai: 'Chờ khám'
                };
                
                console.log('=== UPDATE DOT KHAM PAYLOAD ===', updateDotKhamPayload);
                
                const updateDotKhamResponse = await API.put(`/dot-kham/${maDotKham}`, updateDotKhamPayload);
                
                console.log('=== UPDATE DOT KHAM RESPONSE ===', updateDotKhamResponse);
                
                if (!updateDotKhamResponse.success) {
                    console.error('=== UPDATE FAILED ===', updateDotKhamResponse);
                    throw new Error('Không thể cập nhật bác sĩ: ' + (updateDotKhamResponse.message || 'Unknown error'));
                }
                
                console.log('=== UPDATE SUCCESS - Creating ChiSoSuSong ===');
                
                const dataChiSo = {
                    MaDotKham: maDotKham,
                    NhipTim: nhipTim ? parseInt(nhipTim) : null,
                    HuyetApTamThu: huyetApTamThu ? parseInt(huyetApTamThu) : null,
                    HuyetApTamTruong: huyetApTamTruong ? parseInt(huyetApTamTruong) : null,
                    NhietDo: nhietDo ? parseFloat(nhietDo) : null,
                    NhipTho: nhipTho ? parseInt(nhipTho) : null,
                    CanNang: canNang ? parseFloat(canNang) : null
                };
                
                const response = await API.post('/chi-so-su-song', dataChiSo);
                
                if (response.success) {
                    App.showToast('Cập nhật chỉ số sự sống thành công! Đợt khám đã sẵn sàng cho bác sĩ.', 'success');
                    
                    // Chuyển về trang quản lý đặt khám hoặc bệnh nhân chờ khám
                    setTimeout(() => {
                        App.navigate('dat-kham');
                    }, 1500);
                } else {
                    throw new Error(response.message || 'Không thể cập nhật chỉ số sự sống');
                }
                
                return;
            }
            
            // ===== LUỒNG TẠO MỚI BÌNH THƯỜNG =====
            const maPhongKham = document.getElementById('maPhongKham').value;
            const maBacSi = document.getElementById('maBacSi').value;
            const lyDoKham = document.getElementById('lyDoKham').value.trim();
            
            if (!maPhongKham || !maBacSi) {
                App.showToast('Vui lòng chọn phòng khám và bác sĩ', 'warning');
                App.hideLoading();
                return;
            }
            
            // Tạo đợt khám
            const dataDotKham = {
                MaBenhNhan: maBenhNhan,
                MaPhongKham: maPhongKham,
                MaBacSi: maBacSi,
                LyDoKham: lyDoKham || null,
                TrangThai: 'Chờ khám'
            };
            
            const responseDotKham = await API.post('/dot-kham', dataDotKham);
            
            if (!responseDotKham.success) {
                throw new Error(responseDotKham.message || 'Không thể tạo lượt khám');
            }
            
            const newMaDotKham = responseDotKham.data.maDotKham;
            
            // Lưu chỉ số sức sống (nếu có nhập)
            const nhipTim = document.getElementById('nhipTim').value;
            const huyetApTamThu = document.getElementById('huyetApTamThu').value;
            const huyetApTamTruong = document.getElementById('huyetApTamTruong').value;
            const nhietDo = document.getElementById('nhietDo').value;
            const nhipTho = document.getElementById('nhipTho').value;
            const canNang = document.getElementById('canNang').value;
            
            if (nhipTim || huyetApTamThu || huyetApTamTruong || nhietDo || nhipTho || canNang) {
                const dataChiSo = {
                    MaDotKham: newMaDotKham,
                    NhipTim: nhipTim ? parseInt(nhipTim) : null,
                    HuyetApTamThu: huyetApTamThu ? parseInt(huyetApTamThu) : null,
                    HuyetApTamTruong: huyetApTamTruong ? parseInt(huyetApTamTruong) : null,
                    NhietDo: nhietDo ? parseFloat(nhietDo) : null,
                    NhipTho: nhipTho ? parseInt(nhipTho) : null,
                    CanNang: canNang ? parseFloat(canNang) : null
                };
                
                await API.post('/chi-so-su-song', dataChiSo);
            }
            
            App.showToast('Tạo lượt khám thành công!', 'success');
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Error:', error);
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },
    
    resetForm() {
        const form = document.getElementById('formTaoDotKham');
        form.reset();
        form.removeAttribute('data-ma-benh-nhan');
        form.removeAttribute('data-ma-dot-kham');
        form.removeAttribute('data-ma-yeu-cau');
        form.removeAttribute('data-update-mode');
        
        document.getElementById('thongTinBenhNhan').innerHTML = `
            <i class="bi bi-info-circle"></i> Chưa chọn bệnh nhân
        `;
        document.getElementById('thongTinBenhNhan').className = 'alert alert-secondary';
        
        // Disable fields again
        document.getElementById('maPhongKham').disabled = true;
        document.getElementById('maBacSi').disabled = true;
        document.getElementById('lyDoKham').disabled = true;
        document.getElementById('ngayKham').disabled = true;
        document.getElementById('gioKham').disabled = true;
        document.getElementById('nhipTim').disabled = true;
        document.getElementById('huyetApTamThu').disabled = true;
        document.getElementById('huyetApTamTruong').disabled = true;
        document.getElementById('nhietDo').disabled = true;
        document.getElementById('nhipTho').disabled = true;
        document.getElementById('canNang').disabled = true;
        document.getElementById('btnTaoLuotKham').disabled = true;
        
        // Reset button text
        document.getElementById('btnTaoLuotKham').innerHTML = '<i class="bi bi-check-circle"></i> Tạo lượt khám';
        
        // Set default date again
        document.getElementById('ngayKham').valueAsDate = new Date();
    }
};
