# Elite Cooling Solution

Premium AC Services landing page for Rajasthan.

## Live Demo

Open `index.html` in any modern browser, or deploy to Netlify / Vercel / GitHub Pages.

## Project Structure

```
elite-cooling-solution/
├── index.html          # Main landing page
├── style.css           # Production styles (dark theme)
├── script.js           # Production scripts (particles, animations, WhatsApp form)
├── assets/
│   ├── Ac.png.png
│   ├── Spilit Ac.png
│   ├── casste ac.png
│   ├── Technician.png.jpeg
│   └── hero.png
└── README.md
```

## What was fixed for production

- Extracted inline CSS into `style.css`
- Extracted inline JS into `script.js` with `defer`
- Added Open Graph & Twitter Card meta tags
- Added favicon link
- Added `preconnect` hints for faster font/CDN loading
- Added missing `.btn-primary` / `.btn-outline` CSS definitions
- Added `loading="lazy"` to below-fold images
- Added accessibility `:focus-visible` styles
- Added responsive footer & expert section fixes

## Deployment

This is a static site with an optional backend API. You can deploy it anywhere, or run it locally with Node.js.

### Run locally

1. Open a terminal in the project folder
2. Run `npm install`
3. Run `npm start`
4. Open `http://localhost:3000`

### Deploy

- **Netlify**: Drag & drop the folder for static hosting (API requires a server)
- **Vercel**: `npx vercel --prod`
- **GitHub Pages**: Push to a repo and enable Pages (static only)

## Contact

- Phone: +91 91069 15331
- Location: Ahmedabad, Gujarat
- Email: info@elitecooling.com
