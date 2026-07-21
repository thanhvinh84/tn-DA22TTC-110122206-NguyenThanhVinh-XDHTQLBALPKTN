// Trang Bệnh nhân - Lịch sử khám
const BenhNhanLichSu = {
    benhNhan: null,
    danhSachDotKham: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-clock-history"></i> Lịch sử khám bệnh
                    </h5>
                </div>
                <div class="card-body">
                    <div id="lichSuContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-success" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        await this.loadLichSu();
    },
    
    async loadLichSu() {
        try {
            const user = Auth.getUser();
            
            console.log('Loading lich su for user:', user);
            
            // Kiểm tra xem user có MaBenhNhan không
            if (!user.maBenhNhan) {
                throw new Error('Tài khoản này không liên kết với bệnh nhân nào');
            }
            
            // Lấy thông tin bệnh nhân
            const responseBN = await API.get(`/benh-nhan/${user.maBenhNhan}`);
            
            console.log('Response benh nhan:', responseBN);
            
            if (responseBN.success && responseBN.data) {
                this.benhNhan = responseBN.data;
                
                // Lấy danh sách đợt khám
                const responseDK = await API.get(`/dot-kham/benh-nhan/${this.benhNhan.maBenhNhan}`);
                
                console.log('Response dot kham:', responseDK);
                
                if (responseDK.success && responseDK.data) {
                    this.danhSachDotKham = responseDK.data;
                    // Log chi tiết từng đợt khám
                    this.danhSachDotKham.forEach((dk, idx) => {
                        console.log(`Dot kham ${idx}:`, {
                            maDotKham: dk.maDotKham,
                            hoTenBacSi: dk.hoTenBacSi,
                            tenBacSi: dk.tenBacSi,
                            thoiGianDen: dk.thoiGianDen
                        });
                    });
                } else {
                    console.warn('No dot kham data or failed:', responseDK);
                    this.danhSachDotKham = [];
                }
                
                this.renderLichSu();
            } else {
                throw new Error('Không tìm thấy thông tin bệnh nhân');
            }
        } catch (error) {
            console.error('Error loading lich su:', error);
            document.getElementById('lichSuContent').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    <strong>Lỗi:</strong> ${error.message}
                    <br><small>Vui lòng kiểm tra console (F12) để xem chi tiết lỗi.</small>
                </div>
            `;
        }
    },
    
    renderLichSu() {
        const container = document.getElementById('lichSuContent');
        
        if (!this.danhSachDotKham || this.danhSachDotKham.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    Bạn chưa có lịch sử khám bệnh nào
                </div>
            `;
            return;
        }
        
        // Sắp xếp theo ngày khám mới nhất
        const sortedList = [...this.danhSachDotKham].sort((a, b) => 
            new Date(b.thoiGianDen || 0) - new Date(a.thoiGianDen || 0)
        );
        
        const html = `
            <div class="accordion" id="accordionLichSu">
                ${sortedList.map((dotKham, index) => `
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${index}">
                            <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" 
                                    data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                                <div class="w-100">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i class="bi bi-calendar-check"></i>
                                            <strong>${dotKham.thoiGianDen ? new Date(dotKham.thoiGianDen).toLocaleDateString('vi-VN') : 'Chưa xác định'}</strong>
                                            - ${dotKham.hoTenBacSi || dotKham.tenBacSi || 'Chưa có bác sĩ'}
                                        </div>
                                        <span class="badge ${this.getTrangThaiBadgeClass(dotKham.trangThai)} me-2">
                                            ${dotKham.trangThai || 'Chưa xác định'}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </h2>
                        <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                             data-bs-parent="#accordionLichSu">
                            <div class="accordion-body">
                                <div id="chiTietDotKham${index}">
                                    <div class="text-center py-3">
                                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = html;
        
        // Load chi tiết cho đợt khám đầu tiên
        if (sortedList.length > 0) {
            this.loadChiTietDotKham(sortedList[0].maDotKham, 0);
        }
        
        // Bind events cho các accordion
        sortedList.forEach((dotKham, index) => {
            const collapseElement = document.getElementById(`collapse${index}`);
            collapseElement.addEventListener('show.bs.collapse', () => {
                this.loadChiTietDotKham(dotKham.maDotKham, index);
            });
        });
    },
    
    getTrangThaiBadgeClass(trangThai) {
        const classes = {
            'Chờ khám': 'bg-warning',
            'Đang khám': 'bg-primary',
            'Chờ xét nghiệm': 'bg-info',
            'Đã có kết quả': 'bg-success',
            'Hoàn tất': 'bg-success',
            'Hủy': 'bg-danger'
        };
        return classes[trangThai] || 'bg-secondary';
    },
    
    async loadChiTietDotKham(maDotKham, index) {
        const container = document.getElementById(`chiTietDotKham${index}`);
        
        try {
            // Load chẩn đoán
            const responseChanDoan = await API.get(`/chan-doan/dot-kham/${maDotKham}`);
            const chanDoan = responseChanDoan.success && responseChanDoan.data ? responseChanDoan.data : [];
            
            // Load đơn thuốc
            const responseDonThuoc = await API.get(`/don-thuoc/dot-kham/${maDotKham}`);
            let chiTietThuoc = [];
            if (responseDonThuoc.success && responseDonThuoc.data && responseDonThuoc.data.length > 0) {
                const donThuoc = responseDonThuoc.data[0];
                const responseChiTiet = await API.get(`/don-thuoc/${donThuoc.maDonThuoc}/chi-tiet`);
                if (responseChiTiet.success && responseChiTiet.data) {
                    chiTietThuoc = responseChiTiet.data;
                }
            }
            
            // Load kết quả cận lâm sàng
            const responseKetQua = await API.get(`/ket-qua/dot-kham/${maDotKham}`);
            const ketQuaCLS = responseKetQua.success && responseKetQua.data ? responseKetQua.data : [];
            
            const html = `
                <!-- Chẩn đoán -->
                <div class="mb-3">
                    <h6 class="text-primary"><i class="bi bi-clipboard2-pulse"></i> Chẩn đoán</h6>
                    ${chanDoan.length > 0 ? `
                        <div class="card">
                            <div class="card-body">
                                ${chanDoan.map(cd => `
                                    <div class="mb-2">
                                        <strong>${cd.loai || 'Chẩn đoán'}:</strong> 
                                        ${cd.noiDungChanDoan || cd.moTa || '-'}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : '<p class="text-muted">Chưa có chẩn đoán</p>'}
                </div>
                
                <!-- Đơn thuốc -->
                <div class="mb-3">
                    <h6 class="text-success"><i class="bi bi-capsule"></i> Đơn thuốc</h6>
                    ${chiTietThuoc.length > 0 ? `
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered">
                                <thead class="table-light">
                                    <tr>
                                        <th width="40">#</th>
                                        <th>Tên thuốc</th>
                                        <th width="80">Số lượng</th>
                                        <th>Liều dùng</th>
                                        <th>Cách dùng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${chiTietThuoc.map((thuoc, idx) => `
                                        <tr>
                                            <td>${idx + 1}</td>
                                            <td><strong>${thuoc.tenThuoc || '-'}</strong></td>
                                            <td class="text-center">${thuoc.soLuong || '-'}</td>
                                            <td>${thuoc.lieuDung || '-'}</td>
                                            <td>${thuoc.cachDung || '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : '<p class="text-muted">Không có đơn thuốc</p>'}
                </div>
                
                <!-- Kết quả cận lâm sàng -->
                <div class="mb-3">
                    <h6 class="text-info"><i class="bi bi-file-earmark-medical"></i> Kết quả CLS</h6>
                    ${ketQuaCLS.length > 0 ? `
                        <div class="list-group">
                            ${ketQuaCLS.map(kq => {
                                const images = kq.hinhAnhKetQua ? kq.hinhAnhKetQua.split(';').filter(img => img.trim()) : [];
                                return `
                                <div class="list-group-item">
                                    <div class="mb-2">
                                        <strong class="text-primary">${kq.tenDichVu || 'Xét nghiệm'}</strong>
                                        ${kq.loaiDichVu ? `<span class="badge bg-secondary ms-2">${kq.loaiDichVu}</span>` : ''}
                                    </div>
                                    <div class="mb-2">
                                        <small class="text-muted">Kết luận:</small>
                                        <p class="mb-0">${kq.ketLuan || 'Chưa có kết luận'}</p>
                                    </div>
                                    ${kq.ketQua ? `
                                        <div class="mb-2">
                                            <small class="text-muted">Kết quả chi tiết:</small>
                                            <p class="mb-0">${kq.ketQua}</p>
                                        </div>
                                    ` : ''}
                                    ${kq.ghiChu ? `
                                        <div class="mb-2">
                                            <small class="text-muted">Ghi chú:</small>
                                            <p class="mb-0">${kq.ghiChu}</p>
                                        </div>
                                    ` : ''}
                                    ${images.length > 0 ? `
                                        <div class="mt-2">
                                            <small class="text-muted d-block mb-2">Hình ảnh kết quả:</small>
                                            <div class="d-flex flex-wrap gap-2">
                                                ${images.map(img => {
                                                    const ext = img.split('.').pop().toLowerCase();
                                                    if (ext === 'pdf') {
                                                        return `<a href="${img}" target="_blank" class="btn btn-sm btn-outline-danger">
                                                            <i class="bi bi-file-pdf"></i> Xem PDF
                                                        </a>`;
                                                    } else if (ext === 'doc' || ext === 'docx') {
                                                        return `<a href="${img}" target="_blank" class="btn btn-sm btn-outline-primary">
                                                            <i class="bi bi-file-word"></i> Xem Word
                                                        </a>`;
                                                    } else {
                                                        return `<a href="${img}" target="_blank">
                                                            <img src="${img}" alt="Kết quả" class="img-thumbnail" style="max-width: 150px; max-height: 150px; object-fit: cover;">
                                                        </a>`;
                                                    }
                                                }).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            `}).join('')}
                        </div>
                    ` : '<p class="text-muted">Không có kết quả xét nghiệm</p>'}
                </div>
                
                <!-- Nút in -->
                <div class="text-center mt-4">
                    <button class="btn btn-primary me-2" onclick="PrintPhieuKham.inPhieuKham('${maDotKham}')">
                        <i class="bi bi-printer"></i> In phiếu khám
                    </button>
                    <button class="btn btn-info" onclick="PrintPhieuKham.inPhieuChiDinh('${maDotKham}')">
                        <i class="bi bi-file-earmark-text"></i> In phiếu chỉ định
                    </button>
                </div>
            `;
            
            container.innerHTML = html;
        } catch (error) {
            console.error('Error loading chi tiet dot kham:', error);
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Không thể tải chi tiết đợt khám: ${error.message}
                </div>
            `;
        }
    }
};
