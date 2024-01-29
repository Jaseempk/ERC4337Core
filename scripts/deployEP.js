const hre = require("hardhat");

async function main() {
    const ep = await hre.ethers.deployContract("EntryPoint");
    await ep.waitForDeployment();

    console.log("EP deployed at:", ep.target);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})