// Quản lý authentication
const Auth = {
    // Lưu token
    setToken(token) {
        localStorage.setItem('token', token);
    },
    
    // Lấy token
    getToken() {
        return localStorage.getItem('token');
    },
    
    // Xóa token
    removeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    // Lưu thông tin user
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    
    // Lấy thông tin user
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    // Kiểm tra đã đăng nhập chưa
    isAuthenticated() {
        return !!this.getToken();
    },
    
    // Kiểm tra vai trò
    hasRole(role) {
        const user = this.getUser();
        return user && user.maVaiTro === role;
    },
    
    // Kiểm tra có một trong các vai trò
    hasAnyRole(roles) {
        const user = this.getUser();
        return user && roles.includes(user.maVaiTro);
    },
    
    // Đăng xuất
    logout() {
        this.removeToken();
        window.location.reload();
    }
};
