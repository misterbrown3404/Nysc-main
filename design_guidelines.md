# NYSC Camp Cruise & Challenge Hub - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Instagram (visual sharing), TikTok (challenge trends), and Duolingo (gamification), combined with vibrant Nigerian youth culture aesthetics. This is an experience-focused social platform where energy, fun, and visual appeal drive engagement.

**Core Design Principles**:
- Bold, energetic, and youthful
- Mobile-first design optimized for camp sharing
- Gamified interactions with instant feedback
- Celebratory of Nigerian NYSC culture

---

## Color Philosophy

While specific colors will be defined later, establish visual hierarchy through contrast between primary, secondary, and accent zones. Use NYSC's iconic green and white as foundational references, complemented by vibrant accent zones for hype moments, challenge badges, and reactions.

---

## Typography System

**Primary Font**: **Poppins** (Google Fonts) - Friendly, modern, geometric
- Headers: Bold (700) for energy and impact
- Subheadings: SemiBold (600)
- Body: Regular (400)
- Accents: Medium (500)

**Secondary Font**: **Inter** (Google Fonts) - Clean readability for UI elements
- Navigation, buttons, labels: Medium (500)
- Captions, metadata: Regular (400)

**Hierarchy**:
- Hero Headlines: text-5xl lg:text-7xl font-bold
- Section Titles: text-3xl lg:text-5xl font-bold
- Challenge Cards: text-2xl font-semibold
- Body Text: text-base lg:text-lg
- Labels/Meta: text-sm font-medium

---

## Layout System

**Spacing Scale**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistency
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-4 to gap-8
- Button padding: px-6 py-3

**Grid System**:
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns for challenges (md:grid-cols-2)
- Desktop: 3 columns for content grid (lg:grid-cols-3)
- Leaderboard: Full-width cards with split content

**Container Strategy**:
- Max-width: max-w-7xl mx-auto
- Full-bleed for hero and trending sections
- Contained grids for challenge cards and leaderboards

---

## Component Library

### Navigation
- **Sticky Top Nav**: Logo left, countdown timer center, profile/notifications right
- **Bottom Tab Bar** (mobile): Home, Challenges, Camera/Upload (center elevated), Leaderboard, Profile
- Mobile navigation icons use large touch targets (h-12 w-12)

### Hero Section
- **Full-width energetic banner** with NYSC camp imagery (group photos, parade, camp activities)
- Overlay gradient for text readability
- **Hero CTA**: "Join Today's Challenge" with blurred background button
- 21-Day countdown prominently displayed with animated numbers
- Motivational camp quote rotation

### Challenge Cards
- **Masonry grid layout** for varied content sizes
- Card structure:
  - Thumbnail image/video preview (16:9 aspect ratio)
  - Challenge title with emoji icon
  - Participant count and trending indicator
  - Quick action buttons (View, Join, Share)
- Rounded corners (rounded-xl)
- Subtle shadow on hover (hover:shadow-2xl transition)

### Content Feed (Challenge Submissions)
- **Instagram-style cards**:
  - User avatar, name, platoon, state (top)
  - Full-width media (square aspect ratio for consistency)
  - Reaction bar: Hype button (fire emoji), Comment count, Share
  - Hype points displayed prominently
- Infinite scroll implementation
- "Load more" at intervals

### Leaderboard Component
- **Top 3 Podium Style** (1st place elevated center, 2nd left, 3rd right)
- Profile avatars with ranking badges
- Full list below with rank number, avatar, name, state, total hype points
- Filter tabs: Daily, Weekly, All-time, My Platoon

### Upload/Camera Flow
- **Full-screen modal** for challenge participation
- Camera interface mockup for video/photo capture
- Challenge selector dropdown
- Caption input with emoji picker
- Preview before submit
- Success animation on post

### Reactions & Gamification
- **Hype Button**: Large, animated fire emoji that scales on click
- **Badge System**: Achievement badges for participation milestones
- **Streak Counter**: Daily participation tracking
- Toast notifications for achievements

### Footer
- Quick links: About NYSC Cruise, Community Guidelines, Contact
- Social media links (Instagram, Twitter, WhatsApp group)
- Disclaimer: "For entertainment during NYSC camp only"
- Copyright with camp year

---

## Images

**Hero Image**: Wide landscape shot of NYSC corps members in white uniforms during parade or camp activities, showing energy and community. Vibrant, high-quality, diverse group representation. Place as full-width background with gradient overlay.

**Challenge Thumbnails**: User-generated content placeholders showing camp activities (e.g., parade formations, platoon photos, mess hall moments, drills, Man O' War activities).

**Leaderboard Avatars**: Circular profile photos with colorful ring borders indicating rank levels.

**Achievement Badges**: Icon-style graphics (medals, ribbons, stars) for milestones.

---

## Responsive Behavior

**Mobile (base - md)**:
- Single column layouts
- Bottom navigation bar
- Stacked challenge cards
- Full-width hero
- Simplified leaderboard (top 3 only initially)

**Tablet (md - lg)**:
- 2-column challenge grid
- Side navigation option
- Extended leaderboard view

**Desktop (lg+)**:
- 3-column challenge grid
- Sidebar navigation with quick stats
- Multi-column feed layouts
- Persistent leaderboard sidebar

---

## Interaction Patterns

- **Instant Feedback**: All actions (hype, submit, share) have immediate visual confirmation
- **Smooth Transitions**: 300ms for state changes, card hovers
- **Loading States**: Skeleton screens for content loading
- **Empty States**: Playful illustrations encouraging participation ("Be the first to take this challenge!")

---

## Accessibility

- Icon buttons include aria-labels
- High contrast text over images (guaranteed via gradients/overlays)
- Touch targets minimum 44x44px
- Form inputs with clear labels
- Keyboard navigation support for all interactive elements

This design creates an energetic, social-first experience that celebrates NYSC camp culture while encouraging playful competition and connection among corps members nationwide.