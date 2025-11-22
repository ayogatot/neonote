# Privacy Policy for NeoNote

**Last Updated:** November 22, 2024

## Data Collection

NeoNote does **NOT** collect, transmit, or share any personal data. All data is stored locally on your device using Chrome's built-in storage API.

## What Data is Stored

The extension stores the following data **locally on your device only**:

- Text content of sticky notes you create
- Position coordinates (x, y) of sticky notes
- Color and minimized state of sticky notes
- The URL where each note was created (to display it back on the correct page)

## Data Storage

- All data is stored using `chrome.storage.local` API
- Data never leaves your browser
- No analytics, tracking, or telemetry is implemented
- No external servers are contacted
- No cookies are used

## Permissions Used

The extension requests the following permissions:

- **activeTab**: To access the currently active webpage when you interact with the extension
- **storage**: To save your sticky notes locally on your device
- **host permissions (<all_urls>)**: To allow the content script to run and display sticky notes on any website you visit

These permissions are used **only** for the core functionality of creating and displaying sticky notes.

## Third-Party Services

Context Sticky does **NOT** use any third-party services, analytics, or tracking tools.

## Data Deletion

You can delete all stored data at any time by:
1. Opening the extension popup and clicking "Clear All Notes" for specific pages
2. Or removing the extension entirely from Chrome

## Changes to This Policy

Any changes to this privacy policy will be updated in this document and in the extension listing.

## Contact

For questions or concerns about privacy, please contact [@ayogatot](https://github.com/ayogatot).
