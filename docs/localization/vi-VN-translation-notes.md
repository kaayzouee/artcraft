# Ghi chú bản địa hóa tiếng Việt cho ArtCraft

> Tài liệu làm việc cho nhánh thử nghiệm. Phạm vi giao diện hiện tại chỉ là một lát cắt; chưa phải bản dịch hoàn chỉnh của toàn bộ ArtCraft.

## 1. Quyết định kiến trúc: tương thích với craft-i18n

Từ điển TypeScript riêng đã được thay bằng catalog TSV theo quy ước của [storytold/craft-i18n — Catalog format](https://github.com/storytold/craft-i18n/blob/main/docs/catalog-format.md):

- Mỗi dòng có ba cột phân cách bằng TAB: ngữ cảnh, chuỗi nguồn tiếng Anh chính xác, bản dịch.
- Khóa tra cứu là chuỗi nguồn tiếng Anh và ngữ cảnh; không tạo bộ ID dịch độc lập kiểu settings.general.
- Tôn trọng escape \n, \t, \\; placeholder dạng {name}; dấu ba chấm … ở cuối; không cho phép bản dịch rỗng hay khóa trùng.
- Các chuỗi dùng chung nằm trong common.tsv; các chuỗi riêng của ArtCraft nằm trong artcraft.tsv. Không chép vào catalog ứng dụng một dòng đã có trong common.tsv nếu bản dịch không khác.
- Tên ngôn ngữ trên bộ chọn lấy từ dòng @id với nguồn language.name. Vì thế giao diện hiển thị tên bản địa Tiếng Việt mà không duy trì thêm một khóa tùy chỉnh.

### Vị trí và nguồn dữ liệu hiện tại

- Catalog chung được đóng gói cùng thư viện common tại frontend/libs/common/src/lib/locales/vi/common.tsv. Đây là bản snapshot nguyên trạng từ storytold/craft-i18n, commit [2c95a6d6a05dbb12dc75ba5b1c13fd89346ae604](https://github.com/storytold/craft-i18n/commit/2c95a6d6a05dbb12dc75ba5b1c13fd89346ae604); blob nguồn common.tsv là [57b142d5fa457d0c35a2d24121631fb93232708c](https://github.com/storytold/craft-i18n/blob/main/locales/vi/common.tsv). Khi cập nhật catalog chung, phải đồng bộ từ nguồn có ghim phiên bản và ghi lại commit mới.
- Catalog riêng của ArtCraft là frontend/apps/artcraft/app/src/locales/vi/artcraft.tsv. Phần dịch mới không lặp lại các dòng chung như Home, Settings, General, About, Appearance và Language nếu có thể dùng nguyên văn bản dịch chung.
- Frontend React hiện đọc TSV lúc build bằng Vite và đăng ký catalog ArtCraft vào runtime dùng chung. Thứ tự tra cứu là catalog ArtCraft → catalog chung → nguyên văn tiếng Anh. Cơ chế runtime Rust mô tả trong craft-i18n chưa được dùng trực tiếp bởi frontend React; TSV và quy tắc dữ liệu được thống nhất trước, còn bước tích hợp runtime chính thức vẫn cần phối hợp upstream.

## 2. Phạm vi bản dịch hiện tại

Đã bản địa hóa một số mục trong thanh điều hướng, tooltip trạng thái lượt sử dụng và Cài đặt → Chung, cùng phần tiêu đề/điều hướng của Cài đặt và hộp thoại xác nhận đặt lại tính năng thử nghiệm. Nhiều khu vực khác vẫn có thể hiển thị tiếng Anh, gồm các luồng tạo ảnh/video, thư viện, đăng nhập, thanh toán, nhiều hộp thoại và các thành phần dùng chung chưa được chuyển sang hàm dịch.

## 3. Quy ước tiếng Việt

| English | Dùng thống nhất | Ghi chú |
| --- | --- | --- |
| Settings | Cài đặt | Theo catalog chung. |
| General | Chung | Theo catalog chung. |
| Appearance | Diện mạo | Bản dịch mặc định trong catalog chung; ngữ cảnh theme có thể dùng Giao diện. |
| Downloads | Tải xuống | Nhãn điều hướng. |
| Keybinds / Keyboard shortcuts | Phím tắt | “Bảng tra cứu phím tắt” khi chỉ cheatsheet. |
| Prompt | Câu lệnh | Trong ngữ cảnh nội dung gửi cho mô hình tạo sinh. |
| Generate | Tạo | Dùng như nhãn hành động. |
| Model | Mô hình | Giữ nguyên thuật ngữ AI. |
| Credits | Lượt sử dụng | Cần rà soát lại ngữ cảnh màn hình thanh toán trước khi áp dụng toàn cục. |
| Retry | Thử lại | Hành động thử lại khi thao tác thất bại. |

Dùng tiếng Việt hiện đại, rõ ràng và ngắn gọn. Giữ nguyên tên thương hiệu, tên mô hình, API, phím tắt, placeholder và cú pháp mã. Lưu tệp UTF-8, giữ Unicode NFC và xác minh hiển thị dấu tiếng Việt trong giao diện thực tế.

## 4. Phát hiện ngôn ngữ và lưu lựa chọn

Runtime thử nghiệm ưu tiên lựa chọn lưu trong craft.language, tiếp đến khóa legacy st-locale để không mất thiết lập cũ, tham số URL ?lang=, navigator.languages rồi mới dùng tiếng Anh. Thuộc tính HTML được đặt thành vi-VN hoặc en. Đây vẫn là triển khai cục bộ, chưa có host config hoặc khóa ngôn ngữ dùng chung đã được maintainer phê duyệt.

Các đề xuất upstream [ArtCraft #2382](https://github.com/storytold/artcraft/issues/2382) và [ArtCraft #2405](https://github.com/storytold/artcraft/issues/2405) còn là issue mở, không nên coi toàn bộ nội dung của chúng như một đặc tả chính thức.

## 5. Kiểm thử chất lượng

Từ thư mục frontend, có thể chạy:

    cd libs/common
    npx vitest run --config vite.config.ts src/lib/i18n.spec.ts

    cd ../../apps/artcraft/app
    npx vitest run --config ../vite.config.ts src/locales/vi/artcraft.spec.ts

    cd ../../..
    npx nx run artcraft:build

Test kiểm tra cú pháp TSV, hàng trùng/rỗng, placeholder, dấu ba chấm, Unicode NFC, fallback về tiếng Anh, ưu tiên catalog ứng dụng so với catalog chung, nhãn ngôn ngữ và lưu lựa chọn locale. Những kiểm tra này không thay thế đánh giá ngữ nghĩa của người biên tập.

Trước khi mở rộng phạm vi, cần đối chiếu các chuỗi được sử dụng thật trong mã nguồn với catalog để tìm chuỗi thiếu hoặc lỗi thời; sau đó rà soát các màn hình ở kích thước nhỏ, tooltip, thông báo lỗi và hộp thoại để phát hiện câu bị cắt hoặc khó hiểu.
