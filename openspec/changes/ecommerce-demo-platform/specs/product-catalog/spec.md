## ADDED Requirements

### Requirement: Product grid display
The system SHALL display products in a responsive grid (4 columns desktop, 3 tablet, 2 mobile). Each product card SHALL show the product image, name, price, rating stars, and an "Add to Cart" quick-action button.

#### Scenario: Products render in grid
- **WHEN** user visits /products
- **THEN** products are displayed in a responsive grid with image, name, price, and rating

#### Scenario: Quick add to cart
- **WHEN** user clicks "Add to Cart" on a product card
- **THEN** the product is added to the cart and a success toast appears

### Requirement: Category filtering
The system SHALL display category chips/tabs (e.g., All, Electronics, Clothing, Home, Sports). Selecting a category SHALL filter the product list instantly.

#### Scenario: Filter by category
- **WHEN** user selects "Electronics" category
- **THEN** only products in the Electronics category are displayed

### Requirement: Sorting
The system SHALL allow sorting products by: Price (Low to High), Price (High to Low), Rating, and Newest.

#### Scenario: Sort by price ascending
- **WHEN** user selects "Price: Low to High" from the sort dropdown
- **THEN** products reorder with cheapest first

### Requirement: Search
The system SHALL provide a search input that filters products by name and description in real-time as the user types.

#### Scenario: Search for a product
- **WHEN** user types "wireless" in the search input
- **THEN** only products whose name or description contains "wireless" are shown

### Requirement: Grid/List view toggle
The system SHALL allow toggling between grid view and list view. List view SHALL show more product details per row.

#### Scenario: Switch to list view
- **WHEN** user clicks the list view toggle
- **THEN** products display in a single-column list with larger images and more description text

### Requirement: Loading skeletons
The system SHALL show skeleton placeholders while products are loading (simulated delay).

#### Scenario: Products loading
- **WHEN** the product catalog is fetching data
- **THEN** skeleton cards matching the grid layout are displayed
