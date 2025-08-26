# KẾ HOẠCH PHÁT TRIỂN ỨNG DỤNG QUẢN LÝ HỌC SINH

> Tài liệu định nghĩa phạm vi, tính năng, mô hình dữ liệu, API, bảo mật và lộ trình triển khai cho hệ thống gồm **Admin (quản lý)** và **Người dùng (phụ huynh/học sinh/giáo viên)**.

---

## 1) Mục tiêu & Phạm vi

- Xây dựng hệ thống quản lý lịch học, lớp học, học sinh, giáo viên, điểm số, bài kiểm tra, bài tập về nhà (BTVN) và doanh thu.
- Cung cấp ứng dụng web/mobile cho người dùng xem lịch, điểm, kiểm tra, BTVN và số dư.
- Đảm bảo xác thực an toàn: đăng ký/đăng nhập, quên mật khẩu qua mã xác nhận (OTP).

## 2) Vai trò người dùng

- **Admin (Quản lý):** cấu hình hệ thống, CRUD dữ liệu, xem báo cáo doanh thu, quản trị người dùng & phân quyền.
- **Giáo viên:** (tùy chọn mở rộng) tạo bài kiểm tra, nhập điểm, giao BTVN, cập nhật lịch dạy.
- **Phụ huynh/Học sinh (Người dùng):** xem lịch học, số dư, bài kiểm tra, điểm số, BTVN.

## 3) Chức năng cốt lõi

### 3.1 Xác thực (Auth)

- **Đăng ký**
  - Trường: `sdt_bo_me`, `ten_hoc_sinh`, `lop`, `mat_khau`  
  - Ràng buộc mật khẩu: **≥ 8 ký tự**, **ít nhất 1 chữ số** (khuyến nghị thêm chữ hoa/ký tự đặc biệt).
  - Tùy chọn xác minh OTP trước khi kích hoạt tài khoản.
- **Đăng nhập**
  - Trường: `sdt`, `mat_khau`.
  - JWT (access + refresh), ghi nhận thiết bị/phiên.
- **Quên mật khẩu**
  - Bước: nhập `sdt` → nhận **mã xác nhận (OTP)** → đặt **mật khẩu mới**.
  - OTP 6 số, hết hạn 5 phút, giới hạn 5 lần thử, rate-limit theo IP/thiết bị.

### 3.2 Dashboard **Admin**

- **Quản lý lịch học:** tạo/nhập TKB theo lớp; lịch dạy theo giáo viên; xuất/nhập file.
- **Quản lý học sinh:** CRUD, gán vào lớp, phụ huynh, trạng thái theo năm học.
- **Quản lý lớp học:** CRUD, gán giáo viên chủ nhiệm, năm học, khối.
- **Quản lý thầy cô:** CRUD, phân môn, lịch dạy, hợp đồng (tùy chọn).
- **Doanh thu:** cấu hình học phí, ghi nhận thanh toán, công nợ, báo cáo.
- **Kiểm tra & điểm:** tạo bài kiểm tra, cấu hình trọng số, nhập điểm, xuất sổ điểm.
- **Phân quyền:** RBAC theo vai trò (admin/teacher/parent/student).

### 3.3 Ứng dụng **Người dùng**

- **Xem lịch học** theo lớp/học sinh, đồng bộ theo tuần/tháng.
- **Xem số dư**: học phí phải thu, đã nộp, còn nợ, lịch sử thanh toán.
- **Xem bài kiểm tra**: lịch kiểm tra, mô tả, tài liệu ôn tập (nếu có).
- **Xem điểm số**: theo môn, theo kỳ, biểu đồ xu hướng.
- **Xem BTVN**: tiêu đề, mô tả, hạn nộp, tài liệu; (mở rộng) nộp bài online.

---

## 4) Quy trình nghiệp vụ (User Flows)

**Đăng ký**

1. Phụ huynh nhập `sdt_bo_me`, `ten_hoc_sinh`, `lop`, `mat_khau` → gửi.
2. (Tùy chọn) Nhận OTP → xác minh → tạo tài khoản + hồ sơ học sinh.

**Đăng nhập**

1. Nhập `sdt` + `mat_khau` → hệ thống phát JWT → chuyển đến dashboard phù hợp vai trò.

**Quên mật khẩu**

1. Nhập `sdt` → nhận OTP → nhập OTP + `mat_khau_moi` → đặt lại thành công.

**Admin tạo lịch học**

1. Chọn lớp → thêm các tiết (môn, giáo viên, phòng, thời gian) → lưu → đồng bộ hiển thị cho người dùng.

**Nhập điểm** (Giáo viên hoặc Admin)

1. Chọn bài kiểm tra/lớp → nhập điểm theo học sinh → lưu → cập nhật bảng điểm & thông báo.

**Quản lý doanh thu**

1. Tạo khoản phí theo lớp/học sinh → ghi nhận thanh toán → đối soát → báo cáo.

---

## 5) Mô hình dữ liệu (gợi ý)

### 5.1 Bảng/Collections chính

- **users**: `id`, `phone`, `password_hash`, `role`(admin|teacher|parent|student), `status`, `created_at`.
- **students**: `id`, `full_name`, `class_id`, `parent_user_id`, `dob`, `gender`, `status`.
- **teachers**: `id`, `user_id`, `full_name`, `subjects[]`.
- **classes**: `id`, `name` (VD: 10A1), `grade`, `homeroom_teacher_id`, `school_year`.
- **schedules**: `id`, `class_id`, `weekday`(1-7), `period`, `subject`, `teacher_id`, `room`, `start_time`, `end_time`.
- **exams**: `id`, `class_id`, `subject`, `name`, `date`, `weight`, `description`.
- **exam_results**: `id`, `exam_id`, `student_id`, `score`, `comment`.
- **homeworks**: `id`, `class_id`, `subject`, `title`, `description`, `due_date`, `attachments[]`.
- **homework_submissions** (mở rộng): `id`, `homework_id`, `student_id`, `file_url`, `submitted_at`, `score`, `feedback`.
- **fees**: `id`, `student_id`, `amount`, `type`, `due_date`, `status`(unpaid|partial|paid), `note`.
- **payments**: `id`, `student_id`, `amount`, `method`, `transaction_id`, `created_at`.
- **verifications**: `id`, `phone`, `code_hash`, `purpose`(signup|reset_pw), `expires_at`, `attempts`, `status`.
- **audit_logs**: `id`, `actor_user_id`, `action`, `target`, `metadata`, `created_at`.

**Chỉ mục (Indexes) khuyến nghị:**

- `users(phone)` unique.
- `students(class_id)`, `exam_results(exam_id, student_id)`, `schedules(class_id, weekday)`, `fees(student_id, status)`, `payments(student_id, created_at desc)`, `verifications(phone, purpose)`.

### 5.2 Ràng buộc & Quy tắc

- **Số điện thoại:** 10 chữ số (VN), chuẩn hóa `0xxxxxxxxx`.
- **Mật khẩu:** ≥ 8 ký tự, ≥ 1 chữ số; hash bằng Argon2/Bcrypt.
- **Điểm số:** 0.0 – 10.0 (bước 0.1), chặn nhập ngoài khoảng.
- **Trọng số bài kiểm tra (weight):** tổng theo môn/kỳ = 1.0 (hoặc 100%).

---

## 6) Thiết kế API (REST gợi ý)

### 6.1 Auth

- `POST /auth/register` – body: `{ phone, studentName, className, password }`
- `POST /auth/login` – body: `{ phone, password }`
- `POST /auth/forgot-password/request` – body: `{ phone }`
- `POST /auth/forgot-password/verify` – body: `{ phone, otp }`
- `POST /auth/forgot-password/reset` – body: `{ phone, otp, newPassword }`
- `POST /auth/refresh` – body: `{ refreshToken }`
- `POST /auth/logout`

### 6.2 Admin

- **Lớp:** `GET/POST/PATCH/DELETE /admin/classes`
- **Học sinh:** `GET/POST/PATCH/DELETE /admin/students`
- **Giáo viên:** `GET/POST/PATCH/DELETE /admin/teachers`
- **Lịch học:** `GET/POST/PATCH/DELETE /admin/schedules`
- **Bài kiểm tra:** `GET/POST/PATCH/DELETE /admin/exams`
- **Điểm:** `GET/POST/PATCH/DELETE /admin/exam-results`
- **Khoản phí & thanh toán:** `GET/POST/PATCH/DELETE /admin/fees`, `GET/POST /admin/payments`
- **BTVN:** `GET/POST/PATCH/DELETE /admin/homeworks`

### 6.3 Người dùng

- **Lịch học:** `GET /me/schedules?week=YYYY-Www` hoặc `?from=&to=`
- **Số dư:** `GET /me/balance` (tổng hợp từ fees & payments)
- **Bài kiểm tra:** `GET /me/exams`
- **Điểm:** `GET /me/grades`
- **BTVN:** `GET /me/homeworks`

**Mã lỗi & phản hồi chuẩn hóa:**

- 200, 201, 400, 401, 403, 404, 409, 422, 429, 500.
- `traceId`, `message`, `errors[]` theo trường, `data`.

---

## 7) Bảo mật & Tuân thủ

- Hash mật khẩu bằng **Argon2** (ưu tiên) hoặc **BCrypt**, salt riêng.
- Lưu **OTP dạng hash**, không lưu plain; hết hạn 5 phút; rate-limit 5 phút/5 lần.
- **JWT** access ngắn hạn (15–30 phút), refresh dài hơn (7–30 ngày), có cơ chế revoke.
- **RBAC**: kiểm tra quyền ở middleware; audit log thao tác quan trọng.
- **Chống lộ lọt:** hạn chế PII, ẩn số ĐT (xxx***xxx) trong log, mã hóa at-rest (tuỳ chọn).
- **Sao lưu** DB theo ngày, kiểm thử khôi phục định kỳ.

---

## 8) Không chức năng (NFR)

- **Hiệu năng:** P95 API < 300ms cho truy vấn phổ biến (lịch, điểm, BTVN).
- **Khả dụng:** 99.9% (SLA nội bộ), giám sát uptime.
- **Khả mở rộng:** tách services Auth, Học tập, Thanh toán khi cần.
- **Khả dụng trên di động:** PWA hoặc app (mở rộng).

---

## 9) Giao diện (sitemap tối thiểu)

**Admin**

- Trang tổng quan: số lớp, HS, lịch hôm nay, công nợ nổi bật.
- Lớp học · Học sinh · Giáo viên · Lịch học · Bài kiểm tra · Điểm · BTVN · Doanh thu · Cấu hình.

**Người dùng**

- Trang chủ: lịch tuần, thông báo mới.
- Lịch học · BTVN · Bài kiểm tra · Điểm số · Số dư.

---

## 10) Lộ trình triển khai (gợi ý)

1. **Thiết kế & CSDL**: mô hình, migration, seed dữ liệu mẫu.
2. **Module Auth**: đăng ký/OTP/đăng nhập/quên mật khẩu.
3. **Module Lớp/Lịch/Học sinh/Giáo viên**.
4. **Module Bài kiểm tra/Điểm**.
5. **Module BTVN**.
6. **Module Doanh thu**.
7. **Dashboard Admin + Ứng dụng Người dùng**.
8. **Kiểm thử UAT, bảo mật, tối ưu hiệu năng, tài liệu hướng dẫn.**

---

## 11) Tiêu chí nghiệm thu (sample)

- Đăng ký/Đăng nhập/Quên MK hoạt động, OTP đúng hạn & giới hạn.
- Admin tạo lịch → Người dùng thấy đúng trong giao diện.
- Nhập điểm → người dùng xem điểm theo môn/kỳ.
- Phí & thanh toán → số dư hiển thị chính xác.
- Logs & phân quyền: hành vi bị chặn đúng theo vai trò.

---

## 12) Phụ lục: Mẫu payload

```json
// Đăng ký
{
  "phone": "0912345678",
  "studentName": "Nguyễn Văn A",
  "className": "6A1",
  "password": "abc12345"
}
```

```json
// Tạo lịch học (1 tiết)
{
  "classId": "cls_6A1",
  "weekday": 2,
  "period": 1,
  "subject": "Toán",
  "teacherId": "t_kt01",
  "room": "P201",
  "startTime": "2025-08-26T07:00:00+07:00",
  "endTime": "2025-08-26T07:45:00+07:00"
}
```

---

## 13) Định hướng nâng cấp cho **Trung tâm bồi dưỡng kiến thức**

### 13.1 Tầm nhìn & nguyên tắc

- Trở thành **nền tảng quản trị trung tâm** + **trải nghiệm học tập (LXP/LMS)** thống nhất: tuyển sinh → học tập → đánh giá → thu phí → chăm sóc khách hàng.
- Thiết kế **đa chi nhánh (multi-branch)**, sẵn sàng **đa trung tâm (multi-tenant)** khi mở rộng.
- Dữ liệu học thuật và tài chính **liên thông**; báo cáo thời gian thực cho quản lý.

### 13.2 Vai trò mở rộng

- **System Owner** (Chủ hệ thống): cấu hình toàn cục, gói học, chính sách.
- **Center Admin** (Quản lý chi nhánh): vận hành, chỉ tiêu doanh thu/TSHS, phân công phòng học.
- **Academic Coordinator** (Điều phối học thuật): giáo trình, lịch dạy, kiểm tra chất lượng.
- **Counselor/Admissions** (Tư vấn tuyển sinh): quản lý lead, demo/trial, chốt đơn.
- **Teacher** (Giáo viên): dạy học, điểm danh, giao BTVN, nhập điểm, phản hồi.
- **Parent/Student**: theo dõi tiến độ, lịch học, điểm/nhận xét, thanh toán.

### 13.3 Module mở rộng (ngoài phần 3 đã có)

1) **Khóa học & Giáo trình**: lộ trình theo cấp/level, mục tiêu buổi học (LOs), đề cương, tài liệu.
2) **Tuyển sinh/CRM**: lead source, pipeline, đặt lịch tư vấn/trial, tỉ lệ chuyển đổi, nhắc hẹn.
3) **Ghi danh & Gói học**: lớp theo khóa/cohort, capacity, waitlist, gói buổi (10/20/…); chuyển lớp, bảo lưu.
4) **Điểm danh & Bù buổi**: điểm danh QR/NFC; tự động gợi ý lịch **make‑up**; cảnh báo vắng nhiều.
5) **LMS/E-learning**: bài học số, quiz, bài tập, rubric, ngân hàng câu hỏi; theo dõi tiến độ.
6) **Kỳ thi & Chứng chỉ**: lịch thi tập trung, giám thị, chấm thi, xuất chứng chỉ (PDF, mã QR).
7) **Thanh toán & Khuyến mãi**: hóa đơn, phiếu thu, ưu đãi, trả góp/kỳ hạn; cổng thanh toán (VNPay/MoMo/ZaloPay – cấu hình sau triển khai).
8) **Lương giáo viên**: bảng công theo giờ/buổi, phụ cấp, thưởng KPI, phạt, đối soát.
9) **Quản lý cơ sở vật chất**: phòng học, sức chứa, phát hiện xung đột thời khóa biểu.
10) **Truyền thông**: thông báo/broadcast, mẫu tin (Email/SMS/Zalo OA), lịch gửi theo sự kiện.
11) **Báo cáo & Phân tích**: doanh thu, tồn công nợ, tỉ lệ chuyên cần, retention, NPS, hiệu quả chiến dịch.

### 13.4 KPI trọng yếu

- **Tuyển sinh**: #lead/tuần, %CS (contacted), %Trial, %Enroll, CAC.
- **Vận hành**: Attendance Rate ≥ 90%, tỉ lệ make‑up < 10%, sử dụng phòng học ≥ 70%.
- **Học thuật**: Avg Score theo môn/level, completion rate, %chuyển level.
- **Tài chính**: Doanh thu theo gói/tháng, DSO (days sales outstanding), nợ quá hạn.
- **CSKH**: NPS, thời gian phản hồi < 4h, số khiếu nại/tháng.

### 13.5 Quy trình bổ sung

- **Lead → Trial → Enroll**: tạo lead → gọi tư vấn → đặt lịch trial → chấm điểm đầu vào → đề xuất lộ trình → chốt gói → ký HĐ/thu phí.
- **Điểm danh → Bù buổi**: vắng buổi → tạo phiếu make‑up → gợi ý slot/phòng/giáo viên → xác nhận với PH.
- **Thi & Chứng chỉ**: tạo đợt thi → xếp phòng/giám thị → nhập điểm → phúc khảo → cấp chứng chỉ.

### 13.6 Mô hình dữ liệu (bổ sung)

- **courses**: id, name, level, syllabus_id, duration, price.
- **syllabi**: id, outline, lessons[] {objective, materials, quiz_bank_id}.
- **leads**: id, contact, source, status, counselor_id, next_action_at.
- **enrollments**: id, student_id, class_id, package_id, start/end, status.
- **packages**: id, name, sessions, price, promo_id?
- **attendance**: id, class_session_id, student_id, status(present/absent/makeup), note.
- **rooms**: id, name, capacity.
- **class_sessions**: id, class_id, date, start/end, room_id, teacher_id, topic.
- **payrolls**: id, teacher_id, period, items[] {session_id, rate, bonus, penalty}.
- **certificates**: id, student_id, exam_id, issue_date, qr_code.

> Bổ sung index: leads(status, next_action_at), enrollments(student_id, class_id), attendance(class_session_id), class_sessions(date, room_id), payrolls(teacher_id, period)

### 13.7 API mở rộng (gợi ý)

- CRM: `POST/GET /crm/leads`, `POST /crm/leads/{id}/schedule-trial`, `POST /crm/leads/{id}/convert`.
- Course: `GET/POST /courses`, `GET/POST /syllabi`, `GET /classes/{id}/sessions`.
- Attendance: `POST /sessions/{id}/attendance`, `POST /attendance/{id}/makeup`.
- Exams: `POST/GET /exams`, `POST /exams/{id}/grade`, `POST /exams/{id}/certificate`.
- Billing: `POST/GET /packages`, `POST /enrollments`, `POST /invoices`, `POST /payments`.
- Payroll: `POST/GET /payrolls`, `POST /payrolls/{id}/close`.

### 13.8 Báo cáo/Dashboard mẫu

- **Tuyển sinh**: phễu lead → enroll, hiệu quả kênh.
- **Vận hành**: chuyên cần theo lớp/tuần, cảnh báo lớp quá tải, xung đột phòng học.
- **Học thuật**: điểm trung bình theo level/môn, tiến độ giáo trình, tỉ lệ hoàn thành BTVN.
- **Tài chính**: doanh thu theo gói, công nợ theo tuổi nợ, thu nhập GV theo kỳ.

### 13.9 Kiến trúc & tích hợp

- Gợi ý stack: **Next.js** (web) + **NestJS**/**Django** (API) + **PostgreSQL**/**MongoDB**; cache **Redis**; hàng đợi **RabbitMQ/Kafka**; lưu trữ file **S3-compatible**.
- Tích hợp: cổng thanh toán (VNPay/MoMo/ZaloPay), **Zalo OA/SMS Brandname/Email**, **Zoom/Google Meet** cho lớp online, chữ ký số hoá đơn (tuân thủ quy định hiện hành).

### 13.10 Lộ trình nâng cấp (9 tháng mẫu)

- **Pha 1 (0–3 tháng):** CRM cơ bản, gói học & ghi danh, thời khóa biểu theo phòng, điểm danh QR, báo cáo tuyển sinh/vận hành.
- **Pha 2 (3–6 tháng):** LMS (bài học số, quiz), make‑up tự động, kỳ thi & chấm điểm, chứng chỉ PDF có QR, cổng thanh toán online, bảng lương GV.
- **Pha 3 (6–9 tháng):** dashboard nâng cao, NPS & CSKH, đa chi nhánh, tối ưu hiệu năng, hardening bảo mật & sao lưu/kế hoạch DR.

### 13.11 Tiêu chí nghiệm thu bổ sung

- Tỉ lệ quét điểm danh thành công ≥ 99% trong giờ cao điểm.
- Tạo lớp/mở buổi không xung đột phòng/giáo viên.
- Make‑up gợi ý slot hợp lệ ≥ 95% trường hợp.
- Báo cáo doanh thu/attendance realtime (< 5 phút trễ dữ liệu).

### 13.12 Rủi ro & giảm thiểu

- **Dữ liệu phân mảnh** (nhiều chi nhánh) → chuẩn hoá mã hoá đơn/lớp/học viên.
- **Thay đổi quy trình** → đào tạo nội bộ + tài liệu SOP.
- **Tải cao giờ tan học** → dùng hàng đợi + cache, tách đọc/ghi DB.

### 13.13 Checklist Go‑Live (trung tâm)

- Import danh bạ PH/HS, mapping lớp & gói học.
- Kiểm tra lịch phòng/giáo viên tuần đầu.
- Test hành trình Lead→Trial→Enroll end‑to‑end.
- Kiểm thử thanh toán thật (sandbox → production), mẫu hóa đơn.
- Tập huấn quản trị & giáo viên, thiết lập kênh thông báo.
