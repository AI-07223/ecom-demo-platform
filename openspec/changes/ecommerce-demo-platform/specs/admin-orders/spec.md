## ADDED Requirements

### Requirement: Order list with filters
The system SHALL display a data table of all orders with columns: Order Number, Customer, Date, Total, Payment Status, Fulfillment Status, and Actions. Filter tabs SHALL allow filtering by: All, Pending, Processing, Shipped, Delivered, Cancelled.

#### Scenario: View all orders
- **WHEN** admin navigates to /admin/orders
- **THEN** all orders are listed in a table with status badges

#### Scenario: Filter by status
- **WHEN** admin clicks the "Shipped" filter tab
- **THEN** only orders with "Shipped" status are displayed

### Requirement: Order detail view
The system SHALL display order details at /admin/orders/[id] including: customer info, shipping address, ordered items with quantities and prices, payment summary, order timeline (status history), and action buttons.

#### Scenario: View order detail
- **WHEN** admin clicks on an order row
- **THEN** the order detail page shows all order information and timeline

### Requirement: Update order status
The system SHALL allow admins to update an order's fulfillment status through a dropdown or status buttons (e.g., Mark as Processing, Mark as Shipped, Mark as Delivered). Each status change SHALL add an entry to the order timeline.

#### Scenario: Mark order as shipped
- **WHEN** admin clicks "Mark as Shipped" on an order
- **THEN** the order status updates to "Shipped" and a timeline entry is added

### Requirement: Order search
The system SHALL allow searching orders by order number or customer name.

#### Scenario: Search by order number
- **WHEN** admin types "#ORD-1234" in the search field
- **THEN** the matching order is shown in the table
