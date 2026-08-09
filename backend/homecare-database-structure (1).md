# Home Care Platform — Database Structure (MongoDB)

Database: MongoDB Atlas
Style: one collection per entity, referenced by ObjectId (not deeply embedded), so the office dashboard can query/filter each entity independently.

---

## 1. customers

```js
{
  _id: ObjectId,
  name: String,
  phone: String,             // unique, indexed — primary login/lookup key across ALL channels
  email: String,
  otpVerified: Boolean,      // false until the customer actually logs in via OTP on the website
  registrationChannel: String, // "website" | "call" | "whatsapp" | "facebook" | "instagram"
  addresses: [
    {
      label: String,        // "Home", "Office"
      addressText: String,
      lat: Number,
      lng: Number,
      placeId: String
    }
  ],
  totalBilling: Number,     // running total, updated on invoice payment
  feedbackAvg: Number,
  documents: [ { name: String, url: String } ],
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `phone` (unique), `addresses.location` (2dsphere, for map + nearest-partner queries)

### Handling a call-in enquiry (customer not yet in the database)

This is the common case you flagged — someone calls in and has never touched the website. The fix is to **upsert the customer record by phone at the moment the office worker logs the call**, rather than leaving the enquiry pointing at nothing:

1. Office worker takes the call, types in name + phone in the "Create enquiry → Call" form.
2. Backend runs `findOrCreate` on `customers` by `phone`:
   - **Match found** → reuse that `_id`, don't touch `otpVerified`.
   - **No match** → create a new `customers` doc with `otpVerified: false`, `registrationChannel: "call"`, `name`/`phone` from the call. No OTP needed yet — the office worker vouches for the contact, not the customer themself.
3. The new/found `customerId` is attached to the `enquiries` doc immediately, so every downstream collection (tickets, estimates, invoices) has a real reference from the start — no nullable-customer edge cases to handle later in the pipeline.
4. If that same person later visits the website and OTP-verifies with the same phone number, it's the same document — `otpVerified` flips to `true` and their call history is already attached. `phone` being unique is what makes this dedupe work.

The one place `customerId` genuinely stays `null` for a while is an **FB/IG bot lead before the bot has captured a phone number** — that's a `conversations` doc with no linked customer yet (see §11). The moment the bot gets a phone number, the same upsert-by-phone logic runs and the conversation gets linked.

---

## 2. enquiries

Entry point for every channel — website, call, WhatsApp, Facebook, Instagram.

```js
{
  _id: ObjectId,
  customerId: ObjectId,        // ref: customers — set via upsert-by-phone at creation time (see §1); nullable only for pre-phone bot leads
  source: String,               // "website" | "call" | "whatsapp" | "facebook" | "instagram"
  serviceCategory: String,
  description: String,
  status: String,               // "new" | "contacted" | "qualified" | "converted" | "dropped"
  assignedTo: ObjectId,         // ref: employees
  internalNotes: [
    { text: String, employeeId: ObjectId, timestamp: Date }
  ],
  linkedConversationId: ObjectId, // ref: conversations, if from FB/IG/WA bot
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `status + source` (compound, for dashboard filters), `customerId`, `createdAt`

---

## 3. tickets

Created once the office worker calls back and confirms the job.

```js
{
  _id: ObjectId,
  ticketNumber: String,        // unique, human-readable e.g. "TCK-2026-0042"
  enquiryId: ObjectId,         // ref: enquiries
  customerId: ObjectId,        // ref: customers
  status: String,               // "open" | "estimate_sent" | "approved" | "assigned" | "in_progress" | "completed" | "closed"
  priority: String,             // "low" | "normal" | "high"
  assignedPartnerId: ObjectId, // ref: servicePartners
  timeline: [
    { status: String, timestamp: Date, byEmployeeId: ObjectId }
  ],
  internalNotes: [
    { text: String, employeeId: ObjectId, timestamp: Date }
  ],
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `ticketNumber` (unique), `status`, `assignedPartnerId`, `customerId`

---

## 4. estimates

```js
{
  _id: ObjectId,
  ticketId: ObjectId,          // ref: tickets
  lineItems: [
    { serviceId: ObjectId, name: String, qty: Number, price: Number }
  ],
  visitCharges: Number,
  discount: Number,
  total: Number,
  approvalStatus: String,       // "pending" | "approved" | "rejected"
  acceptedTerms: {              // snapshot of what the customer agreed to — see §15
    termsId: ObjectId,          // ref: termsAndConditions
    version: Number,
    acceptedAt: Date
  },
  pdfUrl: String,
  createdBy: ObjectId,          // ref: employees
  createdAt: Date
}
```
Indexes: `ticketId`

---

## 5. invoices

```js
{
  _id: ObjectId,
  ticketId: ObjectId,           // ref: tickets
  invoiceNumber: String,        // unique
  lineItems: [
    { serviceId: ObjectId, name: String, qty: Number, price: Number }
  ],
  tax: Number,
  discount: Number,
  total: Number,
  paymentStatus: String,        // "unpaid" | "partial" | "paid"
  pdfUrl: String,
  sentViaWhatsApp: Boolean,
  createdAt: Date
}
```
Indexes: `invoiceNumber` (unique), `ticketId`, `paymentStatus`

---

## 6. payments

```js
{
  _id: ObjectId,
  invoiceId: ObjectId,          // ref: invoices
  method: String,                // "cash" | "upi" | "razorpay"
  amount: Number,
  status: String,                // "pending" | "verified" | "failed"
  razorpayTxnId: String,
  verifiedBy: ObjectId,          // ref: employees (for cash/UPI)
  createdAt: Date
}
```
Indexes: `invoiceId`

---

## 7. categories

```js
{
  _id: ObjectId,
  name: String,
  description: String,
  active: Boolean
}
```

## 8. services

```js
{
  _id: ObjectId,
  categoryId: ObjectId,          // ref: categories
  name: String,
  description: String,
  images: [String],
  basePrice: Number,
  visitCharges: Number,
  active: Boolean
}
```
Indexes: `categoryId`

---

## 9. servicePartners

```js
{
  _id: ObjectId,
  name: String,
  phone: String,
  skills: [String],
  documents: [ { name: String, url: String } ],
  availability: { days: [String], hours: String },
  jobHistory: [ObjectId],        // ref: tickets
  avgRating: Number,
  active: Boolean
}
```
Indexes: `skills`, `phone` (unique)

---

## 10. employees

```js
{
  _id: ObjectId,
  name: String,
  email: String,                 // unique
  passwordHash: String,
  role: String,                   // "super_admin" | "ops_executive" | "support_billing" | "marketing" | "investor"
  permissions: [String],
  active: Boolean,
  createdAt: Date
}
```
Indexes: `email` (unique)

---

## 11. conversations

Unified inbox record — every WhatsApp/Facebook/Instagram thread, bot or human.

```js
{
  _id: ObjectId,
  customerId: ObjectId,          // ref: customers, nullable until the bot captures a phone number
  channel: String,                // "whatsapp" | "facebook" | "instagram"
  externalThreadId: String,       // platform's own conversation/thread id
  messages: [
    { from: String, text: String, timestamp: Date }   // from: "bot" | "customer" | "employee"
  ],
  linkedEnquiryId: ObjectId,      // ref: enquiries
  status: String,                  // "bot_active" | "awaiting_human" | "human_active" | "resolved"
  updatedAt: Date
}
```
Indexes: `channel + externalThreadId` (compound, unique), `status`

---

## 12. feedback

```js
{
  _id: ObjectId,
  ticketId: ObjectId,             // ref: tickets
  customerId: ObjectId,           // ref: customers
  rating: Number,                  // 1-5
  comment: String,
  createdAt: Date
}
```
Indexes: `ticketId`

---

## 13. notifications

```js
{
  _id: ObjectId,
  recipientType: String,           // "customer" | "employee"
  recipientId: ObjectId,
  type: String,                     // "enquiry_received" | "booking_confirmed" | "invoice_generated" | ...
  message: String,
  channel: String,                  // "whatsapp" | "email" | "in_app"
  status: String,                   // "queued" | "sent" | "failed"
  sentAt: Date
}
```
Indexes: `recipientId + status`

---

## 14. settings

Single-document (or small) collection for company-wide config.

```js
{
  _id: ObjectId,
  companyName: String,
  logoUrl: String,
  invoiceSettings: { prefix: String, taxRate: Number },
  whatsappSettings: { apiKey: String, phoneNumberId: String },
  paymentSettings: { razorpayKeyId: String },
  updatedAt: Date
}
```

---

## 15. termsAndConditions

Each service **category** (AC repair, plumbing, cleaning, etc.) gets its own terms — warranty period, cancellation policy, and liability limits genuinely differ between a plumbing job and a cleaning job, so this isn't one global T&C document.

```js
{
  _id: ObjectId,
  categoryId: ObjectId,        // ref: categories
  version: Number,             // increments on every edit — never overwrite an old version
  title: String,               // "AC Repair & Service — Terms"
  content: String,             // markdown or rich text
  effectiveFrom: Date,
  active: Boolean,              // only one active version per category at a time
  createdBy: ObjectId,          // ref: employees
  createdAt: Date
}
```
Indexes: `categoryId + active` (fast lookup of the current version), `categoryId + version` (unique compound, for history)

**Why versioned instead of a flat field on `categories`:** terms change over time (say, you shorten the workmanship warranty from 30 to 15 days). If you overwrite the text in place, you lose proof of what a customer actually agreed to on a job from three months ago. Versioning plus the `acceptedTerms` snapshot on `estimates` (§4) gives you an audit trail: "customer approved estimate X, which was governed by AC Repair terms v3, accepted at 14:02 on 12 Aug."

---

## Relationship summary

```
customers  1───N  enquiries          (via upsert-by-phone, works for call/website/bot alike)
enquiries  1───1  tickets            (converts to, once callback confirms)
tickets    1───N  estimates
tickets    1───N  invoices
invoices   1───N  payments
tickets    N───1  servicePartners    (assignedPartnerId)
tickets    1───1  feedback
estimates  N───N  services           (via lineItems)
estimates  N───1  termsAndConditions (via acceptedTerms — snapshot at approval time)
invoices   N───N  services           (via lineItems)
services   N───1  categories
categories 1───N  termsAndConditions (versioned, one active at a time)
customers  1───N  conversations
conversations 1───1  enquiries       (linkedEnquiryId, when bot creates a lead)
```

## Design notes

- **Reference, don't embed, across entities that grow independently.** Tickets, estimates, and invoices are separate collections rather than nested arrays inside `customers`, since each has its own status lifecycle, PDF generation, and reporting needs.
- **`ticketNumber` and `invoiceNumber` are separate from `_id`** — human-readable sequential IDs for staff and customer-facing PDFs, while `_id` stays the internal reference key.
- **`conversations` is the bridge for your FB/IG bot requirement** — a bot-created lead lives here first, then `linkedEnquiryId` connects it to a formal enquiry once the bot captures name/phone/service, which is what lets the office team's callback-and-confirm flow take over.
- **Every enquiry gets a real `customerId` from the moment it's created**, including call-ins, via upsert-by-phone on `customers` (§1). This keeps `tickets`, `estimates`, and `invoices` free of null-customer edge cases — the only genuinely nullable case is a bot conversation before a phone number is captured.
- **Terms & conditions are versioned per category, not global** — see §15 for why, and note the `acceptedTerms` snapshot on `estimates` that records exactly which version a customer approved.
- **Denormalize sparingly for dashboard speed** — e.g. store `customerName` and `phone` directly on `tickets` (in addition to `customerId`) if the ticket list view needs to render fast without a join on every row; keep the source of truth in `customers`.
