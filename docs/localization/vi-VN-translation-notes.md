# Ghi chú bản địa hóa tiếng Việt (bản làm việc)

> Tài liệu tham chiếu tạm thời cho quá trình triển khai và hiệu đính. Cập nhật hoặc gộp nội dung này vào hướng dẫn bản địa hóa chính thức khi phạm vi dịch thuật mở rộng.

## Phạm vi hiện tại

Bản thay đổi đầu tiên bổ sung nền tảng i18n dùng chung, lựa chọn và lưu ngôn ngữ, cập nhật thuộc tính `lang` của tài liệu, cùng bản dịch tiếng Việt cho một lát cắt giao diện gồm thanh điều hướng và phần Cài đặt chung. **Đây chưa phải bản dịch toàn bộ ứng dụng.** Các màn hình tạo ảnh/video, thư viện, đăng nhập, thanh toán và nhiều hộp thoại dùng chung vẫn cần được rà soát và dịch theo từng đợt.

## Nguồn tham chiếu chính thống

1. **Unicode — Unicode Normalization Forms (UAX #15):** https://www.unicode.org/reports/tr15/  
   Dùng để hiểu NFC/NFD và tránh khác biệt mã hóa giữa ký tự tiếng Việt dựng sẵn và dấu kết hợp. Bản dịch nên được lưu ở UTF-8; kiểm tra NFC trong test không thay thế cho kiểm tra hiển thị thực tế.
2. **Unicode CLDR — Core locale data:** https://www.unicode.org/reports/tr35/  
   Tham chiếu quy tắc locale có cấu trúc, tên locale và dữ liệu định dạng; sử dụng `vi-VN` khi định dạng ngày, số và dữ liệu theo vùng.
3. **Unicode CLDR — Date and time formats:** https://www.unicode.org/reports/tr35/tr35-dates.html  
   Tham chiếu định dạng ngày giờ theo locale; tránh tự ghép chuỗi ngày tháng bằng quy tắc chỉ áp dụng cho tiếng Anh.
4. **W3C — Declaring language in HTML:** https://www.w3.org/International/questions/qa-html-language-declarations.html  
   Phải đặt thuộc tính `lang` ở phần tử `html` để công nghệ hỗ trợ tiếp cận và trình duyệt xác định đúng ngôn ngữ nội dung.

## Bảng thuật ngữ khởi đầu

| English | Tiếng Việt thống nhất | Ghi chú |
| --- | --- | --- |
| Settings | Cài đặt | Dùng nhất quán cho mục và tiêu đề. |
| General | Chung | Tên mục trong Cài đặt. |
| Appearance | Giao diện | Không dùng xen kẽ “Diện mạo”. |
| Downloads | Tải xuống | Động từ/danh từ chức năng tải tệp. |
| Keybinds / Keyboard shortcuts | Phím tắt | “Bảng tra cứu phím tắt” khi chỉ cheat sheet. |
| Prompt | Câu lệnh | Trong ngữ cảnh câu mô tả cho mô hình tạo sinh. |
| Generate | Tạo | Dịch theo hành động UI; không dùng “sản xuất”. |
| Model | Mô hình | Giữ nguyên thuật ngữ AI. |
| Credits | Lượt sử dụng | Theo ngữ cảnh hạn mức tạo nội dung; cần rà soát các màn hình thanh toán trước khi áp dụng toàn cục. |
| Balance | Số dư | Trong ngữ cảnh credits: “số dư lượt sử dụng”. |
| Upload | Tải lên | Đối lập với “Tải xuống”. |
| Retry | Thử lại | Hành động thử lại thao tác thất bại. |

## Quy tắc biên tập

- Dùng tiếng Việt hiện đại, chuyên nghiệp, dễ hiểu trên toàn quốc; ưu tiên câu ngắn, hướng hành động.
- Mặc định không thêm đại từ xưng hô nếu câu vẫn rõ nghĩa. Không đổi sắc thái câu lệnh thành câu hỏi hoặc lời quảng cáo.
- Dịch chức năng thay vì dịch từng từ: ví dụ `Submit` là “Gửi” trong ngữ cảnh gửi biểu mẫu/câu lệnh.
- Giữ nguyên tên thương hiệu, tên mô hình, tên API, tên biến, đường dẫn, phím tắt, cú pháp mã và ký hiệu kỹ thuật.
- Không dịch hoặc đổi thứ tự placeholder như `{count}`, `{0}`, `%s`; giữ nguyên thẻ HTML/Markdown và chuỗi định dạng.
- Dùng Unicode UTF-8, kiểm tra NFC, dấu tiếng Việt và độ tương phản/chiều cao dòng. Không được dựa riêng vào ảnh chụp màn hình có font thay thế.
- Không tự ý áp dụng định dạng ngày/số toàn cục bằng thay thế chuỗi; dùng API locale như `Intl.DateTimeFormat('vi-VN')` và `Intl.NumberFormat('vi-VN')` theo ngữ cảnh.

## Kiểm tra chất lượng dịch (LQA)

### Kiểm thử tự động

Chạy test locale trong thư viện common:

```bash
cd frontend/libs/common && npx vitest run --config vite.config.ts src/lib/i18n.spec.ts
```

Test kiểm tra đủ khóa, không làm mất placeholder, chuỗi tiếng Việt ở dạng NFC, những nhãn bắt buộc không bị để nguyên tiếng Anh, nội suy biến và lưu lựa chọn locale. Các kiểm tra tự động **không thể chứng minh ngữ nghĩa đã chính xác**; cần người biên tập đọc đối chiếu với ngữ cảnh chức năng.

### Kiểm thử thủ công cần thực hiện

1. Mở **Cài đặt → Chung**, đổi qua lại giữa English và Tiếng Việt; xác nhận nhãn đổi ngay và được giữ sau khi khởi động lại ứng dụng.
2. Kiểm tra các dấu ă, â, đ, ê, ô, ơ, ư và tổ hợp dấu hỏi/ngã/nặng trên giao diện thực tế.
3. Kiểm tra cửa sổ nhỏ, độ phóng đại hệ điều hành, nút hẹp, tooltip và hộp thoại để phát hiện tràn chữ/cắt dấu.
4. Kiểm tra các luồng tạo ảnh/video, tải lên, thông báo lỗi, thanh toán và đăng nhập trước khi coi bản dịch là hoàn chỉnh.
5. Mỗi đợt dịch cần đối chiếu hành vi gốc, rà soát thuật ngữ trong bảng trên và ghi rõ các mục chưa có bản dịch.

