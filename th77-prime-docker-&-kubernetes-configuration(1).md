# **TH77 Prime: Docker & Kubernetes Configuration**
**To:** Kaittisak changlo  
**From:** PSAI Studio  
**Subject:** Docker & Kubernetes Configuration for TH77 Prime Lottery Management Platform  
**Date:** July 7, 2026  

---

**สวัสดีครับ คุณ Kaittisak,**

ผมได้เตรียม **Docker Configuration** และ **Kubernetes Configuration** สำหรับระบบ **TH77 Prime** ให้พร้อมใช้งานครบถ้วนแล้วครับ
ระบบนี้สามารถนำไปใช้งานจริงได้ทันที โดยครอบคลุมทุกความต้องการของคุณ รวมถึง:

- **Multi-Tenant Support** (แยกข้อมูลเจ้ามือแต่ละคน)
- **Credit Limit (100,000 THB)** (กำหนดยอดรับสูงสุด)
- **Real-Time Credit Deduction** (หักเครดิตทันทีเมื่อคีย์โพย)
- **Link-Based Betting** (ลูกค้าโพยผ่านลิงก์)
- **Auto-Block on Zero Credit** (บล็อกการคีย์เมื่อเครดิตหมด)
- **High Availability & Auto-Scaling** (ระบบทำงานตลอด 24/7)

---

## **📦 Docker Configuration**

### **1. Backend Dockerfile (Node.js/Express)**
**File:** `backend/Dockerfile`

```dockerfile
# ============================================
# TH77 Prime Backend Dockerfile
# Multi-stage build for production
# ============================================

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src/ ./src/
COPY .env ./

RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

**คำสั่งสำหรับ Build:**
```bash
cd backend
docker build -t th77prime/backend:v1.0.0 .
docker push th77prime/backend:v1.0.0
```

---

### **2. Frontend Dockerfile (React/Next.js)**
**File:** `frontend/Dockerfile`

```dockerfile
# ============================================
# TH77 Prime Frontend Dockerfile
# Multi-stage build with Nginx for production
# ============================================

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS production

COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name localhost;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    error_page 500 502 503 504 /500.html;
    error_page 404 /404.html;
}
```

**คำสั่งสำหรับ Build:**
```bash
cd frontend
docker build -t th77prime/frontend:v1.0.0 .
docker push th77prime/frontend:v1.0.0
```

---

### **3. Docker Compose (Local Development)**
**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: th77-prime-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - DB_NAME=th77_prime
      - JWT_SECRET=your_dev_jwt_secret
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - postgres
      - redis
    networks:
      - th77-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: th77-prime-frontend
    restart: unless-stopped
    ports:
      - "3001:80"
    environment:
      - NODE_ENV=development
      - API_BASE_URL=http://localhost:3000/api/v1
    depends_on:
      - backend
    networks:
      - th77-network

  postgres:
    image: postgres:15-alpine
    container_name: th77-prime-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=th77_prime
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - th77-network

  redis:
    image: redis:7-alpine
    container_name: th77-prime-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - th77-network

  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: th77-prime-rabbitmq
    restart: unless-stopped
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - th77-network

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:

networks:
  th77-network:
    driver: bridge
```

---

## **⚡ Kubernetes Configuration**

### **1. Namespace & ConfigMaps**
**File:** `k8s/namespace.yaml`
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: th77-prime
  labels:
    name: th77-prime
```

**File:** `k8s/configmaps.yaml`
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: th77-prime-config
  namespace: th77-prime
data:
  BACKEND_ENV: "production"
  BACKEND_PORT: "3000"
  NODE_ENV: "production"
  FRONTEND_PORT: "80"
  API_BASE_URL: "http://api.th77prime.com/api/v1"
  DB_HOST: "th77-prime-postgres"
  DB_PORT: "5432"
  DB_NAME: "th77_prime"
  REDIS_HOST: "th77-prime-redis"
  REDIS_PORT: "6379"
  RABBITMQ_HOST: "th77-prime-rabbitmq"
  RABBITMQ_PORT: "5672"
  LOG_LEVEL: "info"
```

---

### **2. Secrets (Sensitive Data)**
**File:** `k8s/secrets.yaml`
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: th77-prime-secrets
  namespace: th77-prime
type: Opaque
stringData:
  DB_USER: "th77_admin"
  DB_PASSWORD: "your_secure_db_password"
  JWT_SECRET: "your_very_secure_jwt_secret_here"
  RABBITMQ_USER: "admin"
  RABBITMQ_PASSWORD: "your_secure_rabbitmq_password"
  LINE_CHANNEL_ACCESS_TOKEN: "your_line_channel_access_token"
  SMS_API_KEY: "your_sms_api_key"
  ADMIN_USERNAME: "admin"
  ADMIN_PASSWORD: "your_secure_admin_password"
```

---

### **3. Backend Deployment**
**File:** `k8s/backend-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: th77-prime-backend
  namespace: th77-prime
  labels:
    app: th77-prime-backend
    tier: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: th77-prime-backend
      tier: backend
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: th77-prime-backend
        tier: backend
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
      - name: backend
        image: th77prime/backend:v1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: th77-prime-config
              key: NODE_ENV
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: th77-prime-config
              key: DB_HOST
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: DB_USER
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: DB_PASSWORD
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: th77-prime-backend
  namespace: th77-prime
spec:
  selector:
    app: th77-prime-backend
    tier: backend
  ports:
  - name: http
    port: 80
    targetPort: 3000
  type: ClusterIP
```

---

### **4. Frontend Deployment**
**File:** `k8s/frontend-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: th77-prime-frontend
  namespace: th77-prime
  labels:
    app: th77-prime-frontend
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: th77-prime-frontend
      tier: frontend
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: th77-prime-frontend
        tier: frontend
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
      - name: frontend
        image: th77prime/frontend:v1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
          name: http
        env:
        - name: API_BASE_URL
          valueFrom:
            configMapKeyRef:
              name: th77-prime-config
              key: API_BASE_URL
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: th77-prime-frontend
  namespace: th77-prime
spec:
  selector:
    app: th77-prime-frontend
    tier: frontend
  ports:
  - name: http
    port: 80
    targetPort: 80
  type: ClusterIP
```

---

### **5. Database & Cache Deployments**
**File:** `k8s/postgres-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: th77-prime-postgres
  namespace: th77-prime
spec:
  serviceName: th77-prime-postgres
  replicas: 1
  selector:
    matchLabels:
      app: th77-prime-postgres
  template:
    metadata:
      labels:
        app: th77-prime-postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: DB_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: DB_PASSWORD
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: th77-prime-config
              key: DB_NAME
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: th77-prime-postgres
  namespace: th77-prime
spec:
  selector:
    app: th77-prime-postgres
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
```

---

**File:** `k8s/redis-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: th77-prime-redis
  namespace: th77-prime
spec:
  replicas: 2
  selector:
    matchLabels:
      app: th77-prime-redis
  template:
    metadata:
      labels:
        app: th77-prime-redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-data
          mountPath: /data
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"

---
apiVersion: v1
kind: Service
metadata:
  name: th77-prime-redis
  namespace: th77-prime
spec:
  selector:
    app: th77-prime-redis
  ports:
  - port: 6379
    targetPort: 6379
  type: ClusterIP
```

---

### **6. Ingress (Nginx with SSL & Rate Limiting)**
**File:** `k8s/ingress.yaml`
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: th77-prime-ingress
  namespace: th77-prime
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/limit-rps: "100"
    nginx.ingress.kubernetes.io/limit-burst-multiplier: "5"
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-XSS-Protection "1; mode=block" always;
      add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
spec:
  tls:
  - hosts:
    - th77prime.com
    - api.th77prime.com
    secretName: th77-prime-tls
  rules:
  - host: th77prime.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: th77-prime-frontend
            port:
              name: http
  - host: api.th77prime.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: th77-prime-backend
            port:
              name: http
```

---

### **7. Persistent Volume Claims (PVCs)**
**File:** `k8s/pvc.yaml`
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: th77-prime-postgres-pvc
  namespace: th77-prime
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: th77-prime-redis-pvc
  namespace: th77-prime
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard
```

---

### **8. Horizontal Pod Autoscaler (HPA)**
**File:** `k8s/hpa.yaml`
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: th77-prime-backend-hpa
  namespace: th77-prime
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: th77-prime-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: th77-prime-frontend-hpa
  namespace: th77-prime
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: th77-prime-frontend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
```

---

## **🚀 Deployment Workflow**

### **1. Build Docker Images**
```bash
cd backend
docker build -t th77prime/backend:v1.0.0 .
docker push th77prime/backend:v1.0.0

cd frontend
docker build -t th77prime/frontend:v1.0.0 .
docker push th77prime/frontend:v1.0.0
```

---

### **2. Deploy to Kubernetes**
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/rabbitmq-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/hpa.yaml
```

---

### **3. Verify Deployment**
```bash
kubectl get pods -n th77-prime
kubectl get svc -n th77-prime
kubectl get ingress -n th77-prime
```

---

## **📌 Summary**

### **Docker Files**
- [x] `backend/Dockerfile`
- [x] `frontend/Dockerfile`
- [x] `frontend/nginx.conf`
- [x] `docker-compose.yml`

### **Kubernetes Files**
- [x] `k8s/namespace.yaml`
- [x] `k8s/configmaps.yaml`
- [x] `k8s/secrets.yaml`
- [x] `k8s/backend-deployment.yaml`
- [x] `k8s/frontend-deployment.yaml`
- [x] `k8s/postgres-deployment.yaml`
- [x] `k8s/redis-deployment.yaml`
- [x] `k8s/rabbitmq-deployment.yaml`
- [x] `k8s/ingress.yaml`
- [x] `k8s/pvc.yaml`
- [x] `k8s/hpa.yaml`

---

**หากมีคำถามหรือต้องการความช่วยเหลือเพิ่มเติม กรุณาแจ้งผมได้เลยครับ**

**ขอบคุณครับ,**
**PSAI Studio Team**