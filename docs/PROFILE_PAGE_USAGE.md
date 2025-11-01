# Profile Page Implementation

This document describes the profile page implementation that matches The Conversation's design.

## Overview

A complete profile page has been created at `src/app/[lang]/profile/[username]/` that replicates the design from [The Conversation profile pages](https://theconversation.com/profiles/).

## Features

### Design Elements
- **Header Section**:
  - Circular profile image (150x150px)
  - User name (large, bold heading)
  - Job title and institution (with optional link)
  - Article and comment counts in prominent display
  - "Sign in to contact" CTA button

- **Navigation Tabs**:
  - Profile (default)
  - Articles
  - Activity

- **Profile Content**:
  - Full biography with formatted text
  - Experience section with timeline
  - Contact information sidebar
  - Location, ORCID, and join date
  - Institution logo/link

### Internationalization
The page supports both English and Bengali with translations in:
- `dictionaries/en.json`
- `dictionaries/bn.json`

New dictionary keys added under `profile`:
- `profile-not-found`, `articles`, `comments`
- `sign-in-to-contact`, `profile`, `activity`, `experience`
- `contact-for`, `for`, `joined`
- Contact types: `general`, `media-request`, `speaking-request`, etc.

## Usage

### Access the Profile Page

Visit: `/[lang]/profile/[username]`

Examples:
- `/en/profile/asher-kaufman`
- `/bn/profile/asher-kaufman`

### API Endpoint

The profile data is fetched from: `/api/v1/profile/[username]`

Current implementation uses mock data. To integrate with your database:

```typescript
// In src/app/api/v1/profile/[username]/route.ts
// Replace mock data with:
import { connectDB } from "@/lib/mongodb";

const db = await connectDB();
const profile = await db.collection("users").findOne({ 
  username: username 
});
```

### Data Structure

```typescript
interface ProfileData {
  _id: string;
  name: string;
  image?: string;
  title: string;
  institution: string;
  institutionSlug?: string;
  bio: string;
  articlesCount: number;
  commentsCount: number;
  experience: {
    period: string;
    title: string;
    organization: string;
  }[];
  contactFor: string[];
  location?: string;
  orcid?: string;
  joinedDate?: string;
}
```

## Customization

### Styling
The page uses Tailwind CSS with a gray-50 background and white cards. Colors match The Conversation's design:
- Primary button: teal-600
- Links: blue-600
- Text: gray-900 (headings), gray-700 (body)

### Adding Real Data
1. Update the API route in `src/app/api/v1/profile/[username]/route.ts`
2. Connect to your user database
3. Return profile data in the expected format

### Extending Functionality
- **Articles Tab**: Implement article listing
- **Activity Tab**: Show user comments and interactions
- **Edit Profile**: Add edit functionality for authenticated users
- **Follow/Contact**: Implement contact form or following system

## Files Created

1. **Route Handler**: `src/app/[lang]/profile/[username]/page.tsx`
2. **Client Component**: `src/app/[lang]/profile/[username]/profile-client.tsx`
3. **API Endpoint**: `src/app/api/v1/profile/[username]/route.ts`
4. **Dictionaries**: Updated `en.json` and `bn.json`

## Design Reference

The implementation closely follows the design at:
https://theconversation.com/profiles/asher-kaufman-1480414

Key design principles:
- Clean, professional layout
- Prominent stats display (articles/comments)
- Clear information hierarchy
- Responsive design for mobile/desktop
- Accessibility-friendly
