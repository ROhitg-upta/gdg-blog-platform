# 🖋️ Quill — Editorial Storytelling & Community Platform

> Built for the **GDG on Campus ABESEC (2026–27)** Technical Recruitment | Frontend Development Track

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast_Bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Design](https://img.shields.io/badge/Design_System-Light_Editorial-D85A35)](https://github.com/ROhitg-upta/gdg-blog-platform)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Project Overview

**Quill** is a modern, light-editorial storytelling and community platform engineered for thoughtful reading, intellectual discovery, and distraction-free composition. Rejecting chaotic social feeds, generic SaaS templates, and invasive credential gates, Quill emphasizes deliberate typography (Fraunces serif & Inter), warm linen surfaces (`#F8F5EE`), rich terracotta orange accents (`#D85A35`), and bespoke local vector illustrations.

### 🌐 Live Demo
> **Live Deployment:** [Add Live Demo Link Here]  
> *(Configured with `vercel.json` SPA rewrites for direct deep-link route refreshes)*

---

## 🧭 Zero-Friction User Flow

```text
       ┌──────────────────────────────┐
       │   / (Warm Editorial Landing)  │
       └──────────────┬───────────────┘
                      │
               [ "Continue as reader" (One-Click) ]
                      │
                      ▼
       ┌──────────────────────────────┐
       │  /community (Dashboard Feed)  │ ◄─── Search, Tabs, Topics, Picks
       └──────┬───────────────┬───────┘
              │               │
     [ Select Story ]   [ "Write a story" ]
              │               │
              ▼               ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│  /story/:slug (Reader)    │ │   /write (Writer Studio)  │
│  - Typography controls    │ │   - Structured block body │
│  - Scroll progress bar    │ │   - Local debounced save  │
│  - Synchronized bookmark  │ │   - Cover artwork picker  │
└───────────────────────────┘ └─────────────┬─────────────┘
                                            │
                                    [ Publish / Save ]
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │  /my-stories (Library)    │
                              │  - Drafts / Published     │
                              │  - Safe confirmed delete  │
                              └───────────────────────────┘
```

1. **Root `/`:** Displays the signature warm ivory editorial landing page with the *"Good stories. Unexpected perspectives."* headline, terracotta underline, 3-card mosaic, and topic strip.
2. **One-Click Reader Access:** Entering the community requires **no passwords, no email input, no mandatory signup forms, and no credential validation**. Readers simply click **"Continue as reader"** to initialize a lightweight local reading context.
3. **Direct Navigation:** Visiting `/community`, `/story/:slug`, `/write`, or `/my-stories` directly initializes a neutral local reader profile and renders the full application without authentication redirects.

---

## 🏛️ Application Architecture & Routes

| Route | Surface Type | Description | Key Interactions |
| :--- | :--- | :--- | :--- |
| `/` | **Landing Page** | Approved warm ivory editorial showcase | Wordmark, headline, story mosaic, topic strip, "Continue as reader" |
| `/community` | **Community Dashboard** | 3-column light editorial workspace | Search, tabs (*For you*, *Following*, *Latest*), topic pills, story previews |
| `/story/:slug` | **Full Story Reader** | Dedicated editorial reading room | Reading progress, typography controls (size/width/spacing), share, bookmark, related stories |
| `/explore` | **Explore Stream** | Topic-first curated discovery | Deep search, topic browsing, reader preview modal |
| `/bookmarks` | **Reading Shelf** | Saved stories repository | View saved essays, remove from shelf, instant count badges |
| `/write` | **Writer Studio** | Distraction-free composition desk | Title, excerpt, topic, cover chooser, block editor, autosave, publish |
| `/write/:id/edit` | **Story Editor** | Edit existing draft or published work | Update content blocks, modify cover/topic, debounced local autosave |
| `/write/:id/preview` | **Story Preview** | Author editorial preview room | Verify typography & formatting, publish directly or return to editing |
| `/my-stories` | **My Stories Library** | Personal story management console | Filter & manage Drafts, Published, and Archived stories, safe confirmed delete |
| `/design-system` | **Design System** | Internal component preview | Audit tokens, buttons, inputs, modals, toasts, and artwork |
| `/login`, `/signup` | **Legacy Fallback** | Deprecated auth routes | Safely redirects with `replaceState` back to `/` |

---

## ✨ Features & Functional Matrix

### 1. 🔍 Exploration & Editorial Discovery
* **3-Column Editorial Layout:**
  * **Left Rail (~220px):** Navigation (*Home*, *Explore*, *Bookmarks*, *My stories*), topic shortcuts (*Technology*, *Design*, *AI*, *Personal Growth*, *Culture*), and writing prompt.
  * **Central Feed:** Dynamic time-based greeting (*"Good morning / afternoon / evening, reader."*), headline, tabs (*For you*, *Following*, *Latest*), topic filter pills, 1 featured highlight card, flat editorial story rows, and load-more pagination.
  * **Right Rail (~280px):** Curated Community Picks (3 high-impact essays), quick topic pills, recommended writers with functional Follow/Unfollow toggles, and weekly writing prompt.
* **Instant Live Search:** Real-time search matching title, excerpt, author name, and topic category with clear button and active result indicator.
* **Topic Filtering:** One-click topic filtering with orange pill treatment, combined smoothly with search queries and feed tabs.

### 2. 📖 Immersive Story Preview Modal
* **Accessible Dialog:** Clicking any story preview from the landing mosaic, community feed, or right rail opens an accessible light modal (`StoryPreviewModal`).
* **Rich Editorial Content:** Displays title, writer avatar, date, reading time, local vector artwork, and authentic essay summary.
* **Direct Full-Reader Link:** Includes a dedicated "Read full story →" CTA transitioning smoothly to `/story/:slug`.
* **Shared Bookmarking:** Toggle bookmark directly inside the preview dialog, immediately updating icons across the feed, right rail, and reading shelf.

### 3. 📜 Dedicated Full Story Reader (`/story/:slug`)
* **Warm Editorial Reading Room:** Dedicated light reading layout prioritizing typography and white space without distraction.
* **Rich Semantic Content Structure:** Renders multi-paragraph essays, section subheadings, pull quotes with attributions, and bulleted lists safely without raw HTML injection.
* **Scroll-Aware Reading Progress:** Real-time top progress bar tracking reading percentage (0–100%) through the article text.
* **Typography & Reader Controls Popover:**
  * **Text Size:** Small (`0.95rem`), Default (`1.125rem`), Large (`1.25rem`).
  * **Reading Width:** Standard (`680px`), Spacious (`760px`).
  * **Line Spacing:** Standard (`1.75`), Relaxed (`1.95`).
  * **Reset:** Quick revert to default comfortable reading settings.
* **Direct Link Sharing:** Supports native `navigator.share` on supported devices with automatic fallback to clipboard copying and instant toast notification.
* **Connected Author Byline & Follows:** Displays author bio, avatar, publication date, and real-time Follow/Unfollow toggle.
* **Curated Recommendations:** "More to spend time with" section presenting 3 related stories dynamically matching topic, writer, or platform favorites.
* **Story Unavailable State:** Graceful fallback for non-existent slugs with clear options to return to community or landing.

### 4. 🔖 Reading Shelf & Local Writer Follows
* **Local Persistence:** Bookmarks and followed writers are saved browser-locally (`quill.bookmarks.v1` and `quill.follows.v1`).
* **Instant Feedback:** Toast notifications confirm bookmark actions.
* **Following Feed:** The *Following* tab dynamically shows essays by followed writers, with an informative empty state if no authors are followed yet.

### 5. ✍️ Writer Studio, Publishing & My Stories (`/write`, `/my-stories`)
* **Focused Writing Canvas:** Clean light editorial writing desk on `#FFFDFA` with title (120 char max), excerpt/subtitle (240 char max), topic selector, and cover artwork picker.
* **Structured Block-Based Editor:**
  * Semantic blocks: paragraphs, section headings, pull quotes with attributions, and bullet lists.
  * Reorder controls: accessible keyboard and click buttons (Move up, Move down).
  * Quick paragraph insertion and block removal.
  * Zero `dangerouslySetInnerHTML` injection.
* **Honest Local Autosave:**
  * Real-time save status: *"Unsaved changes"*, *"Saving locally…"*, *"Saved locally"*.
  * Debounced local autosave (850ms) without fake network delays or deceptive cloud claims.
  * Warning before window unload only when unsaved changes exist.
* **Faithful Author Preview (`/write/:id/preview`):**
  * Exact reading fidelity matching `/story/:slug`.
  * Distinct draft badge banner (*"Preview — not published"*).
  * One-click publishing directly from preview or instant return to editing without data loss.
* **Collision-Safe Publishing Engine:**
  * Validates completeness (title, excerpt, topic, cover, non-empty body blocks).
  * Generates unique, collision-safe kebab-case slugs resolving against both static sample stories and local author stories.
  * Direct post-publish transition to `/story/:slug` with instant toast notification.
  * Unified collection merging: published stories immediately appear in Community feeds, Explore, search queries, topic filters, and Bookmarks.
* **Personal Library Management (`/my-stories`):**
  * Three status tabs: **Drafts**, **Published**, and **Archived** with real-time count badges.
  * Actions: Continue writing, view public story, author preview, archive, restore, and permanent deletion.
  * Named deletion confirmation dialog (`ConfirmDialog`) preventing accidental loss of local drafts.
  * Protected static content: curated sample stories cannot be edited or deleted.

---

## 🛠️ Technology Stack

Strictly aligned with project dependencies in `package.json`:
* **Core Framework:** React 18.3.1 (`react`, `react-dom`)
* **Build Tool & Bundler:** Vite 5.4.11 (`@vitejs/plugin-react`)
* **Styling Architecture:** Pure Vanilla CSS with semantic Design Tokens (`quill-tokens.css`, `components.css`, `design-system.css`, `main.css`)
* **Typography:** Fraunces (Display Serif) & Inter (UI Sans-serif)
* **Graphics:** Native inline SVG vector illustrations with zero external asset dependencies

---

## 🎨 Visual Design System (Light Editorial)

Quill uses a semantic light palette with no dark shells or emerald accents:

* **Main Page Background:** `#F8F5EE` (warm linen / paper)
* **Paper Card Surfaces:** `#FFFDFA`
* **Secondary Soft Surface:** `#F0EBE2`
* **Deep Ink Text:** `#1E1C1A`
* **Secondary Text:** `#696158`
* **Muted Metadata:** `#82786B`
* **Fine Border:** `#DDD4C7`
* **Strong Border:** `#CBBEAE`
* **Primary Accent:** `#D85A35` (terracotta orange)
* **Accent Hover:** `#C64C29`
* **Soft Accent Pill / Selection:** `#F8E4D9`
* **Artwork Tints:** Lavender (`#DDD5EA`), Peach (`#F0D1BB`), Sage (`#DCE3CC`)

---

## ♿ Accessibility & Responsive Quality

* **Semantic Landmarks:** `<header>`, `<nav>`, `<main>`, `<aside>`, `<article>`, and `<footer>` on every page.
* **Heading Hierarchy:** Strictly one `<h1>` per page with semantic `<h2>` and `<h3>` tags throughout.
* **Keyboard Navigation:** Full tab order navigation with visible `outline: 2px solid var(--color-accent)` focus rings.
* **Accessible Dialogs:** Focus trapping, `Escape` key listeners, and accessible ARIA attributes (`aria-modal`, `aria-label`).
* **Touch Targets:** Minimum 36px–44px clickable target sizing for mobile controls.
* **Reduced Motion:** Comprehensive `@media (prefers-reduced-motion: reduce)` support disabling animations and transitions.
* **Viewport Support:** Fully responsive across Mobile (360px–390px), Tablet (768px), Laptop (1024px), and Desktop (1440px) with zero horizontal overflow.

---

## 🚀 Setup & Local Execution

### 1. Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** or **yarn**

### 2. Install & Run
```bash
# Clone the repository
git clone https://github.com/ROhitg-upta/gdg-blog-platform.git
cd gdg-blog-platform

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 💾 Local Prototype Storage Model & Disclaimer

Quill is a zero-dependency frontend prototype. Reader preferences and authored stories are persisted within the current browser:
* `quill.reader.v1`: Active reader identity `{ id: "local-reader", displayName: "Reader", enteredAt: ... }`
* `quill.bookmarks.v1`: Array of bookmarked story IDs
* `quill.follows.v1`: Array of followed writer IDs
* `quill.reader-preferences.v1`: Reader typography settings `{ textSize, readingWidth, lineSpacing }`
* `quill.user-stories.v1`: Array of local reader-authored stories `{ id, slug, title, subtitle, excerpt, content, topic, artworkId, status, ... }`

> [!NOTE]
> Stories and drafts are stored solely within browser `localStorage`. Clearing browser data removes locally created stories. No cloud database or multi-user sync exists in this frontend prototype.

---

## 🌐 Deployment Configuration

For static hosting providers such as Vercel, a [`vercel.json`](vercel.json) rewrite file is included in the project root to ensure client-side routing functions cleanly when users refresh direct links (e.g. `/story/:slug`, `/community`, `/write`, `/my-stories`).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
