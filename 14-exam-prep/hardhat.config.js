require("@nomicfoundation/hardhat-toolbox");
require("./tasks");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.25",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.WEB3_PROVIDER_URL,
      accounts: [process.env.WEB3_PROVIDER_PRIVETE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  sourcify: {
    enabled: true,
  },
};
