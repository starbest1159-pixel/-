# **TH77 Prime: Wiki Documentation**

**Lottery Management Platform**  
**Designed &amp; Developed by PSAI Studio**  
**Version:** 1.0.0  
**Last Updated:** July 7, 2026

---

## **📚 Table of Contents**

1. [บทนำ (Introduction)](#1-บทนำ-introduction)
2. [คำศัพท์ (Glossary)](#2-คำศัพท์-glossary)
3. [การเริ่มต้น (Getting Started)](#3-การเริ่มต้น-getting-started)
4. [สถาปัตยกรรมระบบ (System Architecture)](#4-สถาปัตยกรรมระบบ-system-architecture)
5. [การจัดการผู้ใช้งาน (User Management)](#5-การจัดการผู้ใช้งาน-user-management)
6. [การจัดการหวยและงวด (Lottery &amp; Round Management)](#6-การจัดการหวยและงวด-lottery--round-management)
7. [ระบบรับโพย (Betting System)](#7-ระบบรับโพย-betting-system)
8. [ระบบบริหารความเสี่ยง (Risk Management)](#8-ระบบบริหารความเสี่ยง-risk-management)
9. [ระบบลิงก์รับแทง (Link-Based Betting)](#9-ระบบลิงก์รับแทง-link-based-betting)
10. [การประมวลผลและการเงิน (Financial Processing)](#10-การประมวลผลและการเงิน-financial-processing)
11. [ระบบรายงาน (Reporting)](#11-ระบบรายงาน-reporting)
12. [API Documentation](#12-api-documentation)
13. [Database Schema](#13-database-schema)
14. [การ Deploy (Deployment)](#14-การ-deploy-deployment)
15. [การทดสอบ (Testing)](#15-การทดสอบ-testing)
16. [การแก้ไขปัญหา (Troubleshooting)](#16-การแก้ไขปัญหา-troubleshooting)
17. [คำถามที่พบบ่อย (FAQ)](#17-คำถามที่พบบ่อย-faq)

---

## **1. บทนำ (Introduction)**

### **1.1 คำอธิบายระบบ (System Overview)**

**TH77 Prime** เป็น **ระบบบริหารจัดการเครดิตสำหรับธุรกิจหวยออนไลน์** ที่ออกแบบมาเพื่อตอบโจทย์ทุกความต้องการของเจ้ามือหวย และเอเย่นต์ โดยมีฟีเจอร์ครบวงจรตั้งแต่:

- **การจัดการผู้ใช้งาน 4 ระดับ** (Admin, Master, Agent, Member)
- **การจัดการหวยหลายประเภท** (Thai Lottery, Lao Lottery, Hanoi Lottery, Stock Lottery)
- **ระบบรับโพยที่ยืดหยุ่น** (Quick Key, Manual Selection)
- **ระบบบริหารความเสี่ยง** (Restricted Numbers, Risk Sharing)
- **ระบบลิงก์รับแทง** (Self-Service Betting Links)
- **การประมวลผลและการเงินอัตโนมัติ** (Prize Calculation, Payouts, Settlements)
- **ระบบรายงานที่ละเอียด** (Bet History, Financial Reports, Agent Performance)

### **1.2 ความสามารถหลัก (Key Features)**


| **ฟีเจอร์**                   | **รายละเอียด**                                                          |
| ----------------------------- | ----------------------------------------------------------------------- |
| **Multi-Tenant Architecture** | แต่ละเจ้ามือมีข้อมูลแยกกัน (Hierarchy: Admin → Master → Agent → Member) |
| **Credit Management**         | กำหนดยอดรับสูงสุด 100,000 THB ต่อเจ้ามือ, หักเครดิตทันทีเมื่อคีย์โพย    |
| **Real-Time Processing**      | บวกลบยอดเป๊ะ, ห้ามยอดหาย, ห้ามยอดมั่ว                                   |
| **Link-Based Betting**        | ลูกค้าโพยผ่านลิงก์โดยไม่ต้องล็อกอิน                                     |
| **Risk Control**              | จัดการเลขอั้น, ส่งยอดเสี่ยงให้เจ้ามือใหญ่                               |
| **Automated Alerts**          | แจ้งเตือนเมื่อเครดิตต่ำ/หมด, บล็อกการคีย์เมื่อเครดิต=0                  |
| **OCR Integration**           | อัปโหลดหลักฐานการชำระเงิน (Payment Proof)                               |
| **High Availability**         | ระบบทำงานตลอด 24/7 พร้อม Auto-Scaling                                   |


### **1.3 Technology Stack**


| **Layer**         | **Technology**                                           |
| ----------------- | -------------------------------------------------------- |
| **Frontend**      | React (TypeScript), Next.js, Flutter (Mobile)            |
| **Backend**       | Node.js (Express/NestJS), Go (High-Throughput)           |
| **Database**      | PostgreSQL (Primary), Redis (Cache), MongoDB (Analytics) |
| **Message Queue** | RabbitMQ / Kafka                                         |
| **Search**        | Elasticsearch                                            |
| **Storage**       | MinIO (Object Storage)                                   |
| **API Gateway**   | Kong / Traefik                                           |
| **Monitoring**    | Prometheus, Grafana, Loki                                |
| **CI/CD**         | GitHub Actions, Docker, Kubernetes                       |
| **Security**      | JWT, RBAC, Cloudflare WAF, TLS                           |


---

## **2. คำศัพท์ (Glossary)**


| **คำศัพท์**           | **คำอธิบาย**                                       |
| --------------------- | -------------------------------------------------- |
| **Admin**             | ผู้ดูแลระบบสูงสุด, มีสิทธิ์จัดการทุกส่วน           |
| **Master (เจ้ามือ)**  | ผู้จัดการเอเย่นต์และความเสี่ยง, ดูภาพรวมทั้งหมด    |
| **Agent (คนเดินโพย)** | ผู้คีย์โพยให้ลูกค้า, ดูรายงานของตนเอง              |
| **Member (สมาชิก)**   | ลูกค้าที่โพยผ่านลิงก์                              |
| **3D**                | โพยเลข 3 ตัว (ตัวอย่าง: 123)                       |
| **2D**                | โพยเลข 2 ตัว (ตัวอย่าง: 23)                        |
| **Round**             | รอบการออกรางวัล (ตัวอย่าง: หวยรัฐบาลงวดที่ 123456) |
| **Credit**            | ยอดเครดิตที่ใช้สำหรับคีย์โพย                       |
| **Credit Limit**      | ยอดรับสูงสุดที่กำหนด (100,000 THB)                 |
| **Restricted Number** | เลขที่ถูกจำกัด (ไม่รับหรือจ่ายลด)                  |
| **Payout Rate**       | อัตราจ่ายรางวัล (ตัวอย่าง: 1:800 สำหรับ 3D)        |
| **Settlement**        | การคำนวณและจ่ายรางวัลหลังจากรอบปิด                 |
| **Commission**        | ค่าคอมมิชชั่นสำหรับเอเย่นต์/เจ้ามือ                |
| **Betting Link**      | ลิงก์สำหรับลูกค้าโพยโดยตรง                         |
| **Audit Log**         | บันทึกทุกการดำเนินการเพื่อตรวจสอบย้อนหลัง          |


---

## **3. การเริ่มต้น (Getting Started)**

### **3.1 ความต้องการระบบ (System Requirements)**

#### **Hardware Requirements**


| **Component** | **Minimum** | **Recommended** |
| ------------- | ----------- | --------------- |
| **CPU**       | 4 Cores     | 8+ Cores        |
| **RAM**       | 8 GB        | 16+ GB          |
| **Storage**   | 50 GB SSD   | 100+ GB SSD     |
| **Network**   | 100 Mbps    | 1 Gbps          |


#### **Software Requirements**


| **Component**      | **Version** |
| ------------------ | ----------- |
| **Docker**         | 20.10+      |
| **Docker Compose** | 2.0+        |
| **Kubernetes**     | 1.25+       |
| **Node.js**        | 18+         |
| **PostgreSQL**     | 15+         |
| **Redis**          | 7+          |
| **RabbitMQ**       | 3.12+       |


---

### **3.2 การติดตั้ง (Installation)**

#### **Local Development (Docker Compose)**

1. **Clone Repository**
  ```bash
   git clone https://github.com/your-repo/th77-prime.git
   cd th77-prime
  ```
2. **Setup Environment Variables**
  ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your settings
  
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your settings
  ```
3. **Start Services with Docker Compose**
  ```bash
   docker-compose up -d
  ```
4. **Access the Application**
  - **Frontend:** [http://localhost:3001](http://localhost:3001)
  - **Backend API:** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
  - **PGAdmin:** [http://localhost:5050](http://localhost:5050)
  - **RabbitMQ Management:** [http://localhost:15672](http://localhost:15672)

---

### **3.3 การตั้งค่า Environment Variables**

#### **Backend (.env)**

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=th77_prime

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_here
JWT_EXPIRES_IN=1d

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# RabbitMQ Configuration
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=password

# External Services
LINE_CHANNEL_ACCESS_TOKEN=your_line_token
SMS_API_KEY=your_sms_key

# Logging
LOG_LEVEL=info
```

#### **Frontend (.env)**

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=TH77 Prime
NEXT_PUBLIC_ENV=development
```

---

## **4. สถาปัตยกรรมระบบ (System Architecture)**

### **4.1 High-Level Architecture**

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Client Layer                                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐    ┌───────────┐ │
│  │   Web App   │    │  Agent App  │    │   Admin Panel   │    │  Mobile   │ │
│  │ (React/Next)│    │ (React/Next)│    │   (React/Next)   │    │ (Flutter) │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘    └───────────┘ │
└───────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                                API Gateway (Kong)                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ - Rate Limiting                                                          │  │
│  │ - JWT Validation                                                         │  │
│  │ - Request/Response Logging                                               │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Microservices Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Auth       │  │  User       │  │  Lottery    │  │  Betting                 │  │
│  │  Service    │  │  Service    │  │  Service    │  │  Service                │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Wallet     │  │  Payment    │  │  Settlement │  │  Commission              │  │
│  │  Service    │  │  Service    │  │  Service    │  │  Service                │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────────────────┐  │
│  │  Reporting  │  │  Notification│  │  Audit / File / OCR                      │  │
│  │  Service    │  │  Service    │  │  Service                                    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Infrastructure Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ PostgreSQL  │  │   Redis     │  │ RabbitMQ   │  │ Elasticsearch / MinIO    │  │
│  │ (Primary)   │  │ (Cluster)   │  │ (Cluster)  │  │ (Storage)                │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

### **4.2 Service Breakdown**


| **Service**              | **Responsibility**                           | **Database**         | **Dependencies**                 |
| ------------------------ | -------------------------------------------- | -------------------- | -------------------------------- |
| **Auth Service**         | User authentication, JWT management          | PostgreSQL           | Redis (session)                  |
| **User Service**         | User CRUD, role/permission management        | PostgreSQL           | Auth Service                     |
| **Lottery Service**      | Lottery types, rounds, schedules             | PostgreSQL           | -                                |
| **Betting Service**      | Bet placement, validation, duplication check | PostgreSQL           | Lottery Service, Redis           |
| **Wallet Service**       | Credit management, deposits, withdrawals     | PostgreSQL           | User Service                     |
| **Payment Service**      | Payment gateway integration, callbacks       | PostgreSQL           | Wallet Service                   |
| **Settlement Service**   | Prize calculation, payout processing         | PostgreSQL           | Betting Service, Wallet Service  |
| **Commission Service**   | Agent hierarchy, commission calculation      | PostgreSQL           | User Service, Settlement Service |
| **Reporting Service**    | Financial reports, bet history               | PostgreSQL + MongoDB | All Services                     |
| **Notification Service** | SMS, Email, LINE notifications               | -                    | RabbitMQ                         |
| **Audit Service**        | Logging all financial operations             | Elasticsearch        | All Services                     |
| **File Service**         | Document storage (payment proofs, OCR)       | MinIO                | -                                |


---

## **5. การจัดการผู้ใช้งาน (User Management)**

### **5.1 Role Hierarchy**

```
Admin (Super User)
   │
   ├── Master (Manages Agents & Risk)
   │      │
   │      ├── Agent (Places Bets, Manages Members)
   │      │      │
   │      │      └── Member (Bets via Links)
   │
   └── Direct Agent (Optional)
```

### **5.2 Permission Matrix**


| **Action**                   | **Admin**                | **Master**               | **Agent**      | **Member**  |
| ---------------------------- | ------------------------ | ------------------------ | -------------- | ----------- |
| **User Management**          | ✅ Create/Edit/Delete All | ✅ Create/Edit Agents     | ❌              | ❌           |
| **Credit Adjustment**        | ✅ All Users              | ✅ Agents &amp; Below     | ✅ Members Only | ❌           |
| **Discount Management**      | ✅ All Users              | ✅ Agents &amp; Below     | ✅ Members Only | ❌           |
| **Lottery/Round Management** | ✅ Full Access            | ❌                        | ❌              | ❌           |
| **Bet Placement**            | ✅ All                    | ✅ All                    | ✅ Own Bets     | ✅ Via Links |
| **Bet Validation**           | ✅ All                    | ✅ All                    | ✅ Own Bets     | ❌           |
| **Risk Management**          | ✅ Full Access            | ✅ Set Restricted Numbers | ❌              | ❌           |
| **Link Generation**          | ✅ All                    | ✅ All                    | ✅ Own Links    | ❌           |
| **Prize Calculation**        | ✅ All                    | ✅ All                    | ❌              | ❌           |
| **Payout Confirmation**      | ✅ All                    | ✅ All                    | ✅ Own Payouts  | ❌           |
| **Financial Reports**        | ✅ All                    | ✅ All                    | ✅ Own Reports  | ✅ Own Bets  |
| **Audit Logs**               | ✅ All                    | ✅ All                    | ❌              | ❌           |


---

### **5.3 User Workflow**

#### **Create User (Admin/Master)**

1. **Admin/Master** เข้าสู่ระบบ
2. ไปที่ **User Management**
3. กด **Add User**
4. กรอกข้อมูล:
  - Username
  - Password
  - Role (Agent/Member)
  - Credit Limit (100,000 THB)
  - Discount Percentage
5. กด **Save**

#### **Adjust Credit (Admin/Master)**

1. เลือก User ที่ต้องการปรับเครดิต
2. กด **Adjust Credit**
3. กรอก:
  - จำนวนเงิน
  - ประเภท (เติม/หัก)
  - เหตุผล
4. กด **Confirm**
5. ระบบบันทึก **Credit Transaction** และ **Audit Log**

#### **Block/Unblock User (Auto)**

- เมื่อเครดิต = 0 → **ระบบบล็อกอัตโนมัติ**
- เมื่อเติมเครดิต → **ระบบยกเลิกบล็อกอัตโนมัติ**

---

## **6. การจัดการหวยและงวด (Lottery &amp; Round Management)**

### **6.1 Lottery Types**


| **Field**       | **Description** | **Example**  |
| --------------- | --------------- | ------------ |
| **Name**        | ชื่อประเภทหวย   | Thai Lottery |
| **Description** | คำอธิบาย        | หวยรัฐบาลไทย |
| **Image URL**   | รูปภาพประจำ     | \[URL\]      |
| **Is Active**   | สถานะ           | ✅            |


**Supported Lottery Types:**

- Thai Lottery (หวยรัฐบาล)
- Lao Lottery (หวยลาว)
- Hanoi Lottery (หวยฮานอย)
- Stock Lottery (หวยหุ้น)

---

### **6.2 Round Management**


| **Field**        | **Description**     | **Example**      |
| ---------------- | ------------------- | ---------------- |
| **Lottery Type** | ประเภทหวย           | Thai Lottery     |
| **Round Number** | เลขรอบ              | 123456           |
| **Draw Date**    | วันออกรางวัล        | 2026-07-16 18:00 |
| **Close Time**   | เวลาปิดรับแทง       | 2026-07-16 12:00 |
| **Open Time**    | เวลาเปิดรับล่วงหน้า | 2026-07-01 00:00 |
| **Result 3D**    | ผลรางวัล 3 ตัว      | 123              |
| **Result 2D**    | ผลรางวัล 2 ตัว      | 23               |
| **Is Closed**    | สถานะ               | ✅                |


**Round Lifecycle:**

1. **Open** → Accept bets
2. **Close** → Stop accepting bets
3. **Draw** → Set results
4. **Settle** → Calculate prizes
5. **Complete** → Payouts confirmed

---

### **6.3 Auto-Generate Rounds**

1. **Admin** ไปที่ **Lottery Management**
2. กด **Generate Next Rounds**
3. ระบบสร้างงวดถัดไปของหวยทุกประเภทอัตโนมัติ

---

## **7. ระบบรับโพย (Betting System)**

### **7.1 Betting Modes**

#### **Quick Key Mode (โหมดคีย์ด่วน)**

- **Format:** `[เลข] [ยอด]x[จำนวน]`
- **Example:** `824 5040x1, 123 100x2`
- **For:** ผู้ใช้ที่ชำนาญ, ต้องการความเร็ว

#### **Manual Mode (โหมดกดเลือกเลข)**

- **Select:** ประเภท (3D/2D)
- **Enter:** เลข, ยอด, จำนวน
- **For:** ผู้ใช้ทั่วไป, ลดความผิดพลาด

---

### **7.2 Bet Validation**


| **Check**                              | **Action**      | **Result** |
| -------------------------------------- | --------------- | ---------- |
| **Duplicate Bet**                      | รวมยอด          | ✅          |
| **Restricted Number (Blocked)**        | ปฏิเสธ          | ❌          |
| **Restricted Number (Reduced Payout)** | แจ้งเตือน + รับ | ⚠️         |
| **Insufficient Credit**                | ปฏิเสธ          | ❌          |
| **Zero Credit**                        | บล็อก           | 🚫         |
| **Round Closed**                       | ปฏิเสธ          | ❌          |


---

### **7.3 Bet Workflow**

1. **Place Bet**
  - User คีย์โพย (Quick Key/Manual)
  - ระบบตรวจสอบ:
    - เครดิตพอหรือไม่
    - เลขถูกต้องหรือไม่
    - รอบยังเปิดรับหรือไม่
  - หากผ่าน → **บันทึกโพย** และ **หักเครดิตทันที**
2. **Bet Status**
  - `pending` → รออนุมัติ (สำหรับโพยผ่านลิงก์)
  - `confirmed` → ยืนยันแล้ว
  - `cancelled` → ยกเลิก
  - `won` → ถูกรางวัล
  - `paid` → จ่ายรางวัลแล้ว
3. **Credit Deduction**
  - หักเครดิตทันทีเมื่อบันทึกโพย
  - บันทึก **Transaction Log**
  - บันทึก **Audit Log**

---

### **7.4 Bet Types &amp; Payout Rates**


| **Bet Type**       | **Description** | **Payout Rate** | **Example (100 THB Bet)** |
| ------------------ | --------------- | --------------- | ------------------------- |
| **3D (Exact)**     | เลข 3 ตัวตรงกัน | 1:800           | 80,000 THB                |
| **2D (Exact)**     | เลข 2 ตัวตรงกัน | 1:80            | 8,000 THB                 |
| **3D (Any Order)** | เลข 3 ตัวใดๆ    | 1:150           | 15,000 THB                |
| **2D (Any Order)** | เลข 2 ตัวใดๆ    | 1:40            | 4,000 THB                 |


> **Note:** หากเป็น **Restricted Number** อัตราจ่ายจะลดตามที่กำหนด (ตัวอย่าง: 80% → 800 \* 0.80 = 640 THB)

---

## **8. ระบบบริหารความเสี่ยง (Risk Management)**

### **8.1 Restricted Numbers**


| **Type**           | **Description**  | **Action**   |
| ------------------ | ---------------- | ------------ |
| **Blocked**        | ไม่รับโพย        | ❌ ปฏิเสธ     |
| **Reduced Payout** | รับโพย แต่จ่ายลด | ⚠️ แจ้งเตือน |


**Example:**

- เลข `824` → **Blocked** (ไม่รับ)
- เลข `123` → **Reduced Payout 80%** (รับ แต่จ่าย 80%)

---

### **8.2 Risk Management Workflow**

1. **Admin/Master Sets Restricted Numbers**
  - กำหนดเลขอั้นสำหรับแต่ละรอบ
  - กำหนดประเภท (Blocked/Reduced Payout)
  - กำหนดอัตราจ่าย (สำหรับ Reduced Payout)
2. **Copy from Previous Round**
  - คัดลอกเลขอั้นจากรอบก่อนหน้า
  - ประหยัดเวลาในการตั้งค่า
3. **Monitor Risk in Real-Time**
  - ติดตามยอดโพยต่อเลข
  - ไฮไลท์เลขที่มียอดสูง (Risk Dashboard)
4. **Send to Master Agent**
  - ส่งยอดเสี่ยงไปให้เจ้ามือรายใหญ่
  - คำนวณยอดส่งต่อ
5. **Confirm from Master Agent**
  - ยืนยันการรับรางวัลจากเจ้ามือใหญ่
  - บันทึก **Settlement**

---

### **8.3 Risk Dashboard**

**Features:**

- **Real-Time Monitoring** of bets per number
- **Color-Coded Risk Levels**
  - 🟢 **Green**: Safe (ยอดต่ำกว่า threshold)
  - 🟡 **Yellow**: Caution (ยอดใกล้ threshold)
  - 🔴 **Red**: High Risk (ยอดเกิน threshold)
- **Automated Alerts** for high-risk numbers
- **One-Click Actions**:
  - Send to Master
  - Adjust Payout Rate
  - Block Number

---

## **9. ระบบลิงก์รับแทง (Link-Based Betting)**

### **9.1 How It Works**

1. **Agent/Master Creates Link**
  - กำหนด:
    - Customer Name
    - Expiry Time (15 นาที, 1 ชั่วโมง, 1 วัน)
    - Max Uses (ใช้ครั้งเดียว/หลายครั้ง)
  - ระบบสร้าง **Unique Token** (ตัวอย่าง: `abc123def456`)
2. **Share Link with Customer**
  - URL: `https://th77prime.com/bet/abc123def456`
  - ส่งผ่าน LINE, SMS, Email
3. **Customer Clicks Link**
  - เข้าสู่หน้าโพยโดยตรง (ไม่ต้องล็อกอิน)
  - เห็น:
    - รอบที่เปิดรับ
    - ประเภทหวย
    - ช่องสำหรับกรอกโพย
4. **Customer Places Bet**
  - กรอกโพย (Quick Key/Manual)
  - กด **บันทึก**
  - โพยสถานะ = `pending` (รอเจ้ามืออนุมัติ)
  - **หักเครดิตเจ้ามือทันที**
5. **Agent Approves/Rejects Bet**
  - **Approve**: โพยสถานะ = `confirmed`
  - **Reject**: โพยสถานะ = `cancelled`, **คืนเครดิตเจ้ามือ**

---

### **9.2 Link Security**


| **Feature**            | **Description**                        |
| ---------------------- | -------------------------------------- |
| **Token-Based Access** | แต่ละลิงก์มี Token เฉพาะ, ยากต่อการเดา |
| **Expiry Time**        | ลิงก์หมดอายุอัตโนมัติหลังเวลาที่กำหนด  |
| **Max Uses**           | จำกัดจำนวนครั้งในการใช้งาน             |
| **IP Tracking**        | บันทึก IP ของลูกค้าเพื่อป้องกันการฉอฉก |
| **Rate Limiting**      | ป้องกันการใช้งานลิงก์เกินขีดจำกัด      |


---

### **9.3 Link Management**


| **Action**              | **Description**                 |
| ----------------------- | ------------------------------- |
| **Create Link**         | สร้างลิงก์ใหม่สำหรับลูกค้า      |
| **List Links**          | ดูลิงก์ทั้งหมด (Active/Expired) |
| **Deactivate Link**     | ปิดการใช้งานลิงก์               |
| **View Bet History**    | ดูโพยที่มาจากลิงก์              |
| **Approve/Reject Bets** | อนุมัติ/ปฏิเสธโพยจากลิงก์       |


---

## **10. การประมวลผลและการเงิน (Financial Processing)**

### **10.1 Prize Calculation**

**Workflow:**

1. **Admin Sets Results**
  - กรอกผลรางวัล (3D, 2D) สำหรับรอบที่ปิด
2. **Run Calculation**
  - กด **Calculate Prizes**
  - ระบบ:
    - ตรวจโพยทั้งหมดในรอบ
    - คำนวณรางวัลตามเลขที่ถูก
    - พิจารณาอัตราจ่ายลด (Restricted Numbers)
3. **Review Winners**
  - ดูรายชื่อผู้ถูกรางวัล
  - ยอดรางวัลรวม

---

### **10.2 Settlement Process**


| **Step**                 | **Description**               | **Responsible** |
| ------------------------ | ----------------------------- | --------------- |
| **Calculate Prizes**     | คำนวณรางวัลสำหรับรอบ          | System          |
| **Create Settlement**    | สร้างรายการ Settlement        | System          |
| **Calculate Commission** | คำนวณคอมมิชชั่นสำหรับเอเย่นต์ | System          |
| **Confirm Settlement**   | ยืนยันการจ่ายรางวัล           | Admin/Master    |
| **Process Payout**       | โอนเงินให้ผู้ถูกรางวัล        | System          |


---

### **10.3 Financial Transactions**


| **Type**       | **Description** | **Effect on Credit** |
| -------------- | --------------- | -------------------- |
| **Bet**        | โพยหวย          | - (หักเครดิต)        |
| **Deposit**    | เติมเครดิต      | +                    |
| **Withdrawal** | ถอนเครดิต       | -                    |
| **Prize**      | รางวัล          | +                    |
| **Commission** | คอมมิชชั่น      | +                    |


**Example:**

- **Agent Credit:** 100,000 THB
- **Bet:** 5,040 THB (เลข 824)
- **New Credit:** 94,960 THB
- **Bet Status:** `confirmed`
- **Transaction Log:** บันทึกการหักเครดิต

---

## **11. ระบบรายงาน (Reporting)**

### **11.1 Report Types**


| **Report**           | **Description**                                  | **Access**           |
| -------------------- | ------------------------------------------------ | -------------------- |
| **Bet Report**       | รายการโพยทั้งหมด (Filter by Round, User, Status) | Admin, Master, Agent |
| **Financial Report** | สรุปยอดรับ, จ่าย, กำไร/ขาดทุน                    | Admin, Master        |
| **Agent Report**     | Performance ของเอเย่นต์แต่ละคน                   | Admin, Master        |
| **Customer Report**  | ยอดได้-เสียของลูกค้าแต่ละคน                      | Admin, Master, Agent |
| **Round Report**     | สรุปยอดสำหรับรอบเฉพาะ                            | Admin, Master        |
| **Audit Log**        | บันทึกทุกการดำเนินการ                            | Admin                |


---

### **11.2 Dashboard Overview**

#### **Agent Dashboard**

- **เครดิตปัจจุบัน:** 94,960 / 100,000 THB
- **ยอดโพยวันนี้:** 5,040 THB
- **ยอดชนะวันนี้:** 0 THB
- **รายการโพยล่าสุด:** 824 (3D) - 5,040 THB
- **แจ้งเตือน:** ⚠️ เครดิตเหลือ 94,960 THB

#### **Admin Dashboard**

- **จำนวนเจ้ามือ:** 10
- **ยอดโพยวันนี้:** 500,000 THB
- **ยอดจ่ายรางวัลวันนี้:** 100,000 THB
- **รายชื่อเจ้ามือ:** นายสมปอง (เครดิต: 94,960), นายสมชาย (เครดิต: 0 - 🚫 บล็อก)
- **แจ้งเตือน:** 🚨 เครดิตของนายสมชายหมดแล้ว!

---

## **12. API Documentation**

### **12.1 Base URL &amp; Authentication**

- **Base URL:** `https://api.th77prime.com/v1`
- **Authentication:** `Bearer <JWT_TOKEN>` (Header: `Authorization`)
- **Content-Type:** `application/json`

---

### **12.2 Authentication API**


| **Method** | **Endpoint**    | **Description**              |
| ---------- | --------------- | ---------------------------- |
| `POST`     | `/auth/login`   | Login with username/password |
| `POST`     | `/auth/refresh` | Refresh JWT token            |
| `POST`     | `/auth/logout`  | Invalidate JWT token         |


**Example: Login**

```bash
curl -X POST https://api.th77prime.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "secure123"}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "credit": 1000000.00
    }
  }
}
```

---

### **12.3 User Management API**


| **Method** | **Endpoint**         | **Description**            |
| ---------- | -------------------- | -------------------------- |
| `GET`      | `/users`             | List all users (paginated) |
| `GET`      | `/users/{id}`        | Get user details           |
| `POST`     | `/users`             | Create a new user          |
| `PUT`      | `/users/{id}`        | Update user details        |
| `DELETE`   | `/users/{id}`        | Deactivate a user          |
| `PUT`      | `/users/{id}/credit` | Adjust user credit         |


**Example: Adjust Credit**

```bash
curl -X PUT https://api.th77prime.com/v1/users/3/credit \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000.00,
    "action": "add",
    "reason": "Initial credit allocation"
  }'
```

---

### **12.4 Lottery &amp; Round API**


| **Method** | **Endpoint**           | **Description**               |
| ---------- | ---------------------- | ----------------------------- |
| `GET`      | `/lotteries`           | List all lottery types        |
| `POST`     | `/lotteries`           | Create a new lottery type     |
| `GET`      | `/rounds`              | List all rounds (filterable)  |
| `POST`     | `/rounds`              | Create a new round            |
| `POST`     | `/rounds/{id}/close`   | Close a round                 |
| `POST`     | `/rounds/{id}/results` | Set round results             |
| `POST`     | `/rounds/generate`     | Auto-generate upcoming rounds |


**Example: Set Round Results**

```bash
curl -X POST https://api.th77prime.com/v1/rounds/101/results \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "result_3d": "123",
    "result_2d": "23"
  }'
```

---

### **12.5 Betting API**


| **Method** | **Endpoint**          | **Description**                |
| ---------- | --------------------- | ------------------------------ |
| `GET`      | `/bets`               | List bets (filterable)         |
| `POST`     | `/bets`               | Place a new bet                |
| `PUT`      | `/bets/{id}`          | Update bet amount              |
| `DELETE`   | `/bets/{id}`          | Cancel a bet                   |
| `GET`      | `/bets/{id}/validate` | Validate bet before submission |


**Example: Place Bet**

```bash
curl -X POST https://api.th77prime.com/v1/bets \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "round_id": 101,
    "bets": [
      {
        "lottery_number": "824",
        "bet_type": "3d",
        "amount": 5040.00,
        "quantity": 1
      }
    ]
  }'
```

---

### **12.6 Risk Management API**


| **Method** | **Endpoint**               | **Description**          |
| ---------- | -------------------------- | ------------------------ |
| `GET`      | `/restricted-numbers`      | List restricted numbers  |
| `POST`     | `/restricted-numbers`      | Add a restricted number  |
| `PUT`      | `/restricted-numbers/{id}` | Update restricted number |
| `DELETE`   | `/restricted-numbers/{id}` | Remove restricted number |
| `POST`     | `/restricted-numbers/copy` | Copy from previous round |
| `GET`      | `/risk/overview`           | Get risk overview        |


---

### **12.7 Link-Based Betting API**


| **Method** | **Endpoint**          | **Description**           |
| ---------- | --------------------- | ------------------------- |
| `GET`      | `/links`              | List all betting links    |
| `POST`     | `/links`              | Create a new betting link |
| `GET`      | `/links/{token}`      | Get link details          |
| `POST`     | `/links/{token}/bets` | Place a bet via link      |


**Example: Create Betting Link**

```bash
curl -X POST https://api.th77prime.com/v1/links \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "expiry_time": "2026-07-08T23:59:59Z",
    "max_uses": 5,
    "round_id": 101
  }'
```

---

### **12.8 Financial API**


| **Method** | **Endpoint**                | **Description**              |
| ---------- | --------------------------- | ---------------------------- |
| `GET`      | `/transactions`             | List transactions            |
| `POST`     | `/payouts/calculate`        | Calculate prizes for a round |
| `POST`     | `/payouts/confirm`          | Confirm prize payout         |
| `GET`      | `/settlements`              | List settlements             |
| `POST`     | `/settlements/{id}/confirm` | Confirm settlement           |


---

### **12.9 Reporting API**


| **Method** | **Endpoint**          | **Description**           |
| ---------- | --------------------- | ------------------------- |
| `GET`      | `/reports/bets`       | Detailed bet reports      |
| `GET`      | `/reports/financial`  | Financial summary         |
| `GET`      | `/reports/agent`      | Agent performance reports |
| `GET`      | `/dashboard/overview` | Overview dashboard        |


---

## **13. Database Schema**

### **13.1 Core Tables**

#### **Users &amp; Roles**

```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    role_id INT REFERENCES roles(id),
    parent_id INT REFERENCES users(id),
    credit DECIMAL(15,2) DEFAULT 0.00,
    max_credit_limit DECIMAL(15,2) DEFAULT 100000.00,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    is_betting_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Lottery &amp; Rounds**

```sql
CREATE TABLE lottery_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rounds (
    id SERIAL PRIMARY KEY,
    lottery_type_id INT REFERENCES lottery_types(id),
    round_number VARCHAR(20) NOT NULL,
    draw_date TIMESTAMP NOT NULL,
    close_time TIMESTAMP NOT NULL,
    open_time TIMESTAMP NOT NULL,
    result_3d VARCHAR(3),
    result_2d VARCHAR(2),
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Betting System**

```sql
CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    round_id INT REFERENCES rounds(id),
    lottery_number VARCHAR(10) NOT NULL,
    bet_type VARCHAR(10) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    discount_applied DECIMAL(5,2) DEFAULT 0.00,
    is_restricted BOOLEAN DEFAULT false,
    restricted_rate DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'pending',
    is_from_link BOOLEAN DEFAULT false,
    link_id INT REFERENCES betting_links(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Risk Management**

```sql
CREATE TABLE restricted_numbers (
    id SERIAL PRIMARY KEY,
    round_id INT REFERENCES rounds(id),
    number VARCHAR(10) NOT NULL,
    is_blocked BOOLEAN DEFAULT true,
    payout_rate DECIMAL(5,2),
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Financials**

```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    reference_id INT,
    reference_type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'completed',
    proof_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Link-Based Betting**

```sql
CREATE TABLE betting_links (
    id SERIAL PRIMARY KEY,
    created_by INT REFERENCES users(id),
    customer_name VARCHAR(100),
    token VARCHAR(255) UNIQUE NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    max_uses INT,
    current_uses INT DEFAULT 0,
    round_id INT REFERENCES rounds(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE link_bets (
    id SERIAL PRIMARY KEY,
    link_id INT REFERENCES betting_links(id),
    bet_id INT REFERENCES bets(id),
    customer_ip VARCHAR(45),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Settlements &amp; Commissions**

```sql
CREATE TABLE settlements (
    id SERIAL PRIMARY KEY,
    round_id INT REFERENCES rounds(id),
    user_id INT REFERENCES users(id),
    total_bet_amount DECIMAL(15,2) NOT NULL,
    total_prize_amount DECIMAL(15,2) NOT NULL,
    net_profit DECIMAL(15,2) NOT NULL,
    commission_amount DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    settlement_id INT REFERENCES settlements(id),
    user_id INT REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Audit &amp; Alerts**

```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE credit_alerts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    alert_type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by INT REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### **13.2 Indexes for Performance**

```sql
-- Users
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_parent ON users(parent_id);
CREATE INDEX idx_users_credit ON users(credit) WHERE credit <= 10000;

-- Rounds
CREATE INDEX idx_rounds_lottery_type ON rounds(lottery_type_id);
CREATE INDEX idx_rounds_draw_date ON rounds(draw_date);
CREATE INDEX idx_rounds_status ON rounds(is_closed);

-- Bets
CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_bets_round ON bets(round_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_bets_number_type ON bets(lottery_number, bet_type);
CREATE INDEX idx_bets_link ON bets(is_from_link, link_id);

-- Transactions
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Restricted Numbers
CREATE INDEX idx_restricted_round_number ON restricted_numbers(round_id, number);

-- Betting Links
CREATE INDEX idx_betting_links_token ON betting_links(token);
CREATE INDEX idx_betting_links_expiry ON betting_links(expiry_time);
```

---

## **14. การ Deploy (Deployment)**

### **14.1 Docker Deployment (Local/Development)**

1. **Build Images**
  ```bash
   # Backend
   cd backend
   docker build -t th77prime/backend:v1.0.0 .
  
   # Frontend
   cd frontend
   docker build -t th77prime/frontend:v1.0.0 .
  ```
2. **Run with Docker Compose**
  ```bash
   docker-compose up -d
  ```
3. **Access Services**
  - Frontend: [http://localhost:3001](http://localhost:3001)
  - Backend API: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
  - PGAdmin: [http://localhost:5050](http://localhost:5050)
  - RabbitMQ: [http://localhost:15672](http://localhost:15672)

---

### **14.2 Kubernetes Deployment (Production)**

1. **Build and Push Images**
  ```bash
   # Backend
   cd backend
   docker build -t th77prime/backend:v1.0.0 .
   docker push th77prime/backend:v1.0.0
  
   # Frontend
   cd frontend
   docker build -t th77prime/frontend:v1.0.0 .
   docker push th77prime/frontend:v1.0.0
  ```
2. **Apply Kubernetes Manifests**
  ```bash
   kubectl apply -f k8s/
  ```
3. **Verify Deployment**
  ```bash
   kubectl get pods -n th77-prime
   kubectl get svc -n th77-prime
   kubectl get ingress -n th77-prime
  ```
4. **Access Application**
  - Frontend: [https://th77prime.com](https://th77prime.com)
  - Backend API: [https://api.th77prime.com/api/v1](https://api.th77prime.com/api/v1)

---

### **14.3 Kubernetes Files**


| **File**                       | **Description**                         |
| ------------------------------ | --------------------------------------- |
| `k8s/namespace.yaml`           | Namespace Configuration                 |
| `k8s/configmaps.yaml`          | Non-Sensitive Configuration             |
| `k8s/secrets.yaml`             | Sensitive Configuration (DB, JWT, etc.) |
| `k8s/backend-deployment.yaml`  | Backend Deployment &amp; Service        |
| `k8s/frontend-deployment.yaml` | Frontend Deployment &amp; Service       |
| `k8s/postgres-deployment.yaml` | PostgreSQL StatefulSet &amp; Service    |
| `k8s/redis-deployment.yaml`    | Redis Deployment &amp; Service          |
| `k8s/rabbitmq-deployment.yaml` | RabbitMQ StatefulSet &amp; Service      |
| `k8s/ingress.yaml`             | Nginx Ingress with SSL                  |
| `k8s/pvc.yaml`                 | Persistent Volume Claims                |
| `k8s/hpa.yaml`                 | Horizontal Pod Autoscaler               |
| `k8s/kong-deployment.yaml`     | API Gateway (Kong)                      |
| `k8s/monitoring.yaml`          | Prometheus, Grafana, Loki               |


---

## **15. การทดสอบ (Testing)**

### **15.1 Unit Testing**

**Backend (Jest)**

```bash
cd backend
npm test
```

**Example Test (bettingService.test.ts):**

```typescript
import { BetService } from '../services/bettingService';
import { User, Bet, Round } from '../models';

describe('BetService', () => {
  beforeAll(async () => {
    await User.create({ username: 'test-agent', role: 'agent', credit: 100000 });
    await Round.create({ round_number: '123456', draw_date: new Date(), is_closed: false });
  });

  it('should place a bet and deduct credit', async () => {
    const result = await BetService.placeBet(1, 1, [
      { lottery_number: '123', bet_type: '3d', amount: 100, quantity: 1 }
    ]);
    
    expect(result.bets.length).toBe(1);
    expect(result.new_balance).toBe(99900);
  });

  it('should reject bet with insufficient credit', async () => {
    await expect(
      BetService.placeBet(1, 1, [
        { lottery_number: '456', bet_type: '3d', amount: 200000, quantity: 1 }
      ])
    ).rejects.toThrow('INSUFFICIENT_CREDIT');
  });
});
```

---

### **15.2 Integration Testing**

**Postman Collection:**

- **Auth API** (Login, Refresh Token)
- **User API** (CRUD, Credit Adjustment)
- **Betting API** (Place Bet, Validate Bet)
- **Risk API** (Restricted Numbers)
- **Link API** (Create Link, Place Bet via Link)

---

### **15.3 End-to-End Testing (Cypress)**

**Example Test (betPlacement.spec.js):**

```javascript
describe('Bet Placement', () => {
  beforeEach(() => {
    cy.login('agent001', 'password123');
  });

  it('should place a bet successfully', () => {
    cy.visit('/betting');
    cy.get('#lottery-number').type('123');
    cy.get('#amount').type('100');
    cy.get('#quantity').type('1');
    cy.get('#place-bet').click();
    
    cy.contains('Bet placed successfully!');
    cy.contains('Credit: 99,900 THB');
  });

  it('should block betting when credit is zero', () => {
    // Simulate zero credit
    cy.intercept('POST', '/api/v1/bets', {
      statusCode: 400,
      body: { error: { code: 'ZERO_CREDIT' } }
    });
    
    cy.visit('/betting');
    cy.get('#place-bet').click();
    cy.contains('เครดิตหมด กรุณาเติมเครดิตก่อน');
  });
});
```

---

## **16. การแก้ไขปัญหา (Troubleshooting)**

### **16.1 Common Issues &amp; Solutions**


| **Issue**                     | **Cause**                   | **Solution**                     |
| ----------------------------- | --------------------------- | -------------------------------- |
| **Login fails**               | Incorrect credentials       | Reset password or check username |
| **Bets not appearing**        | Not confirmed by agent      | Contact agent to approve         |
| **Payout not received**       | Prize calculation not run   | Run calculation for the round    |
| **Link not working**          | Expired or max uses reached | Generate new link                |
| **Slow API responses**        | High server load            | Check monitoring (Grafana)       |
| **Credit not deducting**      | Transaction failed          | Check audit logs                 |
| **Database connection error** | Incorrect DB config         | Verify `k8s/secrets.yaml`        |
| **Redis connection error**    | Incorrect Redis config      | Verify `k8s/configmaps.yaml`     |


---

### **16.2 Error Codes**


| **Code**              | **HTTP Status** | **Description**                 | **Solution**          |
| --------------------- | --------------- | ------------------------------- | --------------------- |
| `INVALID_INPUT`       | 400             | Missing or invalid request data | Check request body    |
| `UNAUTHORIZED`        | 401             | Missing or invalid JWT          | Re-login              |
| `FORBIDDEN`           | 403             | Insufficient permissions        | Check user role       |
| `NOT_FOUND`           | 404             | Resource not found              | Verify ID/endpoint    |
| `INVALID_BET`         | 400             | Bet violates rules              | Check number/type     |
| `INSUFFICIENT_CREDIT` | 400             | User has no credit              | Top up credit         |
| `ZERO_CREDIT`         | 400             | Credit is zero                  | Top up credit         |
| `ROUND_CLOSED`        | 400             | Betting is closed               | Wait for next round   |
| `RESTRICTED_NUMBER`   | 400             | Number is blocked               | Choose another number |
| `RATE_LIMITED`        | 429             | Too many requests               | Wait and retry        |
| `SERVER_ERROR`        | 500             | Internal server error           | Check logs            |


---

### **16.3 Logs &amp; Debugging**

**View Pod Logs:**

```bash
kubectl logs -f deployment/th77-prime-backend -n th77-prime
kubectl logs -f deployment/th77-prime-frontend -n th77-prime
```

**View All Logs with Timestamp:**

```bash
kubectl logs --since-time=2026-07-07T00:00:00Z -f deployment/th77-prime-backend -n th77-prime
```

**Debug Inside Pod:**

```bash
kubectl exec -it deployment/th77-prime-backend -n th77-prime -- /bin/sh
```

---

## **17. คำถามที่พบบ่อย (FAQ)**

### **17.1 General Questions**

**Q: ระบบ TH77 Prime รองรับภาษาอะไรบ้าง?**  
A: ระบบรองรับภาษาไทยและอังกฤษครับ

---

**Q: สามารถใช้งานบนมือถือได้หรือไม่?**  
A: ใชครับ มี **Flutter App** สำหรับมือถือ (Android/iOS) และ **Responsive Web App** สำหรับ Browser

---

**Q: ระบบสามารถรองรับผู้ใช้งานได้กี่คน?**  
A: ระบบออกแบบมาเพื่อ **Scalability** สามารถรองรับผู้ใช้งาน **หลายพันคน** พร้อมกัน โดยขึ้นอยู่กับ Hardware และ Kubernetes Configuration

---

### **17.2 User Management**

**Q: วิธีสร้างผู้ใช้งานใหม่?**  
A:

1. Login เป็น Admin/Master
2. ไปที่ **User Management**
3. กด **Add User**
4. กรอกข้อมูล (Username, Password, Role, Credit Limit)
5. กด **Save**

---

**Q: วิธีเติมเครดิตให้ผู้ใช้งาน?**  
A:

1. เลือก User ที่ต้องการเติมเครดิต
2. กด **Adjust Credit**
3. กรอกจำนวนเงิน, ประเภท (เติม/หัก), เหตุผล
4. กด **Confirm**

---

**Q: เมื่อเครดิตหมด ระบบจะทำอย่างไร?**  
A: ระบบจะ **บล็อกการคีย์โพย** และ **แจ้งเตือนแอดมิน** อัตโนมัติ

---

### **17.3 Betting System**

**Q: วิธีคีย์โพย?**  
A:

1. Login เป็น Agent/Master
2. ไปที่ **Betting Page**
3. เลือก **Quick Key** หรือ **Manual Mode**
4. กรอกเลข, ยอด, จำนวน
5. กด **บันทึกโพย**

---

**Q: วิธีคีย์โพยแบบ Quick Key?**  
A: **Format:** `[เลข] [ยอด]x[จำนวน]`  
**Example:** `824 5040x1, 123 100x2`

---

**Q: ถ้าคีย์เลขซ้ำ ระบบจะทำอย่างไร?**  
A: ระบบจะ **รวมยอด** ของเลขนั้นๆ (ตัวอย่าง: คีย์ 123 100x1 และ 123 50x1 → รวมเป็น 123 150x1)

---

**Q: ถ้าคีย์เลขอั้น ระบบจะทำอย่างไร?**  
A:

- ถ้า **Blocked** → **ปฏิเสธโพย**
- ถ้า **Reduced Payout** → **รับโพย แต่แจ้งเตือน** (ตัวอย่าง: อัตราจ่าย 80%)

---

### **17.4 Link-Based Betting**

**Q: วิธีสร้างลิงก์รับแทง?**  
A:

1. Login เป็น Agent/Master
2. ไปที่ **Link Management**
3. กด **Create Link**
4. กรอก Customer Name, Expiry Time, Max Uses
5. กด **Generate Link**
6. คัดลอกลิงก์และส่งให้ลูกค้า

---

**Q: ลูกค้าสามารถโพยผ่านลิงก์ได้กี่ครั้ง?**  
A: ขึ้นอยู่กับ **Max Uses** ที่กำหนด (ตัวอย่าง: 5 ครั้ง)

---

**Q: ถ้าลิงก์หมดอายุ ลูกค้าจะโพยได้หรือไม่?**  
A: **ไม่ได้ครับ** ลิงก์ที่หมดอายุจะไม่สามารถใช้งานได้

---

### **17.5 Financial Processing**

**Q: วิธีคำนวณรางวัล?**  
A:

1. Admin กรอก **ผลรางวัล** (3D, 2D) สำหรับรอบนั้น
2. กด **Calculate Prizes**
3. ระบบจะคำนวณรางวัลอัตโนมัติ

---

**Q: อัตราจ่ายรางวัลเป็นอย่างไร?**  
A:

- **3D (Exact):** 1:800
- **2D (Exact):** 1:80
- **3D (Any Order):** 1:150
- **2D (Any Order):** 1:40

> **Note:** หากเป็น **Restricted Number** อัตราจ่ายจะลดตามที่กำหนด

---

**Q: วิธียืนยันการจ่ายรางวัล?**  
A:

1. ไปที่ **Settlement Page**
2. เลือกรอบที่ต้องการ
3. กด **Calculate Prizes**
4. ตรวจสอบรายชื่อผู้ถูกรางวัล
5. กด **Confirm Payout**

---

### **17.6 Deployment**

**Q: วิธี Deploy ระบบ?**  
A:

1. **Build Docker Images**
  ```bash
   docker build -t th77prime/backend:v1.0.0 ./backend
   docker build -t th77prime/frontend:v1.0.0 ./frontend
   docker push th77prime/backend:v1.0.0
   docker push th77prime/frontend:v1.0.0
  ```
2. **Apply Kubernetes Manifests**
  ```bash
   kubectl apply -f k8s/
  ```

---

**Q: วิธีอัปเดตระบบ?**  
A:

1. **Update Code**
2. **Rebuild Docker Images**
  ```bash
   docker build -t th77prime/backend:v1.0.1 ./backend
   docker push th77prime/backend:v1.0.1
  ```
3. **Update Kubernetes Deployment**
  ```bash
   kubectl set image deployment/th77-prime-backend backend=th77prime/backend:v1.0.1 -n th77-prime
  ```

---

**Q: วิธี Rollback?**  
A:

```bash
kubectl rollout undo deployment/th77-prime-backend -n th77-prime
```

---

## **📌 Contact &amp; Support**

**For Technical Support:**

- **Email:** [akenoiz@yahoo.com](mailto:support@psaistudio.com)
- **Phone:** +66 2 123 4567
- **LINE:** @255yxtaf

**For Sales &amp; Inquiries:**

- **Email:** [sales@psaistudio.com](mailto:sales@psaistudio.com)
- **Website:** [https://psaistudio.com](https://psaistudio.com)

---

**Documentation Version:** 1.0.0  
**Last Updated:** July 7, 2026  
**Maintained by:** PSAI Studio Team

---

**💡 ขอบคุณที่ใช้งานระบบ TH77 Prime ครับ!**  
**หากมีข้อสงสัยหรือปัญหาใดๆ กรุณาติดต่อทีมงานครับ**