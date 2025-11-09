# Implementation Plan: Update Static Page Contents from blog.omerald.com

## Overview
This plan outlines the changes needed to update the Next.js app to match the content and structure of http://blog.omerald.com/

## Website Analysis

### Key Sections Identified:
1. **Navigation Bar**: Home, Articles, Contact Us, Login
2. **Hero Section**: "Omerald" branding with tagline
3. **Mission Statement**: Medical Ecosystem description
4. **Latest Articles**: Recent health articles with metadata
5. **Health Topics**: Categorized health content
6. **Popular Articles**: Most viewed/important articles
7. **Healthy Practices Section**: Lifestyle improvement content
8. **Contact Form**: User inquiry form
9. **Footer**: Site links, mission, copyright

---

## Implementation Plan

### Phase 1: Home Page Updates (`app/page.tsx`)

#### Current State:
- ✅ Has hero section
- ✅ Has mission statement
- ✅ Has latest articles section
- ✅ Has health topics section
- ✅ Has healthy practices section

#### Updates Needed:

1. **Hero Section Enhancement**
   - Update hero text to match exact website copy
   - Add visual styling to match website design
   - Ensure "Omerald" branding is prominent

2. **Mission Statement Section**
   - Verify exact text matches: "A Medical Ecosystem to bring back glorious Indian Medical System along with all other proven medical systems all around the world to bring best medical care to Indians belonging to various walks of life."
   - Add proper styling and layout

3. **Latest Articles Section**
   - Display format: Title, Author, Date, Health Topics
   - Show article preview/short description
   - Add "Read More" functionality
   - Display article images if available
   - Format: Card-based layout with metadata

4. **Popular Articles Section** (NEW)
   - Add new section for "Most popular articles"
   - Include articles like:
     - "How to be safe from Covid 19"
     - "Do's and Don'ts during Corona Pandemic"
     - "Challenges faced by health care professionals..."
     - "What is Diabetes"
   - Create API endpoint to fetch popular articles (by views/ratings)
   - Display with "Learn More" buttons

5. **Health Topics Section**
   - Display health topics as cards/links
   - Show topic name and description
   - Link to topic detail pages

6. **Healthy Practices Section**
   - Update text: "Most people ignore healthy practices and get lifestyle issues. Please check below lifestyle articles"
   - Add links to lifestyle-related articles
   - Style as call-to-action section

---

### Phase 2: Static Content Updates

#### 2.1 Header Component (`app/components/Header.tsx`)
- ✅ Already has correct navigation links
- ✅ Has Omerald branding
- **Action**: Verify styling matches website exactly

#### 2.2 Footer Component (`app/components/Footer.tsx`)
- ✅ Has mission statement
- ✅ Has site overview links
- **Updates Needed**:
  - Verify all footer links exist (FAQ, Privacy Policy, User Agreement)
  - Update copyright year to 2025
  - Match exact footer structure from website

#### 2.3 Contact Page (`app/contact/page.tsx`)
- **Updates Needed**:
  - Create contact form matching website structure
  - Form fields: Name, Email, Subject, Message (all required *)
  - Add "Send Message" button
  - Include "Get In Touch" heading
  - Add "You can send contact enquiry" description
  - Style to match website design

#### 2.4 Articles Page (`app/articles/page.tsx`)
- **Updates Needed**:
  - Display all articles in grid/list format
  - Filter by health topics
  - Search functionality
  - Pagination
  - Show article metadata (author, date, topics)

#### 2.5 Article Detail Page (`app/articles/[slug]/page.tsx`)
- **Updates Needed**:
  - Display full article content
  - Show author information
  - Display health topics as tags
  - Show publication date
  - Add related articles section
  - Display article image

---

### Phase 3: Database Integration

#### 3.1 Articles Table Schema (Already exists)
Based on database schema provided:
- `id` (bigint, primary key)
- `writer_id` (bigint, foreign key)
- `title` (varchar)
- `slug` (varchar)
- `short_description` (text)
- `description` (longtext)
- `health_topics` (varchar) - comma-separated or single value
- `status` (tinyint) - 1=Approved, 2=Submitted, 3=In draft, 4=Rejected
- `image` (varchar)
- `created_at`, `updated_at` (timestamp)

#### 3.2 API Endpoints Needed

**Existing Endpoints to Verify:**
- ✅ `GET /api/articles` - List articles
- ✅ `GET /api/articles/[id]` - Get single article
- ✅ `GET /api/health-topics` - List health topics
- ✅ `GET /api/health` - Health check

**New Endpoints to Create:**
- `GET /api/articles/popular` - Get popular articles
- `GET /api/articles?topic={topic}` - Filter by health topic
- `GET /api/contact` - POST endpoint for contact form
- `GET /api/writers/[id]` - Get writer information (if needed)

---

### Phase 4: Content Structure

#### 4.1 Article Display Format
From website analysis, articles should display:
- **Title**: Bold, prominent
- **Author**: Writer name (e.g., "Venu Gopal", "Ganga Urmila")
- **Date**: Publication date (e.g., "Feb 28, 2022")
- **Health Topics**: Tags/categories (e.g., "Food and Nutrition", "Indian culture")
- **Short Description**: Preview text
- **Image**: Article featured image (if available)

#### 4.2 Health Topics Format
- Display as cards or list items
- Show topic name
- Link to topic detail page
- Show article count per topic (optional)

#### 4.3 Popular Articles Section
Articles to highlight:
1. "How to be safe from Covid 19"
2. "Do's and Don'ts during Corona Pandemic"
3. "Challenges faced by health care professionals..."
4. "What is Diabetes"

**Implementation**: 
- Create API endpoint that fetches articles by popularity (views, ratings, or manual selection)
- Display in dedicated section on homepage
- Style with "Learn More" buttons

---

### Phase 5: Styling & Design Updates

#### 5.1 Color Scheme
- Match website color palette
- Ensure consistent branding
- Update CSS variables if needed

#### 5.2 Typography
- Match font families
- Ensure proper heading hierarchy
- Match text sizes and weights

#### 5.3 Layout
- Match spacing and padding
- Ensure responsive design
- Match card/grid layouts

#### 5.4 Components
- Article cards
- Health topic cards
- Popular article cards
- Contact form styling
- Button styles

---

### Phase 6: Missing Pages/Components

#### 6.1 Pages to Create/Update:
1. **FAQ Page** (`app/faq/page.tsx`) - NEW
   - Create FAQ page with common questions
   - Link from footer

2. **Privacy Policy Page** (`app/privacy/page.tsx`) - NEW
   - Create privacy policy page
   - Link from footer

3. **User Agreement Page** (`app/user-agreement/page.tsx`) - NEW
   - Create user agreement page
   - Link from footer

4. **Login Page** (`app/login/page.tsx`)
   - Verify login form matches website
   - Add authentication logic

5. **Health Topics Detail Page** (`app/health-topics/[slug]/page.tsx`)
   - Display topic information
   - Show articles in that topic
   - Add filtering

---

### Phase 7: Content Migration

#### 7.1 Static Text Content
Update all static text to match website exactly:

**Homepage:**
- Hero text: "Omerald" with tagline
- Mission statement (exact copy)
- Section headings
- Button text

**Footer:**
- Copyright: "(C) Copyright 2025 - Omerald. All rights reserved."
- Site overview links
- Mission statement

**Contact Page:**
- "Get In Touch" heading
- "You can send contact enquiry" description
- Form field labels with asterisks for required fields

#### 7.2 Dynamic Content
- Articles will be fetched from database via API
- Health topics will be fetched from database
- Writer information will be fetched from database

---

## Implementation Checklist

### Priority 1 (Critical - Homepage)
- [ ] Update hero section text and styling
- [ ] Verify mission statement text matches exactly
- [ ] Add "Popular Articles" section
- [ ] Update "Latest Articles" display format
- [ ] Update "Healthy Practices" section text
- [ ] Verify health topics display

### Priority 2 (Important - Navigation & Pages)
- [ ] Update contact page form to match website
- [ ] Verify articles listing page
- [ ] Verify article detail page
- [ ] Update footer links and content
- [ ] Verify header navigation

### Priority 3 (Enhancement - Additional Pages)
- [ ] Create FAQ page
- [ ] Create Privacy Policy page
- [ ] Create User Agreement page
- [ ] Update login page if needed

### Priority 4 (API & Database)
- [ ] Verify all API endpoints work correctly
- [ ] Create popular articles API endpoint
- [ ] Create contact form API endpoint
- [ ] Test database connections
- [ ] Verify article filtering by health topics

### Priority 5 (Styling & Polish)
- [ ] Match color scheme
- [ ] Match typography
- [ ] Match spacing and layout
- [ ] Ensure responsive design
- [ ] Test on multiple devices

---

## Database Considerations

### Articles Table
- Status field: Only show articles with `status = 1` (Approved) on public pages
- Health topics: May be comma-separated string, need to parse for display
- Images: Verify image paths/URLs are correct
- Writer ID: May need to join with writers table for author names

### Health Topics
- May be stored in separate table or as comma-separated in articles
- Need to extract unique topics from articles
- Create topic detail pages

### Popular Articles
- Determine popularity metric (views, ratings, manual selection)
- May need to add `views` column or use `article_ratings`
- Or create separate "featured" flag

---

## Notes

1. **Content Source**: Most content will come from database via API calls
2. **Static Content**: Only navigation, mission statement, and section headings are static
3. **Responsive Design**: Ensure all pages work on mobile, tablet, and desktop
4. **Performance**: Use Next.js caching and optimization features
5. **SEO**: Ensure proper meta tags and structured data
6. **Accessibility**: Ensure WCAG compliance

---

## Next Steps

1. Review this plan
2. Prioritize which sections to implement first
3. Begin with Priority 1 items (homepage updates)
4. Test each section as it's implemented
5. Iterate based on feedback

---

## Questions to Clarify

1. How are "popular articles" determined? (views, ratings, manual selection?)
2. Are health topics stored in a separate table or as comma-separated strings?
3. Is there a writers table to get author names?
4. What is the image storage solution? (URLs, local files, CDN?)
5. Should we implement search functionality?
6. What authentication system is used for login?

