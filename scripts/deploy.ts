import { ethers } from "hardhat";

async function main() {

  const MabesiAzukiNFT = await ethers.getContractFactory("MabesiAzukiNFT");
  const cc = await MabesiAzukiNFT.deploy();

  await cc.deployed();

  console.log(`Mabesi Azuki NFT contract was deployed at ${cc.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
