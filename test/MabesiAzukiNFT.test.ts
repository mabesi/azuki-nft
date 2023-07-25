import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MabesiAzukiNFT", function () {

  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();
    const MabesiAzukiNFT = await ethers.getContractFactory("MabesiAzukiNFT");
    const cc = await MabesiAzukiNFT.deploy();
    return { cc, owner, user };
  }

  it("Should has name", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    expect(await cc.name()).to.equal("MabesiNFT", "Can't get name");
  });

  it("Should has symbol", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    expect(await cc.symbol()).to.equal("MBFT", "Can't get symbol");
  });

  it("Should mint ", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint();
    const balance = await cc.balanceOf(owner.address);
    const tokenId = await cc.tokenByIndex(0);
    const ownerOf = await cc.ownerOf(tokenId);
    const ownerTokenId = await cc.tokenOfOwnerByIndex(owner.address, 0);
    const totalSupply = await cc.totalSupply();

    expect(balance).to.equal(1, "Can't mint (balance)");
    expect(tokenId).to.equal(ownerTokenId, "Can't mint (tokenId)");
    expect(ownerOf).to.equal(owner.address, "Can't mint (ownerOf)");
    expect(totalSupply).to.equal(1, "Can't mint (totalSupply)");
  });

  it("Should burn", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint();
    const tokenId = await cc.tokenByIndex(0);
    await cc.burn(tokenId);

    const balance = await cc.balanceOf(owner.address);
    const totalSupply = await cc.totalSupply();

    expect(balance).to.equal(0, "Can't burn (balance)");
    expect(totalSupply).to.equal(0, "Can't burn (totalSupply)");
  });

  it("Should burn (approved)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint();
    const tokenId = await cc.tokenByIndex(0);
    await cc.approve(user.address, tokenId);

    const approved = await cc.getApproved(tokenId);
    expect(approved).to.equal(user.address, "Can't burn (approved)(approved)");

    const instance = cc.connect(user);
    await instance.burn(tokenId);

    const balance = await cc.balanceOf(owner.address);
    const totalSupply = await cc.totalSupply();

    expect(balance).to.equal(0, "Can't burn (balance)(approved)");
    expect(totalSupply).to.equal(0, "Can't burn (totalSupply)(approved)");
  });

  it("Should burn (approved for all)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint();
    const tokenId = await cc.tokenByIndex(0);
    await cc.setApprovalForAll(user.address, true);

    const approved = await cc.isApprovedForAll(owner.address, user.address);
    expect(approved).to.equal(true, "Can't burn (approved)(approved for all)");

    const instance = cc.connect(user);
    await instance.burn(tokenId);

    const balance = await cc.balanceOf(owner.address);
    const totalSupply = await cc.totalSupply();

    expect(balance).to.equal(0, "Can't burn (balance)(approved for all)");
    expect(totalSupply).to.equal(0, "Can't burn (totalSupply)(approved for all)");
  });

  it("Should NOT burn (not exists)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await expect(cc.burn(1)).to.be.revertedWith("ERC721: invalid token ID");
  });

  it("Should NOT burn (permission)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint();
    const tokenId = await cc.tokenByIndex(0);
    const instance = cc.connect(user);
    await expect(instance.burn(tokenId)).to.be.revertedWith("ERC721: caller is not token owner or approved");
  });

  it("Should has URI metadata", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint();
    const tokenId = await cc.tokenByIndex(0);
    expect(await cc.tokenURI(tokenId)).to.equal("https://mabesinftcollection.com/nft/1.json", "Can't get URI metadata");
  });

  it("Should NOT has URI metadata", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await expect(cc.tokenURI(1)).to.be.revertedWith("ERC721: invalid token ID");
  });

  it("Should transfer", async function () {
      const { cc, owner, user } = await loadFixture(deployFixture);
      await cc.mint();
      const tokenId = await cc.tokenByIndex(0);
      await  cc.transferFrom(owner.address, user.address, tokenId);

      const balanceFrom = await cc.balanceOf(owner.address);
      const balanceTo = await cc.balanceOf(user.address);
      const ownerOf = await cc.ownerOf(tokenId);
      const ownerTokenId = await cc.tokenOfOwnerByIndex(user.address, 0);
  
      expect(balanceFrom).to.equal(0, "Can't transfer");
      expect(balanceTo).to.equal(1, "Can't transfer");
      expect(ownerOf).to.equal(user.address, "Can't transfer");
      expect(ownerTokenId).to.equal(tokenId, "Can't transfer");
  });

  it("Should emit transfer", async function () {
      const { cc, owner, user } = await loadFixture(deployFixture);
      await cc.mint();
      const tokenId = await cc.tokenByIndex(0);
      await expect(cc.transferFrom(owner.address, user.address, tokenId)).to
                  .emit(cc, "Transfer")
                  .withArgs(owner.address, user.address, tokenId);
  });

  it("Should transfer (approved)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);

    await cc.mint();

    const tokenId = await cc.tokenByIndex(0);
    await cc.approve(user.address, tokenId);
    const approved = await cc.getApproved(tokenId);
    expect(approved).to.equal(user.address, "Can't transfer (approved)");

    const instance = cc.connect(user);
    await  instance.transferFrom(owner.address, user.address, tokenId);
    const ownerOf = await cc.ownerOf(tokenId);

    expect(ownerOf).to.equal(user.address, "Can't transfer (approved)");
  });

  it("Should emit approval", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint();
    const tokenId = await cc.tokenByIndex(0);
    await expect(cc.approve(user.address, tokenId)).to
                .emit(cc, "Approval")
                .withArgs(owner.address, user.address, tokenId);
  });
  
  it("Should clear approvals", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint();
    const tokenId = await cc.tokenByIndex(0);
    await cc.approve(user.address, tokenId);
    await  cc.transferFrom(owner.address, user.address, tokenId);
    const approved = await cc.getApproved(tokenId);
    expect(approved).to.equal("0x0000000000000000000000000000000000000000", "Can't clear approvals");
  });

  it("Should transfer (approved for all)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);

    await cc.mint();

    const tokenId = await cc.tokenByIndex(0);
    await cc.setApprovalForAll(user.address, true);
    const approved = await cc.isApprovedForAll(owner.address, user.address);
    expect(approved).to.equal(true, "Can't transfer (approved)(approved for all)");

    const instance = cc.connect(user);
    await  instance.transferFrom(owner.address, user.address, tokenId);
    const ownerOf = await cc.ownerOf(tokenId);

    expect(ownerOf).to.equal(user.address, "Can't transfer (owner of)(approved for all)");
  });  

  it("Should emit approval for all", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint();
    const tokenId = await cc.tokenByIndex(0);
    await expect(cc.setApprovalForAll(user.address, true)).to
                .emit(cc, "ApprovalForAll")
                .withArgs(owner.address, user.address, true);
  });

  it("Should NOT transfer (permission)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    
    await cc.mint();
    const tokenId = await cc.tokenByIndex(0);
    const instance = cc.connect(user);    

    await expect(instance.transferFrom(owner.address, user.address, tokenId)).to
                .be.revertedWith("ERC721: caller is not token owner or approved");
  });

  it("Should NOT transfer (token not exists)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    
    await expect(cc.transferFrom(owner.address, user.address, 1)).to
                .be.revertedWith("ERC721: invalid token ID");
  });

  it("Should supports interface", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    expect(await cc.supportsInterface("0x80ac58cd")).to.equal(true,"Can't support interface");
  });

}); // End Describe
