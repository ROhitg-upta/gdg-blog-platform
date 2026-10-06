# 📋 Project Blueprint & Technical Specification

## Project: Chronicle — Blog Management Platform
**Target:** GDG on Campus ABESEC (2026–27) Recruitment — Frontend Track  
**Author:** Rohit Gupta  
**Location:** `D:\ABES\Projects\gdg-blog-platform`

---

## 1. 🎯 Objectives & Success Metrics

The recruitment task evaluates five core pillars:
1. **UI & Responsiveness:** Aesthetic Google/GDG-inspired design with seamless responsiveness (mobile, tablet, desktop).
2. **Functionality:** Flawless implementation of post exploration, individual reading, search/filter, and full CRUD (Create, Read, Update, Delete).
3. **Robust State Handling:** Friendly zero-result views, missing article (404) views, and loading states.
4. **Code Quality:** Modular React components, clean separation of concerns, and reusable custom hooks.
5. **Bonus / Creativity:** Dark/Light theme, likes & bookmarking, interactive comment threads, reading-time estimations, and smooth micro-interactions.

---

## 2. 🏗️ High-Level System Architecture

```text
[ Browser / User ]
        │
   React 18 UI (Vite)
        ├── ThemeContext (Dark / Light Mode Toggle)
        ├── BlogContext (Global State Manager)
        │       ├── Posts List (CRUD Operations)
        │       ├── Bookmarks & Likes State
        │       └── Comments State
        │               │
        │         ┌─────┴──────────┐
        │         ▼                ▼
        │   [localStorage]   [Initial Seed Data]
        │
   React Router v6 Navigation
        ├── /                     -> HomePage (Feed, Search, Category Filter)
        ├── /post/:id             -> PostDetailPage (Article Reader, Comments, Likes)
        ├── /create               -> CreatePostPage (New Blog Post Form)
        ├── /edit/:id             -> EditPostPage (Update Existing Post Form)
        ├── /bookmarks            -> BookmarksPage (Saved Posts Shelf)
        └── *                     -> NotFoundPage (404 Error State)
```

---

## 3. 🗄️ Data Model Specifications

### 3.1 Post Entity Schema
```javascript
{
  id: "post_1710000000000",             // Unique string / timestamp
  title: "Building Scalable Modern Web Apps with React 18",
  slug: "building-scalable-modern-web-apps-with-react-18",
  excerpt: "Discover concurrent features, transitions, and performance optimizations...",
  content: `Full markdown or formatted text paragraphs...`,
  category: "Web Development",          // e.g., Web Development, AI & ML, Cloud, Design, Open Source
  tags: ["React", "JavaScript", "Frontend", "Performance"],
  coverImage: "https://images.unsplash.com/photo-...",
  author: {
    name: "Rohit Gupta",
    role: "Frontend Explorer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit"
  },
  publishedAt: "2026-10-06T10:00:00.000Z",
  readTimeMinutes: 5,
  likesCount: 14,
  isLikedByUser: false,
  isBookmarked: false,
  comments: [
    {
      id: "comm_1",
      authorName: "Aman Verma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
      commentText: "Great breakdown of the concepts!",
      createdAt: "2026-10-06T11:15:00.000Z"
    }
  ]
}
```

### 3.2 Category Taxonomy
* **All** (Default view)
* **Web Development**
* **AI & Machine Learning**
* **Cloud & DevOps**
* **UI/UX Design**
* **Competitive Programming**

---

## 4. 🧩 Component Hierarchy & Responsibilities

### 4.1 Layout Components (`src/components/layout/`)
* `Navbar.jsx`: Brand logo, navigation links (Explore, Saved, New Post), Theme toggle button, and mobile menu hamburger toggle.
* `Footer.jsx`: Community branding, GDG ABESEC mention, GitHub links, and copyright.
* `MobileDrawer.jsx`: Smooth slide-over navigation for small screen viewports.

### 4.2 Blog Components (`src/components/blog/`)
* `BlogCard.jsx`: Card showing cover image, category badge, title, excerpt, author info, read time, and quick-action buttons (Like, Bookmark, Edit, Delete).
* `BlogList.jsx`: Grid wrapper handling layout and loading skeleton placeholders.
* `PostDetail.jsx`: Formatted article body, header metadata, share button, and like trigger.
* `CommentSection.jsx`: List of existing comments, reply input form with validation, and comment submit action.

### 4.3 Form Components (`src/components/forms/`)
* `PostForm.jsx`: Reusable form for both **Create** and **Edit** actions. Handles:
  * Title input with char counter
  * Category selector
  * Tags comma-separated input
  * Cover image URL input with live preview thumbnail
  * Author name input
  * Full article text area with formatting hints
  * Validation error alerts
* `SearchBar.jsx`: Search input with clear button and debounced event dispatch.
* `CategoryFilter.jsx`: Horizontal scrollable pills for instant category switching.

### 4.4 Common / Feedback Components (`src/components/common/`)
* `Button.jsx`: Styled button with variants (`primary`, `secondary`, `danger`, `outline`).
* `Badge.jsx`: Category and tag indicator pill.
* `Modal.jsx`: Accessible modal dialog (used for Delete confirmation).
* `EmptyState.jsx`: Descriptive graphic + heading + call-to-action button when queries return no posts.
* `Toast.jsx`: Lightweight notification alert (e.g., "Post created successfully!", "Added to bookmarks").

---

## 5. 🔄 State Management & Storage Flow

### `BlogContext` (`src/context/BlogContext.jsx`)
Exposes the following API across the app:
* `posts`: Array of all active blog posts.
* `categories`: Master list of categories.
* `createPost(postData)`: Adds a new post to the top of the feed and persists in `localStorage`.
* `updatePost(id, updatedData)`: Modifies post in-place and persists.
* `deletePost(id)`: Removes post and persists.
* `toggleLike(id)`: Increments/decrements like counter and updates user like flag.
* `toggleBookmark(id)`: Adds/removes post from user's bookmarks list.
* `addComment(postId, commentData)`: Appends new comment to the target post.
* `resetToDefault()`: Re-populates `localStorage` with fresh initial seed data (useful for evaluators).

### `ThemeContext` (`src/context/ThemeContext.jsx`)
* `theme`: Current active theme (`'light'` or `'dark'`).
* `toggleTheme()`: Switches active class on `document.documentElement` and stores preference in `localStorage.getItem('theme')`.

---

## 6. 📱 Responsive Breakpoints & Design Guidelines

* **Mobile (< 640px):** Single-column cards, sticky bottom/top navigation, simplified card metadata.
* **Tablet (640px – 1024px):** 2-column card grid, streamlined search and category pills.
* **Desktop (> 1024px):** 3-column card grid, sidebar/header actions, rich full-width article typography reading layout.
* **Color Palette:**
  * Light Mode: Clean white backgrounds (`#FFFFFF`), subtle borders (`#E5E7EB`), deep slate text (`#0F172A`), Google blue accents (`#2563EB`).
  * Dark Mode: Deep dark slate (`#0B0F19`), card elevated dark (`#111827`), soft borders (`#1F2937`), clear readable text (`#F3F4F6`).

---

## 7. 🗓️ Implementation Steps (When Ready to Code)

1. **Step 1: Project Scaffolding**
   - Initialize Vite React project in `D:\ABES\Projects\gdg-blog-platform`.
   - Install `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, `react-router-dom`.
   - Setup Tailwind configuration and custom CSS variables.

2. **Step 2: Core Data & Contexts**
   - Create `initialPosts.js` with 5–6 rich, realistic tech/GDG blog articles.
   - Build `ThemeContext` with dark mode support.
   - Build `BlogContext` with CRUD operations and `localStorage` syncing.

3. **Step 3: Layout & Navigation**
   - Build `Navbar` with dark mode toggle and route links.
   - Build `Footer` and responsive mobile navigation.
   - Configure React Router routes in `App.jsx`.

4. **Step 4: Feed & Exploration Views**
   - Build `HomePage` with `SearchBar`, `CategoryFilter`, and sorting dropdown.
   - Implement `BlogCard` and `BlogList`.
   - Implement `EmptyState` when searches or filters return no results.

5. **Step 5: Article Reader & Engagement**
   - Build `PostDetailPage` displaying full article content.
   - Add Like button with reactive counter.
   - Add Bookmark toggle button.
   - Add Comments feed and new comment submission form.

6. **Step 6: Management & CRUD Actions**
   - Build `CreatePostPage` with form validation and live image preview.
   - Build `EditPostPage` pre-filling current post data.
   - Build `DeleteConfirmationModal` with safe deletion.
   - Build `BookmarksPage` for saved articles.
   - Build `NotFoundPage` (404 state).

7. **Step 7: Polish & Deployment**
   - Test responsiveness across mobile, tablet, and desktop.
   - Run production build `npm run build` to verify 0 errors.
   - Deploy to Vercel/Netlify and link in the recruitment form.
