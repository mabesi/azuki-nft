# Mabesi Azuki NFT Collection

A personal and educational project with a complete professional NFT structure, that implements the Azuki [ERC-721A](https://www.azuki.com/erc721a).

## :speech_balloon: Description

<p align="justify">ERC-721A is an implementation of IERC721 with significant gas savings for minting multiple NFTs in a single transaction.
The Azuki contract will enable minting multiple NFTs for essentially the same cost of minting a single NFT.</p>
<p align="justify">This project is a simple implementation of Azuki standard, with the most important functionalities for an NFT Smart Contract.</p>

<table>
    <tr>
        <td colspan='2'>
            <kbd>
                <img src="./assets/mabesi-azuki-nft-contract.png" />
            </kbd>
        </td>
    </tr>
    <tr>
        <td>
            <img src="./assets/mabesi-azuki-nft-read.png" />
        </td>
        <td>
            <img src="./assets/mabesi-azuki-nft-write.png" />
        </td>
    </tr>
<table>

### 🛠️ Features

These are the key features of an ERC-721A smart contract:

- Optimization 1 - Removing duplicate storage from OpenZeppelin’s (OZ) ERC721Enumerable
- Optimization 2 - updating the owner’s balance once per batch mint request, instead of per minted NFT
- Optimization 3 - updating the owner data once per batch mint request, instead of per minted NFT

### 🏗️ Built With

- Solidity
- TypeScript
- Hardhat

## Getting Started

### 📋 Prerequisites

- Node.js
- CLI/Terminal
- IDE or Text Editor
- Wallet address in an EVM compatible chain
- Balance to deploy the Smart Contract

### :arrow_down: Install

Not applicable.

### :gear: Configuration

Clone the `.env.example` file into a new `.env` file.
After this, adjust the `SECRET` with your seed phrase, `API_KEY` with your API Key (get it in a production block explorer), `RPC_URL` with the RPC url of your chain  and `CHAIN_ID` with the Chain ID of the chain.

```bash
# MetaMask mnemonic 12-word phrase
SECRET=

# Blockchain API Key (get in EtherScan, BSC Scan, SnowTrace, ...)
API_KEY=

# RPC Server URL (e.g. "https://api.avax-test.network/ext/bc/C/rpc")
RPC_URL=

# RPC Chain ID (e.g 43113)
CHAIN_ID=
```

Change the "MabesiAzukiNFT" for the name of your choice.
Change the "MBAFT" for the symbol of your choice.

```solidity
    constructor() ERC721A("MabesiAzukiNFT", "MBAFT") {
        _owner = payable(msg.sender);
    }
```

Change the 0.01 for the price of your choice.

```solidity
    function mint(uint256 quantity) public payable {
        require(msg.value >= (0.01 ether * quantity), "Insufficient payment");
        _mint(msg.sender, quantity);
    }
```

Change the 0.01 for the price of your choice.

```solidity
    function mint(uint256 quantity) public payable {
        require(msg.value >= (0.01 ether * quantity), "Insufficient payment");
        _mint(msg.sender, quantity);
    }
```

After create the [Metadata URI JSON Schema](https://eips.ethereum.org/EIPS/eip-721#specification), adjust your Base URI Metadata address in this function.

```solidity
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmPbCf6w9TZdVhroWyBZ6LY2cDkex6Qe7eLiXG3sEUHYWF/";
    }
```

And, finally, change the Contract URI metadata address:

```solidity
    function contractURI() public pure returns (string memory) {
        return "ipfs://QmQRmf8h6SGBrfBTqBxUzDmzZAfDxjL6scV5bDBJSBmSeP";
    }
```

### 👨‍💻 Testing

To test your ERC-721A smart contract run this command:

```bash
$ npm test
```

To test and view the tests coverage of your ERC-721A smart contract run this command:

```bash
$ npm run cov
```

### 👷 Deploy

To deploy your ERC-721A smart contract run this command:

```bash
$ npm run deploy
```

With the deployed contract address in the hands, run this command to verify it:

```bash
$ npm run verify <contract_address>
```

### :arrow_forward: Usage

You can interact with your deployed contract in two ways

1. By your chain's block explorer

- Find the Contract Address: First, you need to know the address of the deployed smart contract. This address is a hexadecimal string (e.g., 0x123abc...) and serves as the unique identifier for the contract on the blockchain.
- Open the Block Explorer: Choose a blockchain block explorer that supports the network where your contract is deployed. Examples of popular block explorers are Etherscan for Ethereum and BscScan for Binance Smart Chain. Go to the website of the block explorer you want to use.
- Search for the Contract Address: In the search bar of the block explorer, enter the contract address you want to interact with and click "Search" or a similar button. The block explorer will display the contract's details, including its code, transactions, and events.
- Interacting with Functions: If the smart contract has public functions that can be called, the block explorer might provide a user interface to interact with those functions. You may need to look for a "Read Contract" or "Write Contract" section. In some block explorers, this feature is available in the "Contract" or "Smart Contract" tab.
  - Read Functions: For read-only functions (functions that don't modify the state), you can call them directly from the block explorer's interface, and it will display the returned value.
  - Write Functions: To interact with write functions (functions that modify the state), you will need to provide the necessary parameters and possibly your wallet's signature for authentication. After filling in the required details, submit the transaction.
- Transaction Confirmation: When you send a transaction to the contract, the block explorer will provide a transaction hash. You can use this hash to track the status of the transaction on the blockchain. It may take some time for the transaction to be mined and confirmed by the network.
- View Transaction History and Events: The block explorer will also show the transaction history of the contract, including all past interactions. Additionally, if the contract emits events, you can find and explore those events in the block explorer to see the details of each event occurrence.

_It's essential to be cautious when interacting with smart contracts, especially when executing write functions, as blockchain transactions are irreversible. Always double-check the inputs and the contract's behavior to avoid unintended consequences.
Keep in mind that the specific steps and options available for interacting with a smart contract through a block explorer may vary based on the block explorer's design and the features supported by the underlying blockchain network._

2. Use the [Mabesi Azuki NFT DApp](https://github.com/mabesi/dapp-nft) as your Frontend interface user. This DApp was made with React/Next.js to be integrant part of this NFT smart contract.

### 🔧 Troubleshooting

Contracts published on the blockchain are immutable. Thus, if it is necessary to correct any errors or make any changes, you must deploy again, generating a new contract address and reinitializing all state variable information.

It is possible to perform data migration in case of a new deployment of the contract, but for this you must make a plan, performing the backup beforehand and creating a migration script.

## Back Matter

### :clap: Acknowledgements

Thanks to all these amazing people and tools that served as a source of knowledge or were an integral part in the construction of this project.

- [Hardhat](https://hardhat.org/) - Development Environment for Ethereum software
- [OpenZepellin](https://www.openzeppelin.com/) - Web3 Solidity Libraries
- [Azuki](https://www.azuki.com) - Anime Avatar NFT Collection Community
- [Pinata](https://app.pinata.cloud/) - IPFS File Sharing
- [Node.js](https://nodejs.org/) - JavaScript Runtime Environment
- [Ethers.js](https://ethers.org/) - Web3 Library
- [TypeScript](https://www.typescriptlang.org/) - Typed Programming Language
- [LuizTools](https://www.luiztools.com.br/) - JavaScript and Web3 Online Courses

### 🔎 See Also

- [Basic Token ERC-20](https://github.com/mabesi/solidity-coin-erc20)
- [Basic Token BEP-20](https://github.com/mabesi/solidity-coin-bep20)
- [Basic NFT ERC-721](https://github.com/mabesi/solidity-nft-erc721)
- [Basic Multi Token ERC-1155](https://github.com/mabesi/solidity-multitoken-erc1155)
- [Mabesi Azuki NFT DApp](https://github.com/mabesi/dapp-nft)

### ✒️ Authors & Contributors

| [<img loading="lazy" src="https://github.com/mabesi/mabesi/blob/master/octocat-mabesi.png" width=115><br><sub>Plinio Mabesi</sub>](https://github.com/mabesi) |
| :---: |


### 👮🏼‍♂️ Legal Disclaimer

<p align="justify">This tool was created for educational purposes and has the sole purpose of serving as an example of the implementation of a Smart Contract following the proposed standards, in accordance with what is contained in the references.</p>
<p align="justify">The use of this tool, for any purpose, will occur at your own risk, being your sole responsibility for any legal implications arising from it.</p>
<p align="justify">It is also the end user's responsibility to know and obey all applicable local, state and federal laws. Developers take no responsibility and are not liable for any misuse or damage caused by this program.</p>

### 📜 License

This project is licensed under the [MIT License](LICENSE.md).