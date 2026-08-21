# Business Rules Specification

## BR-001: Pricing and Order Calculations
- **Base Item Total**: Sum of `item.price * item.quantity` calculated strictly against active menu item database records.
- **GST (Goods & Services Tax)**: Flat 5% on subtotal (`Math.round(subtotal * 0.05)`).
- **Delivery Fee**:
  - Free delivery (₹0) if subtotal exceeds ₹500 or if `FREEDEL` coupon is applied on orders above ₹299.
  - Standard delivery fee is ₹40 for standard orders below ₹500.
- **Platform Commission**: Fixed at 18% of Gross Merchandise Value (GMV) for platform analytics.

## BR-002: Coupon & Discount Rules
- A coupon can only be applied if `subtotal >= coupon.minOrder`.
- For `percentage` discount: `discount = Math.min((subtotal * discountValue) / 100, maxDiscount || 9999)`.
- For `flat` discount: `discount = discountValue`.
- Final Order Total cannot be negative: `total = Math.max(0, subtotal + deliveryFee + taxes - discount)`.

## BR-003: Single Restaurant per Order Cart
- An order can only contain items from a single restaurant. Mixing items across different restaurants in the same cart/order is rejected.

## BR-004: Restaurant Status & Item Availability
- Inactive / Closed restaurants (`isOpen: false`) cannot accept new orders.
- Out-of-stock items (`isAvailable: false`) cannot be added to a new order.

## BR-005: Order Status State Machine Transitions
Allowed status transitions:
1. `confirmed` -> `preparing` (by Restaurant Partner or Admin)
2. `confirmed` -> `cancelled` (by Customer, Restaurant, or Admin)
3. `preparing` -> `on_the_way` (by Restaurant or Delivery Partner)
4. `preparing` -> `cancelled` (with explicit cancellation reason)
5. `on_the_way` -> `delivered` (by Delivery Partner ONLY upon providing valid 4-digit customer delivery OTP)
6. Terminal states: `delivered`, `cancelled` (no further status changes permitted).

## BR-006: Delivery Rider Operations
- Riders can only accept delivery tasks if they are `On Duty` (`isOnDuty: true`).
- A rider can complete an order only when providing matching customer delivery OTP (`order.deliveryOtp` or system bypass `4220` in demo).
- Cash on Delivery (COD) collections must register an immediate cash audit entry in the rider's ledger.

## BR-007: Authorization & Ownership Restrictions
- Customers can only view, track, cancel, and review their own orders.
- Restaurant Partners can only view orders and modify menus belonging to their assigned `restaurantId`.
- Delivery Riders can only modify stages for orders dispatched to them.
- Admins possess superuser access across all restaurants, orders, fleet members, and coupons.
