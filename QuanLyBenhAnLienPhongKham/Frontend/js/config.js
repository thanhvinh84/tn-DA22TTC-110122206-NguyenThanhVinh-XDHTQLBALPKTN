// Cấu hình API
const API_BASE_URL = 'http://localhost:5000/api';

// Endpoints
const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    ME: '/auth/me',
    
    // Test
    TEST_DB: '/test-db',
    
    // Bệnh nhân
    BENH_NHAN: '/benh-nhan',
    BENH_NHAN_SEARCH: '/benh-nhan/search',
    
    // Hồ sơ bệnh án
    HO_SO: '/ho-so',
    HO_SO_BY_BENH_NHAN: '/ho-so/by-benh-nhan',
    
    // Đợt khám
    DOT_KHAM: '/dot-kham',
    DOT_KHAM_BAC_SI: '/dot-kham/bac-si',
    
    // Chẩn đoán
    CHAN_DOAN: '/chan-doan',
    
    // Chỉ định cận lâm sàng
    CHI_DINH: '/chi-dinh',
    
    // Phòng khám
    PHONG_KHAM: '/phong-kham'
};

// Vai trò
const ROLES = {
    ADMIN: 'VT_ADMIN',
    LETAN: 'VT_LETAN',
    BACSI: 'VT_BACSI',
    KYTHUATVIEN: 'VT_KYTHUATVIEN',
    BENHNHAN: 'VT_BENHNHAN'
};

// Trạng thái đợt khám
const TRANG_THAI_DOT_KHAM = {
    CHO_KHAM: 'Chờ khám',
    DANG_KHAM: 'Đang khám',
    CHO_XET_NGHIEM: 'Chờ xét nghiệm',
    DA_CO_KET_QUA: 'Đã có kết quả',
    HOAN_TAT: 'Hoàn tất',
    HUY: 'Hủy'
};

// Trạng thái chỉ định
const TRANG_THAI_CHI_DINH = {
    CHO_THUC_HIEN: 'Chờ thực hiện',
    DANG_THUC_HIEN: 'Đang thực hiện',
    DA_CO_KET_QUA: 'Đã có kết quả',
    DA_HUY: 'Đã hủy'
};

// Trạng thái hóa đơn
const TRANG_THAI_HOA_DON = {
    CHUA_THANH_TOAN: 'Chưa thanh toán',
    DA_THANH_TOAN: 'Đã thanh toán',
    DA_HUY: 'Đã hủy'
};
