## ADDED Requirements

### Requirement: Customer list
The system SHALL display a data table of customers with columns: Avatar, Name, Email, Total Orders, Total Spent, and Join Date. The table SHALL support search and pagination.

#### Scenario: View customer list
- **WHEN** admin navigates to /admin/customers
- **THEN** a paginated table of customers is displayed

#### Scenario: Search customers
- **WHEN** admin types "john" in the search input
- **THEN** customers matching "john" in name or email are shown

### Requirement: Customer detail view
The system SHALL display customer details at /admin/customers/[id] including: profile info (name, email, phone, address), order history with the customer, total spent, and account creation date.

#### Scenario: View customer detail
- **WHEN** admin clicks on a customer row
- **THEN** the customer detail page shows profile info and their order history

### Requirement: Customer statistics
The customer detail page SHALL show summary cards: Total Orders, Total Spent, Average Order Value, and Last Order Date.

#### Scenario: View customer stats
- **WHEN** admin views a customer detail page
- **THEN** summary cards with the customer's stats are displayed
