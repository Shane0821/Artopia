import { expect } from "chai";
import { ethers } from "hardhat";

describe("PromptNFT Test", function () {
  it("general test", async function () {
    const [a, b, ...rest] = await ethers.getSigners();
    let myAddress = a.address
    let otherAddress = b.address
    // const myAddress = "0x63A231bDEE0558489F881C50B5d4D2D5e0E07e23";
    
    // const otherAddress = "0x63A231bDEE0558489F881C50B5d4D2D5e0E07e23";
 
    const MyToken = await ethers.getContractFactory("PromptNFT");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();

    let tx = await myToken.awardItem(myAddress, "moon mountain");
    await tx.wait();

    let tokenOwner = await myToken.ownerOf(0);
    expect(tokenOwner).to.equal(myAddress);

    let tokenURI = await myToken.tokenURI(0);
    expect(tokenURI).to.equal("ipfs://moon mountain");

    tx = await myToken.awardItem(myAddress, "moon mountain water");
    await tx.wait();

    tokenOwner = await myToken.ownerOf(1);
    expect(tokenOwner).to.equal(myAddress);

    tokenURI = await myToken.tokenURI(1);
    expect(tokenURI).to.equal("ipfs://moon mountain water");
  });

  it("transfer test", async function () {
    const [a, b, ...rest] = await ethers.getSigners();
    let myAddress = a.address
    let otherAddress = b.address
 
    const MyToken = await ethers.getContractFactory("PromptNFT");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();

    let tx = await myToken.awardItem(myAddress, "moon mountain");
    await tx.wait();

    tx = await myToken.awardItem(myAddress, "moon mountain water");
    await tx.wait();

    tx = await myToken.transferFrom(myAddress, otherAddress, 0);
    tx.wait()
    
    let tokenOwner = await myToken.ownerOf(0);
    expect(tokenOwner).to.equal(otherAddress);

    tokenOwner = await myToken.ownerOf(1);
    expect(tokenOwner).to.equal(myAddress);
  })

  it("double mint test", async function () {
    const [a, b, ...rest] = await ethers.getSigners();
    let myAddress = a.address
    let otherAddress = b.address
 
    const MyToken = await ethers.getContractFactory("PromptNFT");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();

    let tx = await myToken.awardItem(myAddress, "moon");
    await tx.wait();

    await expect(myToken.awardItem(myAddress, "moon")).
          to.be.revertedWith("prompt already exists") 
  })
});