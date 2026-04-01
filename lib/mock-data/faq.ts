import type { FaqItem } from "@/types"

export const FAQ_ITEMS: FaqItem[] = [
  // ── Shipping ────────────────────────────────────────────────────────────────
  {
    id: "faq-001",
    question: "How long does standard shipping take?",
    answer:
      "Standard shipping takes 3–7 business days for domestic orders within the contiguous United States. Orders placed before 2:00 PM Eastern Time on business days are processed and handed to the carrier the same day. You'll receive a shipping confirmation email with a tracking number as soon as your package leaves our warehouse. Delivery to Hawaii, Alaska, and US territories may take 7–14 business days.",
    category: "Shipping",
  },
  {
    id: "faq-002",
    question: "Do you offer free shipping?",
    answer:
      "Yes! All domestic orders over $75 qualify for free standard shipping — no promo code needed. Free shipping is automatically applied at checkout once your cart reaches the qualifying threshold. For orders under $75, standard shipping is $5.99 and express shipping (2 business days) is $14.99. Expedited overnight shipping is available for $24.99 on orders placed before 12:00 PM Eastern Time.",
    category: "Shipping",
  },
  {
    id: "faq-003",
    question: "Can I change my shipping address after placing an order?",
    answer:
      "You can update your shipping address within 2 hours of placing your order, provided it hasn't yet been picked and packed. To request a change, contact our support team immediately via the live chat or by emailing support@shopname.com with your order number and the corrected address. Once an order has been processed and handed to the carrier, we're unable to redirect it — you would need to contact the carrier directly with your tracking number to request a delivery redirect, which may incur a carrier fee.",
    category: "Shipping",
  },

  // ── Returns ─────────────────────────────────────────────────────────────────
  {
    id: "faq-004",
    question: "What is your return policy?",
    answer:
      "We accept returns on most items within 30 days of delivery, provided they are in their original, unworn/unused condition with all original tags and packaging intact. To initiate a return, go to Orders in your account and click 'Start Return' next to the relevant item. You'll receive a prepaid return shipping label by email within 10 minutes. Refunds are processed to your original payment method within 5–7 business days of us receiving the returned item.",
    category: "Returns",
  },
  {
    id: "faq-005",
    question: "Are there any items I cannot return?",
    answer:
      "A small number of items are non-returnable for hygiene or safety reasons: opened personal care items, customized or monogrammed products, downloadable software or digital goods, and items marked 'Final Sale' at the time of purchase. Additionally, items that have been worn, washed, damaged by the customer, or returned without original packaging may not be eligible for a full refund — we'll contact you in those cases with available options, which may include a partial credit.",
    category: "Returns",
  },
  {
    id: "faq-006",
    question: "How do I exchange an item for a different size or color?",
    answer:
      "The fastest way to exchange an item is to return your original purchase for a refund and place a new order for the correct size or color. This ensures the item you want doesn't sell out while your return is in transit. Alternatively, you can note the exchange details when submitting your return request and a member of our team will hold the replacement item (subject to availability) and ship it as soon as your return is received. Exchanges for items of equal value ship free.",
    category: "Returns",
  },

  // ── Payments ────────────────────────────────────────────────────────────────
  {
    id: "faq-007",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. We also offer buy-now-pay-later options through Klarna and Afterpay, which allow you to split your purchase into 4 interest-free installments. All transactions are processed over encrypted HTTPS connections and we never store your full card number on our servers.",
    category: "Payments",
  },
  {
    id: "faq-008",
    question: "Is it safe to save my card details on your site?",
    answer:
      "Yes. We use Stripe as our payment processor — one of the most trusted payment infrastructure companies in the world. When you save a card, only a secure token is stored on our servers; the actual card number, expiry date, and CVV are held exclusively within Stripe's PCI-DSS Level 1 certified environment. We have no access to your full card details. You can remove saved cards at any time from your account's Payment Methods section.",
    category: "Payments",
  },
  {
    id: "faq-009",
    question: "Can I use more than one promo code on an order?",
    answer:
      "Only one promotional code can be applied per order. If you have multiple codes, we recommend applying the one with the highest value. Promotional codes cannot be combined with other offers unless the promotion explicitly states otherwise. Codes are case-insensitive and must be entered exactly as received (no spaces). Most codes have an expiry date and a minimum order value requirement — these will be clearly indicated in the terms of any promotion.",
    category: "Payments",
  },

  // ── Account ─────────────────────────────────────────────────────────────────
  {
    id: "faq-010",
    question: "How do I create an account?",
    answer:
      "Click 'Sign Up' in the top-right corner of any page. You can register with your email address and a password, or sign in instantly using your existing Google or Apple account via OAuth — no separate password required. Creating an account lets you track orders, save your shipping addresses, manage a wishlist, write product reviews, and access your full order history. Guest checkout is also available if you prefer not to register.",
    category: "Account",
  },
  {
    id: "faq-011",
    question: "I forgot my password. How do I reset it?",
    answer:
      "On the login page, click 'Forgot Password?' and enter the email address associated with your account. You'll receive a password reset link within a few minutes — be sure to check your spam or junk folder if it doesn't appear in your inbox. The reset link is valid for 24 hours. If you signed up using Google or Apple, you'll need to use that sign-in method and reset your password through the respective platform rather than through our site.",
    category: "Account",
  },
  {
    id: "faq-012",
    question: "How do I delete my account and what happens to my data?",
    answer:
      "You can request account deletion at any time from Account Settings > Privacy > Delete Account. We'll send a confirmation email — clicking the link permanently schedules your account for deletion. Your personal data will be removed from our active systems within 30 days, in accordance with applicable data protection regulations. Note that we are legally required to retain certain transactional records (order invoices, payment records) for a statutory period, which are kept in secure archive storage and are not used for any marketing or operational purpose.",
    category: "Account",
  },
]
