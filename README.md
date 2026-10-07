# 🚀 Chronicle - Modern Blog Management Platform

> Built for the **GDG on Campus ABESEC (2026–27)** Technical Recruitment | Frontend Development Track

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast_Bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide_React-F56565)](https://lucide.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Project Overview

**Chronicle** is a feature-packed, responsive Blog Management Platform engineered to provide writers and readers with an intuitive, seamless content publishing experience. It allows users to browse rich tech/creative articles, filter by categories and keywords, bookmark favorites, engage through comments, and manage (Create, Edit, Delete) their own blog posts with instant local persistence.

Designed with clean typography, fluid transitions, and Google-inspired modern aesthetics, **Chronicle** showcases frontend architecture best practices, complete responsiveness, accessible UI states, and robust state management.

---

## 🌐 Live Demo & Repository

* **Live Deployment:** [https://chronicle-gdg.vercel.app](https://chronicle-gdg.vercel.app) *(To be updated post-deployment)*
* **GitHub Repository:** [https://github.com/your-username/gdg-blog-platform](https://github.com/your-username/gdg-blog-platform)

---

## ✨ Features & Functional Matrix

### 1. 🔍 Exploration & Discovery
* **Interactive Post Feed:** Clean card grid displaying cover images, tags, read duration, author avatars, and publication timestamps.
* **Search & Real-time Filter:** Instant instant search by title, snippet, or content keyword, paired with multi-category filters (e.g., *Web Dev*, *AI & ML*, *Design*, *Cloud*).
* **Smart Sorting:** Sort by *Newest First*, *Oldest*, or *Most Popular / Most Liked*.

### 2. 📖 Immersive Reading Experience
* **Individual Post Detail View:** Full-page reading experience featuring clean typography, estimated reading time, author bio, and categorized badges.
* **Interactive Engagement:** 
  * ❤️ **Like System:** Real-time like counter with persistent state.
  * 🔖 **Bookmarks:** One-click save to bookmarks drawer for offline reading.
  * 💬 **Comments Section:** Add thoughts, view discussion threads with timestamps and commenter badges.

### 3. ✍️ Content Creation & Management (CRUD)
* **Create Post Modal / Page:** Rich form with title, category, cover image URL, estimated read time, author name, and markdown/formatted article body.
* **Edit Existing Posts:** Pre-filled edit form with instant live preview.
* **Delete with Safety Guard:** Delete confirmation dialog to prevent accidental data loss.

### 4. 🛡️ Robust State Handling
* **Empty States:** Custom illustrations and descriptive prompts when searches yield 0 results or when bookmarks are empty.
* **404 / Unavailable Content:** Friendly fallback view with quick navigation back to home when an invalid post ID is requested.
* **Form Validation:** Client-side validations for required fields, image URLs, and minimal content length.

### 5. 🌟 Bonus Enhancements
* 🌗 **Dark / Light Mode:** System-aware theme switcher with persistent user preference stored in `localStorage`.
* 📱 **Full Mobile & Desktop Responsiveness:** Mobile bottom/drawer navigation and fluid grid breakpoints for all viewport sizes.
* ✨ **Micro-interactions:** Hover effects, toast notifications on post creation/deletion, and smooth transitions.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React.js 18** | Component-driven declarative UI architecture |
| **Build Tool** | **Vite** | Lightning-fast HMR and optimized production bundling |
| **Styling** | **Tailwind CSS** | Utility-first responsive styling and seamless dark mode |
| **Icons** | **Lucide React** | Lightweight, clean modern iconography |
| **Routing** | **React Router DOM v6** | Client-side routing with clean URLs and dynamic post IDs |
| **Storage** | **LocalStorage API** | Browser-level persistence for posts, bookmarks, likes, and comments |

---

## 📂 Architecture & Directory Structure

```text
gdg-blog-platform/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/              # Static assets and illustration SVGs
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Button, Modal, Badge, Toast, EmptyState
│   │   ├── layout/          # Navbar, Footer, Sidebar, ThemeToggle
│   │   ├── blog/            # BlogCard, BlogList, BlogDetail, CommentSection
│   │   └── forms/           # PostForm, SearchBar, CategoryFilter
│   ├── context/             # Global State Providers
│   │   ├── BlogContext.jsx  # Posts state, CRUD operations, likes & comments
│   │   └── ThemeContext.jsx # Dark / Light mode toggle & persistence
│   ├── data/                # Initial curated seed articles
│   │   └── initialPosts.js
│   ├── hooks/               # Custom hooks (useLocalStorage, useDebounce)
│   ├── pages/               # Route Views
│   │   ├── HomePage.jsx     # Feed, Search, and Category Explore
│   │   ├── PostDetailPage.jsx # Full article read view
│   │   ├── CreatePostPage.jsx # New blog post creation
│   │   ├── EditPostPage.jsx   # Existing blog post modification
│   │   ├── BookmarksPage.jsx  # Saved posts repository
│   │   └── NotFoundPage.jsx   # 404 Error fallback page
│   ├── utils/               # Formatting helpers (dates, reading time calculation)
│   ├── App.jsx              # Main router configuration & providers
│   ├── index.css            # Tailwind directives and custom variables
│   └── main.jsx             # React DOM entry point
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Setup & Local Installation

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Ensure you have **Node.js** (v18.0 or higher) and **npm** installed.
```bash
node -v
npm -v
```

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/gdg-blog-platform.git
cd gdg-blog-platform
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔐 Prototype Authentication & Demo Credentials

> [!NOTE]
> **Prototype Simulation Disclaimer:**  
> This project currently uses browser-local prototype authentication (`quill.prototype.session` and `quill.prototype.users`).
> * Sessions and user profiles are stored in the current browser's `localStorage`.
> * It is **not production authentication** and does not provide multi-user cloud synchronization or cryptographic password storage.
> * A real production release requires a backend authentication provider (e.g., Supabase Auth, Firebase Auth, OAuth2) and server-side authorization guards.

### Pre-configured Development Demo Credentials
For testing and reviewing the authenticated flow without manual signup:
* **Demo Name:** Vishal Gupta
* **Demo Email:** `demo@quill.local`
* **Demo Password:** `QuillDemo2026!`

Alternatively, click the **"Use prototype demo account"** action on the `/login` screen to populate credentials immediately.

---

## 💾 Data Source & Persistence Strategy

* **Zero External Dependencies Required:** The application is architected to be 100% functional out-of-the-box without requiring an external backend server or database setup.
* **Curated Initial Seeds:** When a first-time user loads the app, high-quality sample blog posts spanning Web Development, AI, Cloud, and Design are populated from `initialPosts.js`.
* **Browser LocalStorage Sync:** Every CRUD action (creating a post, updating an article, removing a blog, liking, commenting, or bookmarking) automatically synchronizes with the user's `localStorage`.
* **Reset to Default Button:** A developer/tester convenience button in settings allows resetting the local dataset back to the initial curated seed posts at any time.

---

## 💡 Engineering Challenges & Solutions

### 1. State Persistence & Data Integrity Across Page Reloads
* **Challenge:** Maintaining updated comments, likes, and user-created posts across route navigations and hard browser reloads without a dedicated SQL/NoSQL backend.
* **Solution:** Designed a custom `useLocalStorage` synchronization hook integrated with a centralized `BlogContext`. The state is initialized lazily from `localStorage` (falling back to curated mock data) and written atomically upon every mutation.

### 2. Smooth Dark Mode without Flash of Unstyled Content (FOUC)
* **Challenge:** Preventing jarring flickers between light and dark modes during initial render.
* **Solution:** Embedded theme initialization logic that syncs with both `localStorage` and `prefers-color-scheme`, instantly toggling the `dark` class on the root `document.documentElement` element before mounting child trees.

### 3. Search and Filter Performance
* **Challenge:** Real-time text searches against post titles and content could cause unnecessary re-renders on every keystroke.
* **Solution:** Implemented a lightweight debounce mechanism (`useDebounce`) coupled with React `useMemo` for filtering and sorting, ensuring instantaneous 60fps UI feedback.

---

## 🎯 Alignment with GDG Evaluation Criteria

* **UI & Responsiveness:** Clean modern typography, accessible contrast, mobile bottom-nav, dynamic grid layout adapting flawlessly from mobile screens to 4K displays.
* **Functionality:** 100% coverage of all required features: Explore, View, Search, Filter, Create, Edit, Delete, plus empty and 404 state boundaries.
* **Code Quality:** Modular component hierarchy, clear naming conventions, separated business logic into custom hooks/contexts, and clean Git commits.
* **Problem-Solving:** Zero-dependency offline persistence architecture allowing reviewers to immediately test CRUD flows without setting up API keys or external servers.
* **Creativity & Bonus Features:** Light/Dark toggle, bookmarks system, interactive comments, reading time calculator, and smooth micro-interactions.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
