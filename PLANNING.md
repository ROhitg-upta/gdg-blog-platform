# Quill — Product and Technical Plan

---

## 1. Product Overview

**Quill** is a modern editorial publishing and community platform designed for writers, essayists, and thoughtful readers. The platform merges an immersive, distraction-free reading room with a streamlined, professional Writer Studio. Within Quill, readers discover curated long-form perspectives across technology, design, artificial intelligence, and personal philosophy, while writers compose, preview, and publish formatted essays with rich media.

### Core Value Proposition
* **The Living Reading Room:** A high-signal community dashboard prioritizing editorial depth, typography hierarchy, and author voice over social media noise.
* **The Writer Studio:** A dedicated drafting workspace providing instantaneous word count and reading time metrics, autosave protection, markdown formatting, and live reader preview.
* **Unified Reading Experience:** Integrated bookmarking, topic filtering, clean typography scaling, and contextual comment discussions.

### Critical Architecture & Scope Paradigm
* **No Public Landing Page:** In this phase of the product lifecycle, there is **no public marketing hero or promotional landing page**.
* **Direct-to-Authentication Entry:** When the application boots, unauthenticated visitors are presented with the **Login** screen (`/login`).
* **Authenticated Community Core:** Upon successful authentication, users enter the three-column **Community Home** dashboard (`/community`).

---

## 2. Scope and Explicit Exclusions

### In-Scope Modules (Phase 1 MVP)

#### A. Authentication Experience
* **Entry Point:** Direct boot to the `/login` screen.
* **Authentication Views:** Login, Account Registration (`/signup`), and Optional Reading Topic Onboarding (`/onboarding`).
* **Session Lifecycle:** Frontend-managed session state with mock authentication validation, session token persistence across browser refreshes, and deterministic logout teardown.
* **Route Protection:** Navigation guards shielding all dashboard, reading, profile, and writer routes against unauthenticated access.

#### B. Authenticated Community Dashboard
* **Community Home (`/community`):** Three-column layout containing global navigation, a personalized central feed ("Your next great read"), dynamic tabs (*For you*, *Following*, *Latest*), and an exploration sidebar.
* **Search & Topic Filtering:** Instant search against story titles, excerpts, author names, and topics, paired with multi-category chips (*Technology*, *Design*, *AI*, *Personal Growth*).
* **Story Reader (`/story/:slug`):** Full-screen reading layout featuring estimated reading time, author card, styled block typography, bookmarking actions, and responsive comment feeds.
* **Bookmarking Engine (`/bookmarks`):** Instant save/unsave actions synchronized with the user profile state.
* **Writer Studio (`/write`, `/write/:id/edit`, `/write/:id/preview`):** Rich drafting interface with live word count, reading-time calculation, draft autosave status, client-side validation, and instant publication.
* **Story Management (`/my-stories`):** Tabbed management console for Published Stories and Saved Drafts with edit, preview, and safe deletion confirmation dialogs.

### Explicitly Excluded (Out of Scope)
* **Public Marketing Landing Page:** No promotional marketing copy, public carousels, or unauthenticated teaser pages.
* **Payment Gateways & Subscriptions:** No Stripe/PayPal integration, paid paywalls, or tipping systems.
* **Real-time WebSockets / Direct Messaging:** No 1-on-1 private messaging or live socket feeds.
* **Machine Learning Recommendation Engine:** Feeds use deterministic client-side filtering algorithms rather than remote vector recommendations.
* **Multi-tenant Admin Analytics:** No company dashboards or revenue metrics.
* **Cloud Email Verification & Password Reset:** No SMTP transactions or password-recovery email dispatching in the prototype.
* **Fictitious Social Proof & Fabricated Sync:** No deceptive claims of cloud database persistence when utilizing local storage mocks.

---

## 3. User Journey

```text
[ Unauthenticated User ]
           │
           ▼
     ┌───────────┐
     │  /login   │ ◄────── (Invalid Credentials -> Display Inline Error)
     └─────┬─────┘
           │ (Valid Credentials or Switch to /signup)
           ▼
    [ Session Created ]
           │
           ▼
 ┌───────────────────┐
 │    /community     │ ◄─── Central Editorial Dashboard
 └─┬───────┬───────┬─┘
   │       │       │
   │       │       └──────► [ Search & Topic Filters ] ──► (Instant Feed Filter)
   │       │
   │       ├──────────────► [ /story/:slug ] ────────────► [ Bookmark / Comment ]
   │       │
   │       ├──────────────► [ /write ] ──────────────────► [ Draft / Preview / Publish ]
   │       │                                                        │
   │       ├──────────────► [ /my-stories ] ◄───────────────────────┘
   │       │
   │       └──────────────► [ /bookmarks ]
   │
   ▼
[ User Selects Logout ]
   │
   ▼
[ Session Cleared -> Redirect to /login ]
```

### Primary Flow: Authentication to Publication
1. **Application Launch:** Browser requests the root domain `/`. The route guard detects no active session token and performs an immediate redirect to `/login`.
2. **Authentication Submission:** User enters credentials (or selects the pre-filled Demo Account). The frontend authentication provider validates credentials against the local mock store and generates an authenticated `quill_session` token.
3. **Dashboard Transition:** User is smoothly transitioned to `/community`. The greeting dynamically displays the user's name (*"Welcome back, Alex"*).
4. **Feed Exploration & Filtering:** User scrolls through curated articles under the *For you* tab. User clicks the *"Design"* chip; the feed updates immediately to showcase relevant design essays.
5. **Story Reading:** User selects an article card. Route navigates to `/story/:slug`. The user reviews the full prose, clicks the **Bookmark** button (toast confirms *"Saved to your bookmarks"*), and submits a discussion comment.
6. **Opening Writer Studio:** User clicks **"Write"** in the top navigation bar. System navigates to `/write`.
7. **Drafting & Autosave:** User inputs a title, selects a topic, writes markdown prose, and observes the auto-calculated metrics (*"450 words · 2 min read"*). The autosave indicator confirms *"Saved to drafts"*.
8. **Preview & Publishing:** User clicks *"Preview"* to inspect reader layout fidelity, then clicks *"Publish"*. Story status changes to `published`, and the user is redirected to `/my-stories`.
9. **Session Teardown:** User opens the top-right profile avatar menu and clicks *"Sign out"*. Local session token is removed, and route immediately reverts to `/login`.

### Secondary & Edge Case Flows
* **Invalid Login Attempt:** User submits non-matching credentials. Form highlights input borders in crimson, disables submission briefly, and displays *"Invalid email or password. Please try the demo account."*
* **New User Registration (`/signup`):** New visitor submits name, email, and password. System creates a prototype user profile, initializes an empty bookmark/story repository, sets session, and optionally prompts for reading interests on `/onboarding`.
* **Unauthorized Direct Route Access:** Unauthenticated visitor attempts to access `/write` or `/bookmarks`. ProtectedRoute interceptor captures the attempted URL, caches it in navigation state (`from: '/write'`), and redirects to `/login`. Post-login, user is redirected back to `/write`.
* **Story Not Found (`404`):** If a user visits `/story/non-existent-slug`, the application displays an editorial empty state: *"This story has vanished into the margins,"* with a direct CTA button *"Return to Community"*.
* **Empty Feed / Zero Search Results:** Searching for a keyword with zero matches triggers an illustrative empty state: *"No stories matched '{query}'. Try searching for a broader term or explore topics below."* with a *"Clear Search"* action.
* **Unsaved Changes Navigation Guard:** When a writer has dirty, unpersisted changes in `/write` and attempts to navigate away, a browser modal warns: *"You have unsaved edits in this story. Leaving will discard recent progress."*

---

## 4. Route and Access Plan

| Route | Access Type | Purpose | Core Components | Redirect Rules |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Public | Warm Ivory Editorial Landing Page | `Header`, `Hero`, `StoryMosaic`, `ExploreTopics`, `EditorialInfo`, `Footer` | Always renders landing page |
| `/community` | Open / Reader | 3-Column Light Editorial Community Dashboard | `CommunityHeader`, `CommunityLeftNav`, `FeedStream`, `CommunityRightRail` | Auto-initializes reader context if direct visit |
| `/explore` | Open / Reader | Curated topics & search-driven directory | `CommunityHeader`, `CommunityLeftNav`, `FeedStream`, `CommunityRightRail` | Direct access |
| `/bookmarks` | Open / Reader | User's saved stories reading shelf | `CommunityHeader`, `CommunityLeftNav`, `BookmarksStream` | Direct access (persists in `quill.bookmarks.v1`) |
| `/write` | Open / Reader | Writer Studio — honest coming-next destination | `CommunityHeader`, `CommunityLeftNav`, `WriterStudioComingSoon` | Direct access |
| `/my-stories` | Open / Reader | Story management — honest coming-next destination | `CommunityHeader`, `CommunityLeftNav`, `WriterStudioComingSoon` | Direct access |
| `/design-system` | Internal | Design system tokens and component preview | `DesignSystemPreview` | Direct internal preview |
| `/login`, `/signup`, `/onboarding` | Legacy | Deprecated prototype auth routes | None | Redirects with replace navigation to `/` |
| `/404` | Public/Catch-all | Missing route fallback | `NotFoundPage`, `ReturnButton` | None |

---

## 5. Lightweight Reader Context (Module 3 Corrected Architecture)

In accordance with Module 3 requirements, all credential-based authentication (passwords, email validation, mandatory signups, and interest gates) has been removed from the product flow. 

Quill operates as a frictionless light editorial prototype where visitors can enter the community with **one click** ("Continue as reader").

### Data Contracts

#### Local Reader Context Object
```typescript
interface QuillReader {
  id: string;                 // "local-reader"
  displayName: string;        // "Reader"
  interests: string[];        // Array of selected topic strings
  followedWriterIds: string[];// Array of followed writer IDs
  enteredAt: string;          // ISO-8601 timestamp
}
```

#### Local Storage Namespaces
* `quill.reader.v1`: Reader profile state
* `quill.bookmarks.v1`: Array of bookmarked story IDs
* `quill.follows.v1`: Array of followed writer IDs

### Entry & Navigation Mechanics
1. **Root Landing (`/`):** Always renders the approved warm ivory landing page. Visiting `/` never redirects away to the dashboard, preserving the publication showcase.
2. **One-Click Reader Entry:** Clicking "Continue as reader" initializes or refreshes the local reader session and navigates to `/community`.
3. **Direct Dashboard Visits:** Directly navigating to `/community` or `/explore` automatically initializes a neutral reader context and displays the dashboard without an auth barrier.
4. **Legacy Auth Routes:** Requests to `/login`, `/signup`, or `/onboarding` perform an immediate `replaceState` redirect to `/`. Obsolete credential storage keys (`quill.prototype.users`, `quill.prototype.session`) are purged safely on initial mount without invoking `localStorage.clear()`.
5. **No Theme Toggle / No Dark Mode:** All active product screens strictly use the Light Editorial design system (`#F8F5EE` paper, `#FFFDFA` card, `#D85A35` terracotta orange accent).

---

## 6. Visual Design System

The visual design system establishes a focused, high-contrast **editorial workspace**. It features a deep obsidian shell contrasted with warm ivory typography, balanced by refined emerald green accents.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [quill.]   [Q Search stories...]         [+ Write]  [Theme]  [Avatar]  │
├─────────────┬──────────────────────────────────────────┬───────────────┤
│ • Home      │ Good afternoon, Alex.                    │ Community     │
│ • Explore   │ Your next great read.                    │ Picks         │
│ • Bookmarks ├──────────────────────────────────────────┤ • Essay 1     │
│ • My Stories│ [For you]  [Following]  [Latest]         │ • Essay 2     │
│             ├──────────────────────────────────────────┼───────────────┤
│ TOPICS      │ [Tech] [Design] [AI] [Culture]           │ Staff Writers │
│ • Technology├──────────────────────────────────────────┤ to Follow     │
│ • Design    │ [Story Card: Cover Image, Title,         │ • Author A    │
│ • AI        │  Author, Read Time, Bookmark Button]     │ • Author B    │
│             │                                          │               │
│ [Write CTA] │                                          │ [Write Prompt]│
└─────────────┴──────────────────────────────────────────┴───────────────┘
```

### Design Tokens

#### 1. Color Palette
* **Application Shell Background (`--bg-app`):** `#0E0E10` (Deep obsidian black).
* **Surface Card Background (`--bg-surface`):** `#141416` (Elevated dark charcoal).
* **Surface Secondary (`--bg-surface-elevated`):** `#1C1C1F` (Hover and active modal state).
* **Primary Text (`--text-primary`):** `#F5F2EB` (Warm ivory white).
* **Secondary Text (`--text-secondary`):** `#A39F95` (Muted parchment gray).
* **Muted/Timestamp Text (`--text-muted`):** `#6E6A62` (Deep stone gray).
* **Primary Editorial Accent (`--accent-primary`):** `#10B981` (Refined emerald green).
* **Accent Hover (`--accent-hover`):** `#059669` (Deep forest green).
* **Accent Subtle Surface (`--accent-subtle`):** `rgba(16, 185, 129, 0.12)`.
* **Dividers & Borders (`--border-subtle`):** `#232326` (Hairline charcoal border).
* **Dividers Active (`--border-strong`):** `#323236` (Noticeable card border).
* **Error / Destructive (`--color-error`):** `#EF4444` (Crimson red).

#### 2. Typography Hierarchy
* **Heading & Story Title Font:** `Fraunces`, `Georgia`, serif.
* **UI Controls, Navigation & Body Copy:** `Inter`, `-apple-system`, sans-serif.
* **Scale:**
  * App Wordmark: `1.85rem` (Fraunces 700).
  * Dashboard Greeting / Page Header: `2.25rem` (Fraunces 600, `-0.025em` letter-spacing).
  * Story Card Headline: `1.35rem` (Fraunces 600, line-height 1.25).
  * Story Reader Title: `2.75rem` (Fraunces 700, line-height 1.15).
  * Body Text: `1.05rem` (Inter 400, line-height 1.68).
  * Metadata & Badges: `0.78rem` (Inter 500, uppercase, `0.08em` tracking).

#### 3. Spatial System & Grid
* **Base Unit:** 4px grid (`0.25rem`).
* **Sidebar Widths:** Left navigation fixed at `240px`; Right context sidebar fixed at `320px`.
* **Central Column:** Fluid max-width `720px` to maintain optimal typographic line lengths (65–75 characters per line).
* **Card Radius:** `10px` for cards and modals; `9999px` strictly for pill buttons and topic chips.
* **Shadows:** Minimal and functional: `0 4px 20px -2px rgba(0, 0, 0, 0.4)`.

---

## 7. Login Experience

### Concept: "Enter the Reading Room"
The login screen is the primary gateway into the application. It avoids generic SaaS dashboard tropes, presenting a split-pane layout with an editorial focus.

```text
┌──────────────────────────────────────┬──────────────────────────────────────┐
│                                      │                                      │
│  quill.                              │  Welcome back                        │
│                                      │  Please enter your details to sign in│
│  "A room without books is like a     │                                      │
│   body without a soul."              │  Email Address                       │
│                                      │  [ alex@quill.editorial            ] │
│  Curated essays, independent voices, │                                      │
│  and room for unexpected             │  Password                            │
│  perspectives.                       │  [ ••••••••••                    👁 ] │
│                                      │                                      │
│                                      │  [ Sign in to Quill                ] │
│                                      │  [ Use One-Click Demo Account      ] │
│                                      │                                      │
│                                      │  New reader? Create an account       │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Visual & Layout Specifications
* **Desktop (Split View):**
  * **Left Editorial Canvas (45% width):** Deep obsidian background (`#0A0A0C`) with a subtle textured paper tint. Displays the `quill.` wordmark, a classical literary quote on craft and quiet thinking, and an original abstract line-art illustration of an open manuscript and quill.
  * **Right Authentication Canvas (55% width):** Focused card containing the headline *"Welcome to the Reading Room,"* email/password input fields, an eye toggle for password visibility, and two action buttons: **Sign in** and **One-Click Demo Login**.
* **Mobile / Tablet View:** Left canvas collapses gracefully into a top-aligned wordmark and concise subtitle. The authentication form expands to full width with 16px touch gutters.

### Form Behavior & States
* **Accessibility:** Full keyboard traversal via `Tab`, explicit `<label for="...">` associations, `aria-required="true"`, and `aria-invalid` bindings on error.
* **Loading State:** The submit button displays a localized SVG spinner and text: *"Entering the reading room..."*, preventing duplicate submissions.
* **One-Click Demo Button:** A secondary styled button instantly populates demo credentials and triggers authentication, speeding up evaluator workflows.
* **Transition Effect:** Upon authentication success, the view triggers a fade transition as the browser navigates to `/community`.

---

## 8. Community Home Dashboard

The dashboard (`/community`) serves as the central command center once authenticated.

### Three-Column Architecture

#### 1. Top Navigation Bar
* **Height:** Fixed `64px`, sticky position, subtle backdrop blur.
* **Left:** `quill.` wordmark linking to `/community`.
* **Center:** Search bar with live debounced search across titles, summaries, and authors.
* **Right Elements:**
  * **Write Button:** Emerald green pill button (`+ Write`) linking to `/write`.
  * **Appearance Toggle:** Light/Dark theme switcher.
  * **Notification Bell:** Popover listing recent community reactions.
  * **Profile Menu:** Avatar circle opening a dropdown menu (*Profile*, *My Stories*, *Bookmarks*, *Settings*, *Sign Out*).

#### 2. Left Navigation Sidebar (`240px`)
* **Primary Navigation:**
  * 🏠 *Home* (Active indicator in emerald green)
  * 🧭 *Explore* (`/explore`)
  * 🔖 *Bookmarks* (`/bookmarks`)
  * ✍️ *My Stories* (`/my-stories`)
* **Curated Topics Shelf:**
  * Quick links to filter the feed: *Technology*, *Design*, *Artificial Intelligence*, *Personal Growth*, *Culture*.
* **Bottom Panel:** Subtle callout box: *"Have a story to tell? Join 1,200+ writers."* with a quick link to Writer Studio.

#### 3. Central Editorial Feed (`Fluid, max-width 720px`)
* **Greeting Header:** Dynamic greeting: *"Good afternoon, Alex"* followed by the subtitle *"Your next great read."*
* **Feed Segment Tabs:**
  * *For You:* Algorithmic mix based on selected user interests.
  * *Following:* Stories authored by writers the user has followed.
  * *Latest:* Chronological stream of newly published articles.
* **Topic Filter Pills:** Horizontal scrollable pills enabling one-click category filtering.
* **Story Card Architecture:**
  * Author avatar, author name, publication date, and topic badge.
  * Story headline in editorial serif (`Fraunces`).
  * Two-line synopsis/excerpt.
  * Reading time estimate (*e.g., "5 min read"*).
  * Cover image thumbnail (`120px × 80px`, rounded).
  * Action controls: Interactive Bookmark toggle, Reaction counter, and Share link trigger.

#### 4. Right Context Sidebar (`320px`)
* **Community Picks:** Hand-curated list of 3 high-impact essays with title, author, and reading time.
* **Recommended Writers:** Cards showcasing 3 active writers with avatar, bio snippet, and a functional *Follow* toggle.
* **Writing Prompt Widget:** Inspiring creative prompt of the week with a button to begin a draft.

### Responsive Breakpoints
* **Desktop (>1180px):** Full three-column layout.
* **Tablet (768px – 1180px):** Right sidebar collapses; left sidebar converts into an icon-only rail; central feed expands.
* **Mobile (<768px):** Left sidebar transforms into an accessible bottom navigation bar (*Home*, *Explore*, *Bookmarks*, *Write*, *Profile*); top navigation focuses on wordmark, search icon, and avatar.

---

## 9. Feature Modules

### Module A: Story Discovery
* **User Goal:** Uncover compelling stories aligned with intellectual curiosity.
* **UI Surface:** Central feed of `/community` and `/explore`.
* **Required Data:** Array of `Story` records filtered by `status: 'published'`.
* **Success State:** Dynamic list of cards with smooth card reveal transitions.
* **Empty State:** Illustrated message: *"No stories found in this topic yet. Be the first to write one!"*
* **Error State:** Fallback error banner with a *"Reload Feed"* button.

### Module B: Search & Dynamic Filtering
* **User Goal:** Quickly locate specific authors, titles, or thematic content.
* **UI Surface:** Search input in top navigation and topic chips.
* **Required Data:** Debounced query string + active topic category ID.
* **Actions:** Instant client-side text evaluation matching `title`, `excerpt`, `author.name`, or `topic`.
* **Success State:** Filtered feed highlighting matching query count.
* **Empty State:** *"No stories match '{query}'. Clear search to browse all stories."*

### Module C: Story Reading
* **User Goal:** Read an essay in an unobstructed, distraction-free environment.
* **UI Surface:** `/story/:slug`.
* **Required Data:** Complete `Story` entity, author details, and associated `Comment` records.
* **Actions:** Toggle bookmark, trigger clap/like, submit comment, copy share URL.
* **Success State:** Centered reader column (max-width 680px), large typography, clear headings, and blockquotes.
* **Error State:** If the story slug does not exist, navigate to `/404`.

### Module D: Bookmarking System
* **User Goal:** Save articles for reference or later reading.
* **UI Surface:** Bookmark icon on Story Cards and `/bookmarks` page.
* **Required Data:** `userId`, array of `storyId` strings stored in user profile.
* **Actions:** Click bookmark icon to toggle saved state with toast notification.
* **Success State:** Real-time icon fill toggle; item appears immediately on `/bookmarks`.
* **Empty State:** `/bookmarks` displays: *"Your shelf is empty. Save stories using the bookmark icon."*

### Module E: Story Creation & Publishing
* **User Goal:** Compose and publish written essays.
* **UI Surface:** Writer Studio (`/write`).
* **Required Data:** `title`, `content`, `topic`, `coverImage`, `status`.
* **Actions:** Type content, save draft, live preview, publish story.
* **Success State:** Toast alert: *"Story published successfully!"* and redirect to `/my-stories`.
* **Validation Failure:** Visual alert if title is under 5 characters or body content is empty.

### Module F: Story Management
* **User Goal:** Inspect and manage personal writing output.
* **UI Surface:** `/my-stories`.
* **Required Data:** Stories authored by active `userId`, partitioned by `status: 'published'` vs. `'draft'`.
* **Actions:** Edit story (navigates to `/write/:id/edit`), view preview, delete story with modal confirmation.
* **Success State:** Clean table/list view with status badges and edit/delete actions.
* **Empty State:** *"You haven't written any stories yet. Start your first draft today."*

### Module G: Comments & Community Reactions
* **User Goal:** Share thoughts on an essay and view reader feedback.
* **UI Surface:** Bottom panel of `/story/:slug`.
* **Required Data:** Array of comments `{ id, authorName, authorAvatar, content, createdAt }`.
* **Actions:** Enter text, click *"Post comment"*, view live thread update.
* **Prototype Behavior:** Comments persist locally to the active story object in local storage.

---

## 10. Writer Studio

### Route: `/write` / `/write/:id/edit`
The Writer Studio is designed as a distraction-free writing environment rather than a standard data entry form.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [quill. studio]   Draft saved • 3 mins ago        [Preview]  [Publish] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   Title                                                                │
│   [ Title of your story...                                           ] │
│                                                                        │
│   Topic: [ Select Topic ▼ ]    Cover Image URL: [ https://...        ] │
│                                                                        │
│   [ B ] [ I ] [ H2 ] [ H3 ] [ Quote ] [ Code ] [ Bullet List ]         │
│   ───────────────────────────────────────────────────────────────────  │
│                                                                        │
│   Tell your story...                                                   │
│   Write your thoughts here using markdown or rich text...              │
│                                                                        │
│                                                                        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│   Words: 642  •  Estimated reading time: 3 min read                    │
└────────────────────────────────────────────────────────────────────────┘
```

### Studio Architecture & Features
1. **Header Toolbar:**
   * Studio branding: `quill. studio`.
   * Autosave Status: Reactive pill displaying *"Saving..."*, *"Draft saved locally"*, or *"Unsaved changes"*.
   * Actions: **Preview** button (opens live reader view) and **Publish** button (launches final confirmation modal).
2. **Metadata Controls:**
   * Title input: Large, auto-growing serif input with placeholder *"Title of your story..."*.
   * Category selector: Dropdown mapping to available topics (*Technology*, *Design*, *AI*, *Life*, etc.).
   * Cover Visual: URL input accompanied by a live image preview thumbnail.
3. **Editor Surface:**
   * Textarea with real-time formatting toolbar support for Bold, Italic, H2, H3, Blockquote, Inline Code, and Bullet Lists.
   * Format: Produces clean markdown text. Markdown is chosen because it is human-readable, requires zero heavy third-party WYSIWYG dependencies, and exports to plain text or HTML cleanly.
4. **Metrics Footer:**
   * Real-time Word Counter (`content.trim().split(/\s+/).length`).
   * Dynamic Reading Time Estimator (`Math.ceil(words / 200)` minutes).
5. **Autosave Engine:**
   * Debounced 1500ms watcher automatically saves edits to `localStorage` under key `quill_draft_<id>`.
   * Warns before window close (`beforeunload` listener) if unsaved edits are in-flight.

---

## 11. Data Models

```typescript
// ==========================================
// 1. User Identity Model
// ==========================================
interface User {
  id: string;                    // [Required] Unique ID e.g. "usr_101"
  name: string;                  // [Required] Full display name
  username: string;              // [Required] Unique handle e.g. "alexvance"
  email: string;                 // [Required] Login email address
  avatar: string;                // [Required] Image URL or SVG initials
  bio: string;                   // [Optional] Editorial bio description
  interests: string[];           // [Required] Array of topic IDs e.g. ["tech", "design"]
  followedWriters: string[];     // [Optional] Array of followed user IDs
  joinedDate: string;            // [Required] ISO-8601 string
}

// ==========================================
// 2. Story Entity Model
// ==========================================
interface Story {
  id: string;                    // [Required] Unique ID e.g. "sty_501"
  slug: string;                  // [Required] URL-friendly slug
  title: string;                 // [Required] Story headline
  excerpt: string;               // [Required] 2-line summary for cards
  content: string;               // [Required] Full markdown body
  cover: string;                 // [Required] Cover illustration/photo URL
  topic: string;                 // [Required] "Technology" | "Design" | "AI" | etc.
  authorId: string;              // [Required] Foreign key to User.id
  status: 'draft' | 'published'; // [Required] Publishing lifecycle state
  createdAt: string;             // [Required] ISO-8601 timestamp
  updatedAt: string;             // [Required] ISO-8601 timestamp
  readingTime: string;           // [Required] e.g. "5 min read"
  bookmarksCount: number;        // [Prototype-local] Counter
  likesCount: number;            // [Prototype-local] Counter
  comments: Comment[];           // [Prototype-local] Embedded comments array
}

// ==========================================
// 3. Discussion Comment Model
// ==========================================
interface Comment {
  id: string;                    // [Required] Unique ID
  storyId: string;               // [Required] Target story ID
  authorId: string;              // [Required] Commenter user ID
  authorName: string;            // [Required] Display name
  authorAvatar: string;          // [Required] Avatar image URL
  content: string;               // [Required] Comment body text
  createdAt: string;             // [Required] ISO-8601 timestamp
}

// ==========================================
// 4. Bookmark Model
// ==========================================
interface Bookmark {
  userId: string;                // [Required] User owning bookmark
  storyId: string;               // [Required] Bookmarked story ID
  createdAt: string;             // [Required] Timestamp saved
}
```

### Data Tier Boundaries
* **Prototype Tier (Local Storage):** Session tokens, active user profile, draft states, user-specific bookmark arrays, newly published story objects, and added comments.
* **Production Tier (Future Cloud Backend):** Encrypted password authentication, cloud PostgreSQL/Supabase database tables, S3 image asset uploads, and server-side authorization checks.

---

## 12. Component Architecture

```text
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx             # Three-column dashboard frame
│   │   ├── TopNavigation.jsx        # Search, Write CTA, Notifications, Profile
│   │   ├── SidebarNavigation.jsx    # Left navigation links and topic list
│   │   ├── RightSidebar.jsx         # Community picks and writers to follow
│   │   └── MobileNavigation.jsx     # Bottom navigation for mobile screens
│   ├── auth/
│   │   ├── AuthLayout.jsx           # Split-pane reading room frame
│   │   ├── LoginForm.jsx            # Email/password form with demo one-click
│   │   └── SignupForm.jsx           # New account registration form
│   ├── story/
│   │   ├── StoryFeed.jsx            # Tabbed stream of editorial story cards
│   │   ├── StoryCard.jsx            # Individual card with metadata and actions
│   │   ├── StoryReader.jsx          # Full prose reading layout with typography
│   │   ├── CommentSection.jsx       # Discussion thread and comment form
│   │   └── BookmarkButton.jsx       # Reusable bookmark toggle control
│   ├── studio/
│   │   ├── WriterStudio.jsx         # Focused drafting canvas and toolbar
│   │   ├── EditorToolbar.jsx        # Markdown formatting controls
│   │   ├── StoryPreview.jsx         # Live preview before publishing
│   │   └── StoryManager.jsx         # Table view of published/draft stories
│   └── common/
│       ├── ProtectedRoute.jsx       # Route guard redirecting to /login
│       ├── SearchBar.jsx            # Debounced search input
│       ├── TopicChip.jsx            # Category filter pill
│       ├── EmptyState.jsx           # Standard zero-data placeholder
│       ├── ErrorState.jsx           # Visual failure fallback
│       ├── LoadingSkeleton.jsx      # Shimmer placeholder during load
│       ├── ConfirmDialog.jsx        # Destructive action modal
│       └── Toast.jsx                # Floating feedback notification
```

### Core Component Responsibilities
* `ProtectedRoute`: Evaluates `isAuthenticated` from `AuthContext`. Renders children if verified; otherwise stores target location in redirect state and forwards to `/login`.
* `AppShell`: Coordinates dashboard grid layouts, responsive breakpoints, top bar, and active drawer states.
* `StoryFeed`: Consumes active tab (*For you*, *Following*, *Latest*) and category filters, rendering an array of `StoryCard` components.
* `WriterStudio`: Houses drafting state, autosave timer, title/body inputs, word counter, and publishing modal.
* `ConfirmDialog`: Traps focus and captures user confirmation before permanently deleting or unpublishing a story.

---

## 13. State Management

To maintain high performance without bloated external state libraries, Quill utilizes a **Dual Context & Custom Hook Architecture**.

```text
               ┌─────────────────────────────────────┐
               │             App.jsx                 │
               └──────────────────┬──────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────┐                             ┌──────────────────┐
│   AuthContext    │                             │   BlogContext    │
├──────────────────┤                             ├──────────────────┤
│ • currentUser    │                             │ • stories        │
│ • sessionToken   │                             │ • bookmarks      │
│ • login()        │                             │ • activeFilter   │
│ • logout()       │                             │ • createStory()  │
│ • register()     │                             │ • updateStory()  │
└──────────────────┘                             │ • deleteStory()  │
                                                 │ • toggleBookmark │
                                                 └──────────────────┘
```

### 1. `AuthContext`
* **Manages:** `currentUser`, `sessionToken`, `isAuthenticated`, `login()`, `logout()`, `register()`.
* **Persistence:** Synchronizes `quill_session` and `quill_user` with `localStorage`.
* **Behavior:** Survives browser refreshes and tab reloads.

### 2. `BlogContext`
* **Manages:**
  * `stories`: Master list initialized from curated seeds and augmented with user creations.
  * `bookmarks`: User's bookmarked story ID set.
  * `activeFilter`: Current selected topic filter.
  * `searchQuery`: Debounced search term.
  * CRUD actions: `createStory()`, `updateStory()`, `deleteStory()`, `toggleBookmark()`, `addComment()`.
* **Persistence:** Persists updated story arrays to `quill_custom_stories`.

---

## 14. Responsive and Accessibility Plan

### Responsive Breakpoint Specifications
* **Mobile (360px – 390px):**
  * Left and right sidebars are hidden.
  * Bottom navigation rail activated (height 60px).
  * Story cards display single-column cover images with wrapped titles.
  * Header search collapses into an expandable overlay icon.
* **Tablet (768px):**
  * Left sidebar condenses to a 64px compact icon rail.
  * Central feed expands to full remaining container width.
  * Right context sidebar remains hidden to ensure reading comfort.
* **Laptop (1024px):**
  * Left sidebar expands to full 220px width.
  * Feed remains centered at 680px width.
* **Desktop (1440px):**
  * Full three-column layout (Left: 240px, Center: 720px, Right: 320px).

### Accessibility (a11y) Standards
* **Keyboard Navigation:** All interactive elements (`button`, `a`, input chips) are accessible via standard `Tab` / `Shift+Tab` flows with high-visibility emerald focus rings (`outline: 2px solid #10B981; outline-offset: 2px`).
* **Modal Accessibility:** `ConfirmDialog` and preview modals bind `Escape` keys to close, lock background scroll, and trap focus using refs.
* **Contrast Compliance:** Warm ivory text (`#F5F2EB`) against obsidian background (`#0E0E10`) produces a contrast ratio $> 14:1$, exceeding WCAG AAA standards.
* **Reduced Motion:** All transitions wrapped in `@media (prefers-reduced-motion: reduce)` to disable layout animations for sensitive users.

---

## 15. Loading, Empty, and Error States

| Context | State Trigger | Visual Representation | Next Action CTA |
| :--- | :--- | :--- | :--- |
| **Authentication** | Invalid credentials | Crimson border glow on input with inline error text | *"Try Demo Account"* button |
| **Feed Discovery** | Loading articles | 3 animated shimmering skeleton card placeholders | Passive wait state |
| **Topic Filter** | 0 stories in category | Illustration of an empty manuscript with friendly copy | *"Clear filter"* pill button |
| **Global Search** | No keyword matches | Magnifying glass icon with *"No stories matching '{query}'"* | *"Reset search"* button |
| **Bookmarks** | No saved articles | Open book icon with *"Your shelf is waiting for good reads"* | *"Explore community feed"* |
| **My Stories** | No drafts or published | Quill feather icon with *"You haven't written any essays"* | *"+ Write your first story"* |
| **Story Reader** | Invalid slug / 404 | *"This story has vanished into the margins"* | *"Back to Community Home"* |
| **Writer Studio** | Empty title or body | Toast warning: *"Please provide a title and story body"* | Highlights empty input field |

---

## 16. Prototype Limitations and Security Notes

### Crucial Engineering Disclaimers

> [!IMPORTANT]
> **Client-Side Prototype Authentication:** The authentication system implemented in this phase is a client-side prototype. Passwords are validated locally and are never transmitted over a real network. In a production build, passwords must be securely hashed and managed through standard protocols (OAuth2, Argon2, Supabase Auth, Firebase Auth).

> [!WARNING]
> **Local Storage Limitations:** All story creation, bookmark toggles, and drafted articles are persisted using browser `localStorage`. Data will not synchronize across different devices or separate browser profiles. Clearing browser site data will reset the application to its curated seed state.

> [!NOTE]
> **Production Migration Pathway:** The component boundaries and data contracts in this architecture mirror production REST and GraphQL backends. Swapping the mock data layer for remote endpoints requires zero modifications to the UI presentation or route layer.

---

## 17. Testing and Acceptance Checklist

### 1. Authentication Suite
- [ ] Application loads `/login` by default when no session exists.
- [ ] Attempting to visit `/community`, `/write`, or `/bookmarks` while logged out redirects to `/login`.
- [ ] One-Click Demo button populates valid credentials and logs in immediately.
- [ ] Submitting invalid credentials displays an inline error without page refresh.
- [ ] Logging in transitions the user to `/community`.
- [ ] Session survives hard browser refresh (`Ctrl+F5` / `Cmd+Shift+R`).
- [ ] Clicking *"Sign Out"* removes the session token and redirects to `/login`.

### 2. Community & Feed Suite
- [ ] Central feed loads default curated seed articles under the *For you* tab.
- [ ] Clicking topic filter chips (*Design*, *Technology*, *AI*) instantly filters the visible cards.
- [ ] Real-time search filters cards by title, summary, or author name.
- [ ] Bookmarking an article card toggles the bookmark icon and updates the `/bookmarks` list.
- [ ] Clicking an article card opens the full story page at `/story/:slug`.
- [ ] Clicking a writer's name opens their author profile.

### 3. Writer Studio Suite
- [ ] Clicking `+ Write` in the top bar opens `/write`.
- [ ] Typing in the title and body updates the live word counter and reading-time calculation.
- [ ] Autosave indicator displays *"Draft saved locally"*.
- [ ] Clicking *"Preview"* presents the story in reader formatting.
- [ ] Clicking *"Publish"* transitions the post to published status and redirects to `/my-stories`.
- [ ] The newly published post appears at the top of the Community Home feed.
- [ ] Drafts and published stories can be edited and safely deleted.

### 4. Responsive & Accessibility Suite
- [ ] Tested and verified on Mobile viewport (360px – 390px): Bottom nav active, zero horizontal scroll.
- [ ] Tested on Tablet viewport (768px): Left rail compact, right sidebar collapsed.
- [ ] Tested on Desktop viewport (1440px): Three columns balanced.
- [ ] Keyboard navigation functions across all buttons and inputs.
- [ ] Focus outlines are visible across all controls.

---

## 18. Phased Implementation Roadmap

### Phase 1: Authentication Core & Route Shell
* **Goals:** Establish design tokens, route guards, and split-pane Login/Signup views.
* **Deliverables:** `AuthContext`, `ProtectedRoute`, `AuthLayout`, `LoginForm`, `SignupForm`.
* **Routes:** `/login`, `/signup`, `/`.
* **Acceptance Criteria:** Booting the app renders the Login screen; authenticating creates a session token.

### Phase 2: Community Dashboard Shell
* **Goals:** Build the three-column layout, top navigation, and sidebar navigation.
* **Deliverables:** `AppShell`, `TopNavigation`, `SidebarNavigation`, `RightSidebar`, `MobileNavigation`.
* **Routes:** `/community`.
* **Acceptance Criteria:** Successful login transitions directly into the three-column dashboard.

### Phase 3: Story Discovery & Reader
* **Goals:** Seed editorial data, build feed tabs, search filtering, and full article reader.
* **Deliverables:** `BlogContext`, `StoryFeed`, `StoryCard`, `StoryReader`, `CommentSection`.
* **Routes:** `/community`, `/explore`, `/story/:slug`.
* **Acceptance Criteria:** Users can browse, search, filter, and read stories with comment support.

### Phase 4: Writer Studio & Story Management
* **Goals:** Build markdown drafting canvas, live word counts, preview, and personal story manager.
* **Deliverables:** `WriterStudio`, `EditorToolbar`, `StoryPreview`, `StoryManager`.
* **Routes:** `/write`, `/write/:id/edit`, `/write/:id/preview`, `/my-stories`.
* **Acceptance Criteria:** Users can draft, preview, publish, edit, and delete stories.

### Phase 5: Bookmarks, Polish & Responsive Optimization
* **Goals:** Connect bookmark shelf, profile preferences, responsive mobile drawers, and build verification.
* **Deliverables:** `BookmarkList`, `SettingsView`, `EmptyState`, `Toast`.
* **Routes:** `/bookmarks`, `/settings`.
* **Acceptance Criteria:** Full responsive validation across viewports, 0 build errors.

---

## 19. Definition of Done

The first version of Quill is officially complete when:
1. **Direct Entry Verification:** Visiting the app opens the **Login** screen first; there is no public marketing page.
2. **Seamless Authentication:** Valid credentials or the Demo Account redirect cleanly to `/community`.
3. **Route Guarding:** Unauthenticated requests to `/community`, `/write`, or `/bookmarks` are redirected to `/login`.
4. **Editorial Community Feed:** Community Home renders articles in a three-column layout with search, category chips, and tabs.
5. **Full Reading Experience:** Clicking any article opens `/story/:slug` with full typography, author bio, and bookmarking.
6. **Functional Writer Studio:** Users can write, preview, publish, and delete stories with real-time word count and autosave.
7. **Complete State Handling:** Every view provides polished loading, empty, and error feedback states.
8. **Responsive Fidelity:** Layout adapts cleanly across mobile (360px), tablet (768px), and desktop (1440px) with zero horizontal overflow.
9. **Build Cleanliness:** `npm run build` succeeds without compiler errors, dead imports, or runtime crashes.

---

## 20. Open Decisions

1. **Rich Markdown vs. Block-based Canvas:** Should the Writer Studio support standard markdown formatting or an inline block-based editor? *(Recommendation: Standard markdown with toolbar buttons gives maximum reliability and zero dependency overhead).*
2. **Default Feed Tab on Login:** Should the initial view default to *For you* (interest-based) or *Latest* (chronological)? *(Recommendation: Default to 'For you' to highlight editorial curation).*
