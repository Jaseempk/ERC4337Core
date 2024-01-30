// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const accountFactory = await hre.ethers.deployContract("AccountFactory");
  await accountFactory.waitForDeployment();

  const ep = await hre.ethers.deployContract("EntryPoint");
  await ep.waitForDeployment();

  const paymaster = await hre.ethers.deployContract("Paymaster");
  await paymaster.waitForDeployment();

  console.log("EP deployed at:", ep.target);
  console.log("accountFactory address:", accountFactory.target);
  console.log("PaymasterAddress:", paymaster.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});