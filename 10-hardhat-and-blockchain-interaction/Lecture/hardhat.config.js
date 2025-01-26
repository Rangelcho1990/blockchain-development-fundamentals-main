require("@nomicfoundation/hardhat-toolbox");
require("./tasks/index.js");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // defaultNetwork: "localhost",
  // networks: {
  //   hardhat: {},
  //   sepolia: {
  //     url: "https://sepolia.infura.io/v3/<key>",
  //   }
  // },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 20
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
