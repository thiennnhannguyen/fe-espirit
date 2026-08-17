# E-SPIRIT – Frontend

## 1. Tổng quan

**E-SPIRIT** là nền tảng trực tuyến hỗ trợ người dùng, đặc biệt là những người trẻ lần đầu tự chuẩn bị các hoạt động cúng kiếng trong gia đình.

Website cung cấp thông tin và kiến thức về phong tục, nghi thức cúng kiếng theo từng dịp, đồng thời hỗ trợ người dùng tìm hiểu và lựa chọn các dịch vụ, mặt hàng và sản phẩm tâm linh phù hợp.

Dự án được xây dựng nhằm tạo ra một giao diện trực quan, dễ sử dụng và tổ chức thông tin rõ ràng cho người dùng.

## 2. Mục tiêu

* Cung cấp kiến thức về phong tục và nghi thức cúng kiếng.
* Tổ chức nội dung theo từng dịp để người dùng dễ tìm kiếm.
* Giới thiệu các dịch vụ cúng kiếng.
* Giới thiệu các mặt hàng và sản phẩm tâm linh.
* Xây dựng giao diện website phù hợp với người dùng.
* Hoàn thiện website ở mức có thể triển khai thực tế.

## 3. Công nghệ sử dụng

### Frontend

* HTML5
* CSS3
* JavaScript
* Postman
* Figma
* VS Code
* Git
* GitHub

## 4. Chức năng chính

> Đang cập nhật

## 5. Cấu trúc Frontend

```text
fe-espirit-frontend/
│
├── index.html
│
├── pages/
|   ├── Sẽ được cập nhật sau
│   └── ...
│
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   └── ...
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── README.md
```

## 6. Cách chạy project trên Local

### Bước 1: Clone repository

`
git clone <repository-url>
`

Ví dụ:

`
git clone https://github.com/<username>/fe-espirit.git
`

### Bước 2: Di chuyển vào project

`
cd fe-espirit-frontend
`

### Bước 3: Mở project bằng VS Code

`
code .
`

Hoặc mở trực tiếp folder `fe-espirit-frontend` bằng VS Code.

### Bước 4: Chạy website

Project sử dụng HTML/CSS/JavaScript thuần nên có thể chạy bằng **Live Server**.

Trong VS Code:

1. Cài extension **Live Server**.
2. Mở file `index.html`.
3. Click chuột phải vào `index.html`.
4. Chọn **Open with Live Server**.

Website sẽ được mở tại địa chỉ tương tự:

`
http://127.0.0.1:5500/
`

hoặc:

`
http://localhost:5500/
`

## 7. Quy trình Git dành cho Team

### Clone project

`
git clone <repository-url> 
`

### Tạo branch riêng

Ví dụ thành viên phụ trách Menu:

`
git checkout -b feature/menu
`

### Kiểm tra branch

`
git branch
`

### Commit code

`
git add .
git commit -m "feat: add menu page"
`

### Push branch

`
git push -u origin feature/menu
`

Sau đó tạo **Pull Request** trên GitHub để review và merge code.

## 8. Quy ước Commit

Team sử dụng Conventional Commits:
|Types|Mô tả|
|---|---|
|feat|Thêm tính năng mới|
|fix|Sửa lỗi|
|docs|Cập nhật tài liệu|
|style|Thay đổi giao diện/format|
|refactor|Tái cấu trúc code|
|chore|Cấu hình hoặc công việc hệ thống|

Ví dụ:

```
git commit -m "feat: add knowledge page"
git commit -m "fix: fix navbar responsive"
git commit -m "docs: update README"
git commit -m "style: update homepage layout"
```

## 9. Team Workflow

```text
GitHub Repository
        │
    git clone
        │
   Create Branch
        │
   Development
        │
      Commit
        │
       Push
        │
 Pull Request
        │
   Code Review
        │
      Merge
```

## 10. Kết quả đầu ra

> Đang cập nhật

---

## 11. Trạng thái dự án

**Status:** In Design

Dự án đang trong giai đoạn phát triển Demo cho team Dev
