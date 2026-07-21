# 📖 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ BỆNH ÁN LIÊN PHÒNG KHÁM

## 📑 MỤC LỤC

1. [Giới thiệu](#giới-thiệu)
2. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
3. [Cài đặt và khởi động](#cài-đặt-và-khởi-động)
4. [Đăng nhập hệ thống](#đăng-nhập-hệ-thống)
5. [Hướng dẫn sử dụng theo vai trò](#hướng-dẫn-sử-dụng-theo-vai-trò)
   - [Admin](#admin)
   - [Lễ tân](#lễ-tân)
   - [Bác sĩ](#bác-sĩ)
6. [Các chức năng chính](#các-chức-năng-chính)
7. [Câu hỏi thường gặp](#câu-hỏi-thường-gặp)
8. [Liên hệ hỗ trợ](#liên-hệ-hỗ-trợ)

---

## 🎯 GIỚI THIỆU

Hệ thống Quản lý Bệnh án Liên phòng khám là một giải pháp quản lý toàn diện cho các phòng khám, 
giúp số hóa quy trình khám chữa bệnh từ tiếp nhận, khám bệnh, kê đơn thuốc đến quản lý hồ sơ bệnh án.

### Tính năng nổi bật:
- ✅ Quản lý hồ sơ bệnh nhân điện tử
- ✅ Quy trình khám bệnh chuyên nghiệp
- ✅ Kê đơn thuốc và chỉ định cận lâm sàng
- ✅ Quản lý thông tin dị ứng
- ✅ Báo cáo thống kê doanh thu
- ✅ Chia sẻ hồ sơ giữa các phòng khám
- ✅ In phiếu khám và hóa đơn

---

## 💻 YÊU CẦU HỆ THỐNG

### Phần cứng tối thiểu:
- CPU: Intel Core i3 hoặc tương đương
- RAM: 4GB trở lên
- Ổ cứng: 500MB dung lượng trống

### Phần mềm:
- Hệ điều hành: Windows 10/11, macOS 10.15+, hoặc Linux
- Trình duyệt web: Chrome 90+, Firefox 88+, Edge 90+ (khuyến nghị Chrome)
- .NET 8.0 Runtime (cho Backend)
- SQL Server 2019 hoặc mới hơn

---

## 🚀 CÀI ĐẶT VÀ KHỞI ĐỘNG

### Bước 1: Cấu hình Database
1. Mở SQL Server Management Studio
2. Chạy script khởi tạo database tại thư mục `Database/init.sql`
3. Cập nhật connection string trong file `Backend/appsettings.json`

### Bước 2: Khởi động Backend API
```bash
cd Backend
dotnet run
```
Backend sẽ chạy tại: `http://localhost:5000`

### Bước 3: Khởi động Frontend
1. Mở file `Frontend/index.html` bằng trình duyệt
2. Hoặc sử dụng Live Server extension trong VS Code

### Bước 4: Kiểm tra kết nối
- Truy cập trang đăng nhập
- Nếu thấy form đăng nhập hiển thị, hệ thống đã sẵn sàng

---

## 🔐 ĐĂNG NHẬP HỆ THỐNG

### Tài khoản mặc định:

#### Admin (Quản trị viên)
- **Tên đăng nhập:** admin
- **Mật khẩu:** admin123

#### Lễ tân
- **Tên đăng nhập:** letan
- **Mật khẩu:** letan123

#### Bác sĩ
- **Tên đăng nhập:** bacsi
- **Mật khẩu:** bacsi123

> ⚠️ **Lưu ý:** Nên đổi mật khẩu ngay sau lần đăng nhập đầu tiên

### Quy trình đăng nhập:
1. Mở trang đăng nhập
2. Nhập tên đăng nhập và mật khẩu
3. Nhấn nút "Đăng nhập"
4. Hệ thống sẽ chuyển đến trang Dashboard tương ứng với vai trò

---

## 👥 HƯỚNG DẪN SỬ DỤNG THEO VAI TRÒ

## 🔧 ADMIN (QUẢN TRỊ VIÊN)

Admin có toàn quyền quản lý hệ thống và truy cập tất cả các chức năng.

### 1. Dashboard
- Xem tổng quan hoạt động: số bệnh nhân, số lượt khám, doanh thu
- Biểu đồ thống kê theo ngày/tháng
- Danh sách bệnh nhân mới nhất

### 2. Quản lý Tài khoản

**Xem danh sách tài khoản:**
- Menu: **Quản lý Tài khoản** → **Tài khoản**
- Hiển thị: Tên đăng nhập, vai trò, trạng thái, mã nhân viên

**Thêm tài khoản mới:**
1. Nhấn nút **"+ Thêm tài khoản"**
2. Điền thông tin:
   - Mã nhân viên (chọn từ danh sách)
   - Tên đăng nhập (duy nhất)
   - Mật khẩu
   - Vai trò (Admin/Lễ tân/Bác sĩ)
3. Nhấn **"Lưu"**

**Sửa tài khoản:**
1. Nhấn nút **"Sửa"** (biểu tượng bút chì)
2. Cập nhật thông tin cần thiết
3. Nhấn **"Cập nhật"**

**Khóa/Mở khóa tài khoản:**
- Nhấn nút **"Khóa"/"Mở khóa"** để thay đổi trạng thái
- Tài khoản bị khóa không thể đăng nhập

**Đổi mật khẩu:**
1. Nhấn nút **"Đổi mật khẩu"** (biểu tượng chìa khóa)
2. Nhập mật khẩu mới
3. Xác nhận

### 3. Quản lý Nhân viên

**Thêm nhân viên:**
1. Menu: **Quản lý Nhân viên** → **Nhân viên**
2. Nhấn **"+ Thêm nhân viên"**
3. Điền thông tin cá nhân:
   - Họ tên, giới tính, ngày sinh
   - CCCD, số điện thoại
   - Email, địa chỉ
   - Vai trò
4. Nhấn **"Lưu"**

**Quản lý Bác sĩ:**
- Menu: **Quản lý Nhân viên** → **Bác sĩ**
- Thêm chuyên khoa cho bác sĩ
- Cập nhật thông tin hành nghề

### 4. Quản lý Phòng khám

**Thêm phòng khám:**
1. Menu: **Quản lý Phòng khám**
2. Nhấn **"+ Thêm phòng khám"**
3. Điền thông tin:
   - Tên phòng khám
   - Địa chỉ, số điện thoại
   - Email
4. Nhấn **"Lưu"**

### 5. Báo cáo Doanh thu

**Xem báo cáo:**
1. Menu: **Báo cáo Doanh thu**
2. Chọn khoảng thời gian (từ ngày - đến ngày)
3. Nhấn **"Xem báo cáo"**
4. Hệ thống hiển thị:
   - Tổng doanh thu
   - Số lượt khám
   - Biểu đồ theo ngày
   - Chi tiết từng hóa đơn

---

## 📋 LỄ TÂN (TIẾP NHẬN)


Lễ tân chịu trách nhiệm tiếp nhận bệnh nhân, tạo hồ sơ và quản lý lịch khám.

### 1. Tiếp nhận Bệnh nhân

**Bước 1: Kiểm tra bệnh nhân**
1. Menu: **Lễ tân** → **Tiếp nhận**
2. Tìm kiếm bệnh nhân theo:
   - Số điện thoại
   - CCCD
   - Họ tên

**Bước 2a: Bệnh nhân mới (chưa có trong hệ thống)**
1. Nhấn **"+ Thêm bệnh nhân mới"**
2. Điền đầy đủ thông tin:
   - **Thông tin cá nhân:** Họ tên, ngày sinh, giới tính
   - **Liên hệ:** Số điện thoại, email, địa chỉ
   - **Giấy tờ:** CCCD, số BHYT (nếu có)
   - **Nghề nghiệp**
3. Thêm thông tin dị ứng (nếu có):
   - Nhấn **"+ Thêm dị ứng"**
   - Điền: Tên dị ứng, mức độ, tác nhân gây dị ứng
   - **⚠️ Bắt buộc:** Biểu hiện dị ứng (mẩn đỏ, ngứa, khó thở...)
4. Nhấn **"Lưu"**

**Bước 2b: Bệnh nhân cũ (đã có trong hệ thống)**
1. Chọn bệnh nhân từ kết quả tìm kiếm
2. Kiểm tra và cập nhật thông tin (nếu cần)

**Bước 3: Tạo đợt khám**
1. Sau khi chọn/tạo bệnh nhân, nhấn **"Tạo đợt khám"**
2. Điền thông tin đợt khám:
   - **Lý do khám:** Triệu chứng chính (sốt, đau bụng, ho...)
   - **Chuyên khoa:** Nội, ngoại, nhi, da liễu...
   - **Bác sĩ khám:** Chọn từ danh sách
3. Nhấn **"Tạo đợt khám"**
4. Bệnh nhân được thêm vào danh sách chờ khám

### 2. Quản lý Bệnh nhân

**Xem danh sách bệnh nhân:**
- Menu: **Quản lý Bệnh nhân**
- Tìm kiếm theo: Mã BN, họ tên, số điện thoại, CCCD

**Xem hồ sơ bệnh án:**
1. Nhấn nút **"Xem hồ sơ"** (biểu tượng folder)
2. Hiển thị:
   - Thông tin cá nhân
   - Lịch sử khám bệnh
   - Thông tin dị ứng
   - Chẩn đoán
   - Đơn thuốc

**Sửa thông tin bệnh nhân:**
1. Nhấn nút **"Sửa"** (biểu tượng bút chì)
2. Cập nhật thông tin
3. Nhấn **"Cập nhật"**

**Quản lý thông tin dị ứng:**
1. Trong trang hồ sơ, tab **"Thông tin dị ứng"**
2. **Thêm dị ứng mới:**
   - Nhấn **"+ Thêm dị ứng"**
   - Điền đầy đủ thông tin (⚠️ Biểu hiện là bắt buộc)
3. **Sửa thông tin dị ứng:**
   - Nhấn nút **"Sửa"** bên cạnh dị ứng cần chỉnh sửa
   - Cập nhật thông tin
   - Nhấn **"Cập nhật"**
4. **Xóa dị ứng:**
   - Nhấn nút **"Xóa"** (biểu tượng thùng rác)
   - Xác nhận

### 3. Danh sách Chờ khám

**Theo dõi bệnh nhân chờ:**
- Menu: **Bệnh nhân Chờ khám**
- Hiển thị: Mã BN, họ tên, lý do khám, bác sĩ, thời gian
- Trạng thái: Chờ khám / Đang khám / Hoàn thành

---

## 🩺 BÁC SĨ (KHÁM BỆNH)

Bác sĩ thực hiện khám bệnh, chẩn đoán và kê đơn thuốc.

### 1. Xem danh sách Chờ khám

1. Menu: **Bệnh nhân Chờ khám**
2. Danh sách hiển thị bệnh nhân chờ khám của bác sĩ
3. Nhấn **"Khám"** để bắt đầu khám bệnh nhân

### 2. Quy trình Khám bệnh

Sau khi nhấn "Khám", hệ thống mở form khám bệnh với 5 tab theo thứ tự:

#### **Tab 1: Chỉ số Sức sống** ❤️
Nhập các chỉ số sinh hiệu:
- **Nhịp tim** (lần/phút): VD: 70
- **Huyết áp tâm thu** (mmHg): VD: 120
- **Huyết áp tâm trương** (mmHg): VD: 80
- **Nhiệt độ** (°C): VD: 36.5
- **Nhịp thở** (lần/phút): VD: 18
- **Cân nặng** (kg): VD: 65

👉 Nhấn **"Lưu chỉ số"**

#### **Tab 2: Triệu chứng & Khám** 📋
- **Triệu chứng chính:** Mô tả triệu chứng bệnh nhân trình bày
  - VD: "Sốt cao 39°C kéo dài 3 ngày, ho có đàm"
- **Khám lâm sàng:** Ghi chú kết quả khám
  - VD: "Phổi: Ran ẩm bên phải, tim: Nhịp đều, bụng: Mềm"

👉 Nhấn **"Lưu thông tin"**

#### **Tab 3: Cận lâm sàng** 🔬
Chỉ định xét nghiệm/dịch vụ:
1. Chọn **Loại chỉ định:**
   - Xét nghiệm
   - Chẩn đoán hình ảnh
   - Thăm dò chức năng
2. Nhập **Tên xét nghiệm/dịch vụ:**
   - VD: "Công thức máu", "X-quang phổi", "Siêu âm bụng"
3. **Ghi chú** (nếu cần)

👉 Nhấn **"Lưu chỉ định"**

**Xem danh sách chỉ định:**
- Hiển thị bên dưới form
- Có thể xóa nếu nhập nhầm


#### **Tab 4: Chẩn đoán** 🏥
1. Chọn **Loại chẩn đoán:**
   - Sơ bộ
   - Xác định
   - Phân biệt

2. **Chọn bệnh (ICD-10):**
   - Tìm kiếm bệnh theo mã hoặc tên
   - VD: Gõ "J18" → Tìm thấy "Viêm phổi"
   - ✅ Có thể chọn nhiều bệnh cùng lúc

3. **Nội dung chẩn đoán:**
   - Mô tả chi tiết chẩn đoán
   - VD: "Viêm phổi cấp thùy dưới phổi phải, mức độ trung bình"

👉 Nhấn **"Lưu chẩn đoán"**

**Danh sách chẩn đoán đã lưu:**
- Hiển thị bên dưới
- Có thể xóa nếu cần

#### **Tab 5: Đơn thuốc** 💊
1. Nhấn **"+ Thêm thuốc"**
2. Tìm kiếm thuốc theo tên
3. Điền thông tin:
   - **Số lượng:** VD: 20 (viên)
   - **Liều dùng:** VD: "Uống 1 viên x 2 lần/ngày"
   - **Ghi chú:** "Uống sau ăn"
4. Nhấn **"Thêm"**

**Quản lý đơn thuốc:**
- Xem danh sách thuốc đã kê
- Sửa hoặc xóa thuốc nếu cần


### 3. Hoàn thành Khám bệnh

Sau khi hoàn tất tất cả các bước:

1. Nhấn **"In phiếu khám"** (nếu cần in ngay)
2. Nhấn **"Hoàn tất khám"**
3. Hệ thống:
   - Cập nhật trạng thái đợt khám
   - Tạo hóa đơn tự động
   - Chuyển bệnh nhân ra khỏi danh sách chờ

### 4. Tra cứu Hồ sơ

**Tìm kiếm hồ sơ:**
1. Menu: **Tra cứu Hồ sơ**
2. Tìm theo: Mã bệnh nhân, họ tên, số điện thoại
3. Nhấn **"Tìm kiếm"**

**Xem chi tiết hồ sơ:**
- Thông tin bệnh nhân
- Lịch sử khám
- Chẩn đoán
- Đơn thuốc
- Kết quả xét nghiệm

**Yêu cầu truy cập hồ sơ liên phòng khám:**
1. Tìm hồ sơ bệnh nhân
2. Nhấn **"Yêu cầu truy cập"**
3. Chọn phòng khám muốn chia sẻ
4. Điền lý do yêu cầu
5. Đợi phòng khám chấp nhận

---

## 📊 CÁC CHỨC NĂNG CHÍNH

### 1. Quản lý Danh mục


**Danh mục Bệnh (ICD-10):**
- Menu: **Quản lý Danh mục** → **Bệnh**
- Thêm/Sửa/Xóa thông tin bệnh
- Mã ICD-10 chuẩn quốc tế

**Danh mục Thuốc:**
- Menu: **Quản lý Danh mục** → **Thuốc**
- Quản lý kho thuốc
- Cập nhật giá, đơn vị tính

**Chuyên khoa:**
- Danh sách các chuyên khoa: Nội, Ngoại, Nhi, Da liễu...

### 2. In ấn Phiếu khám

**In phiếu khám:**
1. Sau khi hoàn tất khám, nhấn **"In phiếu khám"**
2. Phiếu hiển thị đầy đủ:
   - Thông tin bệnh nhân
   - Chỉ số sức sống
   - Triệu chứng và khám lâm sàng
   - Chẩn đoán
   - Chỉ định cận lâm sàng
   - Đơn thuốc
   - Chữ ký bác sĩ
3. Nhấn **Ctrl+P** để in

**In hóa đơn:**
- Tương tự, có thể in hóa đơn thanh toán

### 3. Quản lý Yêu cầu truy cập Hồ sơ

**Gửi yêu cầu:**
1. Menu: **Yêu cầu Truy cập Hồ sơ**
2. Nhấn **"+ Gửi yêu cầu"**
3. Điền thông tin:
   - Phòng khám đích
   - Bệnh nhân
   - Lý do yêu cầu
4. Nhấn **"Gửi"**

**Chấp nhận/Từ chối yêu cầu:**
1. Xem danh sách yêu cầu đến
2. Nhấn **"Chấp nhận"** hoặc **"Từ chối"**
3. Nếu chấp nhận, hồ sơ sẽ được chia sẻ

---

## ❓ CÂU HỎI THƯỜNG GẶP

### 1. Quên mật khẩu?
- Liên hệ Admin để reset mật khẩu
- Admin có thể đổi mật khẩu trong menu Quản lý Tài khoản

### 2. Không tìm thấy thuốc trong danh sách?
- Liên hệ Admin để thêm thuốc mới vào danh mục
- Hoặc tự thêm nếu có quyền quản lý danh mục

### 3. Làm sao để sửa thông tin bệnh nhân đã lưu?
- Vào menu Quản lý Bệnh nhân
- Tìm bệnh nhân cần sửa
- Nhấn nút "Sửa"

### 4. Có thể xóa đợt khám đã tạo không?
- Chỉ Admin mới có quyền xóa
- Nếu cần, liên hệ Admin

### 5. Làm sao để xem lại đơn thuốc đã kê?
- Vào Tra cứu Hồ sơ
- Tìm bệnh nhân
- Xem lịch sử khám → Chọn đợt khám → Xem đơn thuốc

### 6. Có thể in lại phiếu khám không?
- Có, vào Tra cứu Hồ sơ
- Chọn đợt khám cần in
- Nhấn "In phiếu khám"

### 7. Thông tin dị ứng không lưu được?
- Kiểm tra đã điền đầy đủ các trường bắt buộc:
  - Tên dị ứng ✅
  - Mức độ ✅
  - Tác nhân ✅
  - **Biểu hiện dị ứng** ✅ (Bắt buộc)

### 8. Backend không chạy được?
- Kiểm tra .NET 8.0 đã cài đặt
- Kiểm tra SQL Server đang chạy
- Kiểm tra connection string trong appsettings.json

### 9. Dữ liệu không hiển thị?
- Kiểm tra kết nối mạng
- F12 → Console → Xem lỗi
- Kiểm tra Backend có đang chạy không

### 10. Làm sao để backup dữ liệu?
- Sử dụng SQL Server Management Studio
- Backup database định kỳ
- Hoặc sử dụng tính năng tự động backup của SQL Server

---

## 🎓 MẸO SỬ DỤNG HIỆU QUẢ

### Cho Lễ tân:
✅ Luôn kiểm tra thông tin dị ứng khi tiếp nhận bệnh nhân
✅ Xác nhận số điện thoại để liên hệ sau này
✅ Cập nhật địa chỉ nếu bệnh nhân thay đổi


### Cho Bác sĩ:
✅ Kiểm tra thông tin dị ứng trước khi kê đơn
✅ Ghi chú chi tiết triệu chứng để theo dõi sau này
✅ Chọn đúng mã ICD-10 cho chẩn đoán
✅ Ghi rõ liều dùng và cách dùng thuốc
✅ Lưu từng tab trước khi chuyển sang tab khác

### Cho Admin:
✅ Backup database định kỳ (hàng tuần)
✅ Kiểm tra log hệ thống thường xuyên
✅ Cập nhật danh mục bệnh, thuốc khi cần
✅ Đổi mật khẩu định kỳ 3-6 tháng

---

## 🔒 BẢO MẬT VÀ AN TOÀN

### Quy tắc bảo mật:
1. **Không chia sẻ mật khẩu** với người khác
2. **Đăng xuất** khi rời khỏi máy tính
3. **Đổi mật khẩu** ngay sau lần đăng nhập đầu tiên
4. **Không để người khác** sử dụng tài khoản của bạn
5. **Báo ngay** cho Admin nếu phát hiện hoạt động bất thường

### Bảo vệ dữ liệu bệnh nhân:
- Chỉ truy cập hồ sơ khi có nhiệm vụ
- Không sao chép, chụp ảnh hồ sơ bệnh án
- Không chia sẻ thông tin bệnh nhân ra ngoài
- Tuân thủ Luật Bảo vệ dữ liệu cá nhân

---

## 🛠️ XỬ LÝ SỰ CỐ

### Backend không khởi động:
```bash
# Kiểm tra .NET version
dotnet --version

# Rebuild project
cd Backend
dotnet clean
dotnet build
dotnet run
```


### Database lỗi kết nối:
1. Kiểm tra SQL Server có đang chạy
2. Kiểm tra Connection String trong `appsettings.json`
3. Test kết nối bằng SQL Server Management Studio
4. Kiểm tra firewall có chặn cổng 1433 không

### Lỗi đăng nhập:
1. Kiểm tra caps lock
2. Thử tài khoản mặc định (admin/admin123)
3. Liên hệ Admin để reset mật khẩu
4. Kiểm tra Backend có đang chạy

### Lỗi không lưu được dữ liệu:
1. F12 → Console → Xem lỗi chi tiết
2. Kiểm tra kết nối Backend
3. Kiểm tra đã điền đủ trường bắt buộc
4. Xem log Backend để biết lỗi cụ thể

---

## 📞 LIÊN HỆ HỖ TRỢ

### Hỗ trợ kỹ thuật:
- **Email:** support@phongkham.vn
- **Hotline:** 1900-xxxx (8:00 - 17:00, T2-T6)
- **Website:** https://phongkham.vn/support

### Báo lỗi:
- Gửi email kèm:
  - Mô tả lỗi chi tiết
  - Screenshot lỗi (nếu có)
  - Bước tái hiện lỗi
  - Thông tin phiên bản hệ thống

### Yêu cầu tính năng mới:
- Gửi đề xuất qua email
- Hoặc liên hệ hotline

---

## 📝 PHỤ LỤC


### A. Phím tắt hữu ích

| Phím tắt | Chức năng |
|----------|-----------|
| `Ctrl + P` | In trang hiện tại |
| `F5` | Refresh trang |
| `F12` | Mở Developer Tools (debug) |
| `Ctrl + F` | Tìm kiếm trong trang |
| `Esc` | Đóng modal |

### B. Các trạng thái hệ thống

#### Trạng thái Đợt khám:
- 🟡 **Chờ khám:** Đã tạo, đợi bác sĩ khám
- 🔵 **Đang khám:** Bác sĩ đang thực hiện khám
- 🟢 **Hoàn thành:** Đã khám xong
- 🔴 **Hủy:** Đợt khám bị hủy

#### Trạng thái Tài khoản:
- ✅ **Hoạt động:** Có thể đăng nhập
- 🔒 **Bị khóa:** Không thể đăng nhập

#### Mức độ Dị ứng:
- 🟢 **Nhẹ:** Triệu chứng nhẹ, không nguy hiểm
- 🟡 **Trung bình:** Cần theo dõi
- 🟠 **Nặng:** Cần cảnh báo
- 🔴 **Rất nặng:** Nguy hiểm, tuyệt đối tránh

### C. Cấu trúc mã hệ thống

| Loại | Mẫu | Ví dụ |
|------|-----|-------|
| Bệnh nhân | BNxxx | BN001, BN002 |
| Hồ sơ | HSxxx | HS001, HS002 |
| Đợt khám | DKxxxxx | DK00001 |
| Đơn thuốc | DTxxxxx | DT00001 |
| Dị ứng | DUxxx | DU001, DU002 |
| Nhân viên | NVxxx | NV001, NV002 |


### D. Quy trình làm việc chuẩn

#### Quy trình tiếp nhận và khám bệnh:

```
┌─────────────────┐
│  Bệnh nhân đến  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Lễ tân tiếp    │
│  nhận, tạo đợt  │
│  khám           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Bệnh nhân chờ  │
│  trong danh     │
│  sách           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Bác sĩ khám    │
│  - Chỉ số       │
│  - Triệu chứng  │
│  - CLS          │
│  - Chẩn đoán    │
│  - Đơn thuốc    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Hoàn tất,      │
│  in phiếu,      │
│  thanh toán     │
└─────────────────┘
```

---

## 🎉 KẾT LUẬN

Hệ thống Quản lý Bệnh án Liên phòng khám được thiết kế để:
- ✅ Đơn giản hóa quy trình làm việc
- ✅ Tăng hiệu quả khám chữa bệnh
- ✅ Quản lý hồ sơ bệnh án chuyên nghiệp
- ✅ Bảo mật thông tin bệnh nhân
- ✅ Hỗ trợ chia sẻ hồ sơ giữa các phòng khám

### Lưu ý quan trọng:
⚠️ **Luôn backup dữ liệu định kỳ**
⚠️ **Bảo mật thông tin bệnh nhân**
⚠️ **Tuân thủ quy định về bảo vệ dữ liệu cá nhân**


---

## 📚 TÀI LIỆU THAM KHẢO

- [Danh mục ICD-10](https://www.who.int/classifications/icd/icdonlineversions/en/)
- [Luật Khám bệnh, chữa bệnh 2009](https://thuvienphapluat.vn/)
- [Luật Bảo vệ dữ liệu cá nhân](https://thuvienphapluat.vn/)

---

## 📋 LỊCH SỬ CẬP NHẬT

| Phiên bản | Ngày | Nội dung |
|-----------|------|----------|
| 1.0.0 | 2026-01-21 | Phát hành phiên bản đầu tiên |
| 1.0.1 | 2026-01-21 | Bổ sung chức năng sửa dị ứng |
| | | Thêm validation biểu hiện dị ứng bắt buộc |
| | | Sắp xếp lại thứ tự tab khám bệnh |

---

**© 2026 Hệ thống Quản lý Bệnh án Liên phòng khám**

*Tài liệu này được cập nhật thường xuyên. Vui lòng kiểm tra phiên bản mới nhất.*

---

> 💡 **Góp ý:** Nếu bạn có bất kỳ góp ý nào để cải thiện tài liệu này, vui lòng liên hệ qua email support@phongkham.vn

> 🌟 **Chúc bạn sử dụng hệ thống hiệu quả!**
