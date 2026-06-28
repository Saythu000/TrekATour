# Review Feature Setup Instructions

## Database Setup

1. **Run the SQL migration in Supabase:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the contents of `add-trip-reviews-table.sql`

## Features Added

### For Users/Customers:
- **Review Section**: Added to each trip details page
- **Photo Clicks**: Clicking review photos redirects to Instagram (links hidden)
- **YouTube Links**: Visible and clickable for users
- **Maximum 5 Reviews**: Per trip limit enforced

### For Admin:
- **Review Management Tab**: New tab in admin dashboard
- **Add Reviews**: Form to add review text, images, Instagram & YouTube links
- **Review Limit**: Maximum 5 reviews per trip enforced
- **Delete Reviews**: Ability to remove reviews
- **Trip Selection**: Choose which trip to manage reviews for

## Files Modified/Added:

### New Components:
- `src/components/TripReviews.tsx` - Displays reviews on trip pages
- `src/components/admin/AdminReviewManager.tsx` - Admin review management

### Modified Files:
- `src/pages/TripDetails.tsx` - Added review section
- `src/pages/Admin.tsx` - Added review management tab
- `src/integrations/supabase/types.ts` - Added review table types

### Database:
- `add-trip-reviews-table.sql` - Creates trip_reviews table

## Usage:

1. **Admin**: Go to Admin Dashboard → "Manage Reviews" tab
2. **Select Trip**: Choose a trip to manage reviews for
3. **Add Review**: Fill form with text, image URL, Instagram link, YouTube link
4. **Users**: Visit any trip page to see reviews (if any exist)
5. **Click Photos**: Users can click review photos to visit Instagram

## Security:
- Instagram links are hidden from users in UI
- Only authenticated admin users can add/delete reviews
- Public read access for displaying reviews
- Row Level Security (RLS) enabled on reviews table
