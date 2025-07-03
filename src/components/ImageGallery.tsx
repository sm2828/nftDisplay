import React, { useState, useEffect } from 'react';
import './ImageGallery.css';
import { ALCHEMY_API_KEY, MONAD_CONFIG } from '../env';
import NFTModal from './NFTModal';

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  contract: {
    address: string;
  };
}

interface ImageGalleryProps {
  isVisible?: boolean;
  walletAddress?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  isVisible = false,
  walletAddress
}) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ALCHEMY_BASE_URL = 'https://monad-testnet.g.alchemy.com/v2';

  const fetchNFTs = async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Using Alchemy's exact URL format for Monad testnet
      const url = `${ALCHEMY_BASE_URL}/${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=100`;
      const options = { method: 'GET' };
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // For debugging
      console.log('Total NFTs from API:', data.ownedNfts?.length || 0);
      
      // Filter NFTs that have valid metadata and process Monad API response structure
      const nftPromises = data.ownedNfts
        .filter((nft: any) => nft.tokenUri && nft.tokenUri.gateway)
        .map(async (nft: any) => {
          let imageUrl = '';
          
          try {
            // Fetch metadata from tokenUri to get the actual image URL
            const metadataResponse = await fetch(nft.tokenUri.gateway, {
              headers: {
                'Accept': 'application/json',
              },
              signal: AbortSignal.timeout(10000) // 10 second timeout
            });
            
            if (!metadataResponse.ok) {
              throw new Error(`HTTP error! status: ${metadataResponse.status}`);
            }
            
            const metadata = await metadataResponse.json();
            
            // Extract image URL from metadata (try multiple possible fields)
            imageUrl = metadata.image || 
                      metadata.image_url || 
                      metadata.image_data ||
                      metadata.external_url ||
                      metadata.animation_url ||
                      '';
            
            // Handle various URL formats
            if (imageUrl) {
              // Handle IPFS URLs
              if (imageUrl.startsWith('ipfs://')) {
                imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
              }
              // Handle relative URLs
              else if (imageUrl.startsWith('/ipfs/')) {
                imageUrl = 'https://ipfs.io' + imageUrl;
              }
              // Handle gateway.pinata URLs that might be broken
              else if (imageUrl.includes('gateway.pinata.cloud') && !imageUrl.startsWith('http')) {
                imageUrl = 'https://' + imageUrl;
              }
              // Handle data URLs or other protocols
              else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                // Try to construct a proper URL
                if (imageUrl.includes('ipfs')) {
                  const hash = imageUrl.split('/').pop();
                  if (hash && hash.length > 20) { // Basic IPFS hash validation
                    imageUrl = `https://ipfs.io/ipfs/${hash}`;
                  }
                }
              }
            }
            
            // If still no valid image found, try fallback options
            if (!imageUrl) {
              // Try using the tokenUri gateway directly as an image
              imageUrl = nft.tokenUri.gateway;
            }
            
          } catch (error) {
            console.error('Error fetching NFT metadata for token', nft.id.tokenId, ':', error);
            // Fallback: try using the tokenUri gateway directly
            imageUrl = nft.tokenUri.gateway;
          }
          
          return {
            tokenId: nft.id.tokenId,
            name: nft.title || `NFT #${nft.id.tokenId}`,
            description: nft.description || '',
            image: imageUrl,
            contract: {
              address: nft.contract.address
            }
          };
        });

      // Wait for all promises to settle and filter out failed ones
      const settledResults = await Promise.allSettled(nftPromises);
      const validNFTs = settledResults
        .filter((result): result is PromiseFulfilledResult<any> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      console.log('NFTs with tokenUri:', data.ownedNfts?.filter((nft: any) => nft.tokenUri && nft.tokenUri.gateway).length || 0);
      console.log('Successfully processed NFTs:', validNFTs.length);
      console.log('Failed NFTs:', settledResults.filter(result => result.status === 'rejected' || result.value === null).length);

      setNfts(validNFTs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
      console.error('Error fetching NFTs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && walletAddress) {
      fetchNFTs(walletAddress);
    }
  }, [isVisible, walletAddress]);

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNFT(null);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="image-gallery">
      {loading && (
        <div className="loading-state">
          <p>Loading NFTs...</p>
        </div>
      )}
      
      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
          <p>Please check the wallet address and try again.</p>
        </div>
      )}
      
      {!loading && !error && nfts.length === 0 && (
        <div className="empty-state">
          <p>No NFTs found for this wallet address.</p>
        </div>
      )}

      {!loading && nfts.length > 0 && (
        <div className="gallery-grid">
          {nfts.map((nft, index) => (
            <div 
              key={`${nft.contract.address}-${nft.tokenId}`} 
              className="gallery-item"
              onClick={() => handleNFTClick(nft)}
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="gallery-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  
                  // Try alternative IPFS gateways if the first one fails
                  if (target.src.includes('ipfs.io')) {
                    target.src = target.src.replace('ipfs.io/ipfs/', 'gateway.pinata.cloud/ipfs/');
                  } else if (target.src.includes('gateway.pinata.cloud')) {
                    target.src = target.src.replace('gateway.pinata.cloud/ipfs/', 'cloudflare-ipfs.com/ipfs/');
                  } else if (target.src.includes('cloudflare-ipfs.com')) {
                    // Final fallback to a placeholder
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzk5OSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiPk5GVDwvdGV4dD4KPHN2Zz4=';
                    target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              />
              <div className="gallery-overlay">
                <span className="gallery-title">{nft.name}</span>
                {nft.description && (
                  <span className="gallery-description">{nft.description}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <NFTModal
        isOpen={isModalOpen}
        nft={selectedNFT}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ImageGallery; 