import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import dotenv from 'dotenv';

dotenv.config();

// Mabesi Azuki NFT contract was deployed at 0xa018Fc9DecA4A08661Cb214f666538ED988fdfB3
// Successfully verified contract MabesiAzukiNFT on Etherscan.
// https://testnet.snowtrace.io/address/0xa018Fc9DecA4A08661Cb214f666538ED988fdfB3#code

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    avaxtest: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: {
        mnemonic: process.env.SECRET
      }
    }
  },
  etherscan: {
    apiKey: process.env.AVAX_API_KEY
  }
};

export default config;
