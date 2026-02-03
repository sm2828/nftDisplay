# NFT Display Gallery

A React TypeScript application for displaying NFTs from any Monad wallet address using the Alchemy API.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Alchemy API Key
1. Go to [Alchemy](https://alchemy.com) and sign up for a free account
2. Create a new app and select "Monad Testnet"
3. Copy your API key

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Alchemy API Configuration for Monad Testnet
VITE_ALCHEMY_API_KEY=your_actual_alchemy_api_key_here
```

**Note**: Make sure to create your Alchemy app for the **Monad Testnet** network (Chain ID: 10143) to work with this application.

### 4. Run the Development Server
```bash
npm run dev
```

## How It Works

### API Integration
The app uses JavaScript's built-in `fetch()` API to call Alchemy's "NFTs By Owner" endpoint for Monad Testnet:

```typescript
const response = await fetch(`${ALCHEMY_BASE_URL}/${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=20`, {
  method: 'GET'
});
```

### Key Features:
- **Wallet Address Input**: Enter any valid Monad wallet address
- **Real NFT Data**: Fetches actual NFT metadata including images, names, and descriptions
- **Error Handling**: Graceful error states for invalid addresses or API issues
- **Loading States**: Visual feedback while fetching data
- **Image Fallbacks**: Handles broken NFT images gracefully

### API Response Handling
The app processes Alchemy's API response to:
1. Filter NFTs with valid images
2. Extract metadata (name, description, image URL)
3. Display in a responsive grid layout

## Usage

1. Enter a wallet address in the search field (e.g., `0x...`)
2. Click "search" to fetch NFTs
3. Browse the gallery of NFTs owned by that address

## Network Information

This application is configured for the **Monad Testnet**:
- **Chain ID**: 10143
- **Network**: monad-testnet
- **Token**: MON
- **Explorer**: https://testnet.monadscan.io

## Technologies Used

- **React 19** with TypeScript
- **Vite** for build tooling
- **Alchemy API** for NFT data on Monad Testnet
- **CSS3** with modern features (backdrop-filter, grid, animations)
- **Native Fetch API** for HTTP requests

## Project Structure

```
src/
├── components/
│   ├── ImageGallery.tsx    # Main NFT display component
│   ├── ImageGallery.css    # Gallery styling
│   └── ...                 # Other UI components
├── main.tsx                # App entry point
└── index.css              # Global styles
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

