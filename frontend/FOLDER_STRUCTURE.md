# Complete Folder Structure

```
frontend/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── next.config.js            # Next.js configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── jsconfig.json             # JavaScript path aliases
│   ├── .eslintrc.json            # ESLint configuration
│   ├── .gitignore                # Git ignore rules
│   ├── .env.local                # Environment variables
│   ├── README.md                 # Project documentation
│   ├── SETUP_GUIDE.md            # Setup instructions
│   └── FOLDER_STRUCTURE.md       # This file
│
├── 📁 src/
│   │
│   ├── 📁 app/                   # Next.js App Router Pages
│   │   │
│   │   ├── layout.jsx            # Root layout (Header + Footer)
│   │   ├── page.jsx              # Home / Landing page
│   │   │
│   │   ├── 📁 about-us/
│   │   │   └── page.jsx          # About Us page
│   │   │
│   │   ├── 📁 our-services/
│   │   │   └── page.jsx          # Services page
│   │   │
│   │   ├── 📁 login/             # Login pages for 3 user types
│   │   │   ├── 📁 farmer-login/
│   │   │   │   └── page.jsx      # Farmer login page
│   │   │   ├── 📁 customer-login/
│   │   │   │   └── page.jsx      # Customer login page
│   │   │   └── 📁 transport-login/
│   │   │       └── page.jsx      # Transport login page
│   │   │
│   │   ├── 📁 product-list/
│   │   │   └── page.jsx          # Product listing page
│   │   │
│   │   ├── 📁 user-instructions/
│   │   │   └── page.jsx          # User guide page
│   │   │
│   │   ├── 📁 faq/
│   │   │   └── page.jsx          # FAQ page
│   │   │
│   │   └── 📁 contact-us/
│   │       └── page.jsx          # Contact form page
│   │
│   ├── 📁 components/            # Reusable UI Components
│   │   ├── Header.jsx            # Site header with logo
│   │   ├── Footer.jsx            # Site footer with links
│   │   └── Navbar.jsx            # Navigation menu (responsive)
│   │
│   └── 📁 styles/                # Styling
│       └── globals.css           # Global styles + Tailwind directives
│
└── 📁 public/                    # Static Assets
    ├── favicon.ico               # Site favicon
    └── 📁 images/
        ├── 📁 background/        # Background images
        ├── 📁 icons/             # Icon images
        └── 📁 banners/           # Banner images
```

## Page Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.jsx` | Home page |
| `/about-us` | `src/app/about-us/page.jsx` | About Us |
| `/our-services` | `src/app/our-services/page.jsx` | Services |
| `/login/farmer-login` | `src/app/login/farmer-login/page.jsx` | Farmer Login |
| `/login/customer-login` | `src/app/login/customer-login/page.jsx` | Customer Login |
| `/login/transport-login` | `src/app/login/transport-login/page.jsx` | Transport Login |
| `/product-list` | `src/app/product-list/page.jsx` | Products |
| `/user-instructions` | `src/app/user-instructions/page.jsx` | Instructions |
| `/faq` | `src/app/faq/page.jsx` | FAQ |
| `/contact-us` | `src/app/contact-us/page.jsx` | Contact |

## Component Usage

All pages automatically include:
- **Header** (with Navbar) - Defined in `layout.jsx`
- **Footer** - Defined in `layout.jsx`

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (.jsx files)
- **Styling**: Tailwind CSS
- **UI**: React 18
- **Package Manager**: npm

## File Naming Convention

- ✅ All React components use `.jsx` extension
- ✅ Page files are named `page.jsx`
- ✅ Layout files are named `layout.jsx`
- ✅ Component files use PascalCase (e.g., `Header.jsx`)
- ✅ Config files use kebab-case (e.g., `next.config.js`)

## Color Scheme

- **Primary** (Green): Farmer-related features
- **Secondary** (Blue): Customer-related features
- **Accent** (Amber): Transport-related features

## Total Files Created

- **Configuration**: 8 files
- **Pages**: 10 files
- **Components**: 3 files
- **Styles**: 1 file
- **Documentation**: 3 files
- **Total**: 25+ files

