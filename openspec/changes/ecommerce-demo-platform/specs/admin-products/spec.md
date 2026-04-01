## ADDED Requirements

### Requirement: Product list table
The system SHALL display a data table of all products with columns: Image thumbnail, Name, Category, Price, Stock, Status (active/draft), and Actions (edit/delete). The table SHALL support pagination and search filtering.

#### Scenario: View product table
- **WHEN** admin navigates to /admin/products
- **THEN** a paginated table of products with all columns is displayed

#### Scenario: Search products
- **WHEN** admin types "headphones" in the search input
- **THEN** only products matching "headphones" appear in the table

### Requirement: Create product
The system SHALL provide a form at /admin/products/new with fields: name, description (rich text area), category select, price, compare-at price, images (simulated upload), variants (size/color with stock per variant), and status toggle. On save, the product SHALL appear in the product list.

#### Scenario: Create a new product
- **WHEN** admin fills the product form and clicks "Save Product"
- **THEN** the product is added to the mock data and the admin is redirected to the product list with a success toast

### Requirement: Edit product
The system SHALL load existing product data into the form at /admin/products/[id]. Changes SHALL update the mock data on save.

#### Scenario: Edit an existing product
- **WHEN** admin edits a product's price and clicks "Save"
- **THEN** the product updates in the mock store and a success toast appears

### Requirement: Delete product
The system SHALL show a confirmation dialog before deleting a product. On confirm, the product SHALL be removed from the mock store.

#### Scenario: Delete product with confirmation
- **WHEN** admin clicks delete on a product and confirms the dialog
- **THEN** the product is removed from the list

### Requirement: Bulk actions
The system SHALL allow selecting multiple products via checkboxes and performing bulk delete or bulk status change.

#### Scenario: Bulk delete products
- **WHEN** admin selects 3 products and clicks "Delete Selected"
- **THEN** a confirmation dialog appears, and on confirm, all 3 products are removed
