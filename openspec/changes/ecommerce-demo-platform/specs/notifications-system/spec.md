## ADDED Requirements

### Requirement: Toast notifications for actions
The system SHALL display transient toast notifications (bottom-right) for user and admin actions including: add to cart, remove from cart, order placed, product saved/deleted, promo code applied/rejected, login/logout, and form submission. Toasts SHALL auto-dismiss after 4 seconds and support manual dismiss.

#### Scenario: Toast on add to cart
- **WHEN** user adds a product to the cart
- **THEN** a success toast appears with the product name and "Added to cart" message

#### Scenario: Toast auto-dismiss
- **WHEN** a toast notification appears
- **THEN** it auto-dismisses after 4 seconds

#### Scenario: Toast manual dismiss
- **WHEN** user clicks the close button on a toast
- **THEN** the toast is immediately dismissed

### Requirement: Notification bell with activity feed
The system SHALL display a bell icon in both the storefront header and admin topbar. Clicking it SHALL open a dropdown showing a scrollable list of recent activity notifications. An unread count badge SHALL appear on the bell when new notifications exist.

#### Scenario: View notification dropdown
- **WHEN** user clicks the bell icon
- **THEN** a dropdown opens showing recent notifications with timestamps

#### Scenario: Unread badge count
- **WHEN** there are 3 unread notifications
- **THEN** the bell icon shows a badge with "3"

#### Scenario: Mark notifications as read
- **WHEN** user opens the notification dropdown
- **THEN** all visible notifications are marked as read and the badge count resets

### Requirement: Simulated notification events
The system SHALL generate mock notification events including: new order received, low stock alert, new customer signup, order status changed, and review posted. Events SHALL have realistic timestamps spread throughout the current session.

#### Scenario: Admin receives order notification
- **WHEN** admin is on the dashboard and a simulated new order event fires
- **THEN** the notification bell badge increments and the event appears in the dropdown

### Requirement: Notification types and styling
Each notification SHALL have a type (success, warning, info, error) with corresponding icon and color styling. Order notifications SHALL link to the relevant order detail page.

#### Scenario: Click notification to navigate
- **WHEN** admin clicks a "New order #ORD-1052" notification
- **THEN** the admin is navigated to /admin/orders/[id] for that order
