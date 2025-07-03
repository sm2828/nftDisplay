export const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || '';

// Monad Network Configuration
export const MONAD_CONFIG = {
  chainId: 10143,
  networkName: 'monad-testnet',
  tokenSymbol: 'MON',
  rpcUrl: `https://monad-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  explorerUrl: 'https://testnet.monadscan.io'
}; 