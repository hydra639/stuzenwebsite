# Stuzen Technologies Official Corporate Website

Production React frontend for the **STUZEN TECHNOLOGIES** corporate website, built on the approved
blue-and-white design system.

---

## 🚀 Technology Stack

- **Framework**: React.js 18
- **Bundler & Dev Server**: Vite 6
- **Routing**: React Router DOM 6
- **Styling**: Tailwind CSS 3 & CSS3 design tokens
- **Icons**: Lucide React
- **Typography**: Manrope (headings), Inter (body & labels), Orbitron (brand accents)

---

## 📄 Implemented Pages & Routes

| Route | Page Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Corporate landing page with capability grid, industries, delivery approach, security section and conversion CTA |
| `/about` | `About.jsx` | Company philosophy, mission & vision, guiding principles and practice matrix |
| `/services` | `Services.jsx` | Nine-service capability catalogue, flagship solutions, delivery model and engagement comparison |
| `/services/website-development` | `ServiceDetail.jsx` | Web engineering detail: highlights, delivery blueprint, capabilities, process, stack and FAQs |
| `/services/secure-website-building` | `ServiceDetail.jsx` | Security-conscious website delivery with 13 highlighted security practices, process and honest disclaimers |
| `/services/custom-software` | `ServiceDetail.jsx` | Custom software engineering detail with comparison, solution domains, lifecycle and FAQs |
| `/services/ai-automation` | `ServiceDetail.jsx` | AI and automation detail with practical use cases, delivery phases and FAQs |
| `/industries` | `Industries.jsx` | Sector-aware delivery across healthcare, education, retail, manufacturing, travel, finance, startups and enterprise |
| `/contact` | `Contact.jsx` | Genuine contact channels and validated project enquiry form (frontend simulation only) |

Legacy `/welcome` and `/portfolio` URLs redirect to `/` so old bookmarks do not break.

---

## 🔎 SEO

- Per-route title, meta description, canonical URL, Open Graph and Twitter metadata via `PageMeta`.
- Central SEO configuration and canonical base URL in `src/data/site.js`.
- Organization, WebSite, Service, FAQPage, BreadcrumbList and page-type JSON-LD.
- `public/sitemap.xml` and `public/robots.txt`.
- Service-area copy targeting Salem, Chennai, Bangalore, Tamil Nadu and India.
- Semantic headings, descriptive alt text and internal linking across services and industries.

> The site is a client-rendered SPA. Google renders JavaScript, but for maximum non-JS crawlability
> (social previews, some crawlers) a prerender/SSG step would be a future enhancement. Set `SITE_URL`
> in `src/data/site.js` if production uses a different domain.

---

## ✨ Entry Loader

`src/components/SiteLoader.jsx` provides a lightweight, session-scoped entry loader:

- Shows once per browser session (`stuzen-entry-loader-shown`), never on internal navigation.
- Auto-dismisses after 1.5 seconds with a 420 ms fade; reduced-motion path uses 550 ms.
- 5-second fail-safe, graceful logo/storage error handling.
- Renders above the already-mounted page, so content remains crawlable and usable.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

> **Windows quick start:** double-click `start.cmd` in the project root. It installs dependencies if needed and starts the Vite dev server.

> **PowerShell says `npm.ps1 cannot be loaded because running scripts is disabled`?** Use `cmd /c "npm run dev"` instead, run the command from Command Prompt, or use `start.cmd`.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

### 5. Open the split offline edition
```bash
npm run build:offline
```
Then double-click **`offline/STUZEN-Website/index.html`**.

The offline edition keeps the code in separate, readable files:

| File | Contents |
|---|---|
| `index.html` | Page structure and metadata |
| `styles.css` | All styles plus the embedded webfonts |
| `app.js` | Application code (a classic deferred script, not an ES module) |
| `assets/` | Images used by the pages |

It uses hash-based routing so every page works from `file://` without a server:
`index.html#/about`, `index.html#/services/secure-website-building`, and so on.
The classic script is intentional — browsers block ES modules opened directly from
`file://`. It is a local preview only; the normal `npm run build` output and deployed
site are unchanged.

---

## ☁️ Deploying to Netlify

The production build is a static site in `dist`.

1. Run `npm run build`.
2. Drag the `dist` folder onto **https://app.netlify.com/drop**.
3. Netlify reads `public/_redirects` for the SPA fallback and legacy 301 redirects.
4. `public/_headers` adds sensible security and asset-cache headers.
5. `netlify.toml` provides the build command, publish directory and Node version for Git-based deploys.

Routes such as `/about` and `/services/secure-website-building` work on refresh because
Netlify rewrites unknown paths to `index.html`. `/portfolio` and `/welcome` return 301 to `/`.

> The canonical URL is `https://stuzen.com`. If the site is first published on a Netlify
> subdomain, keep it out of search results (preview/noindex) until the real domain is connected,
> or update the URL in `src/data/site.js`, `index.html`, `public/robots.txt` and `public/sitemap.xml`.

For genuine contact-form delivery, connect Formspree, EmailJS, Netlify Forms or a backend;
the current form remains a frontend simulation.

---

## 🖼️ Visual Assets

All page imagery is bundled locally in `src/assets/visuals` as lightweight SVG artwork, so the site
renders correctly offline and never depends on third-party image hosts. Decorative dashboard
illustrations use abstract labels rather than invented performance scores or certifications.

---

## 🎨 Design System & Preservation

The codebase preserves the approved Stitch design system tokens:

- **Navy Blue**: `#102A56`
- **Royal Blue**: `#2563EB`
- **Electric Blue**: `#3B82F6`
- **White**: `#FFFFFF`
- **Soft Background**: `#F5F8FC`
- **Light Blue**: `#EAF2FF`
- **Text**: `#172B4D`
- **Typography**: Manrope for display and section headers; Inter for body copy; Orbitron for brand accents
- **Responsive Breakpoints**: Fluid reflow from small mobile viewports to ultrawide monitors
- **Interactive States**: Mobile hamburger drawer, hover transitions, services and solutions dropdowns, FAQ accordions and client-side form validation

---

## 📬 Contact Form

The enquiry form validates client-side and shows a success state. It is a frontend simulation only:
no data is transmitted, stored or connected to a backend, database or Supabase project. Genuine
contact channels (`hello@stuzen.com`, `+91 74186 72022`, WhatsApp and Instagram) are shown alongside
the form.
