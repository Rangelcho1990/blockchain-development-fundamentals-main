# Auction House System

A decentralized auction system consisting of an ERC721 token (NFT) and a AuctionHouse contract.

## Installation

1. Install dependencies

```bash
npm install
```

2. Create `.env` file

```bash
WEB3_PROVIDER_URL=your_sepolia_rpc_url
WEB3_PROVIDER_PRIVETE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Testing

Run the test suite:

```bash
npx hardhat test
```

Run test coverage:

```bash
npx hardhat coverage
```

## Deployment

Deploy both contracts to Sepolia:

```bash
npx hardhat deploy --owner <nft-owner-address> --network sepolia
```

### Deployment Parameters

- `owner`: address of the NFT contract owner

## Contract Verification

Contracts are automatically verified on Etherscan when deployed to Sepolia.

### Verified Contracts (Sepolia)

- NFT: [0x0947fF392B6A8b2a6d553166ca9Ad3EfeB3BBB92](https://sepolia.etherscan.io/address/0x0947fF392B6A8b2a6d553166ca9Ad3EfeB3BBB92#code)
- AuctionHouse: [0x6e9144337948077FDf207ad3b1d7aAa90110393F](https://sepolia.etherscan.io/address/0x6e9144337948077FDf207ad3b1d7aAa90110393F#code)
