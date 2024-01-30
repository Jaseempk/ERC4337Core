const hre = require("hardhat");

async function main() {
    const Test = await hre.ethers.getContractFactory("Test");
    const [signer0] = await hre.ethers.getSigners();
    const signature = await signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("wee")));

    console.log("Signer:", signer0);
    const test = await Test.deploy(signature);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
})