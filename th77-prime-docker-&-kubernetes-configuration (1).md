# TH77 Prime: Docker & Kubernetes Configuration
**Version:** 1.0.0  
**Last Updated:** July 7, 2026  
**Status:** Production-Ready

---

## **Table of Contents**
1. [Docker Configuration](#1-docker-configuration)
2. [Kubernetes Configuration](#2-kubernetes-configuration)
3. [Deployment Workflow](#3-deployment-workflow)
4. [Environment Variables](#4-environment-variables)
5. [Scaling & High Availability](#5-scaling--high-availability)
6. [Monitoring & Logging](#6-monitoring--logging)

---

## **1. Docker Configuration**

### **1.1 Backend Dockerfile (Node.js/Express)**
**File:** `backend/Dockerfile`

```dockerfile
# ============================================
# TH77 Prime Backend Dockerfile
# Multi-stage build for production
# ============================================

# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY .env ./

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]
```

---

### **1.2 Frontend Dockerfile (React/Next.js)**
**File:** `frontend/Dockerfile`

```dockerfile
# ============================================
# TH77 Prime Frontend Dockerfile
# Multi-stage build with Nginx for production
# ============================================

# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine AS production

# Copy built files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

---

### **1.3 Nginx Configuration for Frontend**
**File:** `frontend/nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Root directory
    root /usr/share/nginx/html;
    index index.html;

    # Handle React Router - return index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Proxy (if frontend and backend are on the same domain)
    # location /api {
    #     proxy_pass http://backend-service:3000;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    # }

    # Error pages
    error_page 500 502 503 504 /500.html;
    error_page 404 /404.html;
}
```

---

### **1.4 Docker Compose (for Local Development)**
**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # Backend Service
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
    volumes:
      - ./backend:/app
      - /app/node_modules

  # Frontend Service
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
    volumes:
      - ./frontend:/app
      - /app/node_modules

  # PostgreSQL Database
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

  # Redis Cache
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

  # RabbitMQ (for async processing)
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: th77-prime-rabbitmq
    restart: unless-stopped
    ports:
      - "5672:5672"  # AMQP
      - "15672:15672" # Management UI
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - th77-network

  # PGAdmin (Database GUI)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: th77-prime-pgadmin
    restart: unless-stopped
    ports:
      - "5050:80"
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@th77prime.com
      - PGADMIN_DEFAULT_PASSWORD=admin
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

## **2. Kubernetes Configuration**

### **2.1 Namespace Configuration**
**File:** `k8s/namespace.yaml`

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: th77-prime
  labels:
    name: th77-prime
```

---

### **2.2 ConfigMaps (Non-Sensitive Configuration)**
**File:** `k8s/configmaps.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: th77-prime-config
  namespace: th77-prime
data:
  # Backend Configuration
  BACKEND_ENV: "production"
  BACKEND_PORT: "3000"
  NODE_ENV: "production"
  
  # Frontend Configuration
  FRONTEND_PORT: "80"
  API_BASE_URL: "http://api.th77prime.com/api/v1"
  
  # Database Configuration
  DB_HOST: "th77-prime-postgres"
  DB_PORT: "5432"
  DB_NAME: "th77_prime"
  
  # Redis Configuration
  REDIS_HOST: "th77-prime-redis"
  REDIS_PORT: "6379"
  
  # RabbitMQ Configuration
  RABBITMQ_HOST: "th77-prime-rabbitmq"
  RABBITMQ_PORT: "5672"
  RABBITMQ_MANAGEMENT_PORT: "15672"
  
  # Logging Configuration
  LOG_LEVEL: "info"
```

---

### **2.3 Secrets (Sensitive Configuration)**
**File:** `k8s/secrets.yaml`

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: th77-prime-secrets
  namespace: th77-prime
type: Opaque
stringData:
  # Database Credentials
  DB_USER: "th77_admin"
  DB_PASSWORD: "your_secure_db_password"
  
  # JWT Secret
  JWT_SECRET: "your_very_secure_jwt_secret_here"
  
  # Redis Password (if configured)
  REDIS_PASSWORD: ""
  
  # RabbitMQ Credentials
  RABBITMQ_USER: "admin"
  RABBITMQ_PASSWORD: "your_secure_rabbitmq_password"
  
  # LINE API Token
  LINE_CHANNEL_ACCESS_TOKEN: "your_line_channel_access_token"
  
  # SMS API Key
  SMS_API_KEY: "your_sms_api_key"
  
  # Admin Credentials (for initial setup)
  ADMIN_USERNAME: "admin"
  ADMIN_PASSWORD: "your_secure_admin_password"
```

> **⚠️ Important:** Apply secrets separately:
> ```bash
> kubectl apply -f k8s/secrets.yaml
> ```
> **Do NOT commit this file to version control!**

---

### **2.4 Backend Deployment**
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
  replicas: 3  # High availability
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
        - name: DB_PORT
          valueFrom:
            configMapKeyRef:
              name: th77-prime-config
              key: DB_PORT
        - name: DB_NAME
          valueFrom:
            configMapKeyRef:
              name: th77-prime-config
              key: DB_NAME
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
        - name: REDIS_HOST
          valueFrom:
            configMapKeyRef:
              name: th77-prime-config
              key: REDIS_HOST
        - name: REDIS_PORT
          valueFrom:
            configMapKeyRef:
              name: th77-prime-config
              key: REDIS_PORT
        - name: RABBITMQ_HOST
          valueFrom:
            configMapKeyRef:
              name: th77-prime-config
              key: RABBITMQ_HOST
        - name: RABBITMQ_USER
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: RABBITMQ_USER
        - name: RABBITMQ_PASSWORD
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: RABBITMQ_PASSWORD
        - name: LINE_CHANNEL_ACCESS_TOKEN
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: LINE_CHANNEL_ACCESS_TOKEN
        - name: SMS_API_KEY
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: SMS_API_KEY
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
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 1
        startupProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 30
      imagePullSecrets:
      - name: regcred

---

apiVersion: v1
kind: Service
metadata:
  name: th77-prime-backend
  namespace: th77-prime
  labels:
    app: th77-prime-backend
    tier: backend
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

### **2.5 Frontend Deployment**
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
  replicas: 3  # High availability
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
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 1
      imagePullSecrets:
      - name: regcred

---

apiVersion: v1
kind: Service
metadata:
  name: th77-prime-frontend
  namespace: th77-prime
  labels:
    app: th77-prime-frontend
    tier: frontend
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

### **2.6 Database Deployment (PostgreSQL)**
**File:** `k8s/postgres-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: th77-prime-postgres
  namespace: th77-prime
  labels:
    app: th77-prime-postgres
    tier: database
spec:
  serviceName: th77-prime-postgres
  replicas: 1  # For production, consider 3 replicas with streaming replication
  selector:
    matchLabels:
      app: th77-prime-postgres
      tier: database
  template:
    metadata:
      labels:
        app: th77-prime-postgres
        tier: database
    spec:
      securityContext:
        fsGroup: 1001
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
          name: postgres
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
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
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
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - $(POSTGRES_USER)
            - -d
            - $(POSTGRES_DB)
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - $(POSTGRES_USER)
            - -d
            - $(POSTGRES_DB)
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 1
      volumes:
      - name: postgres-data
        persistentVolumeClaim:
          claimName: th77-prime-postgres-pvc

---

apiVersion: v1
kind: Service
metadata:
  name: th77-prime-postgres
  namespace: th77-prime
  labels:
    app: th77-prime-postgres
    tier: database
spec:
  selector:
    app: th77-prime-postgres
    tier: database
  ports:
  - name: postgres
    port: 5432
    targetPort: 5432
  type: ClusterIP
```

---

### **2.7 Redis Deployment (Cache)**
**File:** `k8s/redis-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: th77-prime-redis
  namespace: th77-prime
  labels:
    app: th77-prime-redis
    tier: cache
spec:
  replicas: 2  # Redis Cluster for high availability
  selector:
    matchLabels:
      app: th77-prime-redis
      tier: cache
  template:
    metadata:
      labels:
        app: th77-prime-redis
        tier: cache
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
          name: redis
        command:
        - redis-server
        - --appendonly yes
        - --requirepass $(REDIS_PASSWORD)
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: REDIS_PASSWORD
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
        livenessProbe:
          tcpSocket:
            port: 6379
          initialDelaySeconds: 5
          periodSeconds: 10
        readinessProbe:
          tcpSocket:
            port: 6379
          initialDelaySeconds: 5
          periodSeconds: 10
      volumes:
      - name: redis-data
        persistentVolumeClaim:
          claimName: th77-prime-redis-pvc

---

apiVersion: v1
kind: Service
metadata:
  name: th77-prime-redis
  namespace: th77-prime
  labels:
    app: th77-prime-redis
    tier: cache
spec:
  selector:
    app: th77-prime-redis
    tier: cache
  ports:
  - name: redis
    port: 6379
    targetPort: 6379
  type: ClusterIP
```

---

### **2.8 RabbitMQ Deployment (Message Queue)**
**File:** `k8s/rabbitmq-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: th77-prime-rabbitmq
  namespace: th77-prime
  labels:
    app: th77-prime-rabbitmq
    tier: queue
spec:
  serviceName: th77-prime-rabbitmq
  replicas: 1  # For production, consider 3 nodes for cluster
  selector:
    matchLabels:
      app: th77-prime-rabbitmq
      tier: queue
  template:
    metadata:
      labels:
        app: th77-prime-rabbitmq
        tier: queue
    spec:
      securityContext:
        fsGroup: 1001
      containers:
      - name: rabbitmq
        image: rabbitmq:3-management-alpine
        ports:
        - containerPort: 5672
          name: amqp
        - containerPort: 15672
          name: management
        env:
        - name: RABBITMQ_DEFAULT_USER
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: RABBITMQ_USER
        - name: RABBITMQ_DEFAULT_PASS
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: RABBITMQ_PASSWORD
        volumeMounts:
        - name: rabbitmq-data
          mountPath: /var/lib/rabbitmq
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - rabbitmq-diagnostics
            - status
          initialDelaySeconds: 60
          periodSeconds: 60
          timeoutSeconds: 10
          failureThreshold: 3
        readinessProbe:
          exec:
            command:
            - rabbitmq-diagnostics
            - ping
          initialDelaySeconds: 20
          periodSeconds: 60
          timeoutSeconds: 10
          failureThreshold: 3
      volumes:
      - name: rabbitmq-data
        persistentVolumeClaim:
          claimName: th77-prime-rabbitmq-pvc

---

apiVersion: v1
kind: Service
metadata:
  name: th77-prime-rabbitmq
  namespace: th77-prime
  labels:
    app: th77-prime-rabbitmq
    tier: queue
spec:
  selector:
    app: th77-prime-rabbitmq
    tier: queue
  ports:
  - name: amqp
    port: 5672
    targetPort: 5672
  - name: management
    port: 15672
    targetPort: 15672
  type: ClusterIP
```

---

### **2.9 Ingress Configuration (Nginx Ingress Controller)**
**File:** `k8s/ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: th77-prime-ingress
  namespace: th77-prime
  annotations:
    # Use the NGINX Ingress Controller
    kubernetes.io/ingress.class: "nginx"
    
    # SSL Configuration
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    
    # Rate Limiting
    nginx.ingress.kubernetes.io/limit-rps: "100"
    nginx.ingress.kubernetes.io/limit-burst-multiplier: "5"
    nginx.ingress.kubernetes.io/limit-whitelist: "1.2.3.4"  # Whitelist IPs
    
    # CORS
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "https://th77prime.com"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-headers: "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
    nginx.ingress.kubernetes.io/cors-allow-credentials: "true"
    
    # Security Headers
    nginx.ingress.kubernetes.io/configuration-snippet: |
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-XSS-Protection "1; mode=block" always;
      add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
      add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';" always;
    
    # Proxy Settings
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
    
    # Gzip Compression
    nginx.ingress.kubernetes.io/enable-gzip: "true"
    nginx.ingress.kubernetes.io/gzip-level: "6"
    nginx.ingress.kubernetes.io/gzip-types: "text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript"

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
      - path: /api/v1
        pathType: Prefix
        backend:
          service:
            name: th77-prime-backend
            port:
              name: http
      - path: /
        pathType: Prefix
        backend:
          service:
            name: th77-prime-backend
            port:
              name: http
```

---

### **2.10 Persistent Volume Claims (PVCs)**
**File:** `k8s/pvc.yaml`

```yaml
# PostgreSQL PVC
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

# Redis PVC
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

---

# RabbitMQ PVC
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: th77-prime-rabbitmq-pvc
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

### **2.11 Horizontal Pod Autoscaler (HPA)**
**File:** `k8s/hpa.yaml`

```yaml
# Backend HPA
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
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80

---

# Frontend HPA
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
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 70
```

---

### **2.12 API Gateway (Kong) Deployment**
**File:** `k8s/kong-deployment.yaml`

```yaml
# Kong Database Migration Job
apiVersion: batch/v1
kind: Job
metadata:
  name: kong-migrations
  namespace: th77-prime
spec:
  template:
    spec:
      containers:
      - name: kong-migrations
        image: kong:3.6-alpine
        command:
        - /bin/sh
        - -c
        - kong migrations bootstrap --conf /etc/kong/kong.yml
        env:
        - name: KONG_DATABASE
          value: postgres
        - name: KONG_PG_HOST
          value: th77-prime-postgres
        - name: KONG_PG_USER
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: DB_USER
        - name: KONG_PG_PASSWORD
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: DB_PASSWORD
        volumeMounts:
        - name: kong-config
          mountPath: /etc/kong
      volumes:
      - name: kong-config
        configMap:
          name: kong-config
      restartPolicy: Never

---

# Kong ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: kong-config
  namespace: th77-prime
data:
  kong.yml: |
    _format_version: "3.0"
    services:
    - name: th77-prime-backend
      url: http://th77-prime-backend.th77-prime.svc.cluster.local
      routes:
      - name: th77-prime-api
        paths:
        - /api/v1
        strip_path: false
        plugins:
        - name: jwt
          config:
            key_claim_name: iss
            claims_to_verify:
            - exp
        - name: rate-limiting
          config:
            minute: 100
            hour: 1000
        - name: request-transformer
          config:
            add:
              headers:
              - X-Request-ID:uuid

---

# Kong Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kong
  namespace: th77-prime
spec:
  replicas: 2
  selector:
    matchLabels:
      app: kong
  template:
    metadata:
      labels:
        app: kong
    spec:
      containers:
      - name: kong
        image: kong:3.6-alpine
        env:
        - name: KONG_DATABASE
          value: postgres
        - name: KONG_PG_HOST
          value: th77-prime-postgres
        - name: KONG_PG_USER
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: DB_USER
        - name: KONG_PG_PASSWORD
          valueFrom:
            secretKeyRef:
              name: th77-prime-secrets
              key: DB_PASSWORD
        - name: KONG_PROXY_ACCESS_LOG
          value: /dev/stdout
        - name: KONG_ADMIN_ACCESS_LOG
          value: /dev/stdout
        - name: KONG_PROXY_ERROR_LOG
          value: /dev/stderr
        - name: KONG_ADMIN_ERROR_LOG
          value: /dev/stderr
        - name: KONG_LOG_LEVEL
          value: info
        ports:
        - containerPort: 8000
          name: proxy
        - containerPort: 8001
          name: admin
        volumeMounts:
        - name: kong-config
          mountPath: /etc/kong/kong.yml
          subPath: kong.yml
      volumes:
      - name: kong-config
        configMap:
          name: kong-config

---

apiVersion: v1
kind: Service
metadata:
  name: kong-proxy
  namespace: th77-prime
spec:
  type: LoadBalancer
  selector:
    app: kong
  ports:
  - name: proxy
    port: 80
    targetPort: 8000
    protocol: TCP
  - name: proxy-ssl
    port: 443
    targetPort: 8443
    protocol: TCP

---

apiVersion: v1
kind: Service
metadata:
  name: kong-admin
  namespace: th77-prime
spec:
  type: ClusterIP
  selector:
    app: kong
  ports:
  - name: admin
    port: 8001
    targetPort: 8001
    protocol: TCP
```

---

## **3. Deployment Workflow**

### **3.1 Build Docker Images**
```bash
# Build Backend Image
cd backend
docker build -t th77prime/backend:v1.0.0 .
docker push th77prime/backend:v1.0.0

# Build Frontend Image
cd frontend
docker build -t th77prime/frontend:v1.0.0 .
docker push th77prime/frontend:v1.0.0
```

---

### **3.2 Deploy to Kubernetes**
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply ConfigMaps and Secrets
kubectl apply -f k8s/configmaps.yaml
kubectl apply -f k8s/secrets.yaml

# Deploy Databases
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/rabbitmq-deployment.yaml

# Wait for databases to be ready
kubectl wait --for=condition=ready pod -n th77-prime --all

# Deploy Backend and Frontend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Deploy Ingress
kubectl apply -f k8s/ingress.yaml

# Deploy PVCs
kubectl apply -f k8s/pvc.yaml

# Deploy HPA
kubectl apply -f k8s/hpa.yaml

# Deploy API Gateway (Kong)
kubectl apply -f k8s/kong-deployment.yaml
```

---

### **3.3 Verify Deployment**
```bash
# Check pods
kubectl get pods -n th77-prime

# Check services
kubectl get svc -n th77-prime

# Check ingress
kubectl get ingress -n th77-prime

# Check logs
kubectl logs -f deployment/th77-prime-backend -n th77-prime

# Access the application
# Frontend: http://th77prime.com
# Backend API: http://api.th77prime.com/api/v1
# Kong Admin: http://<EXTERNAL-IP>:8001
```

---

### **3.4 Rollback (if needed)**
```bash
# Rollback to previous version
kubectl rollout undo deployment/th77-prime-backend -n th77-prime
kubectl rollout undo deployment/th77-prime-frontend -n th77-prime

# Check rollout status
kubectl rollout status deployment/th77-prime-backend -n th77-prime
```

---

## **4. Environment Variables**

### **4.1 Backend Environment Variables**
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `DB_HOST` | PostgreSQL host | `th77-prime-postgres` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | `th77_admin` |
| `DB_PASSWORD` | PostgreSQL password | `your_secure_password` |
| `DB_NAME` | Database name | `th77_prime` |
| `JWT_SECRET` | JWT secret key | `your_very_secure_jwt_secret` |
| `REDIS_HOST` | Redis host | `th77-prime-redis` |
| `REDIS_PORT` | Redis port | `6379` |
| `RABBITMQ_HOST` | RabbitMQ host | `th77-prime-rabbitmq` |
| `RABBITMQ_USER` | RabbitMQ user | `admin` |
| `RABBITMQ_PASSWORD` | RabbitMQ password | `your_secure_password` |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE API token | `your_line_token` |
| `SMS_API_KEY` | SMS API key | `your_sms_key` |

---

### **4.2 Frontend Environment Variables**
| Variable | Description | Example |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API URL | `http://api.th77prime.com/api/v1` |
| `NODE_ENV` | Environment mode | `production` |

---

## **5. Scaling & High Availability**

### **5.1 Horizontal Scaling**
- **Backend**: Scales from 3 to 10 pods based on CPU/Memory usage (HPA)
- **Frontend**: Scales from 3 to 10 pods based on CPU/Memory usage (HPA)
- **Database**: PostgreSQL with read replicas for read-heavy workloads
- **Cache**: Redis Cluster for high availability
- **Queue**: RabbitMQ Cluster for message queue redundancy

---

### **5.2 Vertical Scaling**
- **Backend**: Up to 1GB RAM, 1 CPU
- **Frontend**: Up to 512MB RAM, 0.5 CPU
- **Database**: Up to 4GB RAM, 2 CPU
- **Cache**: Up to 2GB RAM, 1 CPU
- **Queue**: Up to 2GB RAM, 1 CPU

---

### **5.3 High Availability Features**
| Component | Replicas | HA Strategy |
|-----------|----------|-------------|
| Backend | 3-10 | Rolling Updates, HPA |
| Frontend | 3-10 | Rolling Updates, HPA |
| PostgreSQL | 1 (Primary) + Read Replicas | Streaming Replication |
| Redis | 2 | Redis Sentinel/Cluster |
| RabbitMQ | 3 | RabbitMQ Cluster |
| Kong | 2 | Load Balancer |

---

## **6. Monitoring & Logging**

### **6.1 Prometheus & Grafana Setup**
**File:** `k8s/monitoring.yaml`

```yaml
# Prometheus Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: th77-prime
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        args:
        - --config.file=/etc/prometheus/prometheus.yml
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus
        - name: prometheus-storage
          mountPath: /prometheus
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config
      - name: prometheus-storage
        persistentVolumeClaim:
          claimName: prometheus-pvc

---

apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: th77-prime
spec:
  selector:
    app: prometheus
  ports:
  - port: 9090
    targetPort: 9090

---

# Grafana Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: th77-prime
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        ports:
        - containerPort: 3000
        volumeMounts:
        - name: grafana-storage
          mountPath: /var/lib/grafana
      volumes:
      - name: grafana-storage
        persistentVolumeClaim:
          claimName: grafana-pvc

---

apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: th77-prime
spec:
  type: LoadBalancer
  selector:
    app: grafana
  ports:
  - port: 3000
    targetPort: 3000

---

# Prometheus ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: th77-prime
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    scrape_configs:
    - job_name: 'th77-prime-backend'
      static_configs:
      - targets: ['th77-prime-backend.th77-prime.svc.cluster.local:3000']
    
    - job_name: 'th77-prime-frontend'
      static_configs:
      - targets: ['th77-prime-frontend.th77-prime.svc.cluster.local:80']
    
    - job_name: 'th77-prime-postgres'
      static_configs:
      - targets: ['th77-prime-postgres.th77-prime.svc.cluster.local:5432']
    
    - job_name: 'th77-prime-redis'
      static_configs:
      - targets: ['th77-prime-redis.th77-prime.svc.cluster.local:6379']

---

# Loki (for Logs)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: loki
  namespace: th77-prime
spec:
  replicas: 1
  selector:
    matchLabels:
      app: loki
  template:
    metadata:
      labels:
        app: loki
    spec:
      containers:
      - name: loki
        image: grafana/loki:latest
        ports:
        - containerPort: 3100
        volumeMounts:
        - name: loki-storage
          mountPath: /data
      volumes:
      - name: loki-storage
        persistentVolumeClaim:
          claimName: loki-pvc

---

apiVersion: v1
kind: Service
metadata:
  name: loki
  namespace: th77-prime
spec:
  selector:
    app: loki
  ports:
  - port: 3100
    targetPort: 3100
```

---

### **6.2 Monitoring Dashboards**
- **Backend Metrics**: API latency, error rates, request rates
- **Frontend Metrics**: Page load times, user sessions
- **Database Metrics**: Query performance, connections, cache hit ratio
- **System Metrics**: CPU, Memory, Disk, Network

---

### **6.3 Alert Rules (Prometheus)**
**File:** `k8s/alert-rules.yaml`

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: th77-prime-alerts
  namespace: th77-prime
spec:
  groups:
  - name: th77-prime.rules
    rules:
    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[1m]) / rate(http_requests_total[1m]) > 0.1
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "High error rate on {{ $labels.service }}"
        description: "Error rate is {{ $value }} for {{ $labels.service }}"
    
    - alert: HighLatency
      expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)) > 1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High latency on {{ $labels.service }}"
        description: "95th percentile latency is {{ $value }}s for {{ $labels.service }}"
    
    - alert: HighMemoryUsage
      expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 80
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High memory usage on {{ $labels.instance }}"
        description: "Memory usage is {{ $value }}% on {{ $labels.instance }}"
    
    - alert: HighCPUUsage
      expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100) > 80
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High CPU usage on {{ $labels.instance }}"
        description: "CPU usage is {{ $value }}% on {{ $labels.instance }}"
    
    - alert: DatabaseDown
      expr: pg_up == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "PostgreSQL database is down"
        description: "PostgreSQL database {{ $labels.instance }} is down"
    
    - alert: RedisDown
      expr: redis_up == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "Redis is down"
        description: "Redis {{ $labels.instance }} is down"
```

---

## **📌 Summary: All Files Included**

### **Docker Files**
- [x] `backend/Dockerfile` (Node.js/Express)
- [x] `frontend/Dockerfile` (React/Next.js)
- [x] `frontend/nginx.conf` (Nginx Configuration)
- [x] `docker-compose.yml` (Local Development)

### **Kubernetes Files**
- [x] `k8s/namespace.yaml` (Namespace)
- [x] `k8s/configmaps.yaml` (Non-Sensitive Config)
- [x] `k8s/secrets.yaml` (Sensitive Config)
- [x] `k8s/backend-deployment.yaml` (Backend Deployment & Service)
- [x] `k8s/frontend-deployment.yaml` (Frontend Deployment & Service)
- [x] `k8s/postgres-deployment.yaml` (PostgreSQL StatefulSet & Service)
- [x] `k8s/redis-deployment.yaml` (Redis Deployment & Service)
- [x] `k8s/rabbitmq-deployment.yaml` (RabbitMQ StatefulSet & Service)
- [x] `k8s/ingress.yaml` (Nginx Ingress with SSL & Rate Limiting)
- [x] `k8s/pvc.yaml` (Persistent Volume Claims)
- [x] `k8s/hpa.yaml` (Horizontal Pod Autoscaler)
- [x] `k8s/kong-deployment.yaml` (API Gateway)
- [x] `k8s/monitoring.yaml` (Prometheus, Grafana, Loki)
- [x] `k8s/alert-rules.yaml` (Alert Rules)

---

## **🚀 Next Steps**

1. **Build Docker Images**
   ```bash
   docker build -t th77prime/backend:v1.0.0 ./backend
   docker build -t th77prime/frontend:v1.0.0 ./frontend
   docker push th77prime/backend:v1.0.0
   docker push th77prime/frontend:v1.0.0
   ```

2. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f k8s/
   ```

3. **Verify Deployment**
   ```bash
   kubectl get pods -n th77-prime
   kubectl get svc -n th77-prime
   kubectl get ingress -n th77-prime
   ```

4. **Access the Application**
   - Frontend: `http://th77prime.com`
   - Backend API: `http://api.th77prime.com/api/v1`
   - Kong Admin: `http://<EXTERNAL-IP>:8001`
   - Grafana: `http://<GRAFANA-EXTERNAL-IP>:3000`

---

## **💡 Need Further Customization?**
Let me know if you'd like me to:
- [ ] **Add Helm Charts** for easier deployment
- [ ] **Configure CI/CD Pipeline** (GitHub Actions, ArgoCD)
- [ ] **Add Database Backup Strategy**
- [ ] **Configure Zero-Downtime Deployments**
- [ ] **Add Canary Deployments** for gradual rollouts