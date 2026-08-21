# BiteGo Backend API Contract (v1)

All endpoints are prefixed with `/api/v1`.

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human readable error description",
  "code": "ERROR_CODE",
  "errors": []
}
```

---

## 1. Authentication & Users (`/api/v1/auth`, `/api/v1/users`)

### 1.1 Request Mobile OTP
- **Endpoint**: `POST /api/v1/auth/request-otp`
- **Auth**: Public
- **Request**:
  ```json
  { "phone": "+919876543210" }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "OTP sent successfully",
    "data": { "phone": "+919876543210", "demoOtp": "4220" }
  }
  ```

### 1.2 Verify OTP & Login / Register
- **Endpoint**: `POST /api/v1/auth/verify-otp`
- **Auth**: Public
- **Request**:
  ```json
  {
    "phone": "+919876543210",
    "otp": "4220",
    "name": "Rahul Deshmukh",
    "role": "customer"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "token": "jwt_token_string",
      "user": {
        "id": "usr-1",
        "name": "Rahul Deshmukh",
        "phone": "+91 9876543210",
        "email": "rahul.nashik@bitego.com",
        "role": "customer",
        "isGoldMember": true
      }
    }
  }
  ```

### 1.3 Email Password Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Auth**: Public
- **Request**:
  ```json
  {
    "email": "admin@bitego.com",
    "password": "AdminPassword123!"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": { "token": "jwt_token_string", "user": { ... } }
  }
  ```

### 1.4 Get Profile
- **Endpoint**: `GET /api/v1/users/profile`
- **Auth**: Authenticated (`Bearer <token>`)
- **Response**: `200 OK`

### 1.5 Update Profile
- **Endpoint**: `PUT /api/v1/users/profile`
- **Auth**: Authenticated
- **Request**:
  ```json
  { "name": "Rahul Deshmukh", "email": "rahul@example.com", "phone": "+91 9876543210" }
  ```
- **Response**: `200 OK`

---

## 2. Delivery Addresses (`/api/v1/addresses`)

### 2.1 Get Addresses
- **Endpoint**: `GET /api/v1/addresses`
- **Auth**: Authenticated (`customer`)
- **Response**: `200 OK`

### 2.2 Create Address
- **Endpoint**: `POST /api/v1/addresses`
- **Auth**: Authenticated (`customer`)
- **Request**:
  ```json
  {
    "label": "Home",
    "addressLine": "42, Tech Park Avenue, College Road, Nashik 422005",
    "phone": "+91 9876543210",
    "isDefault": true
  }
  ```
- **Response**: `201 Created`

### 2.3 Update Address
- **Endpoint**: `PUT /api/v1/addresses/:id`
- **Auth**: Authenticated

### 2.4 Delete Address
- **Endpoint**: `DELETE /api/v1/addresses/:id`
- **Auth**: Authenticated

---

## 3. Restaurants & Menus (`/api/v1/restaurants`)

### 3.1 List Restaurants
- **Endpoint**: `GET /api/v1/restaurants`
- **Auth**: Public
- **Query Params**: `search`, `category`, `cuisine`, `isVeg`, `isOpen`, `sort`
- **Response**: `200 OK` (Array of Restaurant objects with menu snippets)

### 3.2 Get Restaurant by ID
- **Endpoint**: `GET /api/v1/restaurants/:id`
- **Auth**: Public
- **Response**: `200 OK` (Full Restaurant details and complete Menu)

### 3.3 Create Restaurant
- **Endpoint**: `POST /api/v1/restaurants`
- **Auth**: `admin`
- **Request**:
  ```json
  {
    "name": "Sadhana Chulivarchi Misal",
    "tagline": "Authentic Nashik Chulivarchi Misal",
    "cuisine": ["Maharashtrian", "Street Food"],
    "deliveryTime": "25-35 mins",
    "priceForOne": 150,
    "address": "Bardan Phata, Gangapur Road, Nashik",
    "coverImage": "https://...",
    "logoImage": "https://..."
  }
  ```
- **Response**: `201 Created`

### 3.4 Toggle Restaurant Open Status
- **Endpoint**: `PATCH /api/v1/restaurants/:id/status`
- **Auth**: `restaurant` or `admin`
- **Request**:
  ```json
  { "isOpen": true }
  ```
- **Response**: `200 OK`

### 3.5 Add Menu Item
- **Endpoint**: `POST /api/v1/restaurants/:id/menu`
- **Auth**: `restaurant` or `admin`
- **Request**:
  ```json
  {
    "name": "Paneer Tikka Masala",
    "description": "Charcoal grilled paneer in rich spiced tomato butter gravy",
    "price": 280,
    "category": "Main Course",
    "isVeg": true,
    "image": "https://...",
    "isAvailable": true,
    "isBestseller": false
  }
  ```
- **Response**: `201 Created`

### 3.6 Update Menu Item Price
- **Endpoint**: `PATCH /api/v1/restaurants/:id/menu/:itemId/price`
- **Auth**: `restaurant` or `admin`
- **Request**:
  ```json
  { "price": 290 }
  ```
- **Response**: `200 OK`

### 3.7 Toggle Item Availability
- **Endpoint**: `PATCH /api/v1/restaurants/:id/menu/:itemId/availability`
- **Auth**: `restaurant` or `admin`
- **Response**: `200 OK`

### 3.8 Delete Menu Item
- **Endpoint**: `DELETE /api/v1/restaurants/:id/menu/:itemId`
- **Auth**: `restaurant` or `admin`
- **Response**: `200 OK`

---

## 4. Coupons & Discounts (`/api/v1/coupons`)

### 4.1 List Available Coupons
- **Endpoint**: `GET /api/v1/coupons`
- **Auth**: Public
- **Response**: `200 OK`

### 4.2 Validate Coupon
- **Endpoint**: `POST /api/v1/coupons/validate`
- **Auth**: Public / Authenticated
- **Request**:
  ```json
  { "code": "BITE50", "orderAmount": 450 }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": { "code": "BITE50", "discount": 100, "finalAmount": 350 }
  }
  ```

### 4.3 Create Coupon
- **Endpoint**: `POST /api/v1/coupons`
- **Auth**: `admin`

### 4.4 Delete Coupon
- **Endpoint**: `DELETE /api/v1/coupons/:code`
- **Auth**: `admin`

---

## 5. Orders & Checkout (`/api/v1/orders`)

### 5.1 Calculate Order Price / Checkout Quote
- **Endpoint**: `POST /api/v1/orders/quote`
- **Auth**: Authenticated (`customer`)
- **Request**:
  ```json
  {
    "items": [{ "itemId": "bk-1", "restaurantId": "rest-1", "quantity": 2 }],
    "couponCode": "BITE50"
  }
  ```
- **Response**: `200 OK` (Itemized subtotal, 5% GST, delivery fee, discount, total)

### 5.2 Create / Place Order
- **Endpoint**: `POST /api/v1/orders`
- **Auth**: Authenticated (`customer`)
- **Request**:
  ```json
  {
    "restaurantId": "rest-1",
    "items": [
      {
        "itemId": "bk-1",
        "quantity": 2
      }
    ],
    "addressId": "addr-1",
    "couponCode": "BITE50",
    "paymentMethod": "upi",
    "specialInstructions": "Please avoid single-use cutlery"
  }
  ```
- **Response**: `201 Created` (Returns full Order entity)

### 5.3 Get Orders List
- **Endpoint**: `GET /api/v1/orders`
- **Auth**: Authenticated
- **Query Params**: `role`, `status`, `restaurantId`
- **Response**: `200 OK`

### 5.4 Get Order Details & Live Tracking
- **Endpoint**: `GET /api/v1/orders/:id`
- **Auth**: Authenticated
- **Response**: `200 OK` (Full Order info, status, live coordinates, delivery partner details)

### 5.5 Update Order Status
- **Endpoint**: `PATCH /api/v1/orders/:id/status`
- **Auth**: `restaurant`, `delivery`, `admin`
- **Request**:
  ```json
  {
    "status": "preparing",
    "estimatedMinutes": 25,
    "rejectionReason": ""
  }
  ```
- **Response**: `200 OK`

### 5.6 Cancel Order
- **Endpoint**: `POST /api/v1/orders/:id/cancel`
- **Auth**: `customer`, `restaurant`, `admin`
- **Request**:
  ```json
  { "reason": "Customer changed mind" }
  ```
- **Response**: `200 OK`

### 5.7 Submit Order Review
- **Endpoint**: `POST /api/v1/orders/:id/review`
- **Auth**: `customer`
- **Request**:
  ```json
  { "rating": 5, "comment": "Delivered piping hot and super fresh!" }
  ```
- **Response**: `200 OK`

---

## 6. Delivery Partner Portal (`/api/v1/delivery`)

### 6.1 Get Active Task & Nearby Requests
- **Endpoint**: `GET /api/v1/delivery/tasks`
- **Auth**: `delivery`, `admin`
- **Response**: `200 OK`

### 6.2 Advance Delivery Stage
- **Endpoint**: `PATCH /api/v1/delivery/tasks/:orderId/stage`
- **Auth**: `delivery`
- **Request**:
  ```json
  { "stage": "on_the_way" }
  ```
- **Response**: `200 OK`

### 6.3 Complete Delivery with Customer OTP
- **Endpoint**: `POST /api/v1/delivery/tasks/:orderId/verify-otp`
- **Auth**: `delivery`
- **Request**:
  ```json
  { "otp": "4220" }
  ```
- **Response**: `200 OK`

### 6.4 Rider Dashboard & Earnings
- **Endpoint**: `GET /api/v1/delivery/dashboard`
- **Auth**: `delivery`, `admin`
- **Query Params**: `timeframe=today|week|month`
- **Response**: `200 OK` (Total earnings, completed deliveries, surge hotspot zones)

### 6.5 Request Instant Payout / Cashout
- **Endpoint**: `POST /api/v1/delivery/cashout`
- **Auth**: `delivery`
- **Request**:
  ```json
  { "amount": 1245 }
  ```
- **Response**: `200 OK`

---

## 7. Admin Portal & Analytics (`/api/v1/admin`)

### 7.1 Platform Overview Metrics
- **Endpoint**: `GET /api/v1/admin/metrics`
- **Auth**: `admin`
- **Response**: `200 OK` (Total GMV, active orders count, 18% commission total, restaurant count, fleet count)

### 7.2 Fleet Live Status
- **Endpoint**: `GET /api/v1/admin/fleet`
- **Auth**: `admin`
- **Response**: `200 OK` (Rider list, vehicle number, battery %, status, active tasks)

### 7.3 Payment Breakdown & Transaction Ledger
- **Endpoint**: `GET /api/v1/admin/payments`
- **Auth**: `admin`
- **Query Params**: `timeframe=today|7d|30d`
- **Response**: `200 OK` (UPI/Card/COD breakdown, volume, latency, transaction history log)
