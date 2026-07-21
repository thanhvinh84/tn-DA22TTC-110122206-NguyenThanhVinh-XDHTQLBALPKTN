const BaoCaoDoanhThu = {
    data: {
        thongKe: null,
        tuNgay: null,
        denNgay: null,
        charts: {}
    },

    async init() {
        // Mặc định 30 ngày gần nhất
        this.data.denNgay = new Date().toISOString().split('T')[0];
        this.data.tuNgay = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
        
        this.renderPage();
        await this.loadData();
    },

    renderPage() {
        const html = `
            <div class="container-fluid">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2><i class="bi bi-graph-up"></i> Báo cáo Doanh thu</h2>
                    <div class="btn-group" id="filterButtons">
                        <button class="btn btn-outline-primary btn-sm" data-filter="7days" onclick="BaoCaoDoanhThu.filter7Days()">7 ngày</button>
                        <button class="btn btn-outline-primary btn-sm active" data-filter="30days" onclick="BaoCaoDoanhThu.filter30Days()">30 ngày</button>
                        <button class="btn btn-outline-primary btn-sm" data-filter="thismonth" onclick="BaoCaoDoanhThu.filterThisMonth()">Tháng này</button>
                        <button class="btn btn-outline-primary btn-sm" data-filter="thisyear" onclick="BaoCaoDoanhThu.filterThisYear()">Năm nay</button>
                    </div>
                </div>

                <!-- Filter -->
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Từ ngày</label>
                                <input type="date" class="form-control" id="tuNgay" value="${this.data.tuNgay}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Đến ngày</label>
                                <input type="date" class="form-control" id="denNgay" value="${this.data.denNgay}">
                            </div>
                            <div class="col-md-6 d-flex align-items-end">
                                <button class="btn btn-primary" onclick="BaoCaoDoanhThu.applyFilter()">
                                    <i class="bi bi-funnel"></i> Lọc
                                </button>
                                <button class="btn btn-outline-secondary ms-2" onclick="BaoCaoDoanhThu.refresh()">
                                    <i class="bi bi-arrow-clockwise"></i> Làm mới
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cards thống kê -->
                <div class="row mb-4" id="statsCards">
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2">Đang tải dữ liệu...</p>
                    </div>
                </div>

                <!-- Biểu đồ -->
                <div class="row mb-4">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-graph-up"></i> Doanh thu theo ngày</h5>
                            </div>
                            <div class="card-body">
                                <canvas id="chartDoanhThuNgay" height="80"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-pie-chart"></i> Trạng thái hóa đơn</h5>
                            </div>
                            <div class="card-body">
                                <canvas id="chartTrangThai"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Biểu đồ theo tháng và Top 10 -->
                <div class="row mb-4">
                    <div class="col-md-7">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-bar-chart"></i> Doanh thu theo tháng</h5>
                            </div>
                            <div class="card-body">
                                <canvas id="chartDoanhThuThang" height="60"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-trophy"></i> Top 10 Bệnh nhân</h5>
                            </div>
                            <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                                <div id="top10BenhNhan"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = html;
    },

    async loadData() {
        try {
            App.showLoading();
            const response = await API.get(
                `/hoa-don/thong-ke/doanh-thu?tuNgay=${this.data.tuNgay}&denNgay=${this.data.denNgay}`
            );
            
            if (response.success) {
                this.data.thongKe = response.data;
                this.renderStatsCards();
                this.renderTop10();
                this.renderCharts();
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            App.showToast('Lỗi tải dữ liệu: ' + error.message, 'error');
            document.getElementById('statsCards').innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle"></i> Không thể tải dữ liệu: ${error.message}
                    </div>
                </div>
            `;
        } finally {
            App.hideLoading();
        }
    },

    renderStatsCards() {
        const tk = this.data.thongKe;
        const html = `
            <div class="col-md-3">
                <div class="card border-primary shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <p class="text-muted mb-1"><small>Tổng doanh thu</small></p>
                                <h4 class="text-primary mb-0">${this.formatMoney(tk.tongDoanhThu)}</h4>
                            </div>
                            <div class="bg-primary bg-opacity-10 p-3 rounded">
                                <i class="bi bi-cash-stack fs-2 text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-success shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <p class="text-muted mb-1"><small>Số hóa đơn</small></p>
                                <h4 class="text-success mb-0">${tk.soLuongHoaDon}</h4>
                                <small class="text-muted">hóa đơn đã thanh toán</small>
                            </div>
                            <div class="bg-success bg-opacity-10 p-3 rounded">
                                <i class="bi bi-receipt fs-2 text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-info shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <p class="text-muted mb-1"><small>Trung bình/HĐ</small></p>
                                <h4 class="text-info mb-0">${this.formatMoney(tk.doanhThuTrungBinh)}</h4>
                            </div>
                            <div class="bg-info bg-opacity-10 p-3 rounded">
                                <i class="bi bi-calculator fs-2 text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-warning shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <p class="text-muted mb-1"><small>Chưa thanh toán</small></p>
                                <h4 class="text-warning mb-0">${this.formatMoney(tk.thongKeTrangThai.tongChuaThanhToan)}</h4>
                                <small class="text-muted">${tk.thongKeTrangThai.chuaThanhToan} hóa đơn</small>
                            </div>
                            <div class="bg-warning bg-opacity-10 p-3 rounded">
                                <i class="bi bi-hourglass-split fs-2 text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('statsCards').innerHTML = html;
    },

    renderCharts() {
        const tk = this.data.thongKe;
        
        // Destroy old charts nếu có
        Object.values(this.data.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        // 1. Biểu đồ doanh thu theo ngày - NÂNG CẤP
        const ctx1 = document.getElementById('chartDoanhThuNgay');
        
        // Tạo gradient
        const gradient = ctx1.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(13, 110, 253, 0.4)');
        gradient.addColorStop(0.5, 'rgba(13, 110, 253, 0.2)');
        gradient.addColorStop(1, 'rgba(13, 110, 253, 0.05)');
        
        this.data.charts.ngay = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: tk.doanhThuTheoNgay.map(d => {
                    const date = new Date(d.ngay);
                    return date.toLocaleDateString('vi-VN', { 
                        weekday: 'short',
                        day: '2-digit', 
                        month: '2-digit' 
                    });
                }),
                datasets: [{
                    label: 'Doanh thu',
                    data: tk.doanhThuTheoNgay.map(d => d.tongTien),
                    borderColor: '#0d6efd',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#0d6efd',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#0d6efd',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { 
                        display: false 
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        bodySpacing: 6,
                        displayColors: true,
                        callbacks: {
                            title: (context) => {
                                const index = context[0].dataIndex;
                                const date = new Date(tk.doanhThuTheoNgay[index].ngay);
                                return date.toLocaleDateString('vi-VN', { 
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long', 
                                    day: 'numeric' 
                                });
                            },
                            label: (context) => {
                                const index = context.dataIndex;
                                const data = tk.doanhThuTheoNgay[index];
                                return [
                                    'Doanh thu: ' + this.formatMoney(data.tongTien),
                                    'Số hóa đơn: ' + data.soLuong + ' hóa đơn',
                                    'Trung bình: ' + this.formatMoney(data.tongTien / data.soLuong)
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.08)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: (value) => {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
        
        // 2. Biểu đồ trạng thái - NÂNG CẤP
        const ctx2 = document.getElementById('chartTrangThai');
        this.data.charts.trangThai = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Đã thanh toán', 'Chưa thanh toán'],
                datasets: [{
                    data: [
                        tk.thongKeTrangThai.daThanhToan,
                        tk.thongKeTrangThai.chuaThanhToan
                    ],
                    backgroundColor: ['#198754', '#ffc107'],
                    borderWidth: 3,
                    borderColor: '#fff',
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                const label = context.label;
                                const value = context.parsed;
                                const total = tk.thongKeTrangThai.daThanhToan + tk.thongKeTrangThai.chuaThanhToan;
                                const percentage = ((value / total) * 100).toFixed(1);
                                const tien = label === 'Đã thanh toán' 
                                    ? tk.thongKeTrangThai.tongDaThanhToan 
                                    : tk.thongKeTrangThai.tongChuaThanhToan;
                                return [
                                    label + ': ' + value + ' hóa đơn',
                                    'Tỷ lệ: ' + percentage + '%',
                                    'Số tiền: ' + this.formatMoney(tien)
                                ];
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                }
            }
        });
        
        // 3. Biểu đồ theo tháng - NÂNG CẤP
        const ctx3 = document.getElementById('chartDoanhThuThang');
        this.data.charts.thang = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: tk.doanhThuTheoThang.map(d => `T${d.thang}/${d.nam}`),
                datasets: [{
                    label: 'Doanh thu',
                    data: tk.doanhThuTheoThang.map(d => d.tongTien),
                    backgroundColor: 'rgba(13, 110, 253, 0.8)',
                    borderColor: '#0d6efd',
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverBackgroundColor: '#0d6efd'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            title: (context) => {
                                const index = context[0].dataIndex;
                                const data = tk.doanhThuTheoThang[index];
                                return `Tháng ${data.thang}/${data.nam}`;
                            },
                            label: (context) => {
                                const index = context.dataIndex;
                                const data = tk.doanhThuTheoThang[index];
                                return [
                                    'Doanh thu: ' + this.formatMoney(data.tongTien),
                                    'Số hóa đơn: ' + data.soLuong + ' hóa đơn',
                                    'Trung bình: ' + this.formatMoney(data.tongTien / data.soLuong)
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.08)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: (value) => {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    },

    renderTop10() {
        const tk = this.data.thongKe;
        if (!tk.top10BenhNhan || tk.top10BenhNhan.length === 0) {
            document.getElementById('top10BenhNhan').innerHTML = '<p class="text-muted">Chưa có dữ liệu</p>';
            return;
        }
        
        const html = tk.top10BenhNhan.map((bn, index) => `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div class="d-flex align-items-center">
                    <div class="me-3">
                        ${index < 3 
                            ? `<i class="bi bi-trophy-fill fs-4 text-warning"></i>` 
                            : `<span class="badge bg-secondary">${index + 1}</span>`
                        }
                    </div>
                    <div>
                        <strong>${bn.hoTen}</strong>
                        <br><small class="text-muted">${bn.maBenhNhan} • ${bn.soLanKham} lần khám</small>
                    </div>
                </div>
                <div class="text-end">
                    <strong class="text-primary">${this.formatMoney(bn.tongChiTieu)}</strong>
                </div>
            </div>
        `).join('');
        
        document.getElementById('top10BenhNhan').innerHTML = html;
    },

    formatMoney(amount, showUnit = true) {
        const formatted = new Intl.NumberFormat('vi-VN').format(Math.round(amount));
        return showUnit ? `${formatted} đ` : formatted;
    },

    // Filter methods
    filter7Days() {
        this.setActiveButton('7days');
        this.data.denNgay = new Date().toISOString().split('T')[0];
        this.data.tuNgay = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
        document.getElementById('tuNgay').value = this.data.tuNgay;
        document.getElementById('denNgay').value = this.data.denNgay;
        this.loadData();
    },

    filter30Days() {
        this.setActiveButton('30days');
        this.data.denNgay = new Date().toISOString().split('T')[0];
        this.data.tuNgay = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
        document.getElementById('tuNgay').value = this.data.tuNgay;
        document.getElementById('denNgay').value = this.data.denNgay;
        this.loadData();
    },

    filterThisMonth() {
        this.setActiveButton('thismonth');
        const now = new Date();
        this.data.denNgay = new Date().toISOString().split('T')[0];
        this.data.tuNgay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        document.getElementById('tuNgay').value = this.data.tuNgay;
        document.getElementById('denNgay').value = this.data.denNgay;
        this.loadData();
    },

    filterThisYear() {
        this.setActiveButton('thisyear');
        const now = new Date();
        this.data.denNgay = new Date().toISOString().split('T')[0];
        this.data.tuNgay = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        document.getElementById('tuNgay').value = this.data.tuNgay;
        document.getElementById('denNgay').value = this.data.denNgay;
        this.loadData();
    },

    setActiveButton(filterType) {
        // Remove active class from all buttons
        document.querySelectorAll('#filterButtons button').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to selected button
        const activeBtn = document.querySelector(`#filterButtons button[data-filter="${filterType}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    },

    applyFilter() {
        this.data.tuNgay = document.getElementById('tuNgay').value;
        this.data.denNgay = document.getElementById('denNgay').value;
        this.loadData();
    },

    refresh() {
        this.loadData();
    }
};
