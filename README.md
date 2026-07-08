# Frontend

Đây là thư mục chứa mã nguồn Frontend cho hệ thống HustStay. Hệ thống giao diện được chia thành 3 ứng dụng độc lập dành cho 3 đối tượng người dùng khác nhau.

Các dự án đều được xây dựng bằng **Vite + ReactJS**.

---

## 🏗 Cấu trúc ứng dụng

Hệ thống bao gồm 3 portal (cổng thông tin):

- **Customer** (Khách hàng): Giao diện cho người dùng cuối tìm kiếm khách sạn, xem phòng, đánh giá, trò chuyện với ChatBot và đặt phòng.
- **Hotel** (Chủ khách sạn): Giao diện cho các đối tác đăng tải thông tin khách sạn, quản lý phòng, duyệt đặt phòng.
- **Admin** (Quản trị viên hệ thống): Giao diện tổng để quản lý toàn bộ người dùng, duyệt khách sạn, và theo dõi doanh thu toàn hệ thống.

---

## 🐳 Cách 1: Chạy bằng Docker Compose (Khuyến nghị)

Cách nhanh nhất để chạy cả 3 giao diện lên cùng một lúc là sử dụng Docker. Docker sẽ tự động build code và phục vụ thông qua NGINX.

### Bước 1 — Build và khởi động toàn bộ Frontend

Mở terminal tại thư mục `FE` (chứa file `docker-compose.yml`) và chạy:

```bash
docker compose up --build -d
```

### Bước 2 — Truy cập các ứng dụng

Sau khi container chạy thành công, truy cập vào các đường dẫn sau:

| Ứng dụng | Đường dẫn truy cập | Cổng Docker |
|----------|--------------------|-------------|
| **Admin** | http://localhost:5171 | `5171` |
| **Customer** | http://localhost:5172 | `5172` |
| **Hotel** | http://localhost:5173 | `5173` |

### Quản lý Docker

- Kiểm tra trạng thái: `docker compose ps`
- Xem logs: `docker compose logs -f`
- Dừng hệ thống: `docker compose down`

---

## 💻 Cách 2: Chạy local thủ công (npm)

> Dùng cách này khi bạn muốn viết code, chỉnh sửa UI và cần tính năng **Hot Reload** (cập nhật giao diện ngay lập tức khi lưu code).

### Yêu cầu
- Node.js (khuyến nghị phiên bản 18+ LTS)
- npm (đi kèm với Node.js)

### Cách chạy từng Portal

Mở 3 terminal riêng biệt để chạy đồng thời hoặc chọn chạy portal mà bạn muốn code.

#### 1. Chạy Customer Portal
```bash
cd Customer
npm install
npm run dev
```

#### 2. Chạy Hotel Portal
```bash
cd Hotel
npm install
npm run dev
```

#### 3. Chạy Admin Portal
```bash
cd Admin
npm install
npm run dev
```

*(Lưu ý: Mặc định Vite sẽ tự động cấp cổng `5173`, nếu cổng đó bận nó sẽ tự nhảy sang `5174`, v.v. Hãy xem màn hình terminal của `npm run dev` để biết chính xác URL local)*.

---

## ⚙️ Cấu hình API Endpoint (Môi trường Local)

Khi chạy ở môi trường local, Frontend cần gọi tới Backend API Gateway. Thông thường URL của backend được thiết lập sẵn trong file `.env` hoặc các file constant bên trong mỗi thư mục dự án (ví dụ: `VITE_API_BASE_URL=http://localhost:1111`).

Nếu bạn chạy Backend ở cổng khác, vui lòng tìm file `.env` trong thư mục `Admin/`, `Customer/`, `Hotel/` để cấu hình lại cho đúng.





cd ~/FE

# 1) Hạ stack FE nếu có
docker-compose down --remove-orphans || true

# 2) Xóa sạch 3 container FE cũ
docker rm -f fe-customer fe-admin fe-hotel 2>/dev/null || true

# 3) Xóa cả container cũ do compose tạo theo tên dạng <id>_fe-customer nếu còn sót
docker ps -a --format '{{.ID}} {{.Names}}' | grep 'fe-customer\|fe-admin\|fe-hotel'

# nếu thấy container lạ còn sót thì xóa luôn bằng ID hoặc NAME:
# docker rm -f <ID_hoac_NAME>

# 4) Build lại sạch
docker-compose build --no-cache

# 5) Chạy lại, nhưng ưu tiên tạo mới chứ không recreate container lỗi cũ
docker-compose up -d --force-recreate