# Chena Frontend Setup Guide

## Quick Start

Follow these steps to get your Next.js frontend running:

### Step 1: Install Dependencies

Open your terminal in the `frontend` directory and run:

```bash
cd frontend
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Tailwind CSS
- PostCSS & Autoprefixer

### Step 2: Start Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

### Step 3: Verify Installation

Open your browser and navigate to:
- Home: http://localhost:3000
- About Us: http://localhost:3000/about-us
- Farmer Login: http://localhost:3000/login/farmer-login
- Customer Login: http://localhost:3000/login/customer-login
- Transport Login: http://localhost:3000/login/transport-login
- Products: http://localhost:3000/product-list
- FAQ: http://localhost:3000/faq
- Contact: http://localhost:3000/contact-us

## Project Structure Overview

```
frontend/
├── src/
│   ├── app/                          # Next.js pages (App Router)
│   │   ├── page.jsx                  # Home page
│   │   ├── layout.jsx                # Root layout with Header/Footer
│   │   ├── about-us/page.jsx
│   │   ├── our-services/page.jsx
│   │   ├── login/
│   │   │   ├── farmer-login/page.jsx
│   │   │   ├── customer-login/page.jsx
│   │   │   └── transport-login/page.jsx
│   │   ├── product-list/page.jsx
│   │   ├── user-instructions/page.jsx
│   │   ├── faq/page.jsx
│   │   └── contact-us/page.jsx
│   │
│   ├── components/                   # Reusable components
│   │   ├── Header.jsx                # Site header
│   │   ├── Footer.jsx                # Site footer
│   │   └── Navbar.jsx                # Navigation menu
│   │
│   └── styles/
│       └── globals.css               # Global styles with Tailwind
│
├── public/                           # Static assets
│   └── images/
│       ├── background/
│       ├── icons/
│       └── banners/
│
├── Configuration Files:
├── package.json                      # Dependencies
├── next.config.js                    # Next.js config
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.js                 # PostCSS config
├── jsconfig.json                     # Path aliases
└── .env.local                        # Environment variables
```

## Key Features

✅ **No TypeScript** - All files use `.jsx` extension
✅ **Tailwind CSS** - Utility-first CSS framework
✅ **Responsive Design** - Mobile-friendly layouts
✅ **Three User Types** - Farmer, Customer, Transport
✅ **Modern Next.js** - App Router (Next.js 14)

## Customization

### Colors (tailwind.config.js)

The project uses custom colors:
- `primary`: Green (#10b981) - For farmers
- `secondary`: Blue (#3b82f6) - For customers
- `accent`: Amber (#f59e0b) - For transport

### Path Aliases (jsconfig.json)

You can import using aliases:
```javascript
import Header from '@/components/Header'
import '@/styles/globals.css'
```

### Environment Variables (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Next.js will automatically use the next available port.

### Module Not Found
Run `npm install` again to ensure all dependencies are installed.

### Tailwind Styles Not Working
Make sure `globals.css` is imported in `layout.jsx`.

## Next Steps

1. ✅ Install dependencies
2. ✅ Start development server
3. 🔄 Connect to backend API (update .env.local)
4. 🔄 Add authentication logic
5. 🔄 Implement API calls
6. 🔄 Add more features as needed

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

