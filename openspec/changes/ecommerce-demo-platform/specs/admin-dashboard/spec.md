## ADDED Requirements

### Requirement: Admin layout with sidebar
The system SHALL render an admin layout with a collapsible sidebar navigation containing links: Dashboard, Products, Orders, Customers, Settings. A topbar SHALL show the admin user name and a back-to-store link.

#### Scenario: Admin sidebar navigation
- **WHEN** admin user is on any /admin route
- **THEN** the sidebar with navigation links and topbar are visible

#### Scenario: Collapse sidebar
- **WHEN** admin clicks the collapse toggle
- **THEN** the sidebar collapses to icon-only mode

### Requirement: Dashboard overview cards
The system SHALL display summary cards showing: Total Revenue, Total Orders, Total Customers, and Average Order Value. Each card SHALL show the metric value and a percentage change indicator.

#### Scenario: View dashboard metrics
- **WHEN** admin navigates to /admin
- **THEN** 4 summary cards with metric values and change percentages are displayed

### Requirement: Sales chart
The system SHALL display a line/area chart showing revenue over the last 7 days/30 days/12 months with a period selector.

#### Scenario: Switch chart period
- **WHEN** admin selects "30 days" from the period selector
- **THEN** the chart updates to show revenue for the last 30 days

### Requirement: Recent orders feed
The system SHALL display a list of the 5 most recent orders with order number, customer name, total, and status badge.

#### Scenario: View recent orders
- **WHEN** admin views the dashboard
- **THEN** the 5 most recent orders are listed with status badges

### Requirement: Top products section
The system SHALL display a list of the top 5 best-selling products with name, units sold, and revenue.

#### Scenario: View top products
- **WHEN** admin views the dashboard
- **THEN** the top 5 products by revenue are listed
