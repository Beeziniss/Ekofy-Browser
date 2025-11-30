# Admin Transactions Management

## Overview
Tính năng này cho phép admin xem và quản lý tất cả payment transactions trong hệ thống.

## Cách truy cập

1. Đăng nhập với tài khoản Admin
2. Truy cập: `/admin/transactions`

## Tính năng

### 1. Xem danh sách transactions
- Hiển thị tất cả payment transactions từ toàn bộ users (listener và artist)
- Thông tin hiển thị:
  - **Date**: Thời gian tạo transaction
  - **User**: Tên người dùng (link đến user detail)
  - **Email**: Email của user
  - **Amount**: Số tiền + loại tiền tệ
  - **Method**: Phương thức thanh toán (card, link, etc.)
  - **Status**: Trạng thái (Paid/Pending/Unpaid)
  - **Transaction ID**: Stripe Payment ID hoặc internal ID
  - **Actions**: Button để xem chi tiết

### 2. Filter và Search
- **Search**: Tìm kiếm theo tên hoặc email người dùng (đang phát triển)
- **Status Filter**: Lọc theo trạng thái thanh toán
  - All Statuses
  - Paid
  - Pending
  - Unpaid

### 3. Pagination
- 20 transactions mỗi trang
- Navigation với Previous/Next buttons
- Hiển thị tổng số transactions và phạm vi hiện tại

## Cấu trúc Code

### 1. GraphQL Query
```typescript
// src/modules/shared/queries/admin/transaction-queries.ts
GetAllTransactionsQuery
```
- Query toàn bộ paymentTransactions không filter theo userId
- Lấy thông tin user kèm theo (email, fullName, role)

### 2. Query Options
```typescript
// src/gql/options/admin-options.ts
adminTransactionsOptions(page, pageSize, searchTerm, statusFilter)
```
- Quản lý pagination, filtering
- Cache 2 phút

### 3. UI Components
```
src/modules/admin/transactions/ui/
├── layout/
│   └── transaction-layout.tsx          # Layout wrapper
├── section/
│   └── transaction-list-section.tsx    # Main section with state management
├── component/
│   ├── transaction-table.tsx           # Table component
│   └── transaction-filters.tsx         # Filter controls
└── view/
    └── admin-transactions-list.tsx     # Main view component
```

### 4. Page
```typescript
// src/app/admin/(main)/transactions/page.tsx
```
- Next.js page với prefetching
- HydrationBoundary cho SSR

## API Endpoint

GraphQL Query được sử dụng:
```graphql
query GetAllTransactions(
  $where: PaymentTransactionFilterInput
  $order: [PaymentTransactionSortInput!]
  $skip: Int
  $take: Int
) {
  paymentTransactions(where: $where, order: $order, skip: $skip, take: $take) {
    totalCount
    items {
      id
      amount
      currency
      createdAt
      paymentStatus
      status
      userId
      user {
        id
        email
        fullName
        role
      }
      # ... other fields
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```

## Permissions

⚠️ **Chỉ dành cho Admin**
- Cần role ADMIN để truy cập
- Middleware sẽ check authentication và authorization

## Các bước tiếp theo (Future Enhancements)

1. **Advanced Search**: 
   - Backend cần hỗ trợ filter theo user info
   - Thêm filter theo date range
   - Filter theo amount range

2. **Export Data**:
   - Export to CSV/Excel
   - Export selected transactions

3. **Transaction Detail Page**:
   - Tạo page `/admin/transactions/[id]`
   - Xem chi tiết đầy đủ transaction
   - View related invoices, subscriptions

4. **Analytics**:
   - Dashboard với charts
   - Revenue statistics
   - Payment method breakdown

5. **Bulk Actions**:
   - Refund multiple transactions
   - Update status in bulk

## Testing

Để test feature này:

1. Khởi chạy development server:
```bash
npm run dev
```

2. Truy cập: `http://localhost:3000/admin/transactions`

3. Test cases:
   - ✅ Load danh sách transactions
   - ✅ Pagination hoạt động
   - ✅ Filter theo status
   - ✅ Click vào user name → redirect đến user detail
   - ✅ Click View button → redirect đến transaction detail (cần implement)

## Troubleshooting

### Không thấy transactions
- Check backend có data không
- Check console log cho errors
- Verify user có role ADMIN

### Lỗi GraphQL
- Check schema.graphql có query `paymentTransactions`
- Verify backend API endpoint đang hoạt động
- Check network tab trong DevTools

### Performance issues
- Giảm pageSize nếu data quá lớn
- Backend có thể cần optimize query với indexes
- Consider implementing virtual scrolling cho large datasets
