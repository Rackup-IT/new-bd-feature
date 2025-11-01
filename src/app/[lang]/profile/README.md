# Profile Page Component

## Overview

This directory contains the user profile page implementation that matches The Conversation's design pattern.

## Structure

```
profile/
└── [username]/
    ├── page.tsx           # Server component (route handler)
    └── profile-client.tsx # Client component (UI logic)
```

## Route

**URL Pattern:** `/[lang]/profile/[username]`

**Examples:**
- `/en/profile/asher-kaufman`
- `/bn/profile/john-doe`

## Component Architecture

### page.tsx (Server Component)
- Handles route parameters (lang, username)
- Fetches dictionary for internationalization
- Passes props to client component

### profile-client.tsx (Client Component)
- Manages UI state (tabs, loading)
- Fetches profile data from API
- Renders profile layout with:
  - Header (image, name, stats)
  - Tabs (Profile, Articles, Activity)
  - Bio & Experience
  - Contact sidebar

## API Integration

**Endpoint:** `GET /api/v1/profile/[username]`

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "image": "string",
  "title": "string",
  "institution": "string",
  "institutionSlug": "string",
  "bio": "string",
  "articlesCount": 0,
  "commentsCount": 0,
  "experience": [...],
  "contactFor": [...],
  "location": "string",
  "orcid": "string",
  "joinedDate": "ISO date string"
}
```

## Features

### Implemented
✅ Profile photo display
✅ Stats display (articles, comments)
✅ Tab navigation (Profile, Articles, Activity)
✅ Biography section
✅ Experience timeline
✅ Contact information
✅ Location & ORCID links
✅ Join date display
✅ Institution link
✅ Loading states
✅ Error handling
✅ Responsive design
✅ Internationalization (en/bn)

### Pending
⏳ Articles tab content
⏳ Activity tab content
⏳ Contact form functionality
⏳ Edit profile (for owners)
⏳ Real database integration

## Styling

Uses Tailwind CSS with:
- Gray-50 background
- White cards with shadow-sm
- Teal-600 buttons
- Blue-600 links
- Responsive grid layout

## Dictionary Keys

Required keys in `dictionaries/[lang].json`:

```json
{
  "profile": {
    "profile-not-found": "Profile not found",
    "articles": "Articles",
    "comments": "Comments",
    "sign-in-to-contact": "Sign in to contact",
    "profile": "Profile",
    "activity": "Activity",
    "experience": "Experience",
    "contact-for": "Contact",
    "for": "for",
    "joined": "Joined"
  }
}
```

## Usage Example

```tsx
// Link to profile from anywhere in the app
import Link from "next/link";

<Link href={`/${lang}/profile/${username}`}>
  View Profile
</Link>
```

## Testing

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/en/profile/asher-kaufman`
3. Test tab switching
4. Test responsive layout (resize browser)
5. Test Bengali version: `/bn/profile/asher-kaufman`

## Database Schema Recommendation

```typescript
// MongoDB/Database schema
interface UserProfile {
  _id: ObjectId;
  username: string; // unique, used in URL
  name: string;
  email: string;
  image?: string;
  title: string;
  institution: string;
  institutionId?: ObjectId;
  bio: string;
  experience: Array<{
    period: string;
    title: string;
    organization: string;
  }>;
  contactFor: string[];
  location?: string;
  orcid?: string;
  website?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
  createdAt: Date;
  articlesCount: number; // computed or cached
  commentsCount: number; // computed or cached
}
```

## Performance Considerations

- Profile data is fetched client-side (could be moved to server)
- Consider implementing ISR (Incremental Static Regeneration)
- Cache profile data with appropriate revalidation
- Lazy load Articles/Activity tabs when clicked
- Optimize images with Next.js Image component

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for images
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast ratios meet WCAG AA standards
