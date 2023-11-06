import { expect } from "chai";
import { ethers } from "hardhat";

describe("ImageNFT Test", function () {
  it("general test", async function () {
    const [a, b, ...rest] = await ethers.getSigners();
    let myAddress = a.address
    let otherAddress = b.address
    // const myAddress = "0x63A231bDEE0558489F881C50B5d4D2D5e0E07e23";
    
    // const otherAddress = "0x63A231bDEE0558489F881C50B5d4D2D5e0E07e23";
 
    const MyToken = await ethers.getContractFactory("ImageNFT");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();

    let tx = await myToken.awardItem(myAddress, "ipfs://Qmb9vsjexQs4uVMN8MSv7jvoNogixh2kuAc66KbQHDgsKQ", 
                                                "QmeTkzeeitCNrKN4WpTtYu9W85XUZnknk37EQjSnpdFPxp");
    await tx.wait();

    let tokenOwner = await myToken.ownerOf(0);
    expect(tokenOwner).to.equal(myAddress);

    let tokenURI = await myToken.tokenURI(0);
    expect(tokenURI).to.equal("ipfs://Qmb9vsjexQs4uVMN8MSv7jvoNogixh2kuAc66KbQHDgsKQ");
  });

  it("transfer test", async function () {
    const [a, b, ...rest] = await ethers.getSigners();
    let myAddress = a.address
    let otherAddress = b.address
    // const myAddress = "0x63A231bDEE0558489F881C50B5d4D2D5e0E07e23";
    
    // const otherAddress = "0x63A231bDEE0558489F881C50B5d4D2D5e0E07e23";
 
    const MyToken = await ethers.getContractFactory("ImageNFT");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();

    let tx = await myToken.awardItem(myAddress, "ipfs://Qmb9vsjexQs4uVMN8MSv7jvoNogixh2kuAc66KbQHDgsKQ", 
                                                "QmeTkzeeitCNrKN4WpTtYu9W85XUZnknk37EQjSnpdFPxp");
    await tx.wait();

    tx = await myToken.transferFrom(myAddress, otherAddress, 0);
    tx.wait()
    
    let tokenOwner = await myToken.ownerOf(0);
    expect(tokenOwner).to.equal(otherAddress);

    let tokenURI = await myToken.tokenURI(0);
    expect(tokenURI).to.equal("ipfs://Qmb9vsjexQs4uVMN8MSv7jvoNogixh2kuAc66KbQHDgsKQ");
  })

  it("double mint test", async function () {
    const [a, b, ...rest] = await ethers.getSigners();
    let myAddress = a.address
    let otherAddress = b.address
    // const myAddress = "0x63A231bDEE0558489F881C50B5d4D2D5e0E07e23";
    
    // const otherAddress = "0x63A231bDEE0558489F881C50B5d4D2D5e0E07e23";
 
    const MyToken = await ethers.getContractFactory("ImageNFT");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();

    let tx = await myToken.awardItem(myAddress, "ipfs://Qmb9vsjexQs4uVMN8MSv7jvoNogixh2kuAc66KbQHDgsKQ", 
                                                "QmeTkzeeitCNrKN4WpTtYu9W85XUZnknk37EQjSnpdFPxp");
    await tx.wait();

    await expect(myToken.awardItem(myAddress, "ipfs://Qmb9vsjexQs4uVMN8MSv7jvoNogixh2kuAc66KbQHDgsKQ", 
                                  "QmeTkzeeitCNrKN4WpTtYu9W85XUZnknk37EQjSnpdFPxp")).
          to.be.revertedWith("cid already exists") 
  })
});