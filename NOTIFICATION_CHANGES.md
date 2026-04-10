# Các Thay Đổi - Notification Service

## Tổng quan
Đã tạo **Notification Service** riêng biệt để xử lý tất cả thông báo trong hệ thống.

## Files Mới

### Notification Service
```
notification-service/
├── pom.xml
├── README.md
└── src/main/
    ├── java/iuh/fit/notification_service/
    │   ├── NotificationServiceApplication.java
    │   ├── config/
    │   │   └── RabbitMQConfig.java
    │   ├── events/
    │   │   ├── UserRegisteredEvent.java
    │   │   ├── BookingCreatedEvent.java
    │   │   └── PaymentCompletedEvent.java
    │   └── listeners/
    │       ├── UserEventListener.java
    │       ├── BookingEventListener.java
    │       └── PaymentEventListener.java
    └── resources/
        └── application.yml
```

## Files Đã Sửa

### 1. Order Service
**File**: `order-service/src/main/java/iuh/fit/order_service/services/OrderService.java`

**Thay đổi**: 
- Publish BOOKING_CREATED event cho **tất cả payment types** (COD và BANK)
- Trước đây chỉ publish cho BANK

```java
// CŨ - chỉ BANK
if (saved.getPaymentType() == PaymentType.BANK) {
    eventPublisher.publishBookingCreated(event);
}

// MỚI - tất cả payment types
eventPublisher.publishBookingCreated(event);
```

### 2. Payment Service
**File**: `payment-service/src/main/java/iuh/fit/payment_service/listeners/BookingEventListener.java`

**Thay đổi**:
- Chỉ xử lý payment cho **BANK** payment type
- Skip các payment type khác (COD)

```java
// MỚI - filter theo payment type
if ("BANK".equalsIgnoreCase(event.getPaymentType())) {
    paymentService.processPayment(event);
} else {
    log.info("Skip payment processing for COD");
}
```

## Tính Năng Mới

### 1. Notification khi Đăng Ký
```
User đăng ký → Customer Service publish event
             → Notification Service log thông báo
```

**Output Console**:
```
╔════════════════════════════════════════════════════════════════╗
║           🎉 THÔNG BÁO ĐĂNG KÝ THÀNH CÔNG 🎉                 ║
╠════════════════════════════════════════════════════════════════╣
║ User ID       : 1                                              ║
║ Username      : testuser                                       ║
║ Email         : test@example.com                               ║
...
╚════════════════════════════════════════════════════════════════╝
```

### 2. Notification cho Đơn COD
```
Tạo order COD → Order Service publish event
              → Notification Service log (chỉ COD)
              → Payment Service skip (không xử lý COD)
```

**Output Console**:
```
╔════════════════════════════════════════════════════════════════╗
║           📦 THÔNG BÁO ĐẶT HÀNG COD THÀNH CÔNG 📦            ║
╠════════════════════════════════════════════════════════════════╣
║ Order ID      : 123                                            ║
║ Payment Type  : COD                                            ║
║ Note: Thanh toán khi nhận hàng                                 ║
...
╚════════════════════════════════════════════════════════════════╝
```

### 3. Notification khi Thanh Toán Thành Công
```
Payment thành công → Payment Service publish PAYMENT_COMPLETED
                   → Order Service update status → PAID
                   → Notification Service log thông báo
```

**Output Console**:
```
╔════════════════════════════════════════════════════════════════╗
║           💳 THÔNG BÁO THANH TOÁN THÀNH CÔNG 💳              ║
╠════════════════════════════════════════════════════════════════╣
║ Order ID      : 124                                            ║
║ Amount Paid   : 750000.00 VNĐ                                 ║
...
╚════════════════════════════════════════════════════════════════╝
```

## Cách Chạy

### 1. Build Notification Service
```bash
cd notification-service
mvn clean install
```

### 2. Run Notification Service
```bash
mvn spring-boot:run
```

Service sẽ chạy trên port **8086**

### 3. Kiểm Tra
- Check console của Notification Service để xem logs
- Tạo user mới → Xem notification
- Tạo order COD → Xem notification
- Tạo order BANK → Đợi payment thành công → Xem notification

## RabbitMQ Queues Mới

1. `user.registered.notification.queue`
2. `booking.created.notification.queue`
3. `payment.completed.notification.queue`

## Lưu Ý

1. **Notification Service là service độc lập** - chỉ listen events và log
2. **Không có database** - pure event listener
3. **Beautiful console output** - dễ đọc và debug
4. **Filter thông minh**:
   - User: log tất cả
   - Booking: chỉ log COD
   - Payment: chỉ log khi completed

## Migration từ Payment Service

Trước đây notification logic nằm trong Payment Service (`NotificationListener.java`). 
Giờ đã tách ra thành service riêng để:
- Dễ scale
- Dễ maintain
- Tách biệt concerns
- Có thể thêm nhiều loại notification (SMS, Email...) sau này

## Next Steps (Optional)

1. Thêm email notification
2. Thêm SMS notification  
3. Lưu notification history vào database
4. Tạo API để query notification history
5. WebSocket để push notification real-time

## Testing Checklist

- [ ] Start RabbitMQ
- [ ] Start Discovery Service
- [ ] Start Customer Service
- [ ] Start Product Service
- [ ] Start Order Service
- [ ] Start Payment Service
- [ ] Start Notification Service
- [ ] Test user registration → Check notification log
- [ ] Test COD booking → Check notification log
- [ ] Test BANK booking → Check payment & notification log
