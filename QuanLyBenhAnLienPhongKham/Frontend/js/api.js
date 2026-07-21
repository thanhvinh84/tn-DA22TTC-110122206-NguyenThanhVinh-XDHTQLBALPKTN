// API helper functions
const API = {
    // Gọi API với fetch
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = Auth.getToken();
        
        console.log('API Request:', {
            url,
            method: options.method || 'GET',
            hasToken: !!token
        });
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
        
        // Thêm token nếu có
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, config);
            
            console.log('API Response:', {
                url,
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });
            
            // Kiểm tra nếu response rỗng
            const text = await response.text();
            if (!text) {
                throw new Error('Backend không trả về dữ liệu. Vui lòng kiểm tra kết nối.');
            }
            
            // Parse JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                console.error('JSON Parse Error:', text);
                throw new Error('Backend trả về dữ liệu không hợp lệ: ' + text.substring(0, 100));
            }
            
            if (!response.ok) {
                // Nếu lỗi 401, có thể token hết hạn
                if (response.status === 401) {
                    console.warn('Token hết hạn hoặc không hợp lệ');
                    // Có thể tự động logout ở đây
                    // Auth.logout();
                    // window.location.reload();
                }
                throw new Error(data.message || `Lỗi ${response.status}: ${response.statusText}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // GET request
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },
    
    // POST request
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // PUT request
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE request
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
    
    // Đăng nhập
    async login(username, password) {
        return this.post(API_ENDPOINTS.LOGIN, {
            tenNguoiDung: username,
            matKhau: password
        });
    },
    
    // Lấy danh sách bệnh nhân
    async getBenhNhan() {
        return this.get(API_ENDPOINTS.BENH_NHAN);
    },
    
    // Tìm kiếm bệnh nhân
    async searchBenhNhan(keyword) {
        return this.get(`${API_ENDPOINTS.BENH_NHAN_SEARCH}?keyword=${encodeURIComponent(keyword)}`);
    },
    
    // Tạo bệnh nhân mới
    async createBenhNhan(data) {
        return this.post(API_ENDPOINTS.BENH_NHAN, data);
    },
    
    // Lấy hồ sơ bệnh án theo mã bệnh nhân
    async getHoSoByMaBenhNhan(maBenhNhan) {
        return this.get(`${API_ENDPOINTS.HO_SO_BY_BENH_NHAN}/${maBenhNhan}`);
    },
    
    // Tạo hồ sơ bệnh án
    async createHoSo(maBenhNhan) {
        return this.post(API_ENDPOINTS.HO_SO, { maBenhNhan });
    },
    
    // Lấy lịch sử khám
    async getLichSuKham(maHoSo) {
        return this.get(`${API_ENDPOINTS.HO_SO}/${maHoSo}/lich-su-kham`);
    },
    
    // Tạo đợt khám mới
    async createDotKham(data) {
        return this.post(API_ENDPOINTS.DOT_KHAM, data);
    },
    
    // Lấy danh sách đợt khám của bác sĩ
    async getDotKhamByBacSi(maBacSi, trangThai = null) {
        let url = `${API_ENDPOINTS.DOT_KHAM_BAC_SI}/${maBacSi}`;
        if (trangThai) {
            url += `?trangThai=${encodeURIComponent(trangThai)}`;
        }
        return this.get(url);
    },
    
    // Lấy chi tiết đợt khám
    async getDotKham(maDotKham) {
        return this.get(`${API_ENDPOINTS.DOT_KHAM}/${maDotKham}`);
    },
    
    // Cập nhật trạng thái đợt khám
    async updateTrangThaiDotKham(maDotKham, trangThai) {
        return this.put(`${API_ENDPOINTS.DOT_KHAM}/${maDotKham}/trang-thai`, { trangThai });
    },
    
    // Lấy danh sách chẩn đoán
    async getChanDoan(maDotKham) {
        return this.get(`${API_ENDPOINTS.CHAN_DOAN}/dot-kham/${maDotKham}`);
    },
    
    // Tạo chẩn đoán
    async createChanDoan(data) {
        return this.post(API_ENDPOINTS.CHAN_DOAN, data);
    },
    
    // Lấy danh sách chỉ định
    async getChiDinh(maDotKham) {
        return this.get(`${API_ENDPOINTS.CHI_DINH}/dot-kham/${maDotKham}`);
    },
    
    // Tạo chỉ định
    async createChiDinh(data) {
        return this.post(API_ENDPOINTS.CHI_DINH, data);
    },
    
    // Lấy danh sách phòng khám
    async getPhongKham() {
        return this.get(API_ENDPOINTS.PHONG_KHAM);
    }
};
