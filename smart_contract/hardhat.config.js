require("@nomicfoundation/hardhat-toolbox");
const {secrets} = require("./secrets")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: secrets.networks.goerli.endpoint,
      accounts: [secrets.networks.goerli.accountPrivateKey]
    }
  }
};
