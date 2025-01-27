require("@nomicfoundation/hardhat-toolbox");
require("./tasks/index.js");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    sepolia: {
      url: process.env.WEB3_PROVIDER_URL,
      accounts: [process.env.WEB3_PROVIDER_PRIVETE_KEY],
    },
  },
  solidity: "0.8.28",
};
