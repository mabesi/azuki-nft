import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
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
    expect(await cc.name()).to.equal("MabesiAzukiNFT", "Can't get name");
  });

  it("Should has symbol", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    expect(await cc.symbol()).to.equal("MBAFT", "Can't get symbol");
  });

  it("Should mint", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const balance = await cc.balanceOf(owner.address);
    const tokenId = 0;
    const ownerOf = await cc.ownerOf(tokenId);
        const totalSupply = await cc.totalSupply();

    expect(balance).to.equal(1, "Can't mint (balance)");
    expect(ownerOf).to.equal(owner.address, "Can't mint (ownerOf)");
    expect(totalSupply).to.equal(1, "Can't mint (totalSupply)");
  });

  it("Should NOT mint (insufficient payment)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    expect(cc.mint(1)).to.be.revertedWith("Insufficient payment");
  });

  it("Should burn", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const tokenId = 0;
    await cc.burn(tokenId);

    const balance = await cc.balanceOf(owner.address);
    const totalSupply = await cc.totalSupply();

    expect(balance).to.equal(0, "Can't burn (balance)");
    expect(totalSupply).to.equal(0, "Can't burn (totalSupply)");
  });

  it("Should burn (approved)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const tokenId = 0;
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
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const tokenId = 0;
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
    await expect(cc.burn(1)).to.be.revertedWithCustomError(cc, "OwnerQueryForNonexistentToken");
  });

  it("Should NOT burn (permission)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const tokenId = 0;
    const instance = cc.connect(user);
    await expect(instance.burn(tokenId)).to.be.revertedWithCustomError(cc, "TransferCallerNotOwnerNorApproved");
  });

  it("Should has URI metadata", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const tokenId = 0;
    expect(await cc.tokenURI(tokenId)).to.equal("ipfs://QmPbCf6w9TZdVhroWyBZ6LY2cDkex6Qe7eLiXG3sEUHYWF/0.json", "Can't get URI metadata");
  });

  it("Should has URI contract metadata", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    expect(await cc.contractURI()).to.equal("ipfs://QmQRmf8h6SGBrfBTqBxUzDmzZAfDxjL6scV5bDBJSBmSeP", "Can't get URI contract metadata");
  });

  it("Should NOT has URI metadata", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await expect(cc.tokenURI(1)).to.be.revertedWithCustomError(cc, "URIQueryForNonexistentToken");
  });

  it("Should transfer", async function () {
      const { cc, owner, user } = await loadFixture(deployFixture);
      await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
      const tokenId = 0;
      await  cc.transferFrom(owner.address, user.address, tokenId);

      const balanceFrom = await cc.balanceOf(owner.address);
      const balanceTo = await cc.balanceOf(user.address);
      const ownerOf = await cc.ownerOf(tokenId);
        
      expect(balanceFrom).to.equal(0, "Can't transfer");
      expect(balanceTo).to.equal(1, "Can't transfer");
      expect(ownerOf).to.equal(user.address, "Can't transfer");
  });

  it("Should emit transfer", async function () {
      const { cc, owner, user } = await loadFixture(deployFixture);
      await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
      const tokenId = 0;
      await expect(cc.transferFrom(owner.address, user.address, tokenId)).to
                  .emit(cc, "Transfer")
                  .withArgs(owner.address, user.address, tokenId);
  });

  it("Should transfer (approved)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);

    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});

    const tokenId = 0;
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
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const tokenId = 0;
    await expect(cc.approve(user.address, tokenId)).to
                .emit(cc, "Approval")
                .withArgs(owner.address, user.address, tokenId);
  });
  
  it("Should clear approvals", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const tokenId = 0;
    await cc.approve(user.address, tokenId);
    await  cc.transferFrom(owner.address, user.address, tokenId);
    const approved = await cc.getApproved(tokenId);
    expect(approved).to.equal("0x0000000000000000000000000000000000000000", "Can't clear approvals");
  });

  it("Should transfer (approved for all)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);

    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});

    const tokenId = 0;
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
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const tokenId = 0;
    await expect(cc.setApprovalForAll(user.address, true)).to
                .emit(cc, "ApprovalForAll")
                .withArgs(owner.address, user.address, true);
  });

  it("Should NOT transfer (permission)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    
    await cc.mint(1, {value: ethers.utils.parseEther("0.01")});
    const tokenId = 0;
    const instance = cc.connect(user);    

    await expect(instance.transferFrom(owner.address, user.address, tokenId)).to
                .be.revertedWithCustomError(cc, "TransferCallerNotOwnerNorApproved");
  });

  it("Should NOT transfer (token not exists)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    
    await expect(cc.transferFrom(owner.address, user.address, 1)).to
                .be.revertedWithCustomError(cc, "OwnerQueryForNonexistentToken");
  });

  it("Should supports interface", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    expect(await cc.supportsInterface("0x80ac58cd")).to.equal(true,"Can't support interface");
  });

  it("Should withdraw ", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    const instace = cc.connect(user);
    await instace.mint(1, {value: ethers.utils.parseEther("0.01")});
    await cc.withdraw();
    const ccBalance = await ethers.provider.getBalance(cc.address);
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

    expect(ccBalance).to.equal(0, "Can't withdraw (ccBalance)");
    expect(ownerBalanceAfter).to.greaterThan(ownerBalanceBefore, "Can't withdraw (ownerBalance)");
  });

  it("Should NOT withdraw (permission)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    const instance = cc.connect(user);
    await expect(instance.withdraw()).to.be.revertedWith("Caller is not owner");
  });

  it("Should NOT withdraw (failed call)", async function () {
    const { cc, owner, user } = await loadFixture(deployFixture);
    const instance = cc.connect(user);
    await expect(instance.withdraw()).to.be.revertedWith("Caller is not owner");
  });

}); // End Describe
