## ADDED Requirements

### Requirement: Realistic product data
The system SHALL include at least 30 mock products across 5 categories (Electronics, Clothing, Home & Living, Sports, Accessories). Each product SHALL have: id, name, description, price, compareAtPrice, category, images (Unsplash placeholder URLs), rating, reviewCount, variants, stock, and status.

#### Scenario: Products loaded on startup
- **WHEN** the application initializes
- **THEN** the product store contains at least 30 products with complete data

### Requirement: Mock order data
The system SHALL include at least 50 mock orders with realistic order numbers, dates spread over the last 90 days, varied statuses (pending, processing, shipped, delivered, cancelled), items referencing real product IDs, and customer references.

#### Scenario: Orders available for admin
- **WHEN** admin views the orders page
- **THEN** at least 50 orders with varied statuses and dates are available

### Requirement: Mock customer data
The system SHALL include at least 20 mock customers with name, email, phone, address, avatar URL, join date, and associated orders.

#### Scenario: Customers loaded
- **WHEN** admin views the customers page
- **THEN** at least 20 customers with complete profiles are listed

### Requirement: Simulated API delay
All mock data access functions SHALL simulate network latency with a random delay between 300ms and 800ms to make interactions feel authentic.

#### Scenario: Loading state during fetch
- **WHEN** a component requests products from the mock API
- **THEN** there is a visible delay (300-800ms) before data appears, during which loading state is shown

### Requirement: Persistent state via localStorage
Cart contents, user authentication state, and theme preference SHALL persist across page refreshes using localStorage. Order and product mutations in admin SHALL also persist within the session.

#### Scenario: Cart persists on refresh
- **WHEN** user adds items to cart and refreshes the browser
- **THEN** the cart still contains the previously added items

### Requirement: Mock data seeding
The system SHALL provide a function to reset all mock data to its original state, accessible from the admin settings page.

#### Scenario: Reset mock data
- **WHEN** admin clicks "Reset Demo Data" in settings
- **THEN** all products, orders, and customers revert to their initial seed values
