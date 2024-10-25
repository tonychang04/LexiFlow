# LexiFlow

LexiFlow is a Chrome extension that automatically adapts web content to the user's education level and interests, making online information more accessible and personalized.

## Features

- Automatically scans web pages for text content
- Adapts content based on user-specified education level and interests
- Easy-to-use popup interface for setting preferences
- Works on any website

## Installation

1. Clone this repository or download the ZIP file and extract it.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click "Load unpacked" and select the directory containing the LexiFlow files.

## Usage

1. Click on the LexiFlow icon in the Chrome toolbar to open the popup.
2. Set your education level and interests in the popup.
3. Navigate to any webpage you want to adapt.
4. Click the "Adapt Current Page" button in the popup.
5. The page content will be processed and adapted according to your settings.

## Development

To modify or extend LexiFlow:

1. Make changes to the relevant files in the project directory.
2. Go to `chrome://extensions/` in Chrome.
3. Find LexiFlow in the list of extensions and click the refresh icon.

### Project Structure

- `manifest.json`: Extension configuration
- `background/background.js`: Background script for handling API calls
- `content/contentScript.js`: Content script for modifying web pages
- `content/contentStyle.css`: Styles for adapted content
- `popup/popup.html`: HTML for the extension popup
- `popup/popup.js`: JavaScript for the popup functionality
- `popup/popup.css`: Styles for the popup
- `options/options.html`: HTML for the options page
- `options/
