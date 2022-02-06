require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    rinkeby: {
      network_id: 4,
      provider: () =>
        new HDWalletProvider(process.env.SEED_PHRASE, process.env.ALCHEMY_KEY),
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
    },
  },
};
