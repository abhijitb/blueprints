# Hiive Blueprints Browser

A modern web application for browsing and previewing website templates and blueprints. Built with Next.js 15, React 19, and TypeScript, this application provides an intuitive interface for exploring various website templates with live previews and download capabilities.

## 🚀 Features

- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Grid & List Views** - Switch between different viewing modes for optimal browsing
- **🔍 Search & Filter** - Find templates by name and filter by type (business, ecommerce, personal)
- **👁️ Live Preview** - Full-screen modal preview with embedded iframe
- **⬇️ Download Links** - Direct access to template resources

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.5.2](https://nextjs.org/) with App Router
- **Frontend**: [React 19.1.0](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4.17](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: Next.js built-in bundler
- **Linting**: ESLint with Next.js configuration
- **Font Optimization**: `next/font` with Geist fonts

## 📋 Prerequisites

- Node.js (version compatible with Next.js 15)
- npm, yarn, pnpm, or bun

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhijitb/blueprints.git
   cd blueprints
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🏗️ Project Structure

```
blueprints/
├── src/app/
│   ├── globals.css      # Global styles with Tailwind directives
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main blueprints browser page
├── public/              # Static assets (currently empty)
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── postcss.config.mjs   # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
├── eslint.config.mjs    # ESLint configuration
└── package.json         # Dependencies and scripts
```

## 🔧 Configuration

### Image Domains
The application is configured to load images from external CDN domains:
- `patterns.hiive.cloud` - API domain
- `bh-wp-onboarding.sfo3.cdn.digitaloceanspaces.com` - Image CDN

### Tailwind CSS
Using Tailwind CSS v3.4.17 with PostCSS for styling. Custom configuration includes:
- Custom color variables
- Font family configuration for Geist fonts
- Responsive design utilities

## 📡 API Integration

The application fetches blueprint data from:
```
https://patterns.hiive.cloud/api/v1/blueprints
```

Expected API response structure:
```typescript
interface Blueprint {
  name: string;
  slug: string;
  type: string;
  preview_url: string;
  screenshot_url: string;
  resources_url: string;
}
```

## 🚀 Deployment

### Vercel (Recommended)
The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Deploy with zero configuration

### Other Platforms
For other deployment platforms:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```
---

*Built with ❤️ using Next.js and modern web technologies*
