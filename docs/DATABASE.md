# Database Schema & Entity Design

## 1. Entities & Fields

### 1.1 `User`
- `id` (String, PK, e.g. `usr-1` or UUID)
- `name` (String, required)
- `email` (String, unique, indexed)
- `phone` (String, unique, indexed, standard format `+91XXXXXXXXXX`)
- `passwordHash` (String, nullable for OTP-only users)
- `role` (Enum: `'customer' | 'restaurant' | 'delivery' | 'admin'`, default `'customer'`)
- `avatar` (String URL)
- `isGoldMember` (Boolean, default `false`)
- `restaurantId` (String, optional FK to Restaurant for restaurant partners)
- `createdAt` (ISO Date String)
- `updatedAt` (ISO Date String)

### 1.2 `DeliveryAddress`
- `id` (String, PK, e.g. `addr-1`)
- `userId` (String, FK to User, indexed)
- `label` (Enum: `'Home' | 'Work' | 'Other'`)
- `addressLine` (String, required)
- `phone` (String, required)
- `isDefault` (Boolean, default `false`)
- `createdAt` (ISO Date String)

### 1.3 `Restaurant`
- `id` (String, PK, e.g. `rest-1`)
- `name` (String, required, indexed)
- `tagline` (String)
- `cuisine` (Array of Strings, indexed)
- `rating` (Number, float e.g. `4.5`)
- `reviewsCount` (String/Number)
- `deliveryTime` (String, e.g. `'20-30 mins'`)
- `priceForOne` (Number, INR)
- `discountBadge` (String, optional)
- `coverImage` (String URL)
- `logoImage` (String URL)
- `distance` (String)
- `address` (String, required)
- `isOpen` (Boolean, default `true`)
- `featured` (Boolean, default `false`)
- `menu` (Embedded Array of MenuItem objects)
- `createdAt` (ISO Date String)
- `updatedAt` (ISO Date String)

### 1.4 `MenuItem`
- `id` (String, PK, e.g. `bk-1`)
- `restaurantId` (String, FK, indexed)
- `name` (String, required)
- `description` (String)
- `price` (Number, INR, required)
- `image` (String URL)
- `category` (Enum: `'Appetizers' | 'Main Course' | 'Breads' | 'Beverages' | 'Desserts' | 'Burgers' | 'Pizzas' | 'Sides'`)
- `isVeg` (Boolean, default `true`)
- `isBestseller` (Boolean, default `false`)
- `isAvailable` (Boolean, default `true`)
- `rating` (Number, float)

### 1.5 `Order`
- `id` (String, PK, e.g. `ord-1724219900`)
- `orderNumber` (String, unique, e.g. `BG-4921`)
- `userId` (String, FK to User, indexed)
- `customerName` (String)
- `customerPhone` (String)
- `restaurantId` (String, FK to Restaurant, indexed)
- `restaurantName` (String)
- `items` (Array of `CartItem` containing `itemId`, `name`, `price`, `quantity`)
- `itemTotal` (Number, INR)
- `deliveryFee` (Number, INR)
- `taxes` (Number, INR, 5% GST)
- `discount` (Number, INR)
- `couponApplied` (String, optional)
- `total` (Number, INR)
- `status` (Enum: `'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled'`)
- `estimatedArrival` (String)
- `estimatedMinutes` (Number)
- `placedAt` (ISO Date String)
- `address` (DeliveryAddress object snapshot)
- `paymentMethod` (Enum: `'upi' | 'card' | 'netbanking' | 'cod'`)
- `paymentStatus` (Enum: `'paid' | 'pending' | 'refunded'`)
- `deliveryPartner` (Object: `{ id, name, phone, rating, vehicleNumber, avatar }`)
- `deliveryOtp` (String, 4-digit code e.g. `4220`)
- `specialInstructions` (String, optional)
- `review` (Object: `{ rating: Number, comment: String, createdAt: String }`)
- `trackingCoordinates` (Object: `{ lat: Number, lng: Number }`)
- `rejectionReason` (String, optional)

### 1.6 `Coupon`
- `code` (String, PK/Unique, uppercase, e.g. `BITE50`)
- `discountType` (Enum: `'percentage' | 'flat'`)
- `discountValue` (Number)
- `minOrder` (Number)
- `maxDiscount` (Number, optional)
- `description` (String)
- `isActive` (Boolean, default `true`)

### 1.7 `Rider`
- `id` (String, PK, e.g. `r1`)
- `userId` (String, FK to User)
- `name` (String)
- `phone` (String)
- `vehicle` (String, e.g. `'MH 15 AB 4592 (EV Scooter)'`)
- `rating` (Number, float)
- `activeDeliveries` (Number)
- `completedToday` (Number)
- `status` (Enum: `'Available' | 'On Delivery' | 'Offline'`)
- `location` (String, e.g. `'Gangapur Road'`)
- `battery` (String, e.g. `'88%'`)

### 1.8 `PaymentTransaction`
- `txId` (String, PK, e.g. `TXN-982143`)
- `orderId` (String, FK)
- `customerName` (String)
- `amount` (Number)
- `method` (Enum: `'upi' | 'card' | 'netbanking' | 'cod'`)
- `provider` (String, e.g. `'PhonePe UPI'`, `'HDFC Netbanking'`)
- `status` (Enum: `'settled' | 'pending' | 'refunded'`)
- `timestamp` (ISO Date String)

## Indexing & Query Patterns
- `users.email` and `users.phone`: Unique indexes for fast authentication lookups.
- `orders.userId`, `orders.restaurantId`, `orders.status`: Composite / filter indexes for role-based views.
- `restaurants.cuisine`, `restaurants.isOpen`, `restaurants.rating`: Search and listing queries.
- `coupons.code`: Fast case-insensitive key lookup.
