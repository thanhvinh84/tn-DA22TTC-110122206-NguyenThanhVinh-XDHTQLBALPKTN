// Quản lý Bệnh nhân chờ khám (cho Bác sĩ)
const BenhNhanChoKham = {
    currentData: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        // Lấy thông tin user hiện tại
        const user = Auth.getUser();
        if (!user || user.maVaiTro !== 'VT_BACSI') {
            content.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Bạn không có quyền truy cập trang này. Chỉ bác sĩ mới có thể xem danh sách bệnh nhân chờ khám.
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-people-fill"></i> Danh sách bệnh nhân chờ khám
                    </h5>
                    <div>
                        <span class="badge bg-info fs-6 me-2">
                            Tổng: <span id="totalBenhNhan">0</span> bệnh nhân
                        </span>
                        <button class="btn btn-outline-primary btn-sm" onclick="BenhNhanChoKham.loadData()">
                            <i class="bi bi-arrow-clockwise"></i> Làm mới
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <!-- Bộ lọc -->
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Lọc theo trạng thái</label>
                            <select class="form-select" id="filterTrangThai" onchange="BenhNhanChoKham.loadData()">
                                <option value="" selected>Tất cả</option>
                                <option value="Chờ khám">Chờ khám</option>
                                <option value="Đang khám">Đang khám</option>
                                <option value="Hoàn tất">Hoàn tất</option>
                            </select>
                        </div>
                    </div>

                    <!-- Bảng danh sách -->
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th width="100">Mã ĐK</th>
                                    <th>Họ tên BN</th>
                                    <th width="100">Giới tính</th>
                                    <th width="150">Thời gian đến</th>
                                    <th>Lý do khám</th>
                                    <th width="150">Phòng khám</th>
                                    <th width="120">Trạng thái</th>
                                    <th width="150" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="tableBenhNhanChoKham">
                                <tr>
                                    <td colspan="8" class="text-center py-4">
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

            <!-- Modal Chi tiết bệnh nhân -->
            <div class="modal fade" id="modalChiTiet" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-person-badge"></i> Thông tin bệnh nhân
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="chiTietContent">
                            <div class="text-center py-5">
                                <div class="spinner-border text-primary" role="status"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load data
        await this.loadData();
    },

    async loadData() {
        try {
            const user = Auth.getUser();
            const maBacSi = user.maNhanVien; // MaBacSi = MaNhanVien
            
            const trangThai = document.getElementById('filterTrangThai')?.value || '';
            
            let url = `/dot-kham/bac-si/${maBacSi}`;
            if (trangThai) {
                url += `?trangThai=${encodeURIComponent(trangThai)}`;
            }
            
            const response = await API.get(url);
            
            if (response.success) {
                this.currentData = response.data || [];
                this.renderTable(this.currentData);
                document.getElementById('totalBenhNhan').textContent = this.currentData.length;
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi tải dữ liệu: ' + error.message, 'error');
            document.getElementById('tableBenhNhanChoKham').innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> 
                        Không thể tải dữ liệu
                    </td>
                </tr>
            `;
        }
    },

    renderTable(data) {
        const tbody = document.getElementById('tableBenhNhanChoKham');
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-4">
                        <i class="bi bi-inbox"></i><br>
                        Không có bệnh nhân nào
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(dk => {
            const statusClass = 
                dk.trangThai === 'Hoàn tất' ? 'success' : 
                dk.trangThai === 'Đang khám' ? 'primary' : 
                dk.trangThai === 'Chờ khám' ? 'warning' : 'secondary';
            
            return `
                <tr class="fade-in">
                    <td><span class="badge bg-info">${dk.maDotKham || '-'}</span></td>
                    <td><strong>${dk.hoTenBenhNhan || '-'}</strong></td>
                    <td>
                        ${dk.gioiTinh ? 
                            `<span class="badge ${dk.gioiTinh === 'Nam' ? 'bg-primary' : 'bg-danger'}" style="${dk.gioiTinh === 'Nữ' ? 'background-color: #e83e8c !important;' : ''}">
                                <i class="bi ${dk.gioiTinh === 'Nam' ? 'bi-gender-male' : 'bi-gender-female'}"></i>
                                ${dk.gioiTinh}
                            </span>` 
                            : '-'
                        }
                    </td>
                    <td><small>${dk.thoiGianDen ? new Date(dk.thoiGianDen).toLocaleString('vi-VN') : '-'}</small></td>
                    <td>${dk.lyDoKham || '-'}</td>
                    <td><small>${dk.tenPhongKham || '-'}</small></td>
                    <td><span class="badge bg-${statusClass}">${dk.trangThai}</span></td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-outline-primary" 
                                    onclick="BenhNhanChoKham.xemChiTiet('${dk.maBenhNhan}')"
                                    title="Xem chi tiết">
                                <i class="bi bi-eye"></i>
                            </button>
                            ${dk.trangThai === 'Chờ khám' ? `
                                <button class="btn btn-outline-success" 
                                        onclick="BenhNhanChoKham.batDauKham('${dk.maDotKham}')"
                                        title="Bắt đầu khám">
                                    <i class="bi bi-play-circle"></i>
                                </button>
                            ` : ''}
                            ${dk.trangThai === 'Đang khám' ? `
                                <button class="btn btn-outline-primary" 
                                        onclick="KhamBenh.khamBenhNhan('${dk.maDotKham}')"
                                        title="Khám bệnh">
                                    <i class="bi bi-clipboard2-pulse"></i>
                                </button>
                            ` : ''}
                            ${dk.trangThai === 'Đang khám' ? `
                                <button class="btn btn-outline-info" 
                                        onclick="BenhNhanChoKham.hoanTatKham('${dk.maDotKham}')"
                                        title="Hoàn tất">
                                    <i class="bi bi-check-circle"></i>
                                </button>
                            ` : ''}
                            ${dk.trangThai === 'Hoàn tất' ? `
                                <button class="btn btn-outline-success" 
                                        onclick="PrintPhieuKham.inPhieuKham('${dk.maDotKham}')"
                                        title="In phiếu khám">
                                    <i class="bi bi-printer"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    async xemChiTiet(maBenhNhan) {
        try {
            App.showLoading();
            
            const response = await API.get(`/benh-nhan/${maBenhNhan}`);
            
            if (response.success && response.data) {
                const bn = response.data;
                
                const content = document.getElementById('chiTietContent');
                content.innerHTML = `
                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs mb-3" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="tab-thongtin" data-bs-toggle="tab" 
                                    data-bs-target="#content-thongtin" type="button">
                                <i class="bi bi-person-badge"></i> Thông tin cơ bản
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="tab-lichsu" data-bs-toggle="tab" 
                                    data-bs-target="#content-lichsu" type="button"
                                    onclick="BenhNhanChoKham.loadLichSuKham('${maBenhNhan}')">
                                <i class="bi bi-clock-history"></i> Lịch sử khám
                            </button>
                        </li>
                    </ul>

                    <!-- Tab content -->
                    <div class="tab-content">
                        <!-- Tab Thông tin cơ bản -->
                        <div class="tab-pane fade show active" id="content-thongtin">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="border-bottom pb-2 mb-3">
                                        <i class="bi bi-person-badge"></i> Thông tin cơ bản
                                    </h6>
                                    <table class="table table-sm">
                                        <tr><th width="150">Mã bệnh nhân:</th><td><span class="badge bg-primary">${bn.maBenhNhan}</span></td></tr>
                                        <tr><th>Họ và tên:</th><td><strong>${bn.hoTen}</strong></td></tr>
                                        <tr><th>Ngày sinh:</th><td>${bn.ngaySinh ? new Date(bn.ngaySinh).toLocaleDateString('vi-VN') : '-'}</td></tr>
                                        <tr><th>Giới tính:</th><td>${bn.gioiTinh || '-'}</td></tr>
                                        <tr><th>Số điện thoại:</th><td>${bn.soDienThoai || '-'}</td></tr>
                                        <tr><th>Email:</th><td>${bn.email || '-'}</td></tr>
                                        <tr><th>CCCD:</th><td>${bn.cccd || '-'}</td></tr>
                                        <tr><th>Địa chỉ:</th><td>${bn.diaChi || '-'}</td></tr>
                                        <tr><th>Số BHYT:</th><td>${bn.soBHYT || '-'}</td></tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="border-bottom pb-2 mb-3">
                                        <i class="bi bi-heart-pulse"></i> Thông tin y tế
                                    </h6>
                                    <div id="thongTinYTe">
                                        <div class="text-center py-3">
                                            <div class="spinner-border spinner-border-sm text-primary"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tab Lịch sử khám -->
                        <div class="tab-pane fade" id="content-lichsu">
                            <div id="lichSuKhamContent">
                                <div class="text-center py-4">
                                    <p class="text-muted">Click vào tab để tải lịch sử khám</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Load thông tin y tế (dùng maBenhNhan thay vì maHoSo)
                this.loadThongTinYTe(bn.maBenhNhan);
                
                const modal = new bootstrap.Modal(document.getElementById('modalChiTiet'));
                modal.show();
            }
        } catch (error) {
            App.showToast('Lỗi xem chi tiết: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async loadThongTinYTe(maBenhNhan) {
        try {
            // Lấy hồ sơ bệnh án theo maBenhNhan
            const response = await API.get(`/ho-so/by-benh-nhan/${maBenhNhan}`);
            const container = document.getElementById('thongTinYTe');
            
            if (response.success && response.data) {
                const hs = response.data;
                container.innerHTML = `
                    <table class="table table-sm">
                        <tr><th width="150">Nhóm máu:</th><td>${hs.nhomMau || '-'}</td></tr>
                        <tr><th>Tiền sử bệnh:</th><td>${hs.tienSuBenh || '-'}</td></tr>
                        <tr><th>Ghi chú:</th><td>${hs.ghiChu || '-'}</td></tr>
                    </table>
                    
                    <h6 class="border-bottom pb-2 mb-2 mt-3">
                        <i class="bi bi-exclamation-triangle"></i> Thông tin dị ứng
                    </h6>
                    <div id="danhSachDiUng">
                        <div class="text-center py-2">
                            <div class="spinner-border spinner-border-sm text-primary"></div>
                        </div>
                    </div>
                `;
                
                // Load danh sách dị ứng
                this.loadDanhSachDiUng(maBenhNhan);
            } else {
                container.innerHTML = '<p class="text-muted">Chưa có thông tin y tế</p>';
            }
        } catch (error) {
            console.error('Error loading thong tin y te:', error);
            document.getElementById('thongTinYTe').innerHTML = '<p class="text-muted">Chưa có thông tin y tế</p>';
        }
    },

    async loadDanhSachDiUng(maBenhNhan) {
        try {
            const response = await API.get(`/di-ung/benh-nhan/${maBenhNhan}`);
            const container = document.getElementById('danhSachDiUng');
            
            if (response.success && response.data && response.data.length > 0) {
                container.innerHTML = response.data.map(du => {
                    const severityClass = 
                        du.mucDoDiUng === 'Nghiêm trọng' ? 'danger' :
                        du.mucDoDiUng === 'Trung bình' ? 'warning' : 'info';
                    
                    return `
                        <div class="alert alert-${severityClass} alert-sm mb-2">
                            <strong>${du.tenDiUng}</strong>
                            <span class="badge bg-${severityClass} ms-2">${du.mucDoDiUng}</span>
                            ${du.bieuHien ? `<br><small>Biểu hiện: ${du.bieuHien}</small>` : ''}
                            ${du.tacNhan ? `<br><small>Tác nhân: ${du.tacNhan}</small>` : ''}
                        </div>
                    `;
                }).join('');
            } else {
                container.innerHTML = '<p class="text-muted small">Không có thông tin dị ứng</p>';
            }
        } catch (error) {
            console.error('Error loading di ung:', error);
            document.getElementById('danhSachDiUng').innerHTML = '<p class="text-muted small">Không thể tải thông tin</p>';
        }
    },

    async loadLichSuKham(maBenhNhan) {
        try {
            const container = document.getElementById('lichSuKhamContent');
            container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary"></div></div>';
            
            // Lấy hồ sơ bệnh án trước để có maHoSo
            const hoSoResponse = await API.get(`/ho-so/by-benh-nhan/${maBenhNhan}`);
            
            if (!hoSoResponse.success || !hoSoResponse.data) {
                container.innerHTML = `
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> Bệnh nhân chưa có hồ sơ bệnh án
                    </div>
                `;
                return;
            }
            
            const maHoSo = hoSoResponse.data.maHoSo;
            
            // Lấy lịch sử khám theo maHoSo
            const response = await API.get(`/dot-kham/ho-so/${maHoSo}`);
            
            if (response.success && response.data && response.data.length > 0) {
                const dotKhamList = response.data.sort((a, b) => 
                    new Date(b.thoiGianDen) - new Date(a.thoiGianDen)
                );
                
                container.innerHTML = `
                    <div class="accordion" id="accordionLichSu">
                        ${dotKhamList.map((dk, index) => `
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" 
                                            data-bs-toggle="collapse" data-bs-target="#collapse${dk.maDotKham}">
                                        <div class="d-flex justify-content-between w-100 me-3">
                                            <span>
                                                <i class="bi bi-calendar-event"></i>
                                                <strong>${new Date(dk.thoiGianDen).toLocaleDateString('vi-VN')}</strong>
                                                - ${dk.lyDoKham || 'Khám bệnh'}
                                            </span>
                                            <span class="badge bg-${dk.trangThai === 'Hoàn tất' ? 'success' : 'warning'}">
                                                ${dk.trangThai}
                                            </span>
                                        </div>
                                    </button>
                                </h2>
                                <div id="collapse${dk.maDotKham}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                                     data-bs-parent="#accordionLichSu">
                                    <div class="accordion-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <p><strong>Bác sĩ:</strong> ${dk.tenBacSi || '-'}</p>
                                                <p><strong>Phòng khám:</strong> ${dk.tenPhongKham || '-'}</p>
                                                <p><strong>Thời gian:</strong> ${new Date(dk.thoiGianDen).toLocaleString('vi-VN')}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p><strong>Lý do khám:</strong> ${dk.lyDoKham || '-'}</p>
                                                <p><strong>Trạng thái:</strong> <span class="badge bg-${dk.trangThai === 'Hoàn tất' ? 'success' : 'warning'}">${dk.trangThai}</span></p>
                                            </div>
                                        </div>
                                        
                                        <div class="mt-3" id="chiTiet${dk.maDotKham}">
                                            <button class="btn btn-sm btn-outline-primary" 
                                                    onclick="BenhNhanChoKham.loadChiTietDotKham('${dk.maDotKham}')">
                                                <i class="bi bi-eye"></i> Xem chi tiết khám
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> Chưa có lịch sử khám bệnh
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading lich su kham:', error);
            document.getElementById('lichSuKhamContent').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> Không thể tải lịch sử khám: ${error.message}
                </div>
            `;
        }
    },

    async loadChiTietDotKham(maDotKham) {
        try {
            const container = document.getElementById(`chiTiet${maDotKham}`);
            container.innerHTML = '<div class="text-center py-2"><div class="spinner-border spinner-border-sm text-primary"></div></div>';
            
            // Load chẩn đoán, đơn thuốc, kết quả CLS
            const [chanDoanRes, donThuocRes, ketQuaRes] = await Promise.all([
                API.get(`/chan-doan/dot-kham/${maDotKham}`),
                API.get(`/don-thuoc/dot-kham/${maDotKham}`),
                API.get(`/ket-qua/dot-kham/${maDotKham}`)
            ]);
            
            let html = '<div class="mt-3">';
            
            // Chẩn đoán
            html += '<h6 class="border-bottom pb-2 mb-2"><i class="bi bi-clipboard2-pulse"></i> Chẩn đoán</h6>';
            if (chanDoanRes.success && chanDoanRes.data && chanDoanRes.data.length > 0) {
                html += '<ul class="list-unstyled">';
                chanDoanRes.data.forEach(cd => {
                    html += `<li class="mb-2">
                        <span class="badge bg-info">${cd.loai || 'Chẩn đoán'}</span>
                        <strong>${cd.tenBenh || cd.noiDungChanDoan || '-'}</strong>
                        ${cd.noiDungChanDoan && cd.tenBenh ? `<br><small class="text-muted">${cd.noiDungChanDoan}</small>` : ''}
                    </li>`;
                });
                html += '</ul>';
            } else {
                html += '<p class="text-muted small">Chưa có chẩn đoán</p>';
            }
            
            // Đơn thuốc
            html += '<h6 class="border-bottom pb-2 mb-2 mt-3"><i class="bi bi-capsule"></i> Đơn thuốc</h6>';
            if (donThuocRes.success && donThuocRes.data && donThuocRes.data.length > 0) {
                donThuocRes.data.forEach(dt => {
                    html += `<div class="card mb-2">
                        <div class="card-body p-2">
                            <small><strong>Ngày kê:</strong> ${dt.ngayLap ? new Date(dt.ngayLap).toLocaleDateString('vi-VN') : '-'}</small>
                            ${dt.chiTiet && dt.chiTiet.length > 0 ? `
                                <table class="table table-sm table-bordered mt-2 mb-0">
                                    <thead><tr><th>Thuốc</th><th>Liều dùng</th><th>Cách dùng</th><th>SL</th></tr></thead>
                                    <tbody>
                                        ${dt.chiTiet.map(ct => `
                                            <tr>
                                                <td>${ct.tenThuoc || '-'}</td>
                                                <td><small>${ct.lieuDung || '-'}</small></td>
                                                <td><small>${ct.cachDung || '-'}</small></td>
                                                <td>${ct.soLuong || '-'}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            ` : '<p class="text-muted small mb-0">Chưa có chi tiết</p>'}
                        </div>
                    </div>`;
                });
            } else {
                html += '<p class="text-muted small">Chưa có đơn thuốc</p>';
            }
            
            // Kết quả CLS
            html += '<h6 class="border-bottom pb-2 mb-2 mt-3"><i class="bi bi-file-earmark-medical"></i> Kết quả CLS</h6>';
            if (ketQuaRes.success && ketQuaRes.data && ketQuaRes.data.length > 0) {
                ketQuaRes.data.forEach(kq => {
                    const images = kq.hinhAnhKetQua ? kq.hinhAnhKetQua.split(';').filter(img => img.trim()) : [];
                    
                    html += `<div class="card mb-2">
                        <div class="card-body p-2">
                            <div class="mb-1">
                                <strong class="text-primary">${kq.tenDichVu || 'Xét nghiệm'}</strong>
                                ${kq.loaiDichVu ? `<span class="badge bg-secondary ms-1" style="font-size: 0.7rem;">${kq.loaiDichVu}</span>` : ''}
                            </div>
                            <small class="text-muted">Kết luận:</small>
                            <div class="small mb-1">${kq.ketLuan || 'Chưa có kết luận'}</div>
                            ${kq.ketQua ? `<small class="text-muted">Chi tiết:</small><div class="small mb-1">${kq.ketQua}</div>` : ''}
                            ${kq.ghiChu ? `<small class="text-muted">Ghi chú:</small><div class="small mb-1">${kq.ghiChu}</div>` : ''}`;
                    
                    if (images.length > 0) {
                        html += '<div class="mt-2"><small class="text-muted d-block mb-1">Hình ảnh:</small><div class="d-flex flex-wrap gap-1">';
                        images.forEach(img => {
                            const ext = img.split('.').pop().toLowerCase();
                            if (ext === 'pdf') {
                                html += `<a href="${img}" target="_blank" class="btn btn-sm btn-outline-danger" style="font-size: 0.7rem; padding: 0.2rem 0.4rem;">
                                    <i class="bi bi-file-pdf"></i> PDF
                                </a>`;
                            } else if (ext === 'doc' || ext === 'docx') {
                                html += `<a href="${img}" target="_blank" class="btn btn-sm btn-outline-primary" style="font-size: 0.7rem; padding: 0.2rem 0.4rem;">
                                    <i class="bi bi-file-word"></i> Word
                                </a>`;
                            } else {
                                html += `<a href="${img}" target="_blank">
                                    <img src="${img}" alt="KQ" class="img-thumbnail" style="max-width: 80px; max-height: 80px; object-fit: cover;">
                                </a>`;
                            }
                        });
                        html += '</div></div>';
                    }
                    
                    html += `</div>
                    </div>`;
                });
            } else {
                html += '<p class="text-muted small">Chưa có kết quả CLS</p>';
            }
            
            html += '</div>';
            container.innerHTML = html;
            
        } catch (error) {
            console.error('Error loading chi tiet dot kham:', error);
            document.getElementById(`chiTiet${maDotKham}`).innerHTML = `
                <div class="alert alert-danger alert-sm">
                    <i class="bi bi-exclamation-triangle"></i> Không thể tải chi tiết: ${error.message}
                </div>
            `;
        }
    },

    async batDauKham(maDotKham) {
        if (!confirm('Bắt đầu khám bệnh nhân này?')) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.put(`/dot-kham/${maDotKham}/trang-thai`, {
                TrangThai: 'Đang khám'
            });
            
            if (response.success) {
                App.showToast('Đã chuyển sang trạng thái "Đang khám"', 'success');
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

    async hoanTatKham(maDotKham) {
        if (!confirm('Hoàn tất khám bệnh nhân này?')) {
            return;
        }
        
        try {
            App.showLoading();
            
            // Cập nhật trạng thái đợt khám
            const response = await API.put(`/dot-kham/${maDotKham}/trang-thai`, {
                TrangThai: 'Hoàn tất'
            });
            
            if (response.success) {
                // Tự động tạo hóa đơn sau khi hoàn tất khám
                try {
                    // Lấy thông tin đợt khám để tạo hóa đơn
                    const dotKhamRes = await API.get(`/dot-kham/${maDotKham}`);
                    if (dotKhamRes.success && dotKhamRes.data) {
                        const dotKham = dotKhamRes.data;
                        
                        // Tạo hóa đơn
                        const hoaDonData = {
                            MaDotKham: maDotKham,
                            MaHoSo: dotKham.maHoSo,
                            NgayLap: new Date().toISOString(),
                            TongTien: 200000, // Phí khám cơ bản, có thể tính toán thêm từ đơn thuốc và CLS
                            TrangThai: 'Chưa thanh toán'
                        };
                        
                        const hoaDonRes = await API.post('/hoa-don', hoaDonData);
                        
                        if (hoaDonRes.success) {
                            App.showToast('Đã hoàn tất khám và tạo hóa đơn!', 'success');
                        } else {
                            App.showToast('Đã hoàn tất khám nhưng không thể tạo hóa đơn', 'warning');
                        }
                    }
                } catch (hoaDonError) {
                    console.error('Error creating invoice:', hoaDonError);
                    App.showToast('Đã hoàn tất khám nhưng có lỗi khi tạo hóa đơn', 'warning');
                }
                
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể cập nhật trạng thái');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
