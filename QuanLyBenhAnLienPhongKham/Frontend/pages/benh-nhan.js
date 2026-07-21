// Quản lý Bệnh nhân
const BenhNhan = {
    currentData: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-people"></i> Danh sách Bệnh nhân
                    </h5>
                    <button class="btn btn-primary" onclick="BenhNhan.showModalThem()">
                        <i class="bi bi-plus-circle"></i> Thêm bệnh nhân
                    </button>
                </div>
                <div class="card-body">
                    <!-- Tìm kiếm -->
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-text bg-white">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" 
                                       id="searchBenhNhan" 
                                       placeholder="Tìm kiếm theo mã, họ tên, CCCD, số điện thoại...">
                                <button class="btn btn-outline-primary" onclick="BenhNhan.handleSearch()">
                                    <i class="bi bi-search"></i> Tìm kiếm
                                </button>
                            </div>
                        </div>
                        <div class="col-md-4 text-end">
                            <span class="badge bg-info fs-6">
                                Tổng: <span id="totalBenhNhan">0</span> bệnh nhân
                            </span>
                        </div>
                    </div>

                    <!-- Bảng danh sách -->
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th width="120">Mã BN</th>
                                    <th>Họ và tên</th>
                                    <th width="100">Ngày sinh</th>
                                    <th width="80">Giới tính</th>
                                    <th width="120">Số điện thoại</th>
                                    <th width="120">CCCD</th>
                                    <th width="250" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="tableBenhNhan">
                                <tr>
                                    <td colspan="7" class="text-center py-4">
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

            <!-- Modal Thêm/Sửa -->
            <div class="modal fade" id="modalBenhNhan" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalBenhNhanTitle">
                                <i class="bi bi-person-plus"></i> Thêm bệnh nhân mới
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formBenhNhan" onsubmit="BenhNhan.handleSubmit(event)">
                            <div class="modal-body">
                                <input type="hidden" id="maBenhNhan" name="maBenhNhan">
                                
                                <h6 class="border-bottom pb-2 mb-3">
                                    <i class="bi bi-person-badge"></i> Thông tin cơ bản
                                </h6>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">Họ và tên</label>
                                        <input type="text" class="form-control" 
                                               id="hoTen" name="hoTen" 
                                               placeholder="VD: Nguyễn Văn A" required>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label">Ngày sinh</label>
                                        <input type="date" class="form-control" 
                                               id="ngaySinh" name="ngaySinh">
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label">Giới tính</label>
                                        <select class="form-select" id="gioiTinh" name="gioiTinh">
                                            <option value="">-- Chọn --</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                    </div>
                                </div>

                                <h6 class="border-bottom pb-2 mb-3 mt-3">
                                    <i class="bi bi-telephone"></i> Thông tin liên hệ
                                </h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Số điện thoại</label>
                                        <input type="tel" class="form-control" 
                                               id="soDienThoai" name="soDienThoai" 
                                               placeholder="VD: 0901234567" 
                                               pattern="[0-9]{10,11}">
                                        <small class="text-muted">10-11 số</small>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" 
                                               id="email" name="email" 
                                               placeholder="VD: email@example.com">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">CCCD/CMND</label>
                                        <input type="text" class="form-control" 
                                               id="cccd" name="cccd" 
                                               placeholder="VD: 001234567890" 
                                               pattern="[0-9]{9,12}">
                                        <small class="text-muted">9-12 số</small>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label class="form-label">Địa chỉ</label>
                                        <textarea class="form-control" 
                                                  id="diaChi" name="diaChi" 
                                                  rows="2" 
                                                  placeholder="VD: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"></textarea>
                                    </div>
                                </div>

                                <h6 class="border-bottom pb-2 mb-3 mt-3">
                                    <i class="bi bi-card-checklist"></i> Thông tin bảo hiểm & khác
                                </h6>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Số BHYT</label>
                                        <input type="text" class="form-control" 
                                               id="soBHYT" name="soBHYT" 
                                               placeholder="VD: DN1234567890123">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Nghề nghiệp</label>
                                        <input type="text" class="form-control" 
                                               id="ngheNghiep" name="ngheNghiep" 
                                               placeholder="VD: Nhân viên văn phòng">
                                    </div>
                                </div>

                                <h6 class="border-bottom pb-2 mb-3 mt-3">
                                    <i class="bi bi-heart-pulse"></i> Thông tin y tế
                                </h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Nhóm máu</label>
                                        <select class="form-select" id="nhomMau" name="nhomMau">
                                            <option value="">-- Chưa xác định --</option>
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
                                    <div class="col-md-8 mb-3">
                                        <label class="form-label">Tiền sử bệnh</label>
                                        <input type="text" class="form-control" 
                                               id="tienSuBenh" name="tienSuBenh" 
                                               placeholder="VD: Tiểu đường, cao huyết áp, hen suyễn...">
                                        <small class="text-muted">Ghi rõ các bệnh lý đã mắc, bệnh mãn tính...</small>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer bg-light">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle"></i> Hủy
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-save"></i> Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Modal Xem hồ sơ -->
            <div class="modal fade" id="modalHoSo" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-folder2-open"></i> Hồ sơ bệnh án
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="hoSoContent">
                            <div class="text-center py-5">
                                <div class="spinner-border text-primary" role="status"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Xem lịch sử -->
            <div class="modal fade" id="modalLichSu" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-clock-history"></i> Lịch sử khám bệnh
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="lichSuContent">
                            <div class="text-center py-5">
                                <div class="spinner-border text-primary" role="status"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Tạo đợt khám -->
            <div class="modal fade" id="modalTaoDotKham" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-calendar-plus"></i> Tạo lượt khám mới
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formTaoDotKham" onsubmit="BenhNhan.handleTaoDotKham(event)">
                            <div class="modal-body">
                                <input type="hidden" id="dotKhamMaBenhNhan" name="maBenhNhan">
                                <input type="hidden" id="dotKhamMaHoSo" name="maHoSo">
                                
                                <div class="alert alert-info">
                                    <strong><i class="bi bi-person"></i> Bệnh nhân:</strong> 
                                    <span id="dotKhamTenBenhNhan"></span>
                                    <span class="badge bg-primary ms-2" id="dotKhamMaBN"></span>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">Phòng khám</label>
                                        <select class="form-select" id="dotKhamPhongKham" name="maPhongKham" required>
                                            <option value="">-- Chọn phòng khám --</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Bác sĩ</label>
                                        <select class="form-select" id="dotKhamBacSi" name="maBacSi">
                                            <option value="">-- Chọn bác sĩ (tùy chọn) --</option>
                                        </select>
                                        <small class="text-muted">Có thể để trống, sẽ phân công sau</small>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label required">Lý do khám</label>
                                    <textarea class="form-control" id="dotKhamLyDo" name="lyDoKham" 
                                              rows="3" required
                                              placeholder="VD: Đau đầu, sốt cao, khó thở, khám định kỳ..."></textarea>
                                </div>

                                <!-- Chỉ số sự sống -->
                                <div class="card border-primary mb-3">
                                    <div class="card-header bg-primary text-white">
                                        <h6 class="mb-0">
                                            <i class="bi bi-heart-pulse"></i> Chỉ số sự sống
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Nhiệt độ (°C)</label>
                                                <input type="number" step="0.1" class="form-control" 
                                                       id="dotKhamNhietDo" name="nhietDo"
                                                       placeholder="VD: 36.5">
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Nhịp tim (lần/phút)</label>
                                                <input type="number" class="form-control" 
                                                       id="dotKhamNhipTim" name="nhipTim"
                                                       placeholder="VD: 75">
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Nhịp thở (lần/phút)</label>
                                                <input type="number" class="form-control" 
                                                       id="dotKhamNhipTho" name="nhipTho"
                                                       placeholder="VD: 18">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Huyết áp tâm thu (mmHg)</label>
                                                <input type="number" class="form-control" 
                                                       id="dotKhamHuyetApTamThu" name="huyetApTamThu"
                                                       placeholder="VD: 120">
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Huyết áp tâm trương (mmHg)</label>
                                                <input type="number" class="form-control" 
                                                       id="dotKhamHuyetApTamTruong" name="huyetApTamTruong"
                                                       placeholder="VD: 80">
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Cân nặng (kg)</label>
                                                <input type="number" step="0.1" class="form-control" 
                                                       id="dotKhamCanNang" name="canNang"
                                                       placeholder="VD: 65.5">
                                            </div>
                                        </div>
                                        <div class="alert alert-info mb-0">
                                            <i class="bi bi-info-circle"></i> 
                                            <small>Các chỉ số này sẽ được bác sĩ xem khi khám bệnh. Có thể bỏ qua nếu chưa đo.</small>
                                        </div>
                                    </div>
                                </div>

                                <div class="alert alert-warning">
                                    <i class="bi bi-info-circle"></i> 
                                    <strong>Lưu ý:</strong> Lượt khám sẽ được tạo với trạng thái "Chờ khám" và thời gian đến là thời điểm hiện tại.
                                </div>
                            </div>
                            <div class="modal-footer bg-light">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle"></i> Hủy
                                </button>
                                <button type="submit" class="btn btn-success">
                                    <i class="bi bi-check-circle"></i> Tạo lượt khám
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Modal Thêm dị ứng -->
            <div class="modal fade" id="modalThemDiUng" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">
                                <i class="bi bi-exclamation-triangle-fill"></i> Thêm thông tin dị ứng
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formThemDiUng" onsubmit="BenhNhan.handleThemDiUng(event)">
                            <div class="modal-body">
                                <input type="hidden" id="diUngMaBenhNhan" name="maBenhNhan">
                                
                                <div class="alert alert-warning">
                                    <i class="bi bi-info-circle"></i> 
                                    <strong>Lưu ý:</strong> Thông tin dị ứng rất quan trọng cho quá trình điều trị. Vui lòng nhập chính xác.
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">Tên dị ứng</label>
                                        <input type="text" class="form-control" 
                                               id="tenDiUng" name="tenDiUng" 
                                               placeholder="VD: Dị ứng Penicillin" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">Mức độ dị ứng</label>
                                        <select class="form-select" id="mucDoDiUng" name="mucDoDiUng" required>
                                            <option value="">-- Chọn mức độ --</option>
                                            <option value="Nhẹ">Nhẹ</option>
                                            <option value="Trung bình">Trung bình</option>
                                            <option value="Nặng">Nặng</option>
                                            <option value="Rất nặng">Rất nặng</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label required">Tác nhân gây dị ứng</label>
                                    <input type="text" class="form-control" 
                                           id="tacNhan" name="tacNhan" 
                                           placeholder="VD: Thuốc kháng sinh Penicillin, Hải sản, Phấn hoa..." required>
                                    <small class="text-muted">Ghi rõ loại thuốc, thực phẩm, hoặc chất gây dị ứng</small>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Biểu hiện dị ứng</label>
                                    <textarea class="form-control" 
                                              id="bieuHien" name="bieuHien" 
                                              rows="3" 
                                              placeholder="VD: Nổi mẩn đỏ, ngứa, khó thở, sưng môi..."></textarea>
                                    <small class="text-muted">Mô tả các triệu chứng khi bị dị ứng</small>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Ngày ghi nhận</label>
                                    <input type="date" class="form-control" 
                                           id="ngayGhiNhan" name="ngayGhiNhan">
                                    <small class="text-muted">Để trống sẽ lấy ngày hiện tại</small>
                                </div>
                            </div>
                            <div class="modal-footer bg-light">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle"></i> Hủy
                                </button>
                                <button type="submit" class="btn btn-warning">
                                    <i class="bi bi-save"></i> Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Bind search event
        document.getElementById('searchBenhNhan').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Load data
        await this.loadData();
    },

    async loadData() {
        try {
            const response = await API.get('/benh-nhan');
            
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
            document.getElementById('tableBenhNhan').innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> 
                        Không thể tải dữ liệu
                    </td>
                </tr>
            `;
        }
    },

    renderTable(data) {
        const tbody = document.getElementById('tableBenhNhan');
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        <i class="bi bi-inbox"></i><br>
                        Chưa có bệnh nhân nào
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(bn => `
            <tr class="fade-in">
                <td><span class="badge bg-primary">${bn.maBenhNhan || '-'}</span></td>
                <td><strong>${bn.hoTen}</strong></td>
                <td>
                    <small>${bn.ngaySinh ? new Date(bn.ngaySinh).toLocaleDateString('vi-VN') : '-'}</small>
                </td>
                <td>
                    ${bn.gioiTinh ? `<span class="badge ${bn.gioiTinh === 'Nam' ? 'bg-info' : 'bg-warning'}">${bn.gioiTinh}</span>` : '-'}
                </td>
                <td><small><i class="bi bi-telephone"></i> ${bn.soDienThoai || '-'}</small></td>
                <td><small>${bn.cccd || '-'}</small></td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-success" 
                                onclick="BenhNhan.xemHoSo('${bn.maBenhNhan}')"
                                title="Xem hồ sơ">
                            <i class="bi bi-folder2-open"></i>
                        </button>
                        <button class="btn btn-outline-info" 
                                onclick="BenhNhan.showModalSua('${bn.maBenhNhan}')"
                                title="Sửa">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-secondary" 
                                onclick="BenhNhan.xemLichSu('${bn.maBenhNhan}')"
                                title="Lịch sử khám">
                            <i class="bi bi-clock-history"></i>
                        </button>
                        <button class="btn btn-outline-danger" 
                                onclick="BenhNhan.handleXoa('${bn.maBenhNhan}', '${bn.hoTen}')"
                                title="Xóa">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    async handleSearch() {
        const keyword = document.getElementById('searchBenhNhan').value.trim();
        
        if (!keyword) {
            this.renderTable(this.currentData);
            return;
        }

        try {
            App.showLoading();
            
            const response = await API.get(`/benh-nhan/search?keyword=${encodeURIComponent(keyword)}`);
            
            if (response.success) {
                this.renderTable(response.data || []);
                document.getElementById('totalBenhNhan').textContent = (response.data || []).length;
            } else {
                throw new Error(response.message || 'Không tìm thấy kết quả');
            }
        } catch (error) {
            App.showToast('Lỗi tìm kiếm: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    showModalThem() {
        document.getElementById('modalBenhNhanTitle').innerHTML = 
            '<i class="bi bi-person-plus"></i> Thêm bệnh nhân mới';
        document.getElementById('formBenhNhan').reset();
        document.getElementById('maBenhNhan').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('modalBenhNhan'));
        modal.show();
    },

    async showModalSua(maBenhNhan) {
        try {
            App.showLoading();
            const response = await API.get(`/benh-nhan/${maBenhNhan}`);
            
            if (response.success && response.data) {
                const bn = response.data;
                
                document.getElementById('modalBenhNhanTitle').innerHTML = 
                    '<i class="bi bi-pencil"></i> Sửa thông tin bệnh nhân';
                document.getElementById('maBenhNhan').value = bn.maBenhNhan;
                document.getElementById('hoTen').value = bn.hoTen || '';
                document.getElementById('ngaySinh').value = bn.ngaySinh ? bn.ngaySinh.split('T')[0] : '';
                document.getElementById('gioiTinh').value = bn.gioiTinh || '';
                document.getElementById('soDienThoai').value = bn.soDienThoai || '';
                document.getElementById('email').value = bn.email || '';
                document.getElementById('cccd').value = bn.cccd || '';
                document.getElementById('diaChi').value = bn.diaChi || '';
                document.getElementById('soBHYT').value = bn.soBHYT || '';
                document.getElementById('ngheNghiep').value = bn.ngheNghiep || '';
                
                // Lấy thông tin hồ sơ để load nhóm máu và tiền sử bệnh
                try {
                    const hsResponse = await API.get(`/ho-so/by-benh-nhan/${maBenhNhan}`);
                    if (hsResponse.success && hsResponse.data) {
                        const hoSo = hsResponse.data;
                        document.getElementById('nhomMau').value = hoSo.nhomMau || '';
                        document.getElementById('tienSuBenh').value = hoSo.tienSuBenh || '';
                    } else {
                        // Nếu chưa có hồ sơ, để trống
                        document.getElementById('nhomMau').value = '';
                        document.getElementById('tienSuBenh').value = '';
                    }
                } catch (hsError) {
                    // Nếu lỗi khi lấy hồ sơ, để trống
                    document.getElementById('nhomMau').value = '';
                    document.getElementById('tienSuBenh').value = '';
                }
                
                const modal = new bootstrap.Modal(document.getElementById('modalBenhNhan'));
                modal.show();
            }
        } catch (error) {
            App.showToast('Lỗi tải thông tin: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            hoTen: formData.get('hoTen'),
            ngaySinh: formData.get('ngaySinh') || null,
            gioiTinh: formData.get('gioiTinh') || null,
            soDienThoai: formData.get('soDienThoai') || null,
            email: formData.get('email') || null,
            cccd: formData.get('cccd') || null,
            diaChi: formData.get('diaChi') || null,
            soBHYT: formData.get('soBHYT') || null,
            ngheNghiep: formData.get('ngheNghiep') || null
        };
        
        const maBenhNhan = formData.get('maBenhNhan');
        const nhomMau = formData.get('nhomMau') || null;
        const tienSuBenh = formData.get('tienSuBenh') || null;
        
        try {
            App.showLoading();
            
            let response;
            if (maBenhNhan) {
                // Update bệnh nhân
                data.maBenhNhan = maBenhNhan;
                response = await API.put(`/benh-nhan/${maBenhNhan}`, data);
                
                // Cập nhật hồ sơ bệnh án (nhóm máu, tiền sử bệnh)
                if (response.success) {
                    try {
                        const hsResponse = await API.get(`/ho-so/by-benh-nhan/${maBenhNhan}`);
                        if (hsResponse.success && hsResponse.data) {
                            const maHoSo = hsResponse.data.maHoSo;
                            await API.put(`/ho-so/${maHoSo}`, {
                                nhomMau: nhomMau,
                                tienSuBenh: tienSuBenh,
                                ghiChu: hsResponse.data.ghiChu // Giữ nguyên ghi chú cũ
                            });
                        }
                    } catch (hsError) {
                        console.warn('Không thể cập nhật hồ sơ:', hsError);
                        // Không throw error, vẫn cho phép cập nhật bệnh nhân thành công
                    }
                }
            } else {
                // Create - Backend sẽ tự động tạo mã và hồ sơ bệnh án
                response = await API.post('/benh-nhan', data);
                
                // Nếu tạo mới và có nhóm máu/tiền sử bệnh, cập nhật hồ sơ
                if (response.success && response.data?.maBenhNhan && (nhomMau || tienSuBenh)) {
                    try {
                        const newMaBenhNhan = response.data.maBenhNhan;
                        // Đợi một chút để backend tạo hồ sơ
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        const hsResponse = await API.get(`/ho-so/by-benh-nhan/${newMaBenhNhan}`);
                        if (hsResponse.success && hsResponse.data) {
                            const maHoSo = hsResponse.data.maHoSo;
                            await API.put(`/ho-so/${maHoSo}`, {
                                nhomMau: nhomMau,
                                tienSuBenh: tienSuBenh,
                                ghiChu: null
                            });
                        }
                    } catch (hsError) {
                        console.warn('Không thể cập nhật hồ sơ:', hsError);
                    }
                }
            }
            
            if (response.success) {
                App.showToast(
                    maBenhNhan ? 'Cập nhật thành công!' : 'Thêm bệnh nhân thành công! Mã BN: ' + (response.data?.maBenhNhan || ''), 
                    'success'
                );
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalBenhNhan'));
                modal.hide();
                
                // Reload data
                await this.loadData();
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async handleXoa(maBenhNhan, hoTen) {
        if (!confirm(`Bạn có chắc muốn xóa bệnh nhân "${hoTen}"?\n\nLưu ý: Không thể xóa nếu bệnh nhân đã có lượt khám.`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.delete(`/benh-nhan/${maBenhNhan}`);
            
            if (response.success) {
                App.showToast('Xóa bệnh nhân thành công!', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể xóa bệnh nhân');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async xemHoSo(maBenhNhan) {
        try {
            App.showLoading();
            
            // Lấy thông tin bệnh nhân
            const bnResponse = await API.get(`/benh-nhan/${maBenhNhan}`);
            if (!bnResponse.success) {
                throw new Error('Không tìm thấy bệnh nhân');
            }
            const bn = bnResponse.data;
            
            // Lấy hồ sơ bệnh án
            const hsResponse = await API.get(`/ho-so/by-benh-nhan/${maBenhNhan}`);
            const hoSo = hsResponse.success ? hsResponse.data : null;
            
            // Hiển thị modal
            const content = document.getElementById('hoSoContent');
            content.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <h6 class="border-bottom pb-2 mb-3">
                            <i class="bi bi-person-badge"></i> Thông tin bệnh nhân
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
                            <tr><th>Nghề nghiệp:</th><td>${bn.ngheNghiep || '-'}</td></tr>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <h6 class="border-bottom pb-2 mb-3">
                            <i class="bi bi-folder2-open"></i> Hồ sơ bệnh án
                        </h6>
                        ${hoSo ? `
                            <table class="table table-sm">
                                <tr><th width="150">Mã hồ sơ:</th><td><span class="badge bg-success">${hoSo.maHoSo}</span></td></tr>
                                <tr><th>Ngày tạo:</th><td>${new Date(hoSo.ngayTao).toLocaleString('vi-VN')}</td></tr>
                                <tr><th>Nhóm máu:</th><td>${hoSo.nhomMau || 'Chưa xác định'}</td></tr>
                                <tr><th>Tiền sử bệnh:</th><td>${hoSo.tienSuBenh || 'Không có'}</td></tr>
                                <tr><th>Ghi chú:</th><td>${hoSo.ghiChu || '-'}</td></tr>
                            </table>
                            
                            <div class="mt-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <strong><i class="bi bi-exclamation-triangle-fill text-warning"></i> Thông tin dị ứng:</strong>
                                    <button class="btn btn-sm btn-outline-primary" onclick="BenhNhan.showModalThemDiUng('${bn.maBenhNhan}')">
                                        <i class="bi bi-plus-circle"></i> Thêm dị ứng
                                    </button>
                                </div>
                                <div id="danhSachDiUng">
                                    <div class="text-center py-2">
                                        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle"></i> 
                                Chưa có hồ sơ bệnh án
                            </div>
                        `}
                    </div>
                </div>
            `;
            
            const modal = new bootstrap.Modal(document.getElementById('modalHoSo'));
            modal.show();
            
            // Load danh sách dị ứng
            if (hoSo) {
                await this.loadDanhSachDiUng(maBenhNhan);
            }
            
        } catch (error) {
            App.showToast('Lỗi xem hồ sơ: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async taoDotKham(maBenhNhan) {
        try {
            App.showLoading();
            
            // Lấy thông tin bệnh nhân
            const bnResponse = await API.get(`/benh-nhan/${maBenhNhan}`);
            if (!bnResponse.success) {
                throw new Error('Không tìm thấy bệnh nhân');
            }
            const bn = bnResponse.data;
            
            // Lấy hồ sơ bệnh án
            const hsResponse = await API.get(`/ho-so/by-benh-nhan/${maBenhNhan}`);
            if (!hsResponse.success || !hsResponse.data) {
                throw new Error('Bệnh nhân chưa có hồ sơ bệnh án');
            }
            const maHoSo = hsResponse.data.maHoSo;
            
            // Lấy danh sách phòng khám
            const pkResponse = await API.get('/phong-kham');
            const phongKhamList = pkResponse.success ? pkResponse.data : [];
            
            // Lấy danh sách bác sĩ
            const bsResponse = await API.get('/bac-si');
            const bacSiList = bsResponse.success ? bsResponse.data : [];
            
            // Điền thông tin vào form
            document.getElementById('dotKhamMaBenhNhan').value = maBenhNhan;
            document.getElementById('dotKhamMaHoSo').value = maHoSo;
            document.getElementById('dotKhamTenBenhNhan').textContent = bn.hoTen;
            document.getElementById('dotKhamMaBN').textContent = bn.maBenhNhan;
            
            // Load phòng khám
            const selectPhongKham = document.getElementById('dotKhamPhongKham');
            selectPhongKham.innerHTML = '<option value="">-- Chọn phòng khám --</option>';
            phongKhamList.forEach(pk => {
                selectPhongKham.innerHTML += `<option value="${pk.maPhongKham}">${pk.tenPhongKham}</option>`;
            });
            
            // Load bác sĩ
            const selectBacSi = document.getElementById('dotKhamBacSi');
            selectBacSi.innerHTML = '<option value="">-- Chọn bác sĩ (tùy chọn) --</option>';
            bacSiList.forEach(bs => {
                selectBacSi.innerHTML += `<option value="${bs.maBacSi}">${bs.hoTen} - ${bs.tenChuyenKhoa || 'Đa khoa'}</option>`;
            });
            
            // Reset lý do khám và chỉ số sự sống
            document.getElementById('dotKhamLyDo').value = '';
            document.getElementById('dotKhamNhietDo').value = '';
            document.getElementById('dotKhamNhipTim').value = '';
            document.getElementById('dotKhamNhipTho').value = '';
            document.getElementById('dotKhamHuyetApTamThu').value = '';
            document.getElementById('dotKhamHuyetApTamTruong').value = '';
            document.getElementById('dotKhamCanNang').value = '';
            
            // Hiển thị modal
            const modal = new bootstrap.Modal(document.getElementById('modalTaoDotKham'));
            modal.show();
            
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async handleTaoDotKham(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            maHoSo: formData.get('maHoSo'),
            maPhongKham: formData.get('maPhongKham'),
            maBacSi: formData.get('maBacSi') || null,
            lyDoKham: formData.get('lyDoKham')
        };
        
        // Chỉ số sự sống
        const chiSoSuSong = {
            nhietDo: formData.get('nhietDo') ? parseFloat(formData.get('nhietDo')) : null,
            nhipTim: formData.get('nhipTim') ? parseInt(formData.get('nhipTim')) : null,
            nhipTho: formData.get('nhipTho') ? parseInt(formData.get('nhipTho')) : null,
            huyetApTamThu: formData.get('huyetApTamThu') ? parseInt(formData.get('huyetApTamThu')) : null,
            huyetApTamTruong: formData.get('huyetApTamTruong') ? parseInt(formData.get('huyetApTamTruong')) : null,
            canNang: formData.get('canNang') ? parseFloat(formData.get('canNang')) : null
        };
        
        try {
            App.showLoading();
            
            const response = await API.post('/dot-kham', data);
            
            if (response.success) {
                const maDotKham = response.data?.maDotKham;
                
                // Lưu chỉ số sự sống nếu có ít nhất 1 giá trị
                const hasVitalSigns = Object.values(chiSoSuSong).some(v => v !== null);
                if (hasVitalSigns && maDotKham) {
                    try {
                        const vitalSignsData = {
                            maDotKham: maDotKham,
                            ...chiSoSuSong
                        };
                        await API.post('/chi-so-su-song', vitalSignsData);
                    } catch (vitalError) {
                        console.error('Error saving vital signs:', vitalError);
                        // Không hiển thị lỗi cho user vì đợt khám đã tạo thành công
                    }
                }
                
                App.showToast('Tạo lượt khám thành công! Mã đợt khám: ' + maDotKham, 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalTaoDotKham'));
                modal.hide();
                
                // Reset form
                event.target.reset();
            } else {
                throw new Error(response.message || 'Không thể tạo lượt khám');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async xemLichSu(maBenhNhan) {
        try {
            App.showLoading();
            
            // Lấy thông tin bệnh nhân
            const bnResponse = await API.get(`/benh-nhan/${maBenhNhan}`);
            if (!bnResponse.success) {
                throw new Error('Không tìm thấy bệnh nhân');
            }
            const bn = bnResponse.data;
            
            // Lấy hồ sơ bệnh án
            const hsResponse = await API.get(`/ho-so/by-benh-nhan/${maBenhNhan}`);
            if (!hsResponse.success || !hsResponse.data) {
                throw new Error('Bệnh nhân chưa có hồ sơ bệnh án');
            }
            
            const maHoSo = hsResponse.data.maHoSo;
            
            // Lấy danh sách đợt khám
            const dkResponse = await API.get(`/dot-kham/ho-so/${maHoSo}`);
            
            const content = document.getElementById('lichSuContent');
            
            if (dkResponse.success && dkResponse.data && dkResponse.data.length > 0) {
                const lichSu = dkResponse.data;
                
                content.innerHTML = `
                    <div class="row mb-3">
                        <div class="col-md-12">
                            <div class="alert alert-info">
                                <strong><i class="bi bi-person"></i> Bệnh nhân:</strong> ${bn.hoTen} 
                                <span class="badge bg-primary ms-2">${bn.maBenhNhan}</span>
                                <span class="ms-3"><strong>Tổng số lượt khám:</strong> ${lichSu.length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-hover table-bordered">
                            <thead class="table-light">
                                <tr>
                                    <th width="100">Mã đợt khám</th>
                                    <th width="150">Thời gian đến</th>
                                    <th>Lý do khám</th>
                                    <th width="150">Phòng khám</th>
                                    <th width="150">Bác sĩ</th>
                                    <th width="120">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${lichSu.map(dk => {
                                    const statusClass = 
                                        dk.trangThai === 'Hoàn tất' ? 'success' : 
                                        dk.trangThai === 'Đang khám' ? 'primary' : 
                                        dk.trangThai === 'Chờ khám' ? 'warning' :
                                        dk.trangThai === 'Hủy' ? 'danger' : 'secondary';
                                    
                                    return `
                                        <tr>
                                            <td><span class="badge bg-info">${dk.maDotKham}</span></td>
                                            <td><small>${new Date(dk.thoiGianDen).toLocaleString('vi-VN')}</small></td>
                                            <td>${dk.lyDoKham || '-'}</td>
                                            <td><small>${dk.tenPhongKham || '-'}</small></td>
                                            <td><small>${dk.hoTenBacSi || 'Chưa phân công'}</small></td>
                                            <td><span class="badge bg-${statusClass}">${dk.trangThai}</span></td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <div class="alert alert-light border">
                                <strong><i class="bi bi-info-circle"></i> Ghi chú:</strong>
                                <ul class="mb-0 mt-2">
                                    <li><span class="badge bg-warning">Chờ khám</span> - Bệnh nhân đã đăng ký, chờ bác sĩ khám</li>
                                    <li><span class="badge bg-primary">Đang khám</span> - Bác sĩ đang thực hiện khám bệnh</li>
                                    <li><span class="badge bg-success">Hoàn tất</span> - Đã hoàn thành khám và điều trị</li>
                                    <li><span class="badge bg-danger">Hủy</span> - Lượt khám đã bị hủy</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                
            } else {
                content.innerHTML = `
                    <div class="alert alert-warning text-center">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <h5 class="mt-3">Chưa có lịch sử khám</h5>
                        <p class="text-muted">Bệnh nhân <strong>${bn.hoTen}</strong> chưa có lượt khám nào.</p>
                    </div>
                `;
            }
            
            // Hiển thị modal
            const modal = new bootstrap.Modal(document.getElementById('modalLichSu'));
            modal.show();
            
        } catch (error) {
            App.showToast('Lỗi xem lịch sử: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async loadDanhSachDiUng(maBenhNhan) {
        try {
            const response = await API.get(`/di-ung/benh-nhan/${maBenhNhan}`);
            
            const container = document.getElementById('danhSachDiUng');
            
            if (response.success && response.data && response.data.length > 0) {
                const diUngList = response.data;
                
                container.innerHTML = `
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered">
                            <thead class="table-light">
                                <tr>
                                    <th width="150">Tên dị ứng</th>
                                    <th width="100">Mức độ</th>
                                    <th>Tác nhân</th>
                                    <th>Biểu hiện</th>
                                    <th width="100">Ngày ghi nhận</th>
                                    <th width="60">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${diUngList.map(du => {
                                    const mucDoClass = 
                                        du.mucDoDiUng === 'Rất nặng' ? 'danger' :
                                        du.mucDoDiUng === 'Nặng' ? 'warning' :
                                        du.mucDoDiUng === 'Trung bình' ? 'info' : 'secondary';
                                    
                                    return `
                                        <tr>
                                            <td><strong>${du.tenDiUng || '-'}</strong></td>
                                            <td><span class="badge bg-${mucDoClass}">${du.mucDoDiUng || '-'}</span></td>
                                            <td><small>${du.tacNhan || '-'}</small></td>
                                            <td><small>${du.bieuHien || '-'}</small></td>
                                            <td><small>${du.ngayGhiNhan ? new Date(du.ngayGhiNhan).toLocaleDateString('vi-VN') : '-'}</small></td>
                                            <td class="text-center">
                                                <button class="btn btn-sm btn-outline-danger" 
                                                        onclick="BenhNhan.xoaDiUng('${du.maDiUng}', '${du.tenDiUng}', '${maBenhNhan}')"
                                                        title="Xóa">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="alert alert-light border text-center">
                        <i class="bi bi-info-circle"></i> Chưa có thông tin dị ứng
                    </div>
                `;
            }
        } catch (error) {
            console.error('Lỗi load dị ứng:', error);
            document.getElementById('danhSachDiUng').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> Lỗi tải thông tin dị ứng
                </div>
            `;
        }
    },

    showModalThemDiUng(maBenhNhan) {
        document.getElementById('diUngMaBenhNhan').value = maBenhNhan;
        document.getElementById('formThemDiUng').reset();
        document.getElementById('diUngMaBenhNhan').value = maBenhNhan; // Set lại sau reset
        
        const modal = new bootstrap.Modal(document.getElementById('modalThemDiUng'));
        modal.show();
    },

    async handleThemDiUng(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            maBenhNhan: formData.get('maBenhNhan'),
            tenDiUng: formData.get('tenDiUng'),
            mucDoDiUng: formData.get('mucDoDiUng'),
            tacNhan: formData.get('tacNhan'),
            bieuHien: formData.get('bieuHien') || null,
            ngayGhiNhan: formData.get('ngayGhiNhan') || null
        };
        
        try {
            App.showLoading();
            
            const response = await API.post('/di-ung', data);
            
            if (response.success) {
                App.showToast('Thêm thông tin dị ứng thành công!', 'success');
                
                // Đóng modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalThemDiUng'));
                modal.hide();
                
                // Reload danh sách dị ứng
                await this.loadDanhSachDiUng(data.maBenhNhan);
            } else {
                throw new Error(response.message || 'Không thể thêm thông tin dị ứng');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async xoaDiUng(maDiUng, tenDiUng, maBenhNhan) {
        if (!confirm(`Bạn có chắc muốn xóa thông tin dị ứng "${tenDiUng}"?`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.delete(`/di-ung/${maDiUng}`);
            
            if (response.success) {
                App.showToast('Xóa thông tin dị ứng thành công!', 'success');
                
                // Reload danh sách dị ứng
                await this.loadDanhSachDiUng(maBenhNhan);
            } else {
                throw new Error(response.message || 'Không thể xóa thông tin dị ứng');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
