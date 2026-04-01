## ADDED Requirements

### Requirement: Multi-step checkout
The system SHALL present checkout as a 3-step process: (1) Shipping Information, (2) Payment Method, (3) Review & Confirm. A step indicator SHALL show progress.

#### Scenario: Step progression
- **WHEN** user completes shipping info and clicks "Continue"
- **THEN** the checkout advances to the Payment step and the progress indicator updates

### Requirement: Shipping information form
The system SHALL collect: full name, email, phone, address line 1, address line 2, city, state/province, zip code, and country. All required fields SHALL validate on blur and on submit.

#### Scenario: Validation error
- **WHEN** user leaves the "Email" field empty and moves to the next field
- **THEN** an inline error "Email is required" appears under the field

#### Scenario: Valid shipping info
- **WHEN** user fills all required shipping fields correctly and clicks "Continue"
- **THEN** the form passes validation and advances to the Payment step

### Requirement: Payment method simulation
The system SHALL show a simulated payment form with card number, expiry, and CVV fields. The form SHALL accept any input for demo purposes but validate format (16 digits, MM/YY, 3 digits).

#### Scenario: Payment form format validation
- **WHEN** user enters "1234" in the card number field
- **THEN** an error "Card number must be 16 digits" is shown

### Requirement: Order review and confirmation
The system SHALL display a review page showing all cart items, shipping address, payment summary, and total. A "Place Order" button SHALL simulate order placement with a loading state, then redirect to a confirmation page.

#### Scenario: Place order
- **WHEN** user clicks "Place Order" on the review step
- **THEN** a loading spinner appears for 1-2 seconds, then user is redirected to an order confirmation page with an order number

### Requirement: Order confirmation page
The system SHALL display a success message, order number, estimated delivery date, order summary, and a "Continue Shopping" button.

#### Scenario: View order confirmation
- **WHEN** user is redirected after placing an order
- **THEN** the confirmation page shows order number, items, total, and estimated delivery
