## ADDED Requirements

### Requirement: Product information display
The system SHALL display the product name, price, description, rating with review count, available variants (size/color), stock status, and an "Add to Cart" button with quantity selector.

#### Scenario: View product detail
- **WHEN** user navigates to /products/[id]
- **THEN** the full product information is displayed including name, price, description, rating, and variants

### Requirement: Image gallery
The system SHALL display a primary product image with a row of thumbnail images below. Clicking a thumbnail SHALL update the main image. The main image SHALL support zoom on hover (desktop) or pinch-to-zoom (mobile).

#### Scenario: Switch product image
- **WHEN** user clicks a thumbnail image
- **THEN** the main image updates to show the selected thumbnail

#### Scenario: Zoom on hover
- **WHEN** user hovers over the main image on desktop
- **THEN** a magnified view of the hovered area is shown

### Requirement: Variant selection
The system SHALL display variant options (e.g., Size: S/M/L/XL, Color: Red/Blue/Black) as selectable chips. Selecting a variant MAY update the price and main image.

#### Scenario: Select a size variant
- **WHEN** user selects "Large" from the size options
- **THEN** the "Large" chip is highlighted as selected

### Requirement: Simulated reviews section
The system SHALL display a list of mock reviews with reviewer name, rating stars, date, and comment text.

#### Scenario: Reviews display
- **WHEN** user scrolls to the reviews section on a product page
- **THEN** a list of reviews with names, star ratings, dates, and comments is shown

### Requirement: Related products
The system SHALL display a "You may also like" section with 4 related product cards at the bottom of the page.

#### Scenario: Related products appear
- **WHEN** user views a product detail page
- **THEN** 4 related product cards from the same category are shown below
