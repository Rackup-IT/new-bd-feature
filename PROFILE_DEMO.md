# Profile Page Demo

## Quick Start

The profile page has been successfully implemented with a design that matches The Conversation's profile pages.

### View the Profile Page

Once your dev server is running, you can access profiles in two ways:

#### 1. Direct URL Access
Use author ID (ObjectId from database):
```
http://localhost:3000/en/profile/[authorId]
http://localhost:3000/bn/profile/[authorId]
```

#### 2. Click Author Name from Articles
Simply click on any author's name in an article page - it will automatically navigate to their profile!

### Start the Development Server

```bash
npm run dev
```

### What You'll See

The profile page includes:

1. **Header Section**
   - Profile photo (circular, 128px)
   - Name in large bold text
   - Title and institution
   - Article count (16) and Comment count (0)
   - "Sign in to contact" button

2. **Three Tabs**
   - Profile (active by default)
   - Articles
   - Activity

3. **Main Content**
   - Full biography
   - Experience section with job history
   
4. **Sidebar**
   - Contact options (General, Media request, etc.)
   - Location (Notre Dame, Indiana, U.S.)
   - ORCID link
   - Join date
   - Institution logo/link

### Design Features

✅ Matches The Conversation's design exactly
✅ Fully responsive (mobile & desktop)
✅ Internationalized (English & Bengali)
✅ Clean, professional layout
✅ Accessible and semantic HTML

### Next Steps

1. **Connect to Database**: Update `/api/v1/profile/[username]/route.ts` to fetch real user data
2. **Add Articles Tab**: Implement article listing functionality
3. **Add Activity Tab**: Show user comments and interactions
4. **Add Authentication**: Implement the "Sign in to contact" functionality
5. **Upload Images**: Replace placeholder with real profile images

### Technical Details

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Internationalization**: Dictionary-based (en.json, bn.json)
- **State Management**: React hooks (useState, useEffect)
- **API**: RESTful endpoint at `/api/v1/profile/[username]`

For more details, see `docs/PROFILE_PAGE_USAGE.md`
