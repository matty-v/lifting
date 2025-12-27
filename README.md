# Lifting Tracker

A Progressive Web App (PWA) for tracking weightlifting workouts and body weight progress.

## Features

- **Exercise Tracking**: Log exercises with weight, percentage of max, and reps
- **Routines**: Create and follow workout routines with automatic set completion tracking
- **Body Weight Tracking**: Monitor body weight over time
- **Progress Charts**: Visualize lifting and weight progress with Chart.js
- **Offline Support**: Works offline via service worker caching
- **Installable**: Can be installed on mobile devices as a standalone app
- **Google Sheets Backend**: Uses Google Sheets as a database via SheetsDb API

## Tech Stack

- React 18 (via CDN)
- Tailwind CSS
- Chart.js
- Service Worker for offline support
- Google Cloud Storage for hosting

## Setup

1. Deploy a [SheetsDb API](https://github.com/matty-v/sheetsdb) instance
2. Create a Google Sheet with the following sheets:
   - `exercises` - columns: Exercise, 100pct, 90pct, 80pct, 70pct, 60pct, Warmup
   - `routines` - columns: Routine, Exercise, Percentage, Reps
   - `lifting` - columns: Date, Exercise, Weight, Percentage, Reps, Notes, Routine
   - `weight` - columns: Date, Weight
3. Open the app and enter your Google Spreadsheet ID

## Deployment

Upload to Google Cloud Storage:

```bash
./upload-to-gcs.sh YOUR_BUCKET_NAME
```

## License

MIT
