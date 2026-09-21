# House of Engineers Pvt. Ltd. — Corporate Web Portal

A modern, performant, and responsive corporate web application for **House of Engineers Pvt. Ltd.**, a premier light-to-medium industrial engineering and custom metal fabrication firm based in Lahore, Punjab, Pakistan.

Built to establish immediate B2B credibility for commercial buyers, factory procurement managers, construction contractors, and residential clients.

---

## 1. System Architecture & Tech Stack

```
house-of-engineers/
├── server/                    # Node.js + Express.js API backend
│   ├── config/
│   │   └── mailer.js          # Nodemailer SMTP transporter & inquiry templates
│   ├── controllers/
│   │   └── contactController.js # Input sanitization, validation & mail dispatch
│   ├── routes/
│   │   └── contactRoutes.js   # /api/health & /api/contact (rate-limited)
│   ├── .env.example           # Environment template
│   ├── package.json           # Express, helmet, cors, express-rate-limit, nodemailer
│   └── server.js              # Express app bootstrap & middleware
├── client/                    # React 18+ (Vite) Single Page Application
│   ├── public/
│   │   └── favicon.svg        # Branded industrial SVG icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Header, brand badge & responsive mobile menu
│   │   │   ├── Footer.jsx         # Dark slate technical footer
│   │   │   ├── ServiceCard.jsx    # Capabilities card with specs preview
│   │   │   ├── PortfolioItem.jsx  # Categorized project item card
│   │   │   ├── ProjectModal.jsx   # Lightbox modal for detailed CAD specs
│   │   │   └── WhatsAppButton.jsx # Floating quick-contact launcher with tooltip
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Hero, metrics, capabilities, value prop & CTA
│   │   │   ├── About.jsx          # Profile, mechanical machinery inventory & coverage
│   │   │   ├── Services.jsx       # 3 divisions: Solar, Machining, Structural
│   │   │   ├── Portfolio.jsx      # Filterable showcase with specs & modal
│   │   │   └── Contact.jsx        # RFQ form, client validation, map & direct channels
│   │   ├── data/
│   │   │   ├── servicesData.js    # Structured engineering specs
│   │   │   └── portfolioData.js   # Documented projects across Punjab
│   │   ├── styles/
│   │   │   └── index.css          # Tailwind directives & CSS design tokens
│   │   ├── App.jsx                # React Router v6 DOM routes
│   │   └── main.jsx               # React DOM root entry
│   ├── index.html                 # Inter font & meta tags
│   ├── tailwind.config.js         # Custom brand colors & sharp geometric cards
│   ├── postcss.config.js
│   ├── vite.config.js             # Vite config with API proxy
│   └── package.json
├── package.json               # Root monorepo orchestration
└── README.md
```

### Technology Highlights
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router DOM v6
- **Backend**: Node.js, Express.js, Helmet, CORS, Express-Rate-Limit, Nodemailer, Validator
- **Design Philosophy**: Minimalist, technical, high-contrast sharp geometric cards (minimal border radius), zero distracting parallax, rapid load times, and mobile-first touch optimization.

---

## 2. Design System & Brand Palette

| Token | Hex Value | Application |
| :--- | :--- | :--- |
| **Primary Corporate Blue** | `#23588f` | Headers, brand anchors, primary trust badges, buttons |
| **Industrial Accent Orange** | `#e48738` | CTAs, quote buttons, highlight indicators, badges |
| **Body Charcoal** | `#4b5156` | High readability text across all devices |
| **Light Background Neutral** | `#f4f6f8` | Section contrast backgrounds and card borders |
| **Pure Surface White** | `#ffffff` | Content cards, data tables, form inputs |
| **Dark Slate Neutral** | `#1e293b` | Hero backdrops, footer, technical dark containers |

---

## 3. Getting Started & Local Development

### Prerequisites
- **Node.js**: v18+ (Tested with Node v24)
- **npm**: v9+ (Tested with npm v11)

### Quick Start
1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```
   *Or install individually in `server/` and `client/`:*
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Configure Environment Variables (Backend)**:
   In `server/`:
   ```bash
   cp .env.example .env
   ```
   *Note: If SMTP credentials (`SMTP_HOST`, `SMTP_USER`, etc.) are left blank, the server automatically operates in safe development logging mode, printing formatted email payloads directly to the terminal.*

3. **Start Development Servers**:
   You can run backend and frontend simultaneously:
   ```bash
   # In terminal 1 (Backend API on http://localhost:5000):
   cd server
   npm run dev

   # In terminal 2 (Frontend Client on http://localhost:5173):
   cd client
   npm run dev
   ```

4. **Open Application**:
   Navigate to [http://localhost:5173](http://localhost:5173). The Vite dev server proxies all `/api/*` requests directly to `http://localhost:5000`.

---

## 4. API Endpoints Specification

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response** `(200 OK)`:
  ```json
  {
    "status": "ok",
    "service": "House of Engineers API",
    "timestamp": "2026-09-21T00:00:00.000Z",
    "uptime": 12.34
  }
  ```

### 2. Contact & Quotation Submission
- **Endpoint**: `POST /api/contact`
- **Rate Limit**: Maximum 5 requests per 15 minutes per IP address.
- **Request Headers**: `Content-Type: application/json`
- **Payload Schema**:
  ```json
  {
    "name": "Engr. Tariq Mahmood",
    "company": "Crescent Mills Ltd.",
    "email": "tariq@crescentmills.com",
    "phone": "+92 300 9876543",
    "service": "Solar Mounting Structures",
    "message": "Require quotation for 300kW elevated rooftop solar mounting frames in Faisalabad.",
    "drawingNote": "CAD drawings uploaded to shared drive."
  }
  ```
- **Success Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "message": "Inquiry received successfully. Our engineering team will review your specifications and respond shortly.",
    "referenceId": "HOE-M0Q8W9Z1"
  }
  ```
- **Error Response** `(400 Bad Request)`:
  ```json
  {
    "success": false,
    "message": "Validation failed. Please review the highlighted errors.",
    "errors": [
      "A valid email address is required.",
      "Please enter a valid phone or WhatsApp number (7-15 digits)."
    ]
  }
  ```

---

## 5. Production Build & Deployment

### Build Client
```bash
cd client
npm run build
```
Generates production-optimized static assets in `client/dist/`.

### Production Server
```bash
cd server
npm start
```

---

## 6. Corporate Contact Details
- **Company**: House of Engineers Pvt. Ltd.
- **Base**: Industrial Area, Lahore, Punjab, Pakistan
- **Procurement & Estimating**: +92 300 123 4567
- **Official Inquiries**: info@houseofengineers.pk / procurement@houseofengineers.pk
- **Service Coverage**: Turnkey delivery and installation teams available throughout Punjab (Lahore, Faisalabad, Gujranwala, Sialkot, Sheikhupura, Multan, Rawalpindi).
