import React from 'react';
import './Header.css';
import GooeyNav from './GooeyNav';


interface HeaderProps {
  title?: string;
  showNavigation?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = "the gallery",
  showNavigation = true
}) => {
  const navItems = [
    { label: "monad testnet", href: "https://testnet.monad.xyz/" },
    { label: "buy monad nfts", href: "https://magiceden.us/monad-testnet" },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <a href="/" className="header-title-link">
            <h1 className="header-title">{title}</h1>
          </a>
        </div>
        
        {showNavigation && (
          <div className="header-nav">
            <GooeyNav
              items={navItems}
              particleCount={12}
              particleDistances={[60, 8]}
              particleR={80}
              initialActiveIndex={0}
              animationTime={500}
              timeVariance={200}
              colors={[1, 2, 3, 4]}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 