import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken Test", function () {
  it("Owner should get the initial supply", async function () {
    const [owner] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MSBD5017Token");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    const ownerBalance = await myToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(1000);
  });
});