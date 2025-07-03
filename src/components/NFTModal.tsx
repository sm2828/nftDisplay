import React from 'react';
import './NFTModal.css';
import { MONAD_CONFIG } from '../env';

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  contract: {
    address: string;
  };
}

interface NFTModalProps {
  isOpen: boolean;
  nft: NFT | null;
  onClose: () => void;
}

const NFTModal: React.FC<NFTModalProps> = ({ isOpen, nft, onClose }) => {
  if (!isOpen || !nft) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div 
      className="nft-modal-backdrop" 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="nft-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-content">
          <div className="modal-image-section">
            <img 
              src={nft.image} 
              alt={nft.name}
              className="modal-image"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-nft.png';
              }}
            />
          </div>
          
          <div className="modal-details-section">
            <h2 className="modal-title">{nft.name}</h2>
            
            <div className="modal-detail-group">
              <label>Token ID:</label>
              <div className="copyable-field">
                <span>{nft.tokenId}</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(nft.tokenId)}
                  title="Copy Token ID"
                >
                  📋
                </button>
              </div>
            </div>
            
            <div className="modal-detail-group">
              <label>Contract Address:</label>
              <div className="copyable-field">
                <span>{formatAddress(nft.contract.address)}</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(nft.contract.address)}
                  title="Copy Contract Address"
                >
                  📋
                </button>
              </div>
            </div>
            
            {nft.description && (
              <div className="modal-detail-group">
                <label>Description:</label>
                <p className="modal-description">{nft.description}</p>
              </div>
            )}
            
            <div className="modal-actions">
              <a 
                href={`${MONAD_CONFIG.explorerUrl}/token/${nft.contract.address}?a=${nft.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn monad-explorer-btn"
              >
                View on Monad Explorer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTModal; 