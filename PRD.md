# Elite Cooling — Product Requirements Document
## AC Service & Repair Platform (Production Ready v1.0)

---

## 1. Overview

**Product Name**: Elite Cooling  
**Tagline**: *Premium AC Service at Your Doorstep*  
**Target Market**: Ahmedabad, Gujarat (India)  
**Business Model**: Service marketplace — technicians provide AC repair/cleaning/installation at customer homes.  

### 1.1 Goal
Build a professional, conversion-optimized website for booking AC services online + via WhatsApp, with optional Stripe payment integration for prepaid bookings.

### 1.2 Success Metrics
- Booking conversion rate > 5%
- Page load time < 3 seconds
- Mobile responsiveness 100%
- WhatsApp booking opens in native app on mobile

---

## 2. Features

### 2.1 Website Sections (Frontend)
| Section | Purpose | Status |
|---------|---------|--------|
| **Hero** | CTA + trust badges + hero image | ✅ Ready |
| **Brands Bar** | Trusted brands marquee (Daikin, LG, Samsung, etc.) | ✅ Ready |
| **Trust Stats** | Animated counters (5000+ services, 4.9 rating, etc.) | ✅ Ready |
| **Services (18+)** | Service tiles with image, price, CTA | ✅ Ready |
| **How It Works** | 4-step process (Choose → Book → Technician → Done) | ✅ Ready |
| **Pricing Cards** | 3 featured plans (Service Check ₹349, Deep Cleaning ₹599, Installation ₹1,299) | ✅ Ready |
| **Testimonials** | Customer reviews with star ratings | ✅ Ready |
| **FAQ Accordion** | 6 common questions | ✅ Ready |
| **Booking Form** | Name, Phone (10 digit), Service dropdown, Date, Address + Location picker | ✅ Ready |
| **Sticky Mobile CTA** | Bottom bar on mobile for quick call/book | ✅ Ready |
| **Footer** | Contact info, service areas, social links | ✅ Ready |

### 2.2 Core Functionality
| Feature | Description | Status |
|---------|-------------|--------|
| **WhatsApp Booking** | Form data → WhatsApp message with customer details + location map | ✅ Ready |
| **Stripe Payment** | "Pay Securely & Book Online" button → Stripe Checkout → success page | ✅ Ready |
| **Geolocation** | "Use Current Location" → fetch lat/lng → reverse geocode to address | ✅ Ready |
| **Mobile WhatsApp App** | Mobile pe direct WhatsApp app open (api.whatsapp.com), desktop pe web (wa.me) | ✅ Ready |
| **Admin Panel** | Dashboard to view bookings, technicians, services, reviews | ✅ Ready |

### 2.3 Admin Panel
| Feature | Description | Status |
|---------|-------------|--------|
| **Login** | Simple password protection | ✅ Ready |
| **Dashboard** | Summary cards (total bookings, technicians, etc.) | ✅ Ready |
| **Bookings CRUD** | View all bookings, update status, delete | ✅ Ready |
| **Technicians CRUD** | Add/edit/remove technicians | ✅ Ready |
| **Services CRUD** | Manage service listings | ✅ Ready |
| **Reviews CRUD** | Moderate customer reviews | ✅ Ready |

---

## 3. Tech Stack

### 3.1 Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup |
| CSS3 | Custom properties, flexbox, grid, animations |
| Vanilla JavaScript | Interactions, API calls, form handling |
| Font Awesome 6.5 | Icons |
| Google Fonts (Inter) | Typography |

### 3.2 Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| Stripe SDK v15 | Payment processing |
| dotenv | Environment variables |
| CORS | Cross-origin requests |

### 3.3 Database
| Technology | Purpose |
|------------|---------|
| JSON File (db.json) | Simple file-based storage for MVP |

### 3.4 Deployment
| Platform | Purpose |
|----------|---------|
| Render.com | Free Node.js hosting (backend + frontend) |
| GitHub | Source code management |

---

## 4. Pages

### 4.1 `index.html` (Main Website)
- Responsive design (mobile-first)
- 18 AC service options in dropdown
- 10-digit phone validation (`pattern="[0-9]{10}"`)
- 2 CTA buttons: WhatsApp Book + Pay Online
- SEO meta tags + Schema.org structured data

### 4.2 `payment-success.html`
- Payment confirmation page
- Order details (service, amount, transaction ID)
- WhatsApp confirmation button
- Back to home button

### 4.3 `admin.html`
- Protected admin dashboard
- Login screen → Dashboard
- Tables for all resources with CRUD operations

---

## 5. API Endpoints

### 5.1 Public APIs (No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/services` | Active services list |
| GET | `/api/public/technicians` | Active technicians |
| GET | `/api/public/reviews` | Visible reviews |
| POST | `/api/public/bookings` | Create new booking |
| POST | `/api/create-checkout-session` | Stripe checkout session |

### 5.2 Admin APIs (Basic Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/:resource` | List all items |
| POST | `/api/admin/:resource` | Create item |
| PUT | `/api/admin/:resource/:id` | Update item |
| DELETE | `/api/admin/:resource/:id` | Delete item |
| GET | `/api/admin/summary` | Dashboard counts |

---

## 6. Stripe Integration

### 6.1 Service Prices (INR — in paise)
| Service | Amount (₹) | Stripe Amount (paise) |
|---------|-----------|----------------------|
| AC Service & Repair | 349 | 34900 |
| AC Installation | 1,299 | 129900 |
| AC Gas Refill | 2,199 | 219900 |
| AC Deep Cleaning | 599 | 59900 |
| Annual Maintenance (AMC) | 2,999 | 299900 |
| AC Uninstallation | 499 | 49900 |
| AC Not Cooling Repair | 549 | 54900 |
| AC Water Leakage Repair | 399 | 39900 |
| AC Noise / Vibration Fix | 449 | 44900 |
| AC Compressor Repair | 1,499 | 149900 |
| AC PCB / Circuit Repair | 1,199 | 119900 |
| AC Fan Motor Replacement | 899 | 89900 |
| AC Gas Leak Detection | 649 | 64900 |
| AC Shifting / Relocation | 1,799 | 179900 |
| AC Copper Pipe Fitting | 150/m | 15000 |
| AC Power Issue Repair | 349 | 34900 |
| AC Thermostat / Sensor Fix | 499 | 49900 |
| AC Remote + Display Repair | 299 | 29900 |

### 6.2 Payment Flow
1. User fills booking form → clicks "Pay Securely & Book Online"
2. Frontend sends POST to `/api/create-checkout-session` with form data
3. Backend creates Stripe Checkout Session with `metadata`
4. Backend returns `{ url: session.url }`
5. Frontend redirects to Stripe hosted checkout page
6. **Success** → `payment-success.html?session_id=xxx`
7. **Cancel** → `index.html#booking`

### 6.3 Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
# or sk_live_... for production
```

---

## 7. WhatsApp Integration

### 7.1 Message Template
```
ELITE COOLING - NEW BOOKING

Name: {name}
Phone: {phone}
Service: {service}
Preferred Date: {date}
Address: {address}
Map Link: https://www.google.com/maps?q={lat},{lng}

(Sent via EliteCooling.com)
```

### 7.2 Mobile vs Desktop
| Device | Behavior |
|--------|----------|
| Mobile (Android/iOS) | `api.whatsapp.com/send` → opens WhatsApp app |
| Desktop | `wa.me/{number}` → opens WhatsApp Web in new tab |

---

## 8. File Structure

```
elite-cooling-solution/
├── index.html              # Main website
├── style.css               # Main styles (blue theme)
├── script.js               # Frontend logic
├── server.js               # Express backend
├── package.json            # Dependencies
├── env.example             # Stripe key template
├── netlify.toml            # Static hosting config
├── payment-success.html    # Stripe success page
├── admin.html              # Admin panel
├── admin.css               # Admin styles
├── admin.js                # Admin logic
├── data/
│   └── db.json             # Local database
├── assets/
│   ├── hero.png            # Hero image (modern living room with AC)
│   ├── ac-unit.png         # AC unit image
│   ├── casste-ac.png       # Cassette AC image
│   └── spilit-ac.png       # Split AC image
└── PRD.md                  # This document
```

---

## 9. Deployment Checklist

### 9.1 Pre-Deploy
- [ ] All image references updated to new filenames
- [ ] No broken links or 404s
- [ ] Mobile responsiveness tested
- [ ] Form validation working (10-digit phone)
- [ ] WhatsApp opens in app on mobile
- [ ] Stripe test key working

### 9.2 Deploy Steps
1. Create GitHub repo → push code
2. Sign up on Render.com (GitHub login)
3. New Web Service → connect GitHub repo
4. Set environment variable: `STRIPE_SECRET_KEY`
5. Deploy → get live URL

### 9.3 Post-Deploy
- [ ] Test WhatsApp booking on mobile
- [ ] Test Stripe payment (test mode)
- [ ] Test geolocation feature
- [ ] Verify admin panel access
- [ ] Add custom domain (optional)

---

## 10. Future Roadmap

| Feature | Priority | Timeline |
|---------|----------|----------|
| Custom domain (elitecooling.in) | High | Week 1 |
| Technician mobile app | Medium | Month 1 |
| SMS notifications (Twilio) | Medium | Month 1 |
| Customer login + booking history | Medium | Month 2 |
| Real-time technician tracking | Low | Month 3 |
| Multi-city expansion | Low | Month 6 |

---

## 11. Contact & Support

- **Business Phone**: +91-91069-15331
- **WhatsApp**: +91-91069-15331
- **Service Area**: Ahmedabad, Gujarat
- **Hours**: 8 AM – 10 PM (All days)

---

**Document Version**: 1.0  
**Last Updated**: May 8, 2026  
**Author**: Elite Cooling Dev Team
