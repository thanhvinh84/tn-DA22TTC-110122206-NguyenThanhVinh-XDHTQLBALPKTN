// Tra cứu hồ sơ bệnh án
const TraCuuHoSo = {
    currentPatient: null,
    currentHoSo: null,
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="row">
                <!-- Phần tìm kiếm -->
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                <i class="bi bi-search"></i> Tìm kiếm bệnh nhân
                            </h5>
                        </div>
                        <div class="card-body">
                            <form id="formTimKiem" onsubmit="TraCuuHoSo.timKiem(event)">
                                <div class="mb-3">
                                    <label class="form-label">Loại tìm kiếm</label>
                                    <select class="form-select" id="loaiTimKiem">
                                        <option value="maBenhNhan">Mã bệnh nhân</option>
                                        <option value="hoTen">Họ tên</option>
                                        <option value="cccd">Số CCCD</option>
                                        <option value="soDienThoai">Số điện thoại</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Từ khóa</label>
                                    <input type="text" class="form-control" id="tuKhoa" 
                                           placeholder="Nhập từ khóa tìm kiếm..." required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">
                                    <i class="bi bi-search"></i> Tìm kiếm
                                </button>
                            </form>
                            
                            <!-- Kết quả tìm kiếm -->
                            <div id="ketQuaTimKiem" class="mt-3"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Phần hiển thị thông tin -->
                <div class="col-md-8">
                    <div id="thongTinBenhNhan">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body text-center py-5">
                                <i class="bi bi-search text-muted" style="font-size: 4rem;"></i>
                                <p class="text-muted mt-3">Vui lòng tìm kiếm bệnh nhân để xem hồ sơ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async timKiem(event) {
        event.preventDefault();
        
        try {
            App.showLoading();
            
            const loaiTimKiem = document.getElementById('loaiTimKiem').value;
            const tuKhoa = document.getElementById('tuKhoa').value.trim();
            
            if (!tuKhoa) {
                App.showToast('Vui lòng nhập từ khóa tìm kiếm', 'warning');
                return;
            }
            
            // Gọi API tìm kiếm
            let response;
            if (loaiTimKiem === 'maBenhNhan') {
                response = await API.get(`/benh-nhan/${tuKhoa}`);
                if (response.success && response.data) {
                    this.hienThiKetQua([response.data]);
                } else {
                    this.hienThiKetQua([]);
                }
            } else {
                response = await API.get(`/benh-nhan`);
                if (response.success && response.data) {
                    // Filter theo loại tìm kiếm
                    const filtered = response.data.filter(bn => {
                        const value = bn[loaiTimKiem]?.toString().toLowerCase() || '';
                        return value.includes(tuKhoa.toLowerCase());
                    });
                    this.hienThiKetQua(filtered);
                } else {
                    this.hienThiKetQua([]);
                }
            }
            
        } catch (error) {
            console.error('Error searching:', error);
            App.showToast('Lỗi tìm kiếm: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    hienThiKetQua(danhSach) {
        const container = document.getElementById('ketQuaTimKiem');
        
        if (!danhSach || danhSach.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info mt-3">
                    <i class="bi bi-info-circle"></i> Không tìm thấy bệnh nhân nào
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="mt-3">
                <h6 class="border-bottom pb-2">Kết quả tìm kiếm (${danhSach.length})</h6>
                <div class="list-group">
                    ${danhSach.map(bn => `
                        <a href="#" class="list-group-item list-group-item-action" 
                           onclick="TraCuuHoSo.xemHoSo('${bn.maBenhNhan}'); return false;">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">${bn.hoTen}</h6>
                                <small class="badge bg-primary">${bn.maBenhNhan}</small>
                            </div>
                            <small class="text-muted">
                                <i class="bi bi-telephone"></i> ${bn.soDienThoai || '-'}
                            </small>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    },

    async xemHoSo(maBenhNhan) {
        try {
            App.showLoading();
            
            // Lấy thông tin bệnh nhân
            const bnResponse = await API.get(`/benh-nhan/${maBenhNhan}`);
            if (!bnResponse.success || !bnResponse.data) {
                throw new Error('Không tìm thấy thông tin bệnh nhân');
            }
            
            this.currentPatient = bnResponse.data;
            
            // Lấy hồ sơ bệnh án
            const hsResponse = await API.get(`/ho-so/by-benh-nhan/${maBenhNhan}`);
            this.currentHoSo = hsResponse.success ? hsResponse.data : null;
            
            // Lấy lịch sử khám
            let lichSuKham = [];
            if (this.currentHoSo) {
                const lsResponse = await API.get(`/dot-kham/ho-so/${this.currentHoSo.maHoSo}`);
                lichSuKham = lsResponse.success ? lsResponse.data : [];
            }
            
            // Kiểm tra quyền truy cập cho các đợt khám từ phòng khám khác
            const user = Auth.getUser();
            const maPhongKhamHienTai = user.maPhongKham;
            
            // Nhóm đợt khám theo phòng khám
            const dotKhamTheoPhongKham = {};
            lichSuKham.forEach(dk => {
                const pkId = dk.maPhongKham || 'unknown';
                if (!dotKhamTheoPhongKham[pkId]) {
                    dotKhamTheoPhongKham[pkId] = [];
                }
                dotKhamTheoPhongKham[pkId].push(dk);
            });
            
            // Kiểm tra quyền truy cập cho từng phòng khám
            const quyenTruyCap = {};
            for (const maPhongKham in dotKhamTheoPhongKham) {
                if (maPhongKham !== maPhongKhamHienTai && maPhongKham !== 'unknown') {
                    try {
                        const quyenRes = await API.get(`/yeu-cau-truy-cap/kiem-tra-quyen?maBenhNhan=${maBenhNhan}&maPhongKham=${maPhongKham}`);
                        if (quyenRes.success && quyenRes.data) {
                            quyenTruyCap[maPhongKham] = quyenRes.data;
                        }
                    } catch (error) {
                        console.error('Error checking permission:', error);
                    }
                }
            }
            
            // Hiển thị thông tin với thông tin quyền truy cập
            this.hienThiThongTin(this.currentPatient, this.currentHoSo, lichSuKham, quyenTruyCap, maPhongKhamHienTai);
            
        } catch (error) {
            console.error('Error loading medical record:', error);
            App.showToast('Lỗi tải hồ sơ: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    hienThiThongTin(benhNhan, hoSo, lichSuKham, quyenTruyCap = {}, maPhongKhamHienTai = null) {
        const container = document.getElementById('thongTinBenhNhan');
        
        container.innerHTML = `
            <div class="card border-0 shadow-sm mb-3">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-person-badge"></i> Thông tin bệnh nhân
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <table class="table table-sm table-borderless">
                                <tr><th width="150">Mã bệnh nhân:</th><td><span class="badge bg-primary">${benhNhan.maBenhNhan}</span></td></tr>
                                <tr><th>Họ và tên:</th><td><strong>${benhNhan.hoTen}</strong></td></tr>
                                <tr><th>Ngày sinh:</th><td>${benhNhan.ngaySinh ? new Date(benhNhan.ngaySinh).toLocaleDateString('vi-VN') : '-'}</td></tr>
                                <tr><th>Giới tính:</th><td>${benhNhan.gioiTinh || '-'}</td></tr>
                                <tr><th>Số điện thoại:</th><td>${benhNhan.soDienThoai || '-'}</td></tr>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <table class="table table-sm table-borderless">
                                <tr><th width="150">Email:</th><td>${benhNhan.email || '-'}</td></tr>
                                <tr><th>CCCD:</th><td>${benhNhan.cccd || '-'}</td></tr>
                                <tr><th>Địa chỉ:</th><td>${benhNhan.diaChi || '-'}</td></tr>
                                <tr><th>Số BHYT:</th><td>${benhNhan.soBHYT || '-'}</td></tr>
                                <tr><th>Nghề nghiệp:</th><td>${benhNhan.ngheNghiep || '-'}</td></tr>
                            </table>
                        </div>
                    </div>
                    
                    ${hoSo ? `
                        <div class="border-top pt-3 mt-3">
                            <h6><i class="bi bi-heart-pulse"></i> Thông tin y tế</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Nhóm máu:</strong> ${hoSo.nhomMau || '-'}</p>
                                    <p><strong>Tiền sử bệnh:</strong> ${hoSo.tienSuBenh || '-'}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Ghi chú:</strong> ${hoSo.ghiChu || '-'}</p>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white">
                    <h5 class="mb-0">
                        <i class="bi bi-clock-history"></i> Lịch sử khám bệnh
                        <span class="badge bg-info ms-2">${lichSuKham.length} lượt</span>
                    </h5>
                </div>
                <div class="card-body">
                    ${lichSuKham.length > 0 ? `
                        <div class="accordion" id="accordionLichSu">
                            ${lichSuKham.sort((a, b) => new Date(b.thoiGianDen) - new Date(a.thoiGianDen)).map((dk, index) => {
                                const laPhongKhamKhac = maPhongKhamHienTai && dk.maPhongKham && dk.maPhongKham !== maPhongKhamHienTai;
                                const quyen = quyenTruyCap[dk.maPhongKham];
                                const coQuyen = quyen && quyen.coQuyen;
                                
                                return `
                                <div class="accordion-item ${laPhongKhamKhac && !coQuyen ? 'border-warning' : ''}">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button ${index !== 0 ? 'collapsed' : ''} ${laPhongKhamKhac && !coQuyen ? 'bg-warning bg-opacity-10' : ''}" type="button" 
                                                data-bs-toggle="collapse" data-bs-target="#collapse${dk.maDotKham}">
                                            <div class="d-flex justify-content-between w-100 me-3 align-items-center">
                                                <span>
                                                    ${laPhongKhamKhac ? '<i class="bi bi-lock-fill text-warning me-2"></i>' : '<i class="bi bi-calendar-event me-2"></i>'}
                                                    <strong>${new Date(dk.thoiGianDen).toLocaleDateString('vi-VN')}</strong>
                                                    - ${dk.lyDoKham || 'Khám bệnh'}
                                                    ${laPhongKhamKhac ? `<span class="badge bg-warning text-dark ms-2"><i class="bi bi-building"></i> ${dk.tenPhongKham || 'Phòng khám khác'}</span>` : ''}
                                                </span>
                                                <span class="badge bg-${dk.trangThai === 'Hoàn tất' ? 'success' : dk.trangThai === 'Đang khám' ? 'primary' : 'warning'}">
                                                    ${dk.trangThai}
                                                </span>
                                            </div>
                                        </button>
                                    </h2>
                                    <div id="collapse${dk.maDotKham}" class="accordion-collapse collapse ${index === 0 && !laPhongKhamKhac ? 'show' : ''}" 
                                         data-bs-parent="#accordionLichSu">
                                        <div class="accordion-body">
                                            ${laPhongKhamKhac && !coQuyen ? `
                                                <div class="alert alert-warning">
                                                    <i class="bi bi-shield-lock"></i>
                                                    <strong>Đợt khám từ phòng khám khác</strong><br>
                                                    Bạn cần xin phép bác sĩ đã khám để xem chi tiết hồ sơ này.
                                                    <button class="btn btn-sm btn-warning mt-2" onclick="TraCuuHoSo.guiYeuCauTruyCap('${benhNhan.maBenhNhan}', '${dk.maBacSi}', '${dk.maPhongKham}')">
                                                        <i class="bi bi-send"></i> Gửi yêu cầu truy cập
                                                    </button>
                                                </div>
                                            ` : `
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <p><strong>Bác sĩ:</strong> ${dk.tenBacSi || dk.hoTenBacSi || '-'}</p>
                                                        <p><strong>Phòng khám:</strong> ${dk.tenPhongKham || '-'}</p>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <p><strong>Thời gian:</strong> ${new Date(dk.thoiGianDen).toLocaleString('vi-VN')}</p>
                                                        <p><strong>Trạng thái:</strong> <span class="badge bg-${dk.trangThai === 'Hoàn tất' ? 'success' : 'warning'}">${dk.trangThai}</span></p>
                                                    </div>
                                                </div>
                                                
                                                ${laPhongKhamKhac && coQuyen ? `
                                                    <div class="alert alert-success alert-sm mb-3">
                                                        <i class="bi bi-check-circle"></i>
                                                        Bạn có quyền xem: <strong>${quyen.loaiQuyen}</strong>
                                                        (Hết hạn: ${new Date(quyen.ngayHetHan).toLocaleDateString('vi-VN')})
                                                    </div>
                                                ` : ''}
                                                
                                                <div id="chiTiet${dk.maDotKham}">
                                                    <button class="btn btn-sm btn-outline-primary" 
                                                            onclick="TraCuuHoSo.loadChiTietDotKham('${dk.maDotKham}', '${benhNhan.maBenhNhan}', '${dk.maPhongKham}')">
                                                        <i class="bi bi-eye"></i> Xem chi tiết khám
                                                    </button>
                                                </div>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    ` : `
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i> Chưa có lịch sử khám bệnh
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    async loadChiTietDotKham(maDotKham, maBenhNhan = null, maPhongKham = null) {
        try {
            const container = document.getElementById(`chiTiet${maDotKham}`);
            container.innerHTML = '<div class="text-center py-2"><div class="spinner-border spinner-border-sm text-primary"></div></div>';
            
            // Ghi log truy cập nếu có thông tin
            if (maBenhNhan && maPhongKham) {
                try {
                    await API.post('/lich-su-truy-cap', {
                        maBenhNhan: maBenhNhan,
                        maPhongKham: maPhongKham,
                        maDotKham: maDotKham,
                        loaiTruyCap: 'Xem đợt khám',
                        thongTinBosung: `Xem chi tiết đợt khám ${maDotKham}`
                    });
                } catch (error) {
                    console.error('Error logging access:', error);
                }
            }
            
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
    
    async guiYeuCauTruyCap(maBenhNhan, maBacSiDuocYeuCau, maPhongKhamDuocYeuCau) {
        // Hiển thị modal nhập lý do
        const modalHtml = `
            <div class="modal fade" id="modalGuiYeuCau" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">Gửi yêu cầu truy cập hồ sơ</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Bệnh nhân:</strong> ${this.currentPatient?.hoTen || '-'}</p>
                            <p class="text-muted small">Bạn đang gửi yêu cầu xem hồ sơ bệnh án từ phòng khám khác.</p>
                            
                            <div class="mb-3">
                                <label class="form-label">Lý do yêu cầu <span class="text-danger">*</span></label>
                                <textarea class="form-control" id="lyDoYeuCau" rows="3" 
                                          placeholder="Ví dụ: Bệnh nhân đến khám tiếp theo, cần xem lịch sử điều trị trước đó..."
                                          required></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-primary" 
                                    onclick="TraCuuHoSo.xacNhanGuiYeuCau('${maBenhNhan}', '${maBacSiDuocYeuCau}', '${maPhongKhamDuocYeuCau}')">
                                <i class="bi bi-send"></i> Gửi yêu cầu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal
        const oldModal = document.getElementById('modalGuiYeuCau');
        if (oldModal) oldModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('modalGuiYeuCau'));
        modal.show();
    },
    
    async xacNhanGuiYeuCau(maBenhNhan, maBacSiDuocYeuCau, maPhongKhamDuocYeuCau) {
        try {
            const lyDoYeuCau = document.getElementById('lyDoYeuCau').value.trim();
            
            if (!lyDoYeuCau) {
                App.showToast('Vui lòng nhập lý do yêu cầu', 'warning');
                return;
            }
            
            App.showLoading();
            
            // Lấy thông tin user hiện tại
            const user = Auth.getUser();
            
            const response = await API.post('/yeu-cau-truy-cap', {
                maBenhNhan: maBenhNhan,
                maBacSiDuocYeuCau: maBacSiDuocYeuCau,
                maPhongKhamYeuCau: user.maPhongKham,
                maPhongKhamDuocYeuCau: maPhongKhamDuocYeuCau,
                lyDoYeuCau: lyDoYeuCau
            });
            
            if (response.success) {
                App.showToast('Gửi yêu cầu thành công! Chờ bác sĩ duyệt.', 'success');
                
                // Đóng modal
                const modalElement = document.getElementById('modalGuiYeuCau');
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
                
                // Reload lại thông tin bệnh nhân để cập nhật trạng thái
                setTimeout(() => {
                    this.xemHoSo(maBenhNhan);
                }, 1000);
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
