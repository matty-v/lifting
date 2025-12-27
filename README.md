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
2. Create a new Google Sheet (can be empty)
3. Open the app, go to Settings, and enter your Google Spreadsheet ID
4. Click "Initialize Sheets" - the app will automatically create all required sheets:
   - `exercises` - for storing exercise definitions and max weights
   - `routines` - for defining workout routines
   - `sets` - for tracking individual lift sets
   - `weight` - for body weight tracking

## Deployment

Upload to Google Cloud Storage:

```bash
./upload-to-gcs.sh YOUR_BUCKET_NAME
```

## License

MIT
