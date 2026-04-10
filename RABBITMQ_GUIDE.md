# Movie Ticket System - Event-Driven Architecture với RabbitMQ

## Tổng quan

Hệ thống đặt vé xem phim được xây dựng theo kiến trúc Event-Driven sử dụng RabbitMQ làm Message Broker. Các service giao tiếp với nhau thông qua events, không gọi trực tiếp.

## Kiến trúc Services

### 1. Customer Service (Port 8082)
- Quản lý user: đăng ký, đăng nhập
- **Publish**: USER_REGISTERED khi đăng ký thành công

### 2. Product Service (Port 8085)
- Quản lý phim: xem danh sách, thêm/sửa phim
- Không có event

### 3. Order Service (Port 8083)
- Tạo booking
- **Publish**: BOOKING_CREATED cho mọi loại payment (COD, BANK)
- **Listen**: PAYMENT_COMPLETED, BOOKING_FAILED để cập nhật status

### 4. Payment Service (Port 8084)
- **Listen**: BOOKING_CREATED (chỉ xử lý BANK)
- Xử lý thanh toán với logic random 70% success
- **Publish**: PAYMENT_COMPLETED hoặc BOOKING_FAILED

### 5. Notification Service (Port 8086) - MỚI
- **Listen**: 
  - USER_REGISTERED - Log khi đăng ký
  - BOOKING_CREATED (chỉ COD) - Log khi tạo đơn COD
  - PAYMENT_COMPLETED - Log khi thanh toán thành công
- Output: Console logs với format đẹp

## Kiến trúc Events

### 1. USER_REGISTERED Event
- **Publisher**: Customer Service
- **Consumer**: Notification Service
- **Trigger**: Khi user đăng ký tài khoản
- **Data**: userId, username, email, fullName, registeredAt

### 2. BOOKING_CREATED Event
- **Publisher**: Order Service
- **Consumer**: 
  - Payment Service (chỉ xử lý BANK)
  - Notification Service (chỉ log COD)
- **Trigger**: Khi tạo booking (COD hoặc BANK)
- **Data**: orderId, userId, totalAmount, paymentType, createdAt

### 3. PAYMENT_COMPLETED Event
- **Publisher**: Payment Service
- **Consumer**: 
  - Order Service (cập nhật trạng thái order)
  - Notification Service (log thông báo)
- **Trigger**: Khi thanh toán BANK thành công
- **Data**: orderId, userId, amount, completedAt

### 4. BOOKING_FAILED Event
- **Publisher**: Payment Service
- **Consumer**: Order Service
- **Trigger**: Khi thanh toán BANK thất bại
- **Data**: orderId, userId, reason, failedAt

## Luồng xử lý chi tiết

### Luồng 1: User Registration
```
User → Customer Service → Register User
                              ↓
                    Publish USER_REGISTERED
                              ↓
                   Notification Service
                              ↓
                    Log: "User đăng ký thành công"
```

### Luồng 2: Booking với COD
```
User → Order Service → Create Order (COD)
                              ↓
                      Save to Database
                              ↓
                    Publish BOOKING_CREATED
                              ↓
                   ┌─────────┴─────────┐
                   ↓                   ↓
          Payment Service      Notification Service
          (Skip - not BANK)            ↓
                              Log: "Đơn COD thành công"
```

### Luồng 3: Booking với BANK
```
User → Order Service → Create Order (BANK)
                              ↓
                      Save to Database
                              ↓
                    Publish BOOKING_CREATED
                              ↓
                   ┌─────────┴─────────┐
                   ↓                   ↓
          Payment Service      Notification Service
                  ↓                 (Skip - not COD)
        Process Payment (Random)
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
PAYMENT_COMPLETED     BOOKING_FAILED
        ↓                   ↓
    ┌───┴───┐           Order Service
    ↓       ↓               ↓
Order    Notification   Update Status
Service     Service     → FAILED
    ↓       ↓
Update  Log Success
Status  Message
→ PAID
```

## Cài đặt

### 1. Yêu cầu
- Java 17
- Maven
- MariaDB
- RabbitMQ
- Eureka Discovery Server

### 2. Cài đặt RabbitMQ

**Windows - Docker:**
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

**RabbitMQ Management UI:**
- URL: http://localhost:15672
- Username: guest
- Password: guest

### 3. Cấu hình Database

Tạo các database sau trong MariaDB:
```sql
CREATE DATABASE customer_db;
CREATE DATABASE order_db;
```

### 4. Build và chạy các service

Thứ tự khởi động:
```bash
# 1. Discovery Service (phải chạy đầu tiên)
cd discovery
mvn clean install
mvn spring-boot:run

# 2. Customer Service
cd customer-service
mvn clean install
mvn spring-boot:run

# 3. Product Service (Movie Service)
cd product-service
mvn clean install
mvn spring-boot:run

# 4. Order Service (Booking Service)
cd order-service
mvn clean install
mvn spring-boot:run

# 5. Payment Service
cd payment-service
mvn clean install
mvn spring-boot:run

# 6. Notification Service (MỚI)
cd notification-service
mvn clean install
mvn spring-boot:run

# 7. API Gateway (optional)
cd api-gateway
mvn clean install
mvn spring-boot:run
```

## Testing

### 1. Đăng ký User (USER_REGISTERED Event)

```bash
POST http://localhost:8082/customer-service/api/v1/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User"
}
```

**Expected:** 
- Customer Service lưu user vào DB
- Publish USER_REGISTERED event
- Notification Service log ra console:
```
╔════════════════════════════════════════════════════════════════╗
║           🎉 THÔNG BÁO ĐĂNG KÝ THÀNH CÔNG 🎉                 ║
╠════════════════════════════════════════════════════════════════╣
║ User ID       : 1                                              ║
║ Username      : testuser                                       ║
...
╚════════════════════════════════════════════════════════════════╝
```

### 2. Tạo Booking với COD (BOOKING_CREATED Event)

```bash
# Login để lấy token
POST http://localhost:8082/customer-service/api/v1/auth/login
Content-Type: application/json

{
  "login": "testuser",
  "password": "password123"
}

# Tạo booking COD
POST http://localhost:8083/order-service/api/v1/orders
Content-Type: application/json
X-User-Id: {userId}

{
  "userId": 1,
  "paymentType": "COD",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

**Expected:**
- Order Service tạo order với status PENDING
- Publish BOOKING_CREATED event
- Payment Service nhận event nhưng SKIP (vì là COD)
- Notification Service log ra console:
```
╔════════════════════════════════════════════════════════════════╗
║           📦 THÔNG BÁO ĐẶT HÀNG COD THÀNH CÔNG 📦            ║
╠════════════════════════════════════════════════════════════════╣
║ Order ID      : 1                                              ║
║ Payment Type  : COD                                            ║
...
╚════════════════════════════════════════════════════════════════╝
```

### 3. Tạo Booking với BANK (PAYMENT_COMPLETED Event)

```bash
POST http://localhost:8083/order-service/api/v1/orders
Content-Type: application/json
X-User-Id: {userId}

{
  "userId": 1,
  "paymentType": "BANK",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

**Expected:**
- Order Service tạo order với status PENDING
- Publish BOOKING_CREATED event
- Payment Service nhận event và xử lý (70% success rate)
- Nếu thành công:
  - Payment Service publish PAYMENT_COMPLETED
  - Order Service cập nhật status → PAID
  - Notification Service log ra console:
```
╔════════════════════════════════════════════════════════════════╗
║           💳 THÔNG BÁO THANH TOÁN THÀNH CÔNG 💳              ║
╠════════════════════════════════════════════════════════════════╣
║ Order ID      : 2                                              ║
║ Amount Paid   : 500000.00 VNĐ                                 ║
...
╚════════════════════════════════════════════════════════════════╝
```

## Exchanges và Queues

### User Exchange
- **Exchange**: `user.exchange` (topic)
- **Queues**:
  - `user.registered.queue` (customer service internal)
  - `user.registered.notification.queue` (notification service)
- **Routing Key**: `user.registered`

### Booking Exchange
- **Exchange**: `booking.exchange` (topic)
- **Queues**:
  - `booking.created.queue` (payment service)
  - `booking.created.notification.queue` (notification service)
- **Routing Key**: `booking.created`

### Payment Exchange
- **Exchange**: `payment.exchange` (topic)
- **Queues**:
  - `payment.completed.queue` (order service)
  - `payment.completed.notification.queue` (notification service)
  - `booking.failed.queue` (order service)
- **Routing Keys**: 
  - `payment.completed`
  - `booking.failed`

## Ports

- Discovery Service: 8761
- Customer Service: 8082
- Order Service: 8083
- Payment Service: 8084
- Product Service: 8085
- **Notification Service: 8086** (MỚI)
- API Gateway: 8080
- RabbitMQ: 5672
- RabbitMQ Management: 15672

## Lưu ý quan trọng

1. **Notification Service**: Service riêng biệt chỉ để log notifications, không xử lý business logic
2. **COD vs BANK**:
   - COD: Tạo order → Log notification ngay → Chờ giao hàng
   - BANK: Tạo order → Xử lý payment → Log notification khi thành công
3. **Payment Service**: 
   - Chỉ xử lý thanh toán cho BANK
   - Random success/fail với tỷ lệ 70% success
4. **Event-Driven**: Các service KHÔNG gọi trực tiếp nhau

## Troubleshooting

### Notification không hiển thị
- Kiểm tra Notification Service đã chạy chưa (port 8086)
- Kiểm tra RabbitMQ đã có queues: `*.notification.queue`
- Kiểm tra log của Notification Service

### Payment không được xử lý cho COD
- Đây là behavior đúng! COD không cần xử lý payment
- Chỉ có BANK mới được Payment Service xử lý

### Event bị duplicate
- Kiểm tra không có nhiều instance của cùng 1 service
- Mỗi service chỉ nên chạy 1 instance trong môi trường dev

## Tác giả

Movie Ticket System - Buổi 6 Event-Driven Architecture with Notification Service
