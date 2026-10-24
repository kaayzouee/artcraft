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



## Rà soát yêu cầu i18n từ upstream

Ngày rà soát: 24/10/2026. Các issue bên dưới vẫn là **đề xuất đang mở**, không nên xem là quyết định kiến trúc đã được maintainer phê duyệt.

### Các issue liên quan trực tiếp

- [ArtCraft #2382 — multi-language support with drop-in translation files](https://github.com/storytold/artcraft/issues/2382): đề xuất dùng thư viện i18n tiêu chuẩn (ví dụ `react-i18next`), một tệp JSON cho mỗi ngôn ngữ, tên ngôn ngữ hiển thị theo ngôn ngữ bản địa, dropdown tự phát hiện catalog, fallback về tiếng Anh khi thiếu khóa, và đổi ngôn ngữ tức thì. Issue còn đề cập nạp/chia sẻ tệp dịch do người dùng đóng góp.
- [ArtCraft #2405 — detect, remember and centrally set interface language](https://github.com/storytold/artcraft/issues/2405): đề xuất thứ tự ưu tiên ngôn ngữ cho web build: lựa chọn đã lưu ở cấp bộ ứng dụng, cấu hình host `craft-config.json` (có thể khóa lựa chọn), tham số URL `?lang=`, danh sách `navigator.languages`, cuối cùng là tiếng Anh. Đây là đề xuất cho nhiều ứng dụng cùng origin, không chỉ ArtCraft.
- [ArtCraft #2120 — localization of ArtCraft UI (Czech)](https://github.com/storytold/artcraft/issues/2120): người đóng góp đề cập các ứng dụng Craft khác có catalog, nhưng ArtCraft cần một quy trình/cấu trúc dịch rõ ràng.
- [ArtCraft #2474 — Chinese localization is incomplete](https://github.com/storytold/artcraft/issues/2474): phản ánh các prompt và thao tác phụ cũng cần được bản địa hóa, không chỉ nhãn menu.

### Chuẩn tham khảo trong các repo cùng hệ sinh thái

- [`storytold/craft-i18n` — định dạng catalog](https://github.com/storytold/craft-i18n/blob/main/docs/catalog-format.md): catalog dạng TSV với các cột ngữ cảnh, chuỗi nguồn tiếng Anh và bản dịch; hỗ trợ ngữ cảnh phân biệt nghĩa, placeholder `{name}`, plural theo CLDR, tên ngôn ngữ bản địa và catalog chưa đầy đủ với fallback về tiếng Anh. CI kiểm tra khóa trùng, bản dịch rỗng, placeholder và dấu ba chấm cuối chuỗi.
- [`storytold/craft-i18n` — cách tích hợp](https://github.com/storytold/craft-i18n/blob/main/docs/integration.md): mô hình dùng catalog chung và catalog riêng từng ứng dụng; thiếu bản dịch không làm hỏng ứng dụng và vẫn hiển thị văn bản tiếng Anh. Cách tích hợp trực tiếp hiện được mô tả cho Rust apps, nên không thể mặc định dùng thẳng thư viện này trong React frontend.
- **Đã có catalog tiếng Việt trong upstream**: [`locales/vi/common.tsv`](https://github.com/storytold/craft-i18n/blob/main/locales/vi/common.tsv), cùng các catalog riêng cho [PdfCraft](https://github.com/storytold/craft-i18n/blob/main/locales/vi/pdfcraft.tsv), [PhotoCraft](https://github.com/storytold/craft-i18n/blob/main/locales/vi/photocraft.tsv), [VectorCraft](https://github.com/storytold/craft-i18n/blob/main/locales/vi/vectorcraft.tsv) và [WordCraft](https://github.com/storytold/craft-i18n/blob/main/locales/vi/wordcraft.tsv). Thư mục `locales/vi/` hiện chưa liệt kê catalog `artcraft.tsv`; đây là nguồn đối chiếu thuật ngữ chung hữu ích, nhưng các chuỗi cần được xác minh theo ngữ cảnh UI ArtCraft thay vì sao chép mù quáng.
- [PhotoCraft — hướng dẫn localization](https://github.com/storytold/photocraft/blob/main/docs/localization.md): nêu fallback theo locale, đổi ngôn ngữ không cần khởi động lại, giữ nguyên placeholder, kiểm thử độ bao phủ catalog, thử giao diện với chuỗi thật và kiểm tra lỗi font/ký tự bị cắt.
- [PhotoCraft — nguyên tắc UI/localization](https://github.com/storytold/photocraft/blob/main/docs/ui-design.md): phân biệt khóa nội bộ với nhãn hiển thị, dùng ID ổn định cho hành vi và yêu cầu test ngăn thiếu bản dịch trong phần giao diện đã đánh dấu hoàn chỉnh.

### Khoảng cách giữa prototype hiện tại và các yêu cầu upstream

1. Prototype hiện tại dùng từ điển TypeScript tĩnh; chưa có catalog JSON/TSV có thể thêm mà không sửa code.
2. Lựa chọn ngôn ngữ đang lưu trong `st-locale` ở từng ứng dụng; chưa dùng khóa dùng chung cho toàn bộ Craft apps, cấu hình host hoặc `?lang=`.
3. Phát hiện tự động hiện dùng `navigator.language`; chưa xét đầy đủ thứ tự `navigator.languages` và đối chiếu catalog đã đăng ký.
4. Các test hiện xác minh tính toàn vẹn của phần từ điển đã thêm; chưa có báo cáo coverage cho toàn bộ chuỗi giao diện và chưa chứng minh mọi prompt/thao tác phụ đã được dịch.

Vì vậy, CI tạm thời của PR này chỉ xác nhận phần bản dịch thử nghiệm và khả năng build frontend. Trước khi mở rộng sang toàn bộ giao diện, nên quyết định định dạng catalog và cơ chế fallback theo hướng tương thích với mục tiêu upstream; không nên coi prototype là kiến trúc i18n cuối cùng.
