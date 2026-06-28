# Image Migration to Hostinger - Step by Step Guide

## Step 1: Upload Images to Hostinger (MANUAL)

1. Login to **Hostinger hPanel**
2. Go to **File Manager**
3. Navigate to `public_html/` (or your website root folder)
4. Create a new folder: `images/trips/`
5. Upload ALL 15 images from the `downloaded-images/` folder to `images/trips/`

Your images will be accessible at:
`https://yourdomain.com/images/trips/image-name.jpg`

## Step 2: Update Database with New Image URLs

After uploading images to Hostinger:

1. Open `update-image-urls.js` file
2. Change line 6: Replace `'https://yourdomain.com'` with your actual domain
   Example: `'https://trekatour.com'` or `'https://yourdomain.hostinger.com'`
3. Save the file
4. Run the script:
   ```bash
   cd "/mnt/d/client project/Trek A tour/original file/version-1/trek-a-tour-website-main"
   node update-image-urls.js
   ```

## Step 3: Verify

Refresh your website - all trip images should now load from Hostinger!

## Image List (15 images to upload):
- andharban-devkund-waterfalls-1758414139694 (1).jpg
- camping-kaburlu-1758434919997.jpg
- coorg-chikmagalur-1758380757073.jpg
- gods-own-country-kerala-1758627208279.jpg
- gokarna-honnavar-murudeshwar-dandeli-1758372059244.JPG
- gokarna-murudeshwar-temple-honnavar-backwaters-1758374999827.jpg
- harishchandragad-aadrai-forest-trek-kalu-waterfalls-1758373201505 (1).jpg
- lohagad-fort-andharban-jungle-trek-devkund-waterfalls-1758373871660.jpeg
- meghayala-1758629395661.jpg
- ooty-coonoor-1758415062863.jpg
- pondicherry-mahabalipuram-1758413363589.jpg
- pondicherry-mahabalipuram-pichavaram-mangroove-forest-1758412731522.jpg
- romantic-kashmir-escape-1759904011978 (1).jpg
- scotland-of-india-coorg-1758416311914 (1).jpg
- the-coffee-land-of-karnataka-chikmagalur-1758428320103.jpg
