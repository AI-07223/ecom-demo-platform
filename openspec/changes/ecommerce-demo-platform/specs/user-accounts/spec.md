## ADDED Requirements

### Requirement: Login simulation
The system SHALL display a login form with email and password fields. Any non-empty credentials SHALL succeed (demo mode). On success, the user state SHALL update and the user is redirected to their profile.

#### Scenario: Successful login
- **WHEN** user enters any email and password and clicks "Sign In"
- **THEN** the user is logged in, the header shows their name, and they are redirected to /account

#### Scenario: Empty credentials
- **WHEN** user clicks "Sign In" with empty fields
- **THEN** validation errors appear on both fields

### Requirement: Registration simulation
The system SHALL display a registration form with name, email, password, and confirm password fields. Passwords must match. On success, the user is auto-logged in.

#### Scenario: Successful registration
- **WHEN** user fills valid registration details and clicks "Create Account"
- **THEN** the account is created, user is logged in, and redirected to /account

### Requirement: User profile page
The system SHALL display the user's profile with name, email, and avatar placeholder. Users MAY edit their name and email.

#### Scenario: View profile
- **WHEN** logged-in user navigates to /account
- **THEN** their profile information is displayed

### Requirement: Order history
The system SHALL display a list of the user's past orders (mock data) with order number, date, status, total, and a link to order detail.

#### Scenario: View order history
- **WHEN** logged-in user navigates to /account and selects "Orders"
- **THEN** a list of past orders with status badges is shown

### Requirement: Wishlist
The system SHALL allow users to save products to a wishlist. The wishlist is accessible from the account page and displays saved products with "Add to Cart" and "Remove" actions.

#### Scenario: Add to wishlist
- **WHEN** user clicks the heart icon on a product
- **THEN** the product is added to the wishlist and the heart fills in

#### Scenario: View wishlist
- **WHEN** user navigates to /account and selects "Wishlist"
- **THEN** saved products are displayed with add-to-cart and remove options

### Requirement: Auth-protected routes
The system SHALL redirect unauthenticated users to /account/login when they attempt to access /account, /checkout, or /account/wishlist.

#### Scenario: Redirect when not logged in
- **WHEN** unauthenticated user navigates to /account
- **THEN** they are redirected to /account/login
