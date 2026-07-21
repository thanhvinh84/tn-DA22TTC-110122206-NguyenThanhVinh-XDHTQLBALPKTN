// Main application
const App = {
    init() {
        this.checkAuth();
        this.bindEvents();
    },
    
    checkAuth() {
        if (Auth.isAuthenticated()) {
            this.showMainPage();
        } else {
            this.showLoginPage();
        }
    },
    
    bindEvents() {
        // Đăng nhập
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Đăng xuất
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    },
    
    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            this.showLoading();
            const response = await API.login(username, password);
            
            if (response.success) {
                // Lưu token và thông tin user
                Auth.setToken(response.data.token);
                Auth.setUser(response.data);
                
                this.showToast('Đăng nhập thành công!', 'success');
                this.showMainPage();
            } else {
                this.showToast(response.message, 'error');
            }
        } catch (error) {
            this.showToast('Đăng nhập thất bại: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },
    
    showLoginPage() {
        document.getElementById('loginPage').classList.remove('d-none');
        document.getElementById('mainPage').classList.add('d-none');
    },
    
    showMainPage() {
        document.getElementById('loginPage').classList.add('d-none');
        document.getElementById('mainPage').classList.remove('d-none');
        
        const user = Auth.getUser();
        document.getElementById('userDisplayName').textContent = user.hoTen || user.tenNguoiDung;
        
        this.loadMenu();
        
        // Load trang đầu tiên trong menu thay vì luôn load dashboard
        const menuItems = this.getMenuByRole(user.maVaiTro);
        if (menuItems.length > 0) {
            this.loadPage(menuItems[0].page);
        }
    },
    
    loadMenu() {
        const user = Auth.getUser();
        const menuItems = this.getMenuByRole(user.maVaiTro);
        
        const sidebarMenu = document.getElementById('sidebarMenu');
        sidebarMenu.innerHTML = menuItems.map(item => `
            <li class="nav-item">
                <a class="nav-link" href="#" data-page="${item.page}">
                    <i class="bi ${item.icon}"></i> ${item.label}
                </a>
            </li>
        `).join('');
        
        // Bind click events
        sidebarMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.loadPage(page);
                
                // Update active state
                sidebarMenu.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    },
    
    // Alias for loadPage - used for navigation
    navigate(page, params = {}) {
        this.loadPage(page, params);
    },
    
    getMenuByRole(role) {
        const menus = {
            [ROLES.ADMIN]: [
                { label: 'Dashboard', icon: 'bi-speedometer2', page: 'dashboard' },
                { label: 'Quản lý Phòng khám', icon: 'bi-building', page: 'phong-kham' },
                { label: 'Quản lý Bệnh nhân', icon: 'bi-people', page: 'benh-nhan' },
                { label: 'Quản lý Nhân viên', icon: 'bi-person-badge', page: 'nhan-vien' },
                { label: 'Quản lý Tài khoản', icon: 'bi-person-lock', page: 'tai-khoan' },
                { label: 'Báo cáo Doanh thu', icon: 'bi-graph-up', page: 'bao-cao-doanh-thu' },
                { label: 'Danh mục Thuốc', icon: 'bi-capsule', page: 'thuoc' },
                { label: 'Danh mục Bệnh', icon: 'bi-clipboard2-pulse', page: 'benh' }
            ],
            [ROLES.LETAN]: [
                { label: 'Dashboard', icon: 'bi-speedometer2', page: 'dashboard' },
                { label: 'Tiếp nhận Bệnh nhân', icon: 'bi-person-plus', page: 'tiep-nhan' },
                { label: 'Tra cứu Bệnh nhân', icon: 'bi-search', page: 'tra-cuu' },
                { label: 'Tạo lượt khám', icon: 'bi-calendar-plus', page: 'tao-dot-kham' },
                { label: 'Yêu cầu đặt khám', icon: 'bi-calendar-check', page: 'dat-kham' },
                { label: 'Quản lý Thanh toán', icon: 'bi-credit-card', page: 'thanh-toan' }
            ],
            [ROLES.BACSI]: [
                { label: 'Dashboard', icon: 'bi-speedometer2', page: 'dashboard' },
                { label: 'Bệnh nhân chờ khám', icon: 'bi-people', page: 'cho-kham' },
                { label: 'Khám bệnh', icon: 'bi-clipboard2-pulse', page: 'kham-benh' },
                { label: 'Tra cứu hồ sơ', icon: 'bi-search', page: 'tra-cuu-ho-so' },
                { label: 'Yêu cầu truy cập', icon: 'bi-shield-lock', page: 'yeu-cau-truy-cap' }
            ],
            [ROLES.KYTHUATVIEN]: [
                { label: 'Dashboard', icon: 'bi-speedometer2', page: 'dashboard' },
                { label: 'Chỉ định chờ thực hiện', icon: 'bi-list-check', page: 'chi-dinh' },
                { label: 'Cập nhật kết quả', icon: 'bi-file-earmark-medical', page: 'ket-qua' }
            ],
            [ROLES.BENHNHAN]: [
                { label: 'Hồ sơ của tôi', icon: 'bi-file-person', page: 'ho-so-ca-nhan' },
                { label: 'Đặt khám online', icon: 'bi-calendar-plus', page: 'dat-kham-online' },
                { label: 'Lịch sử khám', icon: 'bi-clock-history', page: 'lich-su' }
            ]
        };
        
        return menus[role] || [];
    },
    
    loadPage(page, params = {}) {
        document.getElementById('pageTitle').textContent = this.getPageTitle(page);
        const content = document.getElementById('mainContent');
        
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'phong-kham':
                PhongKham.render();
                break;
            case 'benh-nhan':
                BenhNhan.render();
                break;
            case 'cho-kham':
                BenhNhanChoKham.render();
                break;
            case 'kham-benh':
                KhamBenh.render();
                break;
            case 'tra-cuu-ho-so':
                TraCuuHoSo.render();
                break;
            case 'nhan-vien':
                NhanVien.render();
                break;
            case 'tai-khoan':
                TaiKhoan.render();
                break;
            case 'thuoc':
                DanhMucThuoc.render();
                break;
            case 'benh':
                DanhMucBenh.render();
                break;
            case 'chuyen-khoa':
                ChuyenKhoa.render();
                break;
            case 'phan-quyen':
                PhanQuyen.render();
                break;
            case 'tiep-nhan':
                LeTanTiepNhan.render();
                break;
            case 'tra-cuu':
                LeTanTraCuu.render();
                break;
            case 'tao-dot-kham':
                LeTanTaoDotKham.render(params);  // Truyền params
                break;
            case 'thanh-toan':
                LeTanThanhToan.render();
                break;
            case 'yeu-cau-truy-cap':
                YeuCauTruyCapHoSo.render();
                break;
            case 'chi-dinh':
                KyThuatVienChiDinh.render();
                break;
            case 'ket-qua':
                KyThuatVienKetQua.render();
                break;
            case 'ho-so-ca-nhan':
                BenhNhanHoSo.render();
                break;
            case 'lich-su':
                BenhNhanLichSu.render();
                break;
            case 'dat-kham':
                LeTanDatKham.render();
                break;
            case 'dat-kham-online':
                BenhNhanDatKham.render();
                break;
            case 'bao-cao-doanh-thu':
                BaoCaoDoanhThu.init();
                break;
            default:
                content.innerHTML = '<div class="alert alert-info">Trang đang được phát triển...</div>';
        }
    },
    
    getPageTitle(page) {
        const titles = {
            'dashboard': 'Dashboard',
            'benh-nhan': 'Quản lý Bệnh nhân',
            'nhan-vien': 'Quản lý Nhân viên',
            'tai-khoan': 'Quản lý Tài khoản',
            'thuoc': 'Danh mục Thuốc',
            'benh': 'Danh mục Bệnh',
            'chuyen-khoa': 'Quản lý Chuyên khoa',
            'phan-quyen': 'Phân quyền Hồ sơ',
            'tiep-nhan': 'Tiếp nhận Bệnh nhân',
            'tra-cuu': 'Tra cứu Bệnh nhân',
            'tao-dot-kham': 'Tạo lượt khám mới',
            'thanh-toan': 'Quản lý Thanh toán',
            'cho-kham': 'Bệnh nhân chờ khám',
            'kham-benh': 'Khám bệnh',
            'phong-kham': 'Quản lý Phòng khám',
            'tra-cuu-ho-so': 'Tra cứu hồ sơ bệnh án',
            'yeu-cau-truy-cap': 'Quản lý yêu cầu truy cập',
            'chi-dinh': 'Chỉ định chờ thực hiện',
            'ket-qua': 'Cập nhật kết quả',
            'ho-so-ca-nhan': 'Hồ sơ của tôi',
            'lich-su': 'Lịch sử khám bệnh',
            'dat-kham': 'Quản lý yêu cầu đặt khám',
            'dat-kham-online': 'Đặt khám online',
            'bao-cao-doanh-thu': 'Báo cáo Doanh thu'
        };
        return titles[page] || 'Trang chủ';
    },
    
    loadDashboard() {
        Dashboard.render();
    },
    
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
        
        switch(type) {
            case 'success':
                toast.classList.add('bg-success', 'text-white');
                break;
            case 'error':
                toast.classList.add('bg-danger', 'text-white');
                break;
            case 'warning':
                toast.classList.add('bg-warning');
                break;
            default:
                toast.classList.add('bg-info', 'text-white');
        }
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    },
    
    showLoading() {
        // Tạo loading overlay nếu chưa có
        let loadingOverlay = document.getElementById('loadingOverlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loadingOverlay';
            loadingOverlay.innerHTML = `
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `;
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.style.display = 'flex';
    },
    
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
};

// Khởi động ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
