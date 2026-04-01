## ADDED Requirements

### Requirement: About Us page
The system SHALL display an About Us page at /about with: a hero section with company story text, a team section showing a grid of team member cards (avatar, name, role), and a mission/values section with icon cards.

#### Scenario: View About Us
- **WHEN** user navigates to /about
- **THEN** the page displays company story, team grid, and mission/values sections

### Requirement: Contact page
The system SHALL display a Contact page at /contact with: a contact form (name, email, subject, message) that simulates submission with a success toast, business hours, a placeholder map section, and contact info (phone, email, address).

#### Scenario: Submit contact form
- **WHEN** user fills the contact form and clicks "Send Message"
- **THEN** a loading spinner appears briefly, then a success toast "Message sent!" is shown and the form resets

#### Scenario: Contact form validation
- **WHEN** user submits the contact form with empty required fields
- **THEN** inline validation errors appear on the missing fields

### Requirement: FAQ page
The system SHALL display a FAQ page at /faq with an accordion component containing at least 10 mock questions and answers organized by category (Shipping, Returns, Payments, Account).

#### Scenario: Expand FAQ item
- **WHEN** user clicks on a FAQ question
- **THEN** the answer expands with a smooth animation and other open answers collapse

### Requirement: Blog listing page
The system SHALL display a blog page at /blog with a grid of mock article cards (6-10 articles). Each card SHALL show a featured image, title, excerpt (2 lines), author name, publish date, and category tag.

#### Scenario: View blog listing
- **WHEN** user navigates to /blog
- **THEN** a grid of article cards with images, titles, excerpts, and metadata is displayed

### Requirement: Blog article detail page
The system SHALL display individual articles at /blog/[slug] with: a hero image, title, author with avatar, publish date, rich content body (headings, paragraphs, images, blockquotes), and a "Related Articles" section at the bottom.

#### Scenario: Read blog article
- **WHEN** user clicks on a blog article card
- **THEN** the article detail page loads with full content and related articles

### Requirement: Navigation integration
The storefront header navigation SHALL include links to About, Contact, FAQ, and Blog. These SHALL be accessible from a "Pages" dropdown or directly in the nav bar.

#### Scenario: Navigate to marketing pages
- **WHEN** user clicks "About" in the header navigation
- **THEN** the About Us page is displayed within the storefront layout
