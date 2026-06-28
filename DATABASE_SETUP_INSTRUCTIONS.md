# Database Setup Instructions

## Current Status
The dates and visibility features are working with **localStorage as temporary storage** until the database columns are added.

## To Complete Setup:

### 1. Add Database Columns
Run this SQL in your Supabase SQL Editor:

```sql
-- Add available_dates and is_active columns to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS available_dates TEXT[];
ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing trips to be active by default
UPDATE trips SET is_active = true WHERE is_active IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_trips_is_active ON trips(is_active);
```

### 2. After Adding Columns
Once the database columns are added, you can:

1. Uncomment the database fields in `TripCreateFormSupabase.tsx` (lines with `available_dates` and `is_active`)
2. Update the `getActive()` method to use database filtering instead of localStorage
3. Update the toggle visibility function to use database updates

### 3. Current Functionality (localStorage)
✅ **Working Now:**
- Date management in admin form
- Visibility toggle in admin panel  
- Customer sees only "active" trips
- Booking shows available dates dropdown
- All data stored in localStorage temporarily

### 4. Migration Path
The current localStorage implementation ensures the features work immediately while you set up the database columns.
