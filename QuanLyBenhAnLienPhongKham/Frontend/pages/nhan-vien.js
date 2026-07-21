// Quản lý Nhân viên
const NhanVien = {
    currentData: [],
    phongKhamList: [],
    chuyenKhoaList: [],
    
    async render() {
        const content = document.getElementById('mainContent');
        
        content.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-person-badge"></i> Danh sách Nhân viên
                    </h5>
                    <button class="btn btn-primary" onclick="NhanVien.showModalThem()">
                        <i class="bi bi-plus-circle"></i> Thêm nhân viên
                    </button>
                </div>
                <div class="card-body">
                    <!-- Tìm kiếm và filter -->
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <div class="input-group">
                                <span class="input-group-text bg-white">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" 
                                       id="searchNhanVien" 
                                       placeholder="Tìm kiếm theo tên, CCCD, số điện thoại...">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="filterPhongKham" onchange="NhanVien.handleFilter()">
                                <option value="">-- Tất cả phòng khám --</option>
                            </select>
                        </div>
                        <div class="col-md-3 text-end">
                            <span class="badge bg-info fs-6">
                                Tổng: <span id="totalNhanVien">0</span> nhân viên
                            </span>
                        </div>
                    </div>

                    <!-- Bảng danh sách -->
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th width="80">Mã NV</th>
                                    <th>Họ và tên</th>
                                    <th width="120">Số điện thoại</th>
                                    <th width="120">CCCD</th>
                                    <th>Phòng khám</th>
                                    <th width="100">Là bác sĩ</th>
                                    <th width="200" class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="tableNhanVien">
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
            <div class="modal fade" id="modalNhanVien" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalNhanVienTitle">
                                <i class="bi bi-person-plus"></i> Thêm nhân viên mới
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="formNhanVien" onsubmit="NhanVien.handleSubmit(event)">
                            <div class="modal-body">
                                <input type="hidden" id="maNhanVien" name="maNhanVien">
                                
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
                                        </select>
                                    </div>
                                </div>

                                <h6 class="border-bottom pb-2 mb-3 mt-3">
                                    <i class="bi bi-telephone"></i> Thông tin liên hệ
                                </h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label required">Số điện thoại</label>
                                        <input type="tel" class="form-control" 
                                               id="soDienThoai" name="soDienThoai" 
                                               placeholder="VD: 0901234567" 
                                               pattern="[0-9]{10,11}" required>
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
                                    <i class="bi bi-building"></i> Thông tin công việc
                                </h6>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label required">Phòng khám</label>
                                        <select class="form-select" id="maPhongKham" name="maPhongKham" required>
                                            <option value="">-- Chọn phòng khám --</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Chức vụ</label>
                                        <input type="text" class="form-control" 
                                               id="chucVu" name="chucVu" 
                                               placeholder="VD: Bác sĩ, Y tá, Lễ tân...">
                                    </div>
                                </div>

                                <!-- Checkbox: Là bác sĩ -->
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" 
                                                   id="laBacSi" name="laBacSi" 
                                                   onchange="NhanVien.toggleBacSiFields()">
                                            <label class="form-check-label fw-bold" for="laBacSi">
                                                <i class="bi bi-heart-pulse"></i> Nhân viên này là Bác sĩ
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Thông tin bác sĩ (ẩn mặc định) -->
                                <div id="bacSiFields" style="display: none;">
                                    <h6 class="border-bottom pb-2 mb-3 mt-3 text-primary">
                                        <i class="bi bi-heart-pulse"></i> Thông tin Bác sĩ
                                    </h6>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Chuyên khoa</label>
                                            <select class="form-select" id="maChuyenKhoa" name="maChuyenKhoa">
                                                <option value="">-- Chọn chuyên khoa --</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Chứng chỉ hành nghề</label>
                                            <input type="text" class="form-control" 
                                                   id="chungChiHanhNghe" name="chungChiHanhNghe" 
                                                   placeholder="VD: CC-12345">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12 mb-3">
                                            <label class="form-label">Bằng cấp</label>
                                            <textarea class="form-control" 
                                                      id="bangCap" name="bangCap" 
                                                      rows="2" 
                                                      placeholder="VD: Bác sĩ Đa khoa, Thạc sĩ Y khoa..."></textarea>
                                        </div>
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
        `;

        // Bind search event
        document.getElementById('searchNhanVien').addEventListener('input', (e) => {
            this.handleSearchLocal(e.target.value);
        });

        // Load data
        await this.loadPhongKham();
        await this.loadChuyenKhoa();
        await this.loadData();
    },

    async loadPhongKham() {
        try {
            const response = await API.get('/phong-kham');
            if (response.success) {
                this.phongKhamList = response.data || [];
                
                // Populate dropdown trong form
                const select = document.getElementById('maPhongKham');
                select.innerHTML = '<option value="">-- Chọn phòng khám --</option>' +
                    this.phongKhamList.map(pk => 
                        `<option value="${pk.maPhongKham}">${pk.tenPhongKham}</option>`
                    ).join('');
                
                // Populate filter dropdown
                const filterSelect = document.getElementById('filterPhongKham');
                filterSelect.innerHTML = '<option value="">-- Tất cả phòng khám --</option>' +
                    this.phongKhamList.map(pk => 
                        `<option value="${pk.maPhongKham}">${pk.tenPhongKham}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error loading phong kham:', error);
        }
    },

    async loadChuyenKhoa() {
        try {
            const response = await API.get('/chuyen-khoa');
            if (response.success) {
                this.chuyenKhoaList = response.data || [];
                
                // Populate dropdown
                const select = document.getElementById('maChuyenKhoa');
                select.innerHTML = '<option value="">-- Chọn chuyên khoa --</option>' +
                    this.chuyenKhoaList.map(ck => 
                        `<option value="${ck.maChuyenKhoa}">${ck.tenChuyenKhoa}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error loading chuyen khoa:', error);
        }
    },

    async loadData() {
        try {
            const response = await API.get('/nhan-vien');
            
            if (response.success) {
                this.currentData = response.data || [];
                this.renderTable(this.currentData);
                document.getElementById('totalNhanVien').textContent = this.currentData.length;
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi tải dữ liệu: ' + error.message, 'error');
            document.getElementById('tableNhanVien').innerHTML = `
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
        const tbody = document.getElementById('tableNhanVien');
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        <i class="bi bi-inbox"></i><br>
                        Chưa có nhân viên nào
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(nv => {
            const phongKham = this.phongKhamList.find(pk => pk.maPhongKham === nv.maPhongKham);
            const tenPhongKham = phongKham ? phongKham.tenPhongKham : 'N/A';
            
            return `
                <tr class="fade-in">
                    <td><span class="badge bg-primary">${nv.maNhanVien}</span></td>
                    <td>
                        <strong>${nv.hoTen}</strong>
                        ${nv.chucVu ? `<br><small class="text-muted">${nv.chucVu}</small>` : ''}
                    </td>
                    <td><small><i class="bi bi-telephone"></i> ${nv.soDienThoai || '-'}</small></td>
                    <td><small>${nv.cccd || '-'}</small></td>
                    <td><small>${tenPhongKham}</small></td>
                    <td class="text-center">
                        ${nv.laBacSi ? '<span class="badge bg-success"><i class="bi bi-heart-pulse"></i> Bác sĩ</span>' : '<span class="badge bg-secondary">Không</span>'}
                    </td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-outline-info" 
                                    onclick="NhanVien.showModalSua('${nv.maNhanVien}')"
                                    title="Sửa">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" 
                                    onclick="NhanVien.handleXoa('${nv.maNhanVien}', '${nv.hoTen.replace(/'/g, "\\'")}')"
                                    title="Xóa">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    handleSearchLocal(keyword) {
        if (!keyword.trim()) {
            this.renderTable(this.currentData);
            document.getElementById('totalNhanVien').textContent = this.currentData.length;
            return;
        }

        const filtered = this.currentData.filter(nv => {
            const searchStr = keyword.toLowerCase();
            return (
                nv.hoTen?.toLowerCase().includes(searchStr) ||
                nv.soDienThoai?.includes(searchStr) ||
                nv.cccd?.includes(searchStr) ||
                nv.email?.toLowerCase().includes(searchStr)
            );
        });

        this.renderTable(filtered);
        document.getElementById('totalNhanVien').textContent = filtered.length;
    },

    handleFilter() {
        const maPhongKham = document.getElementById('filterPhongKham').value;
        
        if (!maPhongKham) {
            this.renderTable(this.currentData);
            document.getElementById('totalNhanVien').textContent = this.currentData.length;
            return;
        }

        const filtered = this.currentData.filter(nv => nv.maPhongKham == maPhongKham);
        this.renderTable(filtered);
        document.getElementById('totalNhanVien').textContent = filtered.length;
    },

    toggleBacSiFields() {
        const checkbox = document.getElementById('laBacSi');
        const fields = document.getElementById('bacSiFields');
        
        if (checkbox.checked) {
            fields.style.display = 'block';
        } else {
            fields.style.display = 'none';
            // Clear bác sĩ fields
            document.getElementById('maChuyenKhoa').value = '';
            document.getElementById('chungChiHanhNghe').value = '';
            document.getElementById('bangCap').value = '';
        }
    },

    showModalThem() {
        document.getElementById('modalNhanVienTitle').innerHTML = 
            '<i class="bi bi-person-plus"></i> Thêm nhân viên mới';
        document.getElementById('formNhanVien').reset();
        document.getElementById('maNhanVien').value = '';
        document.getElementById('laBacSi').checked = false;
        document.getElementById('bacSiFields').style.display = 'none';
        
        const modal = new bootstrap.Modal(document.getElementById('modalNhanVien'));
        modal.show();
    },

    async showModalSua(maNhanVien) {
        try {
            App.showLoading();
            
            // Lấy thông tin nhân viên
            const nvResponse = await API.get(`/nhan-vien/${maNhanVien}`);
            if (!nvResponse.success || !nvResponse.data) {
                throw new Error('Không tìm thấy nhân viên');
            }
            const nv = nvResponse.data;
            
            // Fill form
            document.getElementById('modalNhanVienTitle').innerHTML = 
                '<i class="bi bi-pencil"></i> Sửa thông tin nhân viên';
            document.getElementById('maNhanVien').value = nv.maNhanVien;
            document.getElementById('hoTen').value = nv.hoTen || '';
            document.getElementById('ngaySinh').value = nv.ngaySinh ? nv.ngaySinh.split('T')[0] : '';
            document.getElementById('gioiTinh').value = nv.gioiTinh || '';
            document.getElementById('soDienThoai').value = nv.soDienThoai || '';
            document.getElementById('email').value = nv.email || '';
            document.getElementById('cccd').value = nv.cccd || '';
            document.getElementById('diaChi').value = nv.diaChi || '';
            document.getElementById('maPhongKham').value = nv.maPhongKham || '';
            document.getElementById('chucVu').value = nv.chucVu || '';
            
            // Kiểm tra nếu là bác sĩ
            document.getElementById('laBacSi').checked = nv.laBacSi || false;
            
            if (nv.laBacSi) {
                // Lấy thông tin bác sĩ
                const bsResponse = await API.get(`/bac-si/nhan-vien/${maNhanVien}`);
                if (bsResponse.success && bsResponse.data) {
                    const bs = bsResponse.data;
                    document.getElementById('maChuyenKhoa').value = bs.maChuyenKhoa || '';
                    document.getElementById('chungChiHanhNghe').value = bs.chungChiHanhNghe || '';
                    document.getElementById('bangCap').value = bs.bangCap || '';
                }
                document.getElementById('bacSiFields').style.display = 'block';
            } else {
                document.getElementById('bacSiFields').style.display = 'none';
            }
            
            const modal = new bootstrap.Modal(document.getElementById('modalNhanVien'));
            modal.show();
            
        } catch (error) {
            App.showToast('Lỗi tải thông tin: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    },

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const maNhanVien = formData.get('maNhanVien');
        const laBacSi = document.getElementById('laBacSi').checked;
        
        // Dữ liệu nhân viên
        const nhanVienData = {
            hoTen: formData.get('hoTen'),
            ngaySinh: formData.get('ngaySinh') || null,
            gioiTinh: formData.get('gioiTinh') || null,
            soDienThoai: formData.get('soDienThoai') || null,
            email: formData.get('email') || null,
            cccd: formData.get('cccd') || null,
            diaChi: formData.get('diaChi') || null,
            maPhongKham: formData.get('maPhongKham'),
            chucVu: formData.get('chucVu') || null,
            laBacSi: laBacSi
        };
        
        // Nếu là bác sĩ, thêm các trường thông tin bác sĩ vào cùng payload
        if (laBacSi) {
            nhanVienData.ChuyenKhoa = formData.get('maChuyenKhoa') || null;
            nhanVienData.ChungChiHanhNghe = formData.get('chungChiHanhNghe') || null;
            nhanVienData.BangCap = formData.get('bangCap') || null;
            
            console.log('=== TẠO BÁC SĨ ===');
            console.log('ChuyenKhoa (Mã):', nhanVienData.ChuyenKhoa);
            console.log('ChungChiHanhNghe:', nhanVienData.ChungChiHanhNghe);
            console.log('BangCap:', nhanVienData.BangCap);
        }
        
        console.log('=== PAYLOAD GỬI ĐI ===', nhanVienData);
        
        try {
            App.showLoading();
            
            let response;
            if (maNhanVien) {
                // Update nhân viên
                nhanVienData.maNhanVien = maNhanVien;
                response = await API.put(`/nhan-vien/${maNhanVien}`, nhanVienData);
                
                // Update/Create thông tin bác sĩ nếu có
                if (response.success && laBacSi) {
                    const bacSiData = {
                        maNhanVien: maNhanVien,
                        maChuyenKhoa: formData.get('maChuyenKhoa') || null,
                        chungChiHanhNghe: formData.get('chungChiHanhNghe') || null,
                        bangCap: formData.get('bangCap') || null
                    };
                    
                    // Kiểm tra xem bác sĩ đã tồn tại chưa
                    let bacSiExists = false;
                    try {
                        const checkBS = await API.get(`/bac-si/nhan-vien/${maNhanVien}`);
                        bacSiExists = checkBS.success && checkBS.data;
                        console.log('[UPDATE MODE] Check bác sĩ tồn tại:', bacSiExists);
                    } catch (error) {
                        // Nếu lỗi 404 = chưa tồn tại
                        console.log('[UPDATE MODE] Bác sĩ chưa tồn tại (404)');
                        bacSiExists = false;
                    }
                    
                    if (bacSiExists) {
                        // Đã tồn tại → PUT (Update)
                        console.log('[UPDATE MODE] Bác sĩ đã tồn tại, gọi PUT');
                        await API.put(`/bac-si/nhan-vien/${maNhanVien}`, bacSiData);
                    } else {
                        // Chưa tồn tại → POST (Create)
                        console.log('[UPDATE MODE] Bác sĩ chưa tồn tại, gọi POST');
                        bacSiData.maBacSi = maNhanVien;  // Thêm maBacSi cho POST
                        await API.post(`/bac-si`, bacSiData);
                    }
                }
            } else {
                // Create nhân viên - Backend sẽ tự động tạo bản ghi BacSi nếu LaBacSi = true
                console.log('[CREATE MODE] Tạo mới nhân viên');
                response = await API.post('/nhan-vien', nhanVienData);
            }
            
            if (response.success) {
                App.showToast(
                    maNhanVien ? 'Cập nhật thành công!' : 'Thêm nhân viên thành công!', 
                    'success'
                );
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalNhanVien'));
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

    async handleXoa(maNhanVien, hoTen) {
        if (!confirm(`Bạn có chắc muốn xóa nhân viên "${hoTen}"?\n\nLưu ý: Không thể xóa nếu nhân viên đang có dữ liệu liên quan.`)) {
            return;
        }
        
        try {
            App.showLoading();
            
            const response = await API.delete(`/nhan-vien/${maNhanVien}`);
            
            if (response.success) {
                App.showToast('Xóa nhân viên thành công!', 'success');
                await this.loadData();
            } else {
                throw new Error(response.message || 'Không thể xóa nhân viên');
            }
        } catch (error) {
            App.showToast('Lỗi: ' + error.message, 'error');
        } finally {
            App.hideLoading();
        }
    }
};
