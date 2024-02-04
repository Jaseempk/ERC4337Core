const hre = require("hardhat");

async function main() {
    const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const PM_ADDRESS = "0x887203128f054d41e8919a9f609C66E8E6B4356D";


    const epContract = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

    await epContract.depositTo(PM_ADDRESS, {
        value: hre.ethers.parseEther("0.2")
    })
    console.log("deposited...");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})