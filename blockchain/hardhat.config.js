/* global ethers task */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY],
    },
    fuji: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_FUJI,
      accounts: [process.env.PRIVATE_KEY],
    },
    bsc: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_BSC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  contractSizer: {
    runOnCompile: true,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
