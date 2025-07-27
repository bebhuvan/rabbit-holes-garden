# Rabbit Holes Blog - Critical Issues Report

## Current Status: Typography & Layout Issues Need Immediate Attention

### 🔴 CRITICAL ISSUES

#### 1. Individual Post Pages - Typography Completely Broken
**Problem**: Post content is nearly unreadable
- Font inconsistency between homepage and individual posts
- Text appears to still be using serif font despite multiple attempts to fix
- Spacing between paragraphs is cramped (users report "horrible readability")
- Headings have insufficient spacing and hierarchy
- Individual post titles may not be displaying properly

**Files Affected**:
- `/src/pages/posts/[slug].astro` - Individual post layout
- `/src/components/PostCard.astro` - Homepage post cards (conflicting global styles)

**Attempted Fixes That Failed**:
- Changed font-family from 'Source Serif 4' to 'Manrope' with !important
- Added `.single-post` specificity to override global styles
- Multiple attempts at spacing adjustments
- User reports no visual changes despite code changes

#### 2. CSS Specificity & Global Style Conflicts
**Problem**: PostCard.astro has global styles that override individual post styles
- `<style is:global>` in PostCard.astro affects all `.post-content` elements
- Individual post styles are being overridden despite higher specificity
- Font changes aren't taking effect (users see no difference)

**Code Locations**:
```
/src/components/PostCard.astro lines 146-200+ (global styles)
/src/pages/posts/[slug].astro lines 252-320+ (individual post styles)
```

#### 3. Missing Post Titles in Individual Posts
**Problem**: Individual blog posts may not be showing titles properly
- User reported "That post has no heading"
- Post title should be prominently displayed at top of individual posts

### 🟡 MEDIUM PRIORITY ISSUES

#### 4. Link Previews Styling Inconsistency
**Problem**: LinkPreview components work but styling needs refinement
- Components render correctly in HTML but visual appearance is poor
- Different styling between homepage feed and individual posts
- Twitter embeds show "Loading tweet..." instead of actual tweets

#### 5. Hover Effects Removed But May Need Selective Restoration
**Problem**: Removed ALL hover effects per user request
- All transitions and animations disabled
- Some subtle hover effects might improve UX without being "bouncy"

### 📋 DETAILED TECHNICAL ANALYSIS

#### Root Cause Analysis
The main issue appears to be **CSS cascade problems**:

1. **PostCard Global Styles Override Everything**:
   ```css
   /* This affects ALL .post-content everywhere */
   .post-content {
     font-family: 'Source Serif 4', Georgia, serif; /* OLD PROBLEM */
   }
   ```

2. **Astro Scoped Styles Not Working As Expected**:
   - Individual post styles should have higher specificity
   - `!important` declarations aren't taking effect
   - Possible CSS loading order issues

3. **Font Loading Issues**:
   - Both Manrope and Source Serif 4 are loaded in BaseLayout
   - Browser may be defaulting to serif despite CSS changes

#### Current File Structure Issues
```
src/
├── components/
│   ├── PostCard.astro (GLOBAL STYLES - PROBLEM SOURCE)
│   └── LinkPreview.astro (Working but needs styling polish)
├── pages/
│   ├── posts/[slug].astro (INDIVIDUAL POSTS - STYLES NOT WORKING)
│   └── index.astro (Homepage - Working better)
└── layouts/
    └── BaseLayout.astro (Loads both fonts - potential conflict)
```

### 🛠️ IMMEDIATE ACTION REQUIRED

#### Priority 1: Fix Typography System
1. **Remove all global .post-content styles from PostCard.astro**
2. **Create separate, specific classes for homepage vs individual posts**
3. **Test font changes are actually taking effect in browser**
4. **Verify post titles are displaying properly**

#### Priority 2: Rebuild Individual Post Layout
1. **Start fresh with individual post typography**
2. **Ensure proper heading hierarchy (H1 title, H2 sections, etc.)**
3. **Fix paragraph and heading spacing for readability**
4. **Test with the new digital-minimalism.mdx post**

#### Priority 3: Polish Link Previews
1. **Ensure consistent styling across contexts**
2. **Fix Twitter embed loading issues**
3. **Verify YouTube embeds display properly**

### 📄 RECENT CHANGES LOG

#### Last Session Changes (Not Working):
- Modified `/src/pages/posts/[slug].astro` typography styles
- Changed fonts from serif to sans-serif with !important
- Increased spacing between paragraphs and headings
- Added dark mode support for new styles
- Created new test post: `digital-minimalism.mdx`

**User Feedback**: "Nothing has changed :("

#### Working Features:
- Homepage post cards display correctly
- Link preview components render (but need styling)
- Dark mode toggle works
- Individual post routing works
- Navigation and basic layout work

### 🎯 SUCCESS CRITERIA

For the next session, success means:
1. **Typography is readable** - Clean, consistent sans-serif font
2. **Proper spacing** - Adequate white space between paragraphs and headings  
3. **Clear hierarchy** - Post titles, section headers, and body text are visually distinct
4. **User satisfaction** - "Looks much better now" instead of "nothing changed"

### 💡 RECOMMENDED APPROACH FOR NEXT DEVELOPER

1. **Start by checking what's actually rendering in browser**:
   - Use browser dev tools to inspect computed styles
   - Verify which CSS rules are actually applied
   - Check if font files are loading correctly

2. **Simplify the CSS architecture**:
   - Remove global styles that cause conflicts
   - Use more specific class names
   - Consider using CSS modules or scoped styles

3. **Test changes incrementally**:
   - Make one change at a time
   - Verify in browser before proceeding
   - Get user feedback early and often

---

**Generated**: January 2025  
**Status**: Critical - Typography system needs complete overhaul  
**Next Session Priority**: Fix individual post readability immediately