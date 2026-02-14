# CRM Project

Dự án CRM với Backend sử dụng Spring Boot, Frontend sử dụng Electron.js + React, và Database là Oracle.

## 📋 Yêu cầu hệ thống

### Backend
- Java JDK 25
- Maven 3.8+
- Oracle Database 19c trở lên

### Frontend
- Node.js 18+ và npm
- Hệ điều hành: Windows/macOS/Linux

## 🗄️ Cài đặt Oracle Database

### 1. Cài đặt Oracle Database
- Tải và cài đặt Oracle Database 19c từ trang chủ Oracle
- Hoặc sử dụng Docker:
```bash
docker run -d -p 1521:1521 -p 5500:5500 \
  -e ORACLE_SID=orcl \
  -e ORACLE_PWD=Admin@123 \
  container-registry.oracle.com/database/enterprise:19.3.0.0
```

### 2. Cấu hình Database
- Service Name: `orcl`
- Port: `1521`
- Username: `system`
- Password: `Admin@123`

### 3. Tạo Schema và Tables
Backend sẽ tự động tạo tables khi khởi động (nhờ `spring.jpa.hibernate.ddl-auto=update`).

Nếu muốn chạy các stored procedures và triggers thủ công, execute các file SQL trong thư mục:
- `src/main/sql/procedure/`
- `src/main/sql/trigger/`
- `src/main/sql/concurrency/`

## 🚀 Cài đặt và chạy Backend (Spring Boot)

### 1. Điều hướng đến thư mục gốc
```bash
cd d:\Work\Project\crm
```

### 2. Cấu hình Database
Mở file `src/main/resources/application.properties` và cập nhật thông tin kết nối Oracle nếu cần:
```properties
spring.datasource.url=jdbc:oracle:thin:@//localhost:1521/orcl
spring.datasource.username=system
spring.datasource.password=Admin@123
```

### 3. Cài đặt dependencies
```bash
mvnw clean install
```

Hoặc nếu đã cài Maven global:
```bash
mvn clean install
```

### 4. Chạy ứng dụng
```bash
mvnw spring-boot:run
```

Hoặc:
```bash
mvn spring-boot:run
```

Backend sẽ chạy tại: **http://localhost:8080**

### 5. Kiểm tra Backend
Mở trình duyệt và truy cập:
- API Base URL: `http://localhost:8080`
- Kiểm tra health: `http://localhost:8080/actuator/health` (nếu có actuator)

## 💻 Cài đặt và chạy Frontend (Electron.js)

### 1. Điều hướng đến thư mục frontend
```bash
cd frontend
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy ứng dụng ở chế độ Development
```bash
npm run dev
```

Lệnh này sẽ:
- Khởi động Electron app
- Bật hot-reload cho phát triển
- Mở ứng dụng desktop

### 4. Các lệnh khác

#### Preview (Production mode)
```bash
npm start
```

#### Build TypeScript
```bash
npm run typecheck
```

#### Lint code
```bash
npm run lint
```

#### Format code
```bash
npm run format
```

#### Build ứng dụng cho production
```bash
# Build tất cả (không đóng gói)
npm run build:unpack

# Build cho Windows
npm run build:win

# Build cho macOS
npm run build:mac

# Build cho Linux
npm run build:linux
```

## 🔧 Cấu hình API trong Frontend

Đảm bảo frontend đang trỏ đúng đến backend URL. Kiểm tra file cấu hình API (thường trong `src/renderer/src/lib/` hoặc config):

```typescript
const API_BASE_URL = 'http://localhost:8080';
```

## 📁 Cấu trúc thư mục

```
crm/
├── frontend/               # Electron + React frontend
│   ├── src/
│   │   ├── main/          # Electron main process
│   │   ├── preload/       # Preload scripts
│   │   └── renderer/      # React app
│   └── package.json
├── src/
│   └── main/
│       ├── java/          # Spring Boot backend
│       │   └── dev/uit/project/
│       ├── resources/     # Cấu hình
│       │   └── application.properties
│       └── sql/           # SQL scripts
└── pom.xml                # Maven config
```

## 🔄 Quy trình chạy đầy đủ

1. **Khởi động Oracle Database**
   ```bash
   # Đảm bảo Oracle đang chạy trên port 1521
   ```

2. **Khởi động Backend**
   ```bash
   # Ở thư mục gốc
   mvnw spring-boot:run
   ```

3. **Khởi động Frontend**
   ```bash
   # Ở thư mục frontend
   cd frontend
   npm run dev
   ```

## ⚠️ Xử lý lỗi thường gặp

### Backend không kết nối được Oracle
- Kiểm tra Oracle service đang chạy
- Verify connection string trong `application.properties`
- Kiểm tra firewall/port 1521

### Frontend không gọi được API
- Đảm bảo backend đang chạy trên port 8080
- Kiểm tra CORS configuration trong Spring Boot
- Verify API URL trong frontend config

### Maven build failed
- Đảm bảo Java 25 đã được cài đặt: `java -version`
- Set JAVA_HOME environment variable
- Clear Maven cache: `mvnw clean`

### npm install failed
- Xóa `node_modules` và `package-lock.json`
- Chạy lại `npm install`
- Thử với Node.js phiên bản khác nếu gặp lỗi

## 📝 Ghi chú

- Backend mặc định chạy trên port **8080**
- Oracle Database mặc định trên port **1521**
- Ứng dụng sử dụng Spring Security (có thể cần authentication)
- Frontend sử dụng React Router cho navigation
- Database schema sẽ tự động được tạo/cập nhật khi khởi động backend
