# Quick Start Guide - Testing Notification Service

## Bước 1: Start RabbitMQ
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Truy cập RabbitMQ Management: http://localhost:15672 (guest/guest)

## Bước 2: Start các Services (theo thứ tự)

### Terminal 1 - Discovery
```bash
cd discovery
mvn spring-boot:run
```
Đợi đến khi thấy: "Started DiscoveryApplication"

### Terminal 2 - Customer Service
```bash
cd customer-service
mvn spring-boot:run
```

### Terminal 3 - Product Service
```bash
cd product-service
mvn spring-boot:run
```

### Terminal 4 - Order Service
```bash
cd order-service
mvn spring-boot:run
```

### Terminal 5 - Payment Service
```bash
cd payment-service
mvn spring-boot:run
```

### Terminal 6 - Notification Service ⭐
```bash
cd notification-service
mvn spring-boot:run
```
**Chú ý console này - đây là nơi hiển thị notifications!**

## Bước 3: Test Notifications

### Test 1: User Registration Notification

**Request:**
```bash
curl -X POST http://localhost:8082/customer-service/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

**Check:** Terminal 6 (Notification Service) sẽ hiển thị:
```
╔════════════════════════════════════════════════════════════════╗
║           🎉 THÔNG BÁO ĐĂNG KÝ THÀNH CÔNG 🎉                 ║
╚════════════════════════════════════════════════════════════════╝
```

---

### Test 2: COD Booking Notification

**Step 1 - Login để lấy token:**
```bash
curl -X POST http://localhost:8082/customer-service/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "john_doe",
    "password": "password123"
  }'
```

**Step 2 - Tạo Product (nếu chưa có):**
```bash
curl -X POST http://localhost:8085/product-service/api/v1/products \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "name": "Vé xem phim Avatar",
    "description": "Phim hay",
    "price": 150000
  }'
```

**Step 3 - Tạo Order COD:**
```bash
curl -X POST http://localhost:8083/order-service/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "userId": 1,
    "paymentType": "COD",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'
```

**Check:** Terminal 6 (Notification Service) sẽ hiển thị:
```
╔════════════════════════════════════════════════════════════════╗
║           📦 THÔNG BÁO ĐẶT HÀNG COD THÀNH CÔNG 📦            ║
║ Note: Thanh toán khi nhận hàng                                 ║
╚════════════════════════════════════════════════════════════════╝
```

**Payment Service Terminal:** Sẽ log "Skip payment processing for COD"

---

### Test 3: BANK Payment Notification

**Request:**
```bash
curl -X POST http://localhost:8083/order-service/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "userId": 1,
    "paymentType": "BANK",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'
```

**Check Terminal 5 (Payment Service):** 
```
Processing payment for order: 2
Payment successful for order: 2  (hoặc failed - random 70% success)
```

**Check Terminal 6 (Notification Service):**
- Nếu payment thành công:
```
╔════════════════════════════════════════════════════════════════╗
║           💳 THÔNG BÁO THANH TOÁN THÀNH CÔNG 💳              ║
║ Message: User #1 đã đặt đơn #2 thành công!                    ║
╚════════════════════════════════════════════════════════════════╝
```
- Nếu payment thất bại: Không có notification (đúng behavior)

---

## Kiểm Tra RabbitMQ

1. Truy cập: http://localhost:15672
2. Login: guest/guest
3. Click tab "Queues"
4. Bạn sẽ thấy các queues:
   - `user.registered.notification.queue`
   - `booking.created.notification.queue`
   - `payment.completed.notification.queue`
5. Click vào từng queue để xem messages

## Troubleshooting

### Notification không hiển thị
1. Check Notification Service có chạy không (port 8086)
2. Check RabbitMQ có chạy không
3. Check log của service publisher (Customer/Order/Payment)
4. Check RabbitMQ Management UI xem có messages trong queues không

### "Connection refused" error
- RabbitMQ chưa chạy → Start RabbitMQ trước
- Service khác chưa chạy → Start theo đúng thứ tự

### Database error
- MariaDB chưa chạy
- Chưa tạo database: `customer_db`, `order_db`

## Summary

✅ **Notification Service** sẽ log:
1. Mỗi khi có user mới đăng ký
2. Mỗi khi tạo đơn hàng COD
3. Mỗi khi thanh toán BANK thành công

✅ **Tất cả notifications** đều hiển thị ở console của Notification Service với format đẹp

✅ **Event-Driven** - Các service không gọi trực tiếp nhau, giao tiếp qua RabbitMQ
