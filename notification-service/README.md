# Notification Service

Service chuyên xử lý tất cả các thông báo trong hệ thống Movie Ticket.

## Chức năng

Notification Service lắng nghe các events từ RabbitMQ và log thông báo ra console:

### 1. USER_REGISTERED Event
- **Trigger**: Khi user đăng ký tài khoản mới
- **Action**: Log thông tin user mới đăng ký
- **Format**: Hiển thị đẹp với box border

### 2. BOOKING_CREATED Event (COD only)
- **Trigger**: Khi tạo booking với payment type = COD
- **Action**: Log thông tin đơn hàng COD
- **Note**: Chỉ log cho đơn COD, đơn BANK chờ thanh toán trước

### 3. PAYMENT_COMPLETED Event
- **Trigger**: Khi thanh toán BANK thành công
- **Action**: Log thông tin thanh toán thành công
- **Format**: Hiển thị order ID, user ID, số tiền, thời gian

## Cấu hình

### Port
- **8086**

### RabbitMQ Queues
- `user.registered.notification.queue` - Nhận USER_REGISTERED events
- `booking.created.notification.queue` - Nhận BOOKING_CREATED events
- `payment.completed.notification.queue` - Nhận PAYMENT_COMPLETED events

## Build & Run

```bash
cd notification-service
mvn clean install
mvn spring-boot:run
```

## Ví dụ Output

### User Registration
```
╔════════════════════════════════════════════════════════════════╗
║           🎉 THÔNG BÁO ĐĂNG KÝ THÀNH CÔNG 🎉                 ║
╠════════════════════════════════════════════════════════════════╣
║ User ID       : 1                                              ║
║ Username      : testuser                                       ║
║ Email         : test@example.com                               ║
║ Full Name     : Test User                                      ║
║ Registered At : 2026-04-10T10:30:00                            ║
╚════════════════════════════════════════════════════════════════╝
```

### COD Booking
```
╔════════════════════════════════════════════════════════════════╗
║           📦 THÔNG BÁO ĐẶT HÀNG COD THÀNH CÔNG 📦            ║
╠════════════════════════════════════════════════════════════════╣
║ Order ID      : 123                                            ║
║ User ID       : 1                                              ║
║ Payment Type  : COD                                            ║
║ Total Amount  : 500000.00 VNĐ                                 ║
║ Created At    : 2026-04-10T10:35:00                            ║
║ Note: Thanh toán khi nhận hàng                                 ║
╚════════════════════════════════════════════════════════════════╝
```

### Payment Completed
```
╔════════════════════════════════════════════════════════════════╗
║           💳 THÔNG BÁO THANH TOÁN THÀNH CÔNG 💳              ║
╠════════════════════════════════════════════════════════════════╣
║ Order ID      : 124                                            ║
║ User ID       : 1                                              ║
║ Amount Paid   : 750000.00 VNĐ                                 ║
║ Completed At  : 2026-04-10T10:40:00                            ║
║ Message: User #1 đã đặt đơn #124 thành công!                  ║
╚════════════════════════════════════════════════════════════════╝
```

## Dependencies

- Spring Boot 4.0.5
- Spring Cloud Netflix Eureka Client
- Spring AMQP (RabbitMQ)
- Lombok
