## ADDED Requirements

### Requirement: App shell with persistent navigation
The system SHALL render a storefront layout with a sticky header containing the logo, navigation links (Home, Products, Account), a search trigger, a theme toggle, and a cart icon with item count badge. A footer SHALL display on all storefront pages.

#### Scenario: Header renders on all storefront pages
- **WHEN** user navigates to any storefront route
- **THEN** the header with logo, nav links, search, theme toggle, and cart icon is visible

#### Scenario: Cart badge shows item count
- **WHEN** the cart contains 3 items
- **THEN** the cart icon displays a badge with "3"

#### Scenario: Cart badge hidden when empty
- **WHEN** the cart is empty
- **THEN** no badge is displayed on the cart icon

### Requirement: Responsive layout
The system SHALL adapt the layout for mobile (<768px), tablet (768-1024px), and desktop (>1024px). On mobile, the navigation SHALL collapse into a hamburger menu with a slide-out drawer.

#### Scenario: Mobile navigation drawer
- **WHEN** viewport is below 768px and user taps the hamburger icon
- **THEN** a drawer slides in from the left with navigation links

#### Scenario: Desktop full navigation
- **WHEN** viewport is above 1024px
- **THEN** all navigation links are visible in the header bar

### Requirement: Theme switching
The system SHALL support light and dark themes. The theme toggle SHALL switch between them with a smooth transition. The selected theme SHALL persist across page refreshes via localStorage.

#### Scenario: Toggle dark mode
- **WHEN** user clicks the theme toggle while in light mode
- **THEN** the entire UI switches to dark theme and the preference is saved

#### Scenario: Theme persists on refresh
- **WHEN** user has selected dark mode and refreshes the page
- **THEN** dark mode is still active

### Requirement: Page transitions
The system SHALL animate route transitions using fade/slide animations for a polished feel.

#### Scenario: Navigate between pages
- **WHEN** user clicks a navigation link
- **THEN** the outgoing page fades out and the incoming page fades in smoothly
