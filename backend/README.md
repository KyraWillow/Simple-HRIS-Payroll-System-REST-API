# Project Briefing Baru: HRIS & Payroll System - Clean Architecture (DENGAN URUTAN PEMBUATAN YANG BENAR)

## 1. Project Overview
- **Nama Proyek:** HRIS & Payroll System
- **Jenis:** REST API Backend
- **Stack:** Node.js, Express.js, Prisma ORM, PostgreSQL
- **Architecture:** Clean Architecture (Infrastructure → Core → Interface)
- **Deadline:** 3 hari dari briefing ini
- **Sprint:** 3 sprint, masing-masing 1 hari

---

## 2. Urutan Pembuatan yang Benar (Dari Bawah ke Atas)

### 2.1 Alasan Pendekatan Ini:
- Mulai dari **Infrastructure** agar ada foundation yang nyata
- Tidak ada dependency yang menggantung
- Bisa diuji secara bertahap
- Lebih mudah dipahami karena ada implementasi nyata

---

## 3. Infrastructure Layer (Dibuat Pertama)

### 3.1 Database Connection
**File:** `src/infrastructure/database/DatabaseConnection.js`

```javascript
// src/infrastructure/database/DatabaseConnection.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = { prisma };
```

### 3.2 Repository Implementation
**File:** `src/infrastructure/database/UserRepositoryImpl.js`

```javascript
// src/infrastructure/database/UserRepositoryImpl.js
const { prisma } = require('./DatabaseConnection');
const ApplicationError = require('../../shared/errors/ApplicationError');

class UserRepositoryImpl {
  async findByEmail(email) {
    try {
      const user = await prisma.users.findUnique({
        where: { email }
      });
      return user;
    } catch (error) {
      throw new ApplicationError('Database error occurred', 500);
    }
  }

  async findById(id) {
    try {
      const user = await prisma.users.findUnique({
        where: { id }
      });
      return user;
    } catch (error) {
      throw new ApplicationError('Database error occurred', 500);
    }
  }

  async create(userData) {
    try {
      const user = await prisma.users.create({
        data: userData
      });
      return user;
    } catch (error) {
      throw new ApplicationError('Failed to create user', 400);
    }
  }

  async update(id, userData) {
    try {
      const user = await prisma.users.update({
        where: { id },
        data: userData
      });
      return user;
    } catch (error) {
      throw new ApplicationError('Failed to update user', 400);
    }
  }

  async findAll() {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          base_salary: true,
          join_date: true
        }
      });
      return users;
    } catch (error) {
      throw new ApplicationError('Database error occurred', 500);
    }
  }
}

module.exports = UserRepositoryImpl;
```

### 3.3 Middleware Implementation
**File:** `src/infrastructure/middleware/AuthMiddleware.js`

```javascript
// src/infrastructure/middleware/AuthMiddleware.js
const jwt = require('jsonwebtoken');
const ApplicationError = require('../../shared/errors/ApplicationError');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new ApplicationError('Access token is required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApplicationError('Invalid token', 401);
    }
    next(error);
  }
};

module.exports = authMiddleware;
```

---

## 4. Core Layer (Dibuat Kedua)

### 4.1 Interfaces (Kontrak)
**File:** `src/core/interfaces/IUserRepository.js`

```javascript
// src/core/interfaces/IUserRepository.js
class IUserRepository {
  async findByEmail(email) {
    throw new Error('Method findByEmail not implemented');
  }

  async findById(id) {
    throw new Error('Method findById not implemented');
  }

  async create(userData) {
    throw new Error('Method create not implemented');
  }

  async update(id, userData) {
    throw new Error('Method update not implemented');
  }

  async findAll() {
    throw new Error('Method findAll not implemented');
  }
}

module.exports = IUserRepository;
```

### 4.2 Entities (Business Logic Murni)
**File:** `src/core/entities/User.entity.js`

```javascript
// src/core/entities/User.entity.js
class UserEntity {
  constructor(id, name, email, password, role, baseSalary, joinDate) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role || 'employee';
    this.baseSalary = baseSalary;
    this.joinDate = joinDate;
  }

  validate() {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Email is required and must be valid');
    }
    
    if (!this.name || this.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async hashPassword(plainPassword) {
    // Implementasi hashing password di service
    // Contoh: return await bcrypt.hash(plainPassword, 12);
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    // Implementasi verifikasi password di service
    // Contoh: return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = UserEntity;
```

### 4.3 Use Cases (Business Logic)
**File:** `src/core/usecases/auth/LoginUserUseCase.js`

```javascript
// src/core/usecases/auth/LoginUserUseCase.js
const ApplicationError = require('../../../shared/errors/ApplicationError');

class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, password) {
    if (!email || !password) {
      throw new ApplicationError('Email and password are required', 400);
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApplicationError('Invalid credentials', 401);
    }

    // Verifikasi password akan dilakukan di service
    // const isValidPassword = await UserEntity.verifyPassword(password, user.password);
    // if (!isValidPassword) {
    //   throw new ApplicationError('Invalid credentials', 401);
    // }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = LoginUserUseCase;
```

---

## 5. Interface Layer (Dibuat Ketiga)

### 5.1 Controllers
**File:** `src/interfaces/controllers/AuthController.js`

```javascript
// src/interfaces/controllers/AuthController.js
const LoginUserUseCase = require('../../core/usecases/auth/LoginUserUseCase');
const UserRepositoryImpl = require('../../infrastructure/database/UserRepositoryImpl');

class AuthController {
  constructor() {
    this.userRepository = new UserRepositoryImpl();
    this.loginUserUseCase = new LoginUserUseCase(this.userRepository);
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUserUseCase.execute(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
```

### 5.2 Routes
**File:** `src/interfaces/routes/auth.routes.js`

```javascript
// src/interfaces/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/login', authController.login);

module.exports = router;
```

### 5.3 DTOs
**File:** `src/interfaces/dtos/LoginRequestDTO.js`

```javascript
// src/interfaces/dtos/LoginRequestDTO.js
class LoginRequestDTO {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  validate() {
    const errors = [];

    if (!this.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Email format is invalid');
    }

    if (!this.password) {
      errors.push('Password is required');
    } else if (this.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sanitize() {
    this.email = this.email.trim().toLowerCase();
  }
}

module.exports = LoginRequestDTO;
```

---

## 6. Shared Layer (Dibuat Bersamaan dengan Layer Lain)

### 6.1 Errors
**File:** `src/shared/errors/ApplicationError.js`

```javascript
// src/shared/errors/ApplicationError.js
class ApplicationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApplicationError;
```

---

## 7. Sprint Planning dengan Urutan Pembuatan yang Benar

### Sprint 1: Foundation & Authentication (Hari 1)

#### 7.1 Goals untuk Sprint 1:
- [x] Membuat endpoint `/auth/login` yang menerima email dan password
- [x] Implementasi validasi input untuk login
- [ ] Implementasi JWT authentication
- [ ] Membuat middleware untuk validasi token
- [ ] Membuat role-based access control
- [ ] Membuat endpoint `/employees/profile` untuk melihat profil sendiri
- [ ] Membuat endpoint `/employees` untuk HR Admin melihat semua karyawan
- [ ] Membuat endpoint `/employees` POST untuk HR Admin membuat karyawan baru

#### 7.2 Urutan Pembuatan:
1. **Infrastructure Layer:**
   - `DatabaseConnection.js`
   - `UserRepositoryImpl.js`
   - `AuthMiddleware.js`

2. **Shared Layer:**
   - `ApplicationError.js`

3. **Core Layer:**
   - `IUserRepository.js`
   - `User.entity.js`
   - `LoginUserUseCase.js`
   - `RegisterUserUseCase.js`

4. **Interface Layer:**
   - `AuthController.js`
   - `auth.routes.js`
   - `LoginRequestDTO.js`

#### 7.3 Integration:
- Update `src/index.js` untuk menggunakan routes
- Tambahkan error handling middleware

---

### Sprint 2: Core Features (Hari 2)

#### 7.1 Goals untuk Sprint 2:
- [ ] Membuat endpoint `/attendance/clock-in` untuk employee absen masuk
- [ ] Membuat endpoint `/attendance/clock-out` untuk employee absen pulang
- [ ] Implementasi validasi bahwa employee tidak bisa absen 2x sehari
- [ ] Implementasi validasi bahwa employee tidak bisa absen hari Minggu
- [ ] Implementasi logika status absensi (present, late, absent) berdasarkan waktu masuk
- [ ] Membuat endpoint `/attendance/my-history` untuk employee melihat riwayat absensi sendiri
- [ ] Membuat endpoint `/attendance/employee/:id` untuk HR Admin melihat absensi karyawan tertentu
- [ ] Membuat endpoint `/attendance/date/:date` untuk HR Admin melihat absensi semua karyawan pada tanggal tertentu

#### 7.2 Urutan Pembuatan:
1. **Infrastructure Layer:**
   - `AttendanceRepositoryImpl.js`
   - `AttendanceMiddleware.js`

2. **Core Layer:**
   - `IAttendanceRepository.js`
   - `Attendance.entity.js`
   - `ClockInUseCase.js`
   - `ClockOutUseCase.js`

3. **Interface Layer:**
   - `AttendanceController.js`
   - `attendance.routes.js`
   - `ClockInRequestDTO.js`

---

### Sprint 3: Advanced Features (Hari 3)

#### 7.1 Goals untuk Sprint 3:
- [ ] Membuat endpoint `/payrolls/generate` untuk HR Admin mengenerate slip gaji
- [ ] Implementasi logika perhitungan gaji berdasarkan absensi (potongan telat/absen)
- [ ] Implementasi bahwa data gaji yang sudah digenerate (status: Paid) tidak bisa diubah
- [ ] Membuat endpoint `/payrolls/my-history` untuk employee melihat riwayat gaji sendiri
- [ ] Membuat endpoint `/payrolls/employee/:id` untuk HR Admin melihat gaji karyawan tertentu
- [ ] Membuat endpoint `/payrolls/month/:month/year/:year` untuk HR Admin melihat gaji semua karyawan pada bulan dan tahun tertentu
- [ ] Implementasi validasi bahwa hanya HR Admin yang bisa mengenerate gaji
- [ ] Membuat endpoint `/payrolls/:id/pay` untuk HR Admin menandai gaji sebagai sudah dibayar

#### 7.2 Urutan Pembuatan:
1. **Infrastructure Layer:**
   - `PayrollRepositoryImpl.js`
   - `PayrollCalculationService.js`

2. **Core Layer:**
   - `IPayrollRepository.js`
   - `Payroll.entity.js`
   - `GeneratePayrollUseCase.js`
   - `GetPayrollHistoryUseCase.js`

3. **Interface Layer:**
   - `PayrollController.js`
   - `payroll.routes.js`
   - `GeneratePayrollRequestDTO.js`

---

## 8. Dependency Injection Pattern

### 8.1 Contoh Dependency Injection:
```javascript
// Di controller, dependency diberikan dari luar
class AuthController {
  constructor(userRepository) {
    this.userRepository = userRepository || new UserRepositoryImpl();
    this.loginUserUseCase = new LoginUserUseCase(this.userRepository);
  }
}
```

---

## 9. Error Handling Pattern

### 9.1 Global Error Handler Middleware:
```javascript
// src/middleware/ErrorHandler.js
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;
```

---

## 10. Kesimpulan

Dengan pendekatan ini, Anda:
- Membangun dari foundation yang nyata (Infrastructure)
- Tidak ada dependency yang menggantung
- Bisa menguji setiap layer secara bertahap
- Memahami alur dari bawah ke atas
- Memiliki struktur yang jelas dan terorganisir

Urutan pembuatan: **Infrastructure → Core → Interface** memastikan bahwa setiap layer memiliki implementasi nyata sebelum digunakan oleh layer di atasnya.
