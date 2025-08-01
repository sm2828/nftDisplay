import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SearchContainer from './components/SearchContainer'
import Iridescence from './components/Iridescence'
import Header from './components/Header'
import Footer from './components/Footer'
import CyclingText from './components/CyclingText'
import ImageGallery from './components/ImageGallery'

function App() {
  const [showGallery, setShowGallery] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    setWalletAddress(query.trim());
    setShowGallery(true);
  };

  const titleSentences = [
    "john w is begging to keep his job",
    "keone will fire him",
    "molandak is the best",
    "icl ts fast",
    "keone kiss",
    "kb onion",
    "purple",
    "nfts",
    "one billion txs",
    "'the gallery' lol",
    "one quadrillion txs",
  ];

  return (
    <>
      <Iridescence
        color={[1, 1, 1]}
        mouseReact={true}
        amplitude={0.15}
        speed={0.8}
      />
      
      <div className="app-layout">
        <Header />
        
        <main className="main-content">
          <div className="hero-section">
            <h1 className="hero-title">
              <CyclingText 
                sentences={titleSentences} 
                className="hero-cycling-text"
              />
            </h1>
            <p className="hero-subtitle">
              uhhh
            </p>
            <SearchContainer 
              onSearch={handleSearch}
              placeholder="wallet address"
              buttonText="search"
            />
          </div>
        </main>
        
        <ImageGallery 
          isVisible={showGallery} 
          walletAddress={walletAddress}
        />
        
        <Footer />
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
