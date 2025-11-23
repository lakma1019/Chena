# Chena Frontend - Next.js Application

This is the frontend application for the Chena agricultural platform built with Next.js and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.jsx            # Home page
│   │   ├── layout.jsx          # Root layout
│   │   ├── about-us/
│   │   ├── our-services/
│   │   ├── login/
│   │   │   ├── farmer-login/
│   │   │   ├── customer-login/
│   │   │   └── transport-login/
│   │   ├── product-list/
│   │   ├── user-instructions/
│   │   ├── faq/
│   │   └── contact-us/
│   ├── components/             # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   └── styles/                 # Global styles
│       └── globals.css
├── public/                     # Static assets
│   └── images/
├── package.json
├── next.config.js
├── tailwind.config.js
└── jsconfig.json
```

## Features

- ✅ Next.js 14 with App Router
- ✅ Tailwind CSS for styling
- ✅ Responsive design
- ✅ JSX (JavaScript, not TypeScript)
- ✅ Three user types: Farmer, Customer, Transport
- ✅ Product listing and search
- ✅ Contact forms
- ✅ FAQ section

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

