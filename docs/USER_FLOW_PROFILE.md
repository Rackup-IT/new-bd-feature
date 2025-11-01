# User Flow: Article → Author Profile

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      ARTICLE PAGE                            │
│  /en/some-article-slug                                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  AUTHOR SECTION (Sidebar - Desktop)                 │    │
│  │  ┌──────────┐                                       │    │
│  │  │  Photo   │  [Yeasin Arafat] ← CLICKABLE         │    │
│  │  └──────────┘  I am student                         │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  On Mobile: Same link in collapsible author details         │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    USER CLICKS NAME
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   NAVIGATION HAPPENS                         │
│  Route: /en/profile/65a1b2c3d4e5f6789012345                │
│  (Uses author's _id from database)                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  API CALL: GET /api/v1/profile/[id]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE QUERY                            │
│  MongoDB: authors.findOne({ _id: ObjectId("...") })        │
│  Result: { name, occupation, bio, profileImage, ... }      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PROFILE PAGE LOADS                        │
│  /en/profile/65a1b2c3d4e5f6789012345                       │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │  ┌──────────┐  Yeasin Arafat               │            │
│  │  │  Photo   │  I am student                 │            │
│  │  │  128x128 │  University of Dhaka          │            │
│  │  └──────────┘                                │            │
│  │                                              │            │
│  │  [16 Articles]  [0 Comments]                │            │
│  │  [Sign in to contact]                       │            │
│  └────────────────────────────────────────────┘            │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │ [Profile] [Articles] [Activity]             │  ← TABS   │
│  └────────────────────────────────────────────┘            │
│                                                              │
│  ┌──────────────────────┬─────────────────────┐            │
│  │  BIOGRAPHY           │  CONTACT INFO       │            │
│  │  Experience details  │  - General          │            │
│  │  Publications        │  - Media request    │            │
│  │  Research interests  │  - Speaking         │            │
│  │                      │  Location: Dhaka    │            │
│  └──────────────────────┴─────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  USER CLICKS "ARTICLES" TAB
                            ↓
             API CALL: GET /api/v1/profile/[id]/articles
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE QUERY                            │
│  MongoDB: posts.find({ writter: authorId })                │
│  Result: [{ title, slug, desscription, createdAt }, ...]   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 ARTICLES LIST DISPLAYS                       │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │ [Profile] [Articles ✓] [Activity]           │            │
│  └────────────────────────────────────────────┘            │
│                                                              │
│  📄 Article 1 Title (Clickable)                             │
│     Brief description...                                     │
│     Published: January 15, 2025                             │
│  ──────────────────────────────────────────────             │
│  📄 Article 2 Title (Clickable)                             │
│     Brief description...                                     │
│     Published: January 10, 2025                             │
│  ──────────────────────────────────────────────             │
│  📄 Article 3 Title (Clickable)                             │
│     Brief description...                                     │
│     Published: January 5, 2025                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                USER CLICKS AN ARTICLE TITLE
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              BACK TO ARTICLE PAGE                            │
│  /en/article-slug-here                                       │
│  (User can repeat the cycle)                                 │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Article Page Author Link
**Location:** Desktop sidebar + Mobile collapsible

**Component:** `AuthorDetail.tsx`
```tsx
<Link href={`/${lang}/profile/${authorData._id}`}>
  {authorData.name}
</Link>
```

**Trigger:** User clicks blue author name

---

### 2. Profile Page (Server Component)
**File:** `src/app/[lang]/profile/[username]/page.tsx`

**Responsibilities:**
- Receives route params (lang, username/id)
- Fetches dictionary for i18n
- Passes data to client component

---

### 3. Profile Client Component
**File:** `profile-client.tsx`

**Responsibilities:**
- Fetches profile data from API
- Manages tab state
- Renders profile layout
- Handles loading states

**API Calls:**
1. **On Mount:** `GET /api/v1/profile/[username]`
2. **On Articles Tab Click:** `GET /api/v1/profile/[username]/articles`

---

### 4. Profile API
**File:** `src/app/api/v1/profile/[username]/route.ts`

**Process:**
1. Receive username/id parameter
2. Query MongoDB authors collection
3. Count articles by author
4. Format response data
5. Return JSON

**Response:**
```json
{
  "_id": "65a1b2c3...",
  "name": "Yeasin Arafat",
  "image": "https://...",
  "title": "I am student",
  "institution": "University of Dhaka",
  "bio": "...",
  "articlesCount": 16,
  "commentsCount": 0,
  "experience": [...],
  "contactFor": [...],
  "location": "Dhaka, Bangladesh",
  "joinedDate": "2024-01-15"
}
```

---

### 5. Articles API
**File:** `src/app/api/v1/profile/[username]/articles/route.ts`

**Process:**
1. Find author by username/id
2. Query posts collection
3. Sort by date (newest first)
4. Return array of articles

**Response:**
```json
{
  "articles": [
    {
      "_id": "...",
      "title": "Article Title",
      "slug": "article-slug",
      "desscription": "...",
      "createdAt": "2025-01-15T..."
    }
  ],
  "count": 16
}
```

---

## State Management

### Profile Page States
```typescript
const [profile, setProfile] = useState<ProfileData | null>(null);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState<"profile">("profile");
const [articles, setArticles] = useState<any[]>([]);
const [articlesLoading, setArticlesLoading] = useState(false);
```

### Loading States
1. **Initial:** Show full-page spinner
2. **Profile Loaded:** Show content + Profile tab
3. **Articles Tab Clicked:** Fetch articles
4. **Articles Loading:** Show spinner in tab
5. **Articles Loaded:** Display list

---

## Error Handling

### Scenarios Handled
1. **Author not found** → "Profile not found" message
2. **Database error** → Falls back to mock data
3. **No articles** → "No articles found" message
4. **Network error** → Console log + user feedback

---

## Mobile vs Desktop

### Mobile (< 768px)
- Single column layout
- Author info in collapsible `<details>`
- Full-width cards
- Stacked sections

### Desktop (≥ 768px)
- Two-column layout (7:5 ratio)
- Author always visible in sidebar
- Sticky contact info
- Side-by-side bio + contact

---

## Internationalization

### Supported Languages
- English (`/en/profile/...`)
- Bengali (`/bn/profile/...`)

### Translated Elements
- Tab names
- Button text
- Date formats
- Error messages
- Contact options

---

## Performance Considerations

### Optimizations
✅ Client-side fetching with loading states
✅ Lazy loading articles (only on tab click)
✅ MongoDB projections (exclude password)
✅ Article count cached in profile response
✅ Next.js Image component for photos

### Future Optimizations
- [ ] Server-side rendering for initial profile data
- [ ] ISR for cached profiles
- [ ] Pagination for articles
- [ ] Virtual scrolling for long lists

---

## Testing Checklist

- [ ] Click author name from article page
- [ ] Profile loads with correct data
- [ ] Photo displays correctly
- [ ] Stats show accurate counts
- [ ] Click Articles tab
- [ ] Articles list loads
- [ ] Click article title → navigates correctly
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768-1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Test Bengali version (`/bn/profile/...`)
- [ ] Test with author who has no articles
- [ ] Test with invalid author ID
- [ ] Test with database disconnected

---

## Common Issues & Solutions

### Issue: Author link not working
**Solution:** Ensure `post.writter._id` exists in API response

### Issue: Profile shows "Not found"
**Solution:** Check author ID format (must be valid ObjectId)

### Issue: Articles not loading
**Solution:** Verify `writter` field in posts matches `_id` in authors

### Issue: Images not showing
**Solution:** Check `profileImage` field contains valid URL

### Issue: Bengali text not displaying
**Solution:** Ensure proper UTF-8 encoding in database
