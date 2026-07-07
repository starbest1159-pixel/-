# TH77 Prime - API Specification

## Base URL

```
https://api.th77prime.com/v1
```

## Authentication

All endpoints (except login/refresh) require JWT token in header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  },
  "timestamp": "2026-07-07T10:00:00Z"
}
```

---

## Endpoints

### Authentication

#### POST /auth/login

Login user and get JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4u...",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

---

## Full API Documentation

For complete API documentation with all endpoints, request/response examples, and error codes, see the main project documentation file.
