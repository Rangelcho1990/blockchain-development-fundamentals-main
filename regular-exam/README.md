# Staking Pool System

A decentralized auction system consisting of an IERC20 token (NFT) and a StakingPool contract.

## Env example
WEB3_PROVIDER_URL=your_sepolia_rpc_url
WEB3_PROVIDER_PRIVETE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key

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
npx hardhat deploy --owner <owner-address> --network sepolia
```

## Contract Verification

Contracts are automatically verified on Etherscan when deployed to Sepolia.

### Verified Contracts (Sepolia)

- StakeX: []()
- StakingPool: [0x385D016452b69aF22604F11dEc5297d6352396C5](https://sepolia.etherscan.io/address/0x385D016452b69aF22604F11dEc5297d6352396C5#code)
