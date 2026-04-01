## ADDED Requirements

### Requirement: Quick view modal
The system SHALL display an "eye" icon on product cards in the catalog. Clicking it SHALL open a modal overlay with the product image, name, price, rating, variant selector, quantity picker, and "Add to Cart" button — without navigating away from the catalog.

#### Scenario: Open quick view
- **WHEN** user clicks the quick view icon on a product card
- **THEN** a modal opens with product details and add-to-cart functionality

#### Scenario: Add to cart from quick view
- **WHEN** user selects a variant and clicks "Add to Cart" in the quick view modal
- **THEN** the product is added to the cart and a success toast appears

#### Scenario: Close quick view
- **WHEN** user clicks outside the modal or the close button
- **THEN** the modal closes and the user remains on the catalog page

### Requirement: Recently viewed products
The system SHALL track the last 8 products the user has viewed and store them in localStorage. A "Recently Viewed" horizontal scroll section SHALL appear on the homepage and at the bottom of product detail pages.

#### Scenario: Track viewed product
- **WHEN** user visits /products/[id]
- **THEN** the product is added to the recently viewed list (most recent first, max 8)

#### Scenario: Display recently viewed
- **WHEN** user visits the homepage and has viewed products before
- **THEN** a "Recently Viewed" section shows the products as a horizontal scrollable row

#### Scenario: No recently viewed
- **WHEN** user has not viewed any products yet
- **THEN** the "Recently Viewed" section is not displayed

### Requirement: Product comparison
The system SHALL allow users to add up to 4 products to a comparison tray. A floating comparison bar SHALL appear at the bottom of the screen when at least 1 product is in the tray, showing thumbnail previews and a "Compare" button. The comparison page SHALL display a side-by-side table of product attributes (name, price, rating, category, description, stock status).

#### Scenario: Add to comparison
- **WHEN** user clicks "Compare" on a product card
- **THEN** the product is added to the comparison tray and the floating bar appears

#### Scenario: Comparison tray limit
- **WHEN** user tries to add a 5th product to comparison
- **THEN** an error toast appears saying "Maximum 4 products for comparison"

#### Scenario: View comparison page
- **WHEN** user clicks "Compare" on the floating bar with 3 products selected
- **THEN** a comparison page opens with a side-by-side attribute table for all 3 products

#### Scenario: Remove from comparison
- **WHEN** user clicks the X on a product in the floating comparison bar
- **THEN** the product is removed from comparison

### Requirement: Size guide modal
The system SHALL display a "Size Guide" link on product detail pages for applicable categories (Clothing, Sports). Clicking it SHALL open a modal with a size chart table showing measurements for each size option.

#### Scenario: Open size guide
- **WHEN** user clicks "Size Guide" on a clothing product page
- **THEN** a modal opens with a table of sizes and their measurements

#### Scenario: Size guide not shown for non-apparel
- **WHEN** user views an Electronics product detail page
- **THEN** no "Size Guide" link is displayed
