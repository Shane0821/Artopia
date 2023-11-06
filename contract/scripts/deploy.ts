import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("ImageNFT");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());


  const Contract2 = await ethers.getContractFactory("PromptNFT");
  const contract2 = await Contract2.deploy();
  await contract2.waitForDeployment();
  console.log("Contract deployed to:", await contract2.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});