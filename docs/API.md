# AUTOX — RESTful API Documentation v1.0

Version: `1.0.0`  
Base URL Prefix: `/api/v1`  
Protocol: `HTTP/1.1` & `HTTPS`  
Response Encoding: `application/json; charset=utf-8`  
Currency Standard: `Pakistani Rupees (PKR ₨)`

---

## 1. Unified Response Envelope Standard

### Successful Response Format
```json
{
  "success": true,
  "message": "Resource retrieved or operation successful",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 31,
    "totalPages": 3
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Descriptive client or operational error",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

---

## 2. Authentication & Identity Endpoints (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new customer account with bcrypt hashing & automatic session |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user; returns JWT & sets HTTP-only secure cookie |
| `POST` | `/api/v1/auth/logout` | Public | Invalidates authentication cookie |
| `GET` | `/api/v1/auth/me` | Private | Returns current authenticated user profile |
| `POST` | `/api/v1/auth/forgot-password` | Public | Generates cryptographic sha256 token and dispatches reset email |
| `POST` | `/api/v1/auth/reset-password` | Public | Validates unexpired token and updates account password |

---

## 3. User & Customer Profile Endpoints (`/api/v1/users`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/users/profile` | Private | Retrieve authenticated pilot profile |
| `PATCH` | `/api/v1/users/profile` | Private | Update name, phone, or avatar |
| `PATCH` | `/api/v1/users/password` | Private | Validate current password and set new password |
| `GET` | `/api/v1/users/addresses` | Private | List all saved delivery addresses |
| `POST` | `/api/v1/users/addresses` | Private | Add new Pakistan domestic delivery address |
| `PATCH` | `/api/v1/users/addresses/:id` | Private | Update existing address details |
| `DELETE` | `/api/v1/users/addresses/:id` | Private | Delete saved address |

---

## 4. Hardware Catalog & Product Endpoints (`/api/v1/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/products` | Public | List products with query filtering (`search`, `category`, `brand`, `minPrice`, `maxPrice`, `rating`, `inStock`, `sort`, `page`, `limit`) |
| `GET` | `/api/v1/products/featured` | Public | Retrieve curated featured releases & top-selling components |
| `GET` | `/api/v1/products/:slug` | Public | Retrieve product by slug/ID including related category accessories |
| `POST` | `/api/v1/products` | Admin | Create new equipment item (Admin only) |
| `PATCH` | `/api/v1/products/:id` | Admin | Update pricing, stock, specs, or images |
| `DELETE` | `/api/v1/products/:id` | Admin | Remove product from catalog |

---

## 5. Division Categories (`/api/v1/categories`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/categories` | Public | Retrieve all 10 active divisions with live product counts |
| `GET` | `/api/v1/categories/:slug` | Public | Retrieve division details and all assigned accessories |
| `POST` | `/api/v1/categories` | Admin | Create a new division |
| `PATCH` | `/api/v1/categories/:id` | Admin | Update division name, slug, or image |
| `DELETE` | `/api/v1/categories/:id` | Admin | Remove division (validated against existing products) |

---

## 6. Authoritative Shopping Cart (`/api/v1/cart`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/cart` | Public (Optional Auth) | Retrieve authoritative server-calculated cart totals |
| `POST` | `/api/v1/cart/items` | Public (Optional Auth) | Add product to cart with server-side stock verification |
| `PATCH` | `/api/v1/cart/items/:productId` | Public (Optional Auth) | Update item quantity or remove if quantity is 0 |
| `DELETE` | `/api/v1/cart/items/:productId` | Public (Optional Auth) | Remove item from cart |
| `POST` | `/api/v1/cart/coupon` | Public (Optional Auth) | Validate and apply promo code with minimum order checks |
| `DELETE` | `/api/v1/cart/coupon` | Public (Optional Auth) | Remove active coupon |
| `DELETE` | `/api/v1/cart` | Public (Optional Auth) | Empty all items |
| `POST` | `/api/v1/cart/sync` | Private | Merge guest session items into user account upon login |

---

## 7. Order Fulfillment & Telemetry (`/api/v1/orders`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/orders` | Private | Validated order placement; reserves stock, creates tracking, clears cart |
| `GET` | `/api/v1/orders/my-orders` | Private | Retrieve logged-in customer's order history |
| `GET` | `/api/v1/orders/:id` | Private | Order details with frozen item snapshots |
| `PATCH` | `/api/v1/orders/:id/cancel` | Private | Cancel order (restocks items; allowed if status is `placed` or `confirmed`) |
| `GET` | `/api/v1/orders/:id/tracking` | Private | Real-time consignment milestone timeline |

---

## 8. Customer Reviews & Verification (`/api/v1/reviews`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/reviews/product/:productId` | Public | List approved verified reviews for product |
| `POST` | `/api/v1/reviews` | Private | Submit review (enforces purchase verification & 1 review per product) |
| `PATCH` | `/api/v1/reviews/:id` | Private | Edit own review |
| `DELETE` | `/api/v1/reviews/:id` | Private | Remove review and recalculate product ratings |

---

## 9. Wishlist (`/api/v1/wishlist`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/wishlist` | Private | Retrieve saved accessories |
| `POST` | `/api/v1/wishlist/:productId` | Private | Add accessory to wishlist |
| `DELETE` | `/api/v1/wishlist/:productId` | Private | Remove accessory from wishlist |

---

## 10. Admin Operations Command (`/api/v1/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | Admin | Real-time KPIs: revenue, volume, customer count, low-stock alerts |
| `GET` | `/api/v1/admin/orders` | Admin | Filter and inspect nationwide consignments |
| `PATCH` | `/api/v1/admin/orders/:id/status` | Admin | Update status with valid state transitions & tracking logs |
| `GET` | `/api/v1/admin/customers` | Admin | Pilot directory with account search |
| `PATCH` | `/api/v1/admin/customers/:id/status` | Admin | Suspend or activate customer account (protects sole admin) |
| `GET` | `/api/v1/admin/reviews` | Admin | Moderation queue for customer reviews |
| `PATCH` | `/api/v1/admin/reviews/:id/status` | Admin | Approve or hide review |
| `GET` | `/api/v1/admin/coupons` | Admin | List all promotional coupons |
| `POST` | `/api/v1/admin/coupons` | Admin | Create discount coupon (fixed PKR or percentage) |
| `PATCH` | `/api/v1/admin/coupons/:id` | Admin | Edit discount parameters or limits |
| `DELETE` | `/api/v1/admin/coupons/:id` | Admin | Delete coupon code |

---

## 11. Media Uploads (`/api/v1/upload`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/upload` | Admin | Upload single image (JPG, PNG, WebP) or 3D model (GLB, GLTF) |
| `POST` | `/api/v1/upload/multiple` | Admin | Batch image upload up to 8 images per request |

