## ADDED Requirements

### Requirement: Cart page display
The system SHALL display a cart page at /cart listing all items with product image, name, selected variant, unit price, quantity selector, line total, and a remove button. A cart summary panel SHALL show subtotal, shipping estimate, tax, and order total.

#### Scenario: View cart with items
- **WHEN** user navigates to /cart with 2 items in the cart
- **THEN** both items are listed with their details and the summary shows correct totals

### Requirement: Quantity management
The system SHALL allow incrementing, decrementing, and directly editing item quantities. Minimum quantity is 1. Setting quantity to 0 or clicking remove SHALL delete the item.

#### Scenario: Increase quantity
- **WHEN** user clicks the "+" button on a cart item
- **THEN** the quantity increases by 1 and the line total and order total update

#### Scenario: Remove item
- **WHEN** user clicks the remove button on a cart item
- **THEN** the item is removed from the cart and totals recalculate

### Requirement: Cart drawer
The system SHALL support a slide-out cart drawer (from the right) that opens when adding an item or clicking the cart icon. The drawer shows a compact item list and a "View Cart" / "Checkout" button.

#### Scenario: Cart drawer opens on add
- **WHEN** user adds a product to cart from the catalog
- **THEN** the cart drawer slides open from the right showing the added item

### Requirement: Promo code
The system SHALL accept a promo code input. Entering "DEMO10" SHALL apply a 10% discount. Invalid codes SHALL show an error message.

#### Scenario: Apply valid promo code
- **WHEN** user enters "DEMO10" and clicks apply
- **THEN** a 10% discount is applied and shown in the summary

#### Scenario: Invalid promo code
- **WHEN** user enters "INVALID" and clicks apply
- **THEN** an error message "Invalid promo code" is displayed

### Requirement: Empty cart state
The system SHALL show an empty state with illustration and a "Continue Shopping" link when the cart has no items.

#### Scenario: Empty cart
- **WHEN** user views cart with no items
- **THEN** an empty cart illustration and "Continue Shopping" link are shown
