const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const dotenv = require('dotenv');

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  throw dotenvResult.error;
}

const {
  MNEMONIC, INFURA_PROVIDER_URL, INFURA_API_KEY
} = process.env;


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  //contracts_build_directory: path.join(__dirname, "vapp/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      gasPrice: 0,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: new HDWalletProvider(MNEMONIC,`${INFURA_PROVIDER_URL}/${INFURA_API_KEY}`, 0, 10, false ),
      network_id: 4, // eslint-disable-line camelcase
      gasPrice: "7000000000",
      gas: 6000000
    }
  }
};
