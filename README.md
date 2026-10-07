# 🖋️ Quill — Editorial Storytelling & Community Platform

> Built for the **GDG on Campus ABESEC (2026–27)** Technical Recruitment | Frontend Development Track

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast_Bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Design](https://img.shields.io/badge/Design_System-Light_Editorial-D85A35)](https://github.com/ROhitg-upta/gdg-blog-platform)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Project Overview

**Quill** is a modern, light-editorial storytelling and community platform engineered for thoughtful reading and intellectual discovery. Rejecting chaotic social feeds and generic templates, Quill emphasizes deliberate typography (Fraunces serif & Inter), warm linen surfaces (`#F8F5EE`), rich terracotta orange accents (`#D85A35`), and bespoke local vector illustrations.

### The Entry Flow (Zero-Friction Access)
* **Root `/`:** Directly renders the warm ivory editorial landing page featuring the signature *"Good stories. Unexpected perspectives."* typography, terracotta underline, curated 3-card mosaic, and topic strip.
* **One-Click Reader Access:** Entering the community requires **no passwords, no email input, no mandatory signup forms, and no credential validation**. Readers simply click **"Continue as reader"** to initialize a lightweight local reading context and enter the community dashboard immediately.
* **Direct Access:** Navigating directly to `/community` automatically initializes a neutral local reader profile and displays the full dashboard. Returning to `/` displays the landing page without redirecting away.

---

## 🏛️ Application Architecture & Routes

| Route | Surface Type | Description | Key Interactions |
| :--- | :--- | :--- | :--- |
| `/` | **Landing Page** | Approved warm ivory editorial showcase | Wordmark, headline, story mosaic, topic strip, "Continue as reader" |
| `/community` | **Community Dashboard** | 3-column light editorial workspace | Search, tabs (*For you*, *Following*, *Latest*), topic pills, story previews |
| `/explore` | **Explore Stream** | Topic-first curated discovery | Deep search, topic browsing, reader preview modal |
| `/bookmarks` | **Reading Shelf** | Saved stories repository | View saved essays, remove from shelf, instant count badges |
| `/write` | **Writer Studio** | Honest coming-soon destination | Preview of upcoming typography composition studio |
| `/my-stories` | **Drafts Archive** | Honest coming-soon destination | Preview of author archives arriving in Module 4 |
| `/design-system` | **Design System** | Internal component preview | Audit tokens, buttons, inputs, modals, toasts, and artwork |
| `/login`, `/signup` | **Legacy Fallback** | Deprecated auth routes | Safely redirects with `replaceState` back to `/` |

---

## ✨ Features & Functional Matrix

### 1. 🔍 Exploration & Editorial Discovery
* **3-Column Editorial Layout:**
  * **Left Rail (~220px):** Navigation (*Home*, *Explore*, *Bookmarks*, *My stories*), topic shortcuts (*Technology*, *Design*, *AI*, *Personal Growth*, *Culture*), and writing prompt.
  * **Central Feed:** Dynamic time-based greeting (*"Good morning / afternoon / evening, reader."*), headline, tabs (*For you*, *Following*, *Latest*), topic filter pills, 1 featured highlight card, flat editorial story rows, and load-more pagination.
  * **Right Rail (~280px):** Curated Community Picks (3 high-impact essays), quick topic pills, recommended writers with functional Follow/Unfollow toggles, and weekly writing prompt.
* **Instant Live Search:** Instant search matching title, excerpt, writer name, and topic category with clear button and active result indicator.
* **Topic Filtering:** One-click topic filtering with orange pill treatment, combined smoothly with search queries and feed tabs.

### 2. 📖 Immersive Story Preview Modal
* **Accessible Dialog:** Clicking any story from the landing mosaic, community feed, or right rail opens an accessible light modal (`StoryPreviewModal`).
* **Rich Editorial Content:** Displays title, writer avatar, date, reading time, local vector artwork, and multiple authentic essay paragraphs.
* **Shared Bookmarking:** Toggle bookmark directly inside the preview dialog, immediately updating icons across the feed, right rail, and reading shelf.

### 3. 🔖 Reading Shelf & Local Writer Follows
* **Local Persistence:** Bookmarks and followed writers are saved browser-locally (`quill.bookmarks.v1` and `quill.follows.v1`).
* **Instant Feedback:** Toast notifications confirm bookmark actions.
* **Following Feed:** The *Following* tab dynamically shows essays by followed writers, with an informative empty state if no authors are followed yet.

---

## 🎨 Visual Design System (Light Editorial)

Quill uses a light semantic palette with no dark shells or emerald accents:

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

## 💾 Local Prototype Storage Model

Quill is a zero-dependency frontend prototype. Reader preferences are persisted within the current browser:
* `quill.reader.v1`: Active reader identity `{ id: "local-reader", displayName: "Reader", enteredAt: ... }`
* `quill.bookmarks.v1`: Array of bookmarked story IDs
* `quill.follows.v1`: Array of followed writer IDs

All obsolete prototype authentication keys (`quill.prototype.users` and `quill.prototype.session`) have been safely deprecated and purged. `localStorage.clear()` is never invoked.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
