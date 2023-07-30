import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    my_rpc_chain: {
      url: process.env.RPC_URL,
      chainId: parseInt(process.env.CHAIN_ID || "0"),
      accounts: {
        mnemonic: process.env.SECRET
      }
    }
  },
  etherscan: {
    apiKey: process.env.API_KEY
  }
};

export default config;
