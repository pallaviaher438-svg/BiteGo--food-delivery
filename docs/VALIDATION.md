# Input Validation & Sanitization Rules

## 1. Validation Strategy
- Validation is executed in a dedicated middleware layer (`validateRequest(schema)`) before requests reach controller handlers.
- Both data type validation and business constraint validation are strictly enforced.

## 2. Key Validation Rules by Entity

### 2.1 User & Authentication
- `phone`: Must match Indian mobile format `^(?:\+91|91)?[6-9]\d{9}$` (10 digits starting with 6-9).
- `email`: Standard email regex format.
- `password`: Minimum 6 characters.
- `role`: Must be one of `['customer', 'restaurant', 'delivery', 'admin']`.
- `otp`: 4 to 6 digit numerical string.

### 2.2 Address
- `label`: Enum `['Home', 'Work', 'Other']`.
- `addressLine`: String, min 5 chars, max 255 chars.
- `phone`: Valid Indian phone format.
- `isDefault`: Optional boolean.

### 2.3 Restaurant & Menu
- `name`: String, 2 to 100 chars, sanitized.
- `priceForOne`: Positive integer >= 50.
- `menuItem.price`: Positive integer >= 10.
- `menuItem.category`: Enum `['Appetizers', 'Main Course', 'Breads', 'Beverages', 'Desserts', 'Burgers', 'Pizzas', 'Sides']`.
- `isVeg`: Boolean.

### 2.4 Coupon
- `code`: Alphanumeric, uppercase, min 3, max 20 chars (e.g. `BITE50`).
- `discountType`: Enum `['percentage', 'flat']`.
- `discountValue`: Positive integer (if percentage: 1-100).
- `minOrder`: Positive integer >= 0.

### 2.5 Order Placement
- `items`: Non-empty array of `{ itemId: string, quantity: integer >= 1 }`.
- `addressId` or `address`: Valid delivery address object.
- `paymentMethod`: Enum `['upi', 'card', 'netbanking', 'cod']`.
- `specialInstructions`: Max 250 chars.

### 2.6 Order Status Update
- `status`: Enum `['confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled']`.
- `deliveryOtp`: Required when transitioning to `delivered`.
