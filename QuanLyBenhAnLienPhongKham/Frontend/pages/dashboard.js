// Dashboard - Hiển thị thống kê tổng quan
const Dashboard = {
    async render() {
        const user = Auth.getUser();
        const content = document.getElementById('mainContent');
        
        // Kiểm tra vai trò để hiển thị thống kê phù hợp
        const isLeTan = user.maVaiTro === 'VT_LETAN';
        const isBacSi = user.maVaiTro === 'VT_BACSI';
        const isAdmin = user.maVaiTro === 'VT_ADMIN';
        
        content.innerHTML = `
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="alert alert-success border-0 shadow-sm">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-check-circle-fill fs-3 me-3"></i>
                            <div>
                                <h5 class="mb-1">Chào mừng, ${user.hoTen || user.tenNguoiDung}!</h5>
                                <p class="mb-0">Vai trò: <strong>${user.tenVaiTro}</strong> | Hệ thống đã kết nối thành công</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-3 mb-4">
                <!-- Tổng số bệnh nhân -->
                <div class="col-md-3">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <p class="text-muted mb-1 small">Tổng số bệnh nhân</p>
                                    <h2 class="mb-0 fw-bold" id="statTongBenhNhan">
                                        <span class="spinner-border spinner-border-sm"></span>
                                    </h2>
                                </div>
                                <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-people-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${isAdmin ? `
                <!-- Tổng số nhân viên (Chỉ Admin) -->
                <div class="col-md-3">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <p class="text-muted mb-1 small">Tổng số nhân viên</p>
                                    <h2 class="mb-0 fw-bold" id="statTongNhanVien">
                                        <span class="spinner-border spinner-border-sm"></span>
                                    </h2>
                                </div>
                                <div class="stat-icon bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-person-badge-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tổng số phòng khám (Chỉ Admin) -->
                <div class="col-md-3">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <p class="text-muted mb-1 small">Tổng số phòng khám</p>
                                    <h2 class="mb-0 fw-bold" id="statTongPhongKham">
                                        <span class="spinner-border spinner-border-sm"></span>
                                    </h2>
                                </div>
                                <div class="stat-icon bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-building-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Tổng số lượt khám -->
                <div class="col-md-3">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <p class="text-muted mb-1 small">Tổng số lượt khám</p>
                                    <h2 class="mb-0 fw-bold" id="statTongDotKham">
                                        <span class="spinner-border spinner-border-sm"></span>
                                    </h2>
                                </div>
                                <div class="stat-icon bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-clipboard2-pulse-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-3 mb-4">
                <!-- Lượt khám chờ khám -->
                <div class="col-md-${isLeTan ? '4' : '4'}">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <p class="text-muted mb-1 small">Lượt khám chờ khám</p>
                                    <h2 class="mb-0 fw-bold text-warning" id="statChoKham">
                                        <span class="spinner-border spinner-border-sm"></span>
                                    </h2>
                                </div>
                                <div class="stat-icon bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-clock-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${!isLeTan && !isBacSi ? `
                <!-- Chỉ định CLS chờ thực hiện (Chỉ Admin, Kỹ thuật viên) -->
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <p class="text-muted mb-1 small">CLS chờ thực hiện</p>
                                    <h2 class="mb-0 fw-bold text-info" id="statChiDinhCho">
                                        <span class="spinner-border spinner-border-sm"></span>
                                    </h2>
                                </div>
                                <div class="stat-icon bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-file-earmark-medical-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}

                ${isLeTan || isAdmin ? `
                <!-- Hóa đơn chưa thanh toán (Chỉ Lễ tân và Admin) -->
                <div class="col-md-${isLeTan ? '4' : '4'}">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <p class="text-muted mb-1 small">Hóa đơn chưa thanh toán</p>
                                    <h2 class="mb-0 fw-bold text-danger" id="statHoaDonCho">
                                        <span class="spinner-border spinner-border-sm"></span>
                                    </h2>
                                </div>
                                <div class="stat-icon bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-receipt-cutoff"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="row g-3">
                <!-- Hoạt động gần đây -->
                <div class="col-md-8">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-bottom">
                            <h5 class="mb-0"><i class="bi bi-clock-history"></i> Hoạt động gần đây</h5>
                        </div>
                        <div class="card-body">
                            <div id="recentActivities">
                                <div class="text-center py-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Thông tin hệ thống -->
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-bottom">
                            <h5 class="mb-0"><i class="bi bi-info-circle"></i> Thông tin hệ thống</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <small class="text-muted">Phiên bản</small>
                                <p class="mb-0 fw-bold">v1.0.0</p>
                            </div>
                            <div class="mb-3">
                                <small class="text-muted">Database</small>
                                <p class="mb-0 fw-bold">QL_BenhAnLienPhongKham</p>
                            </div>
                            <div class="mb-3">
                                <small class="text-muted">Backend API</small>
                                <p class="mb-0 fw-bold">http://localhost:5000</p>
                            </div>
                            <div>
                                <small class="text-muted">Trạng thái</small>
                                <p class="mb-0">
                                    <span class="badge bg-success">
                                        <i class="bi bi-check-circle"></i> Hoạt động
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load statistics
        await this.loadStatistics();
    },

    async loadStatistics() {
        const user = Auth.getUser();
        const isLeTan = user.maVaiTro === 'VT_LETAN';
        const isBacSi = user.maVaiTro === 'VT_BACSI';
        const isAdmin = user.maVaiTro === 'VT_ADMIN';
        
        try {
            // Load tổng số bệnh nhân (Tất cả vai trò)
            try {
                const benhNhanResponse = await API.get('/benh-nhan');
                const element = document.getElementById('statTongBenhNhan');
                if (element) {
                    element.textContent = benhNhanResponse.data?.length || 0;
                }
            } catch (error) {
                console.error('Error loading benh nhan:', error);
                const element = document.getElementById('statTongBenhNhan');
                if (element) element.textContent = '0';
            }

            // Load tổng số nhân viên (Chỉ Admin)
            if (isAdmin) {
                try {
                    const nhanVienResponse = await API.get('/nhan-vien');
                    const element = document.getElementById('statTongNhanVien');
                    if (element) {
                        element.textContent = nhanVienResponse.data?.length || 0;
                    }
                } catch (error) {
                    console.error('Error loading nhan vien:', error);
                    const element = document.getElementById('statTongNhanVien');
                    if (element) element.textContent = '0';
                }

                // Load tổng số phòng khám (Chỉ Admin)
                try {
                    const phongKhamResponse = await API.get('/phong-kham');
                    const element = document.getElementById('statTongPhongKham');
                    if (element) {
                        element.textContent = phongKhamResponse.data?.length || 0;
                    }
                } catch (error) {
                    console.error('Error loading phong kham:', error);
                    const element = document.getElementById('statTongPhongKham');
                    if (element) element.textContent = '0';
                }
            }

            // Load tổng số đợt khám
            let dotKhamData = [];
            try {
                const dotKhamResponse = await API.get('/dot-kham');
                let allDotKham = dotKhamResponse.data || [];
                
                // Nếu là bác sĩ, chỉ lấy đợt khám của mình
                if (isBacSi && user.maNhanVien) {
                    dotKhamData = allDotKham.filter(dk => dk.maBacSi === user.maNhanVien);
                } else {
                    dotKhamData = allDotKham;
                }
                
                const element = document.getElementById('statTongDotKham');
                if (element) element.textContent = dotKhamData.length;

                // Load số lượt khám chờ khám
                const choKham = dotKhamData.filter(dk => 
                    dk.trangThai === 'Chờ khám' || dk.trangThai === 'CHO_KHAM'
                ).length;
                const elementCho = document.getElementById('statChoKham');
                if (elementCho) elementCho.textContent = choKham;
            } catch (error) {
                console.error('Error loading dot kham:', error);
                const element = document.getElementById('statTongDotKham');
                if (element) element.textContent = '0';
                const elementCho = document.getElementById('statChoKham');
                if (elementCho) elementCho.textContent = '0';
            }

            // Load số chỉ định chờ thực hiện (Chỉ Admin, Kỹ thuật viên - không hiển thị cho Bác sĩ và Lễ tân)
            if (!isLeTan && !isBacSi) {
                try {
                    const chiDinhResponse = await API.get('/chi-dinh');
                    let allChiDinh = chiDinhResponse.data || [];
                    
                    const chiDinhCho = allChiDinh.filter(cd => 
                        cd.trangThai === 'Chờ thực hiện' || cd.trangThai === 'CHO_THUC_HIEN'
                    ).length;
                    
                    const element = document.getElementById('statChiDinhCho');
                    if (element) element.textContent = chiDinhCho;
                } catch (error) {
                    console.error('Error loading chi dinh:', error);
                    const element = document.getElementById('statChiDinhCho');
                    if (element) element.textContent = '0';
                }
            }

            // Load số hóa đơn chưa thanh toán (Chỉ Lễ tân và Admin - không hiển thị cho Bác sĩ)
            if (isLeTan || isAdmin) {
                try {
                    const hoaDonResponse = await API.get('/hoa-don');
                    let allHoaDon = hoaDonResponse.data || [];
                    
                    const hoaDonCho = allHoaDon.filter(hd => 
                        hd.trangThai === 'Chưa thanh toán' || hd.trangThai === 'CHUATHANHTOAN'
                    ).length;
                    
                    const element = document.getElementById('statHoaDonCho');
                    if (element) element.textContent = hoaDonCho;
                } catch (error) {
                    console.error('Error loading hoa don:', error);
                    const element = document.getElementById('statHoaDonCho');
                    if (element) element.textContent = '0';
                }
            }

            // Load recent activities (chỉ của bác sĩ nếu là bác sĩ)
            this.loadRecentActivities(dotKhamData);

        } catch (error) {
            console.error('Error loading statistics:', error);
            // Set all stats to 0 if there's a general error
            ['statTongBenhNhan', 'statTongDotKham', 'statChoKham'].forEach(id => {
                const element = document.getElementById(id);
                if (element) element.textContent = '0';
            });
        }
    },

    loadRecentActivities(dotKhamData) {
        const container = document.getElementById('recentActivities');
        
        if (!dotKhamData || dotKhamData.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Chưa có hoạt động nào</p>';
            return;
        }

        // Get latest 5 activities
        const recent = dotKhamData
            .sort((a, b) => new Date(b.thoiGianDen) - new Date(a.thoiGianDen))
            .slice(0, 5);

        container.innerHTML = recent.map(dk => `
            <div class="activity-item d-flex align-items-start mb-3 pb-3 border-bottom">
                <div class="activity-icon me-3">
                    <i class="bi bi-clipboard2-pulse text-primary"></i>
                </div>
                <div class="flex-grow-1">
                    <p class="mb-1">
                        <strong>${dk.hoTenBenhNhan || 'Bệnh nhân'}</strong> 
                        - ${dk.lyDoKham || 'Khám bệnh'}
                    </p>
                    <small class="text-muted">
                        <i class="bi bi-clock"></i> 
                        ${new Date(dk.thoiGianDen).toLocaleString('vi-VN')}
                    </small>
                    <span class="badge bg-${this.getStatusColor(dk.trangThai)} ms-2">
                        ${dk.trangThai}
                    </span>
                </div>
            </div>
        `).join('');
    },

    getStatusColor(status) {
        const colors = {
            'Chờ khám': 'warning',
            'Đang khám': 'info',
            'Hoàn tất': 'success',
            'Hủy': 'danger'
        };
        return colors[status] || 'secondary';
    }
};
