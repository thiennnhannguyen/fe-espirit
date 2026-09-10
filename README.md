# E-SPIRIT

Ứng dụng hỗ trợ người dùng tra cứu phong tục – nghi thức truyền thống, quản lý việc chuẩn bị lễ (checklist), tích hợp lịch âm/dương, trợ lý AI, và kết nối tới sản phẩm/địa điểm liên quan đến các dịp lễ, thờ cúng. Đi kèm là một khu vực quản trị (Admin) để quản lý nội dung, người dùng và chatbot.

> Lưu ý: đây là **khung code (scaffold)** — cấu trúc thư mục, routing và các component/service đã được dựng sẵn dưới dạng "rỗng" kèm ghi chú `TODO`, chưa hiện thực logic/UI thật. Mục tiêu là có một bộ khung thống nhất để cả nhóm bắt đầu code song song theo từng module.

## 1. Tổng quan chức năng

Danh sách được tổng hợp từ tài liệu yêu cầu chức năng của dự án, sắp xếp theo mức ưu tiên.

### 1.1. Phía người dùng (User)

| # | Chức năng | Mô tả |
|---|---|---|
| 1 | Quản lý tài khoản | Đăng ký, đăng nhập, quản lý hồ sơ cá nhân, khôi phục mật khẩu |
| 2 | Tra cứu nghi thức | Tìm kiếm và xem phong tục, nghi thức |
| 3 | Phân loại nội dung | Bộ lọc linh hoạt cho nội dung |
| 4 | Cẩm nang hướng dẫn | Dữ liệu hướng dẫn thực tế, chi tiết |
| 5 | Lịch âm | Tích hợp lịch âm/dương, đồng bộ sự kiện vào Google Calendar / Apple Calendar |
| 6 | Quản lý checklist | Khởi tạo, chỉnh sửa, đánh dấu tiến độ sắp lễ; chia sẻ list cho người thân |
| 7 | Trợ lý AI | Chatbot hỗ trợ người dùng |
| 8 | Đánh giá nội dung | Người dùng đánh giá trải nghiệm |
| 9 | Gửi yêu cầu phản hồi | Gửi phản hồi / đề xuất nội dung đến admin |
| 10 | Tìm kiếm sản phẩm | Tra cứu mặt hàng theo tên, công dụng, dịp lễ |
| 11 | Gợi ý sản phẩm | Đề xuất sản phẩm theo ngữ cảnh (thuật toán phân tích) |
| 12 | Đồng bộ dữ liệu TMĐT | Tích hợp API từ sàn thương mại điện tử |
| 13 | Chuyển hướng mua sắm | Gắn link affiliate sang nền tảng TMĐT |
| 14 | Đề xuất điểm bán / địa điểm thờ cúng | Gợi ý danh sách địa điểm tâm linh phù hợp |
| 15 | Tích hợp bản đồ | Định vị GPS/địa chỉ, chỉ đường đến địa điểm gợi ý |

### 1.2. Phía quản trị (Admin)

| # | Chức năng | Mô tả |
|---|---|---|
| 1 | Đăng nhập admin | Chỉ 1 tài khoản admin |
| 2 | Đăng ký admin | Tạo tài khoản admin mới *(đang cân nhắc)* |
| 3 | Bảo mật | Quên mật khẩu, đổi mật khẩu |
| 4 | Quản lý sự kiện / bài viết | Danh sách (tìm kiếm, lọc theo loại/vùng miền/tôn giáo), thêm/sửa/xóa/ẩn bài viết, sửa link giỏ hàng gắn trong bài |
| 5 | Quản lý người dùng | Danh sách user, khóa/mở tài khoản, xem lịch sử đăng nhập & tần suất hoạt động |
| 6 | Quản lý nội dung chatbot | Xem/sửa câu trả lời mẫu, quản lý kịch bản nội dung chatbot |
| 7 | Quản lý nội dung trang Home | Ảnh, banner, bài viết nổi bật, đề xuất hàng hóa cho ngày lễ gần nhất, nội dung footer |
| 8 | Báo cáo và thống kê | Dashboard theo dõi số liệu |

## 2. Công nghệ sử dụng

- **React 18** + **Vite** — SPA, dev server nhanh
- **React Router v6** — routing, tách 2 khu vực `/` (user) và `/admin`
- **Axios** — gọi API
- **Context API** (`AuthContext`) — quản lý trạng thái đăng nhập; có thể nâng cấp lên Redux/Zustand nếu state phức tạp hơn
- CSS thuần (`src/styles`) — có thể thay bằng Tailwind/SCSS tùy nhóm quyết định

Backend, cơ sở dữ liệu và các API bên thứ 3 (sàn TMĐT, bản đồ, Google Calendar, AI) không nằm trong phạm vi repo này — xem mục "Tích hợp bên ngoài".

## 3. Cấu trúc thư mục

```
e-spirit-frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── public/
└── src/
    ├── main.jsx                # entry point
    ├── App.jsx                 # render router tổng
    ├── routes/
    │   ├── AppRoutes.jsx        # khai báo toàn bộ route (user + admin)
    │   └── PrivateRoute.jsx     # guard route cần đăng nhập / quyền admin
    ├── layouts/
    │   ├── UserLayout.jsx       # Header + Footer + <Outlet/>
    │   └── AdminLayout.jsx      # Sidebar + <Outlet/>
    ├── pages/
    │   ├── user/                # 1 file / 1 chức năng phía user
    │   └── admin/                # 1 file / 1 chức năng phía admin
    ├── components/
    │   ├── common/               # Header, Footer, Navbar, Button, Modal, LoadingSpinner
    │   ├── user/                 # RitualCard, ProductCard, ChecklistItem, RatingStars, MapView, CalendarSync, FilterBar
    │   └── admin/                 # Sidebar, DataTable, StatCard
    ├── services/                  # lớp gọi API, 1 file / 1 nhóm chức năng
    ├── hooks/                      # useAuth, useDebounce, useFetch
    ├── context/                    # AuthContext
    ├── utils/                      # constants, formatDate, lunarCalendar
    ├── assets/                     # images, icons
    └── styles/                     # global.css, variables.css
```

Quy ước: mỗi trang trong `pages/` tương ứng 1 dòng trong bảng chức năng ở mục 1, mỗi service trong `services/` bọc các API call cho 1 nhóm chức năng — giúp map ngược lại yêu cầu dễ dàng khi phân công việc trong nhóm.

## 4. Bắt đầu

```bash
npm install
cp .env.example .env   # rồi điền các key/URL thật
npm run dev
```

## 5. Tích hợp bên ngoài (cần API key / thỏa thuận riêng)

- **Google Calendar / Apple Calendar API** — đồng bộ sự kiện lịch âm (`calendarService.js`)
- **Bản đồ (Google Maps hoặc Mapbox)** — định vị, chỉ đường (`locationService.js`, `MapView`)
- **API sàn TMĐT** — đồng bộ dữ liệu sản phẩm, tạo link affiliate (`ecommerceService.js`)
- **Dịch vụ AI (chatbot)** — trợ lý AI hỗ trợ người dùng (`chatbotService.js`)

## 6. Việc tiếp theo

Đây mới là khung — các bước tiếp theo cho từng thành viên:

1. Thiết kế UI/UX (wireframe/Figma) cho từng trang trong `pages/`
2. Hiện thực từng `service` khi backend có API thật (thay các hàm TODO bằng call `api.js`)
3. Chuẩn hoá state management nếu Context không đủ (ví dụ khi checklist / giỏ hàng phức tạp)
4. Viết test cho các luồng chính: đăng nhập, tra cứu, checklist, chatbot
