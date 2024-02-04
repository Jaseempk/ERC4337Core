const hre = require("hardhat");

async function main() {
    const smartAccAddr = "0x590655bdf3215a0a1dca505daacfb91a97806d45";
    const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const PM_ADDRESS = "0x887203128f054d41e8919a9f609C66E8E6B4356D";

    const smartAcc = await hre.ethers.getContractAt("Account", smartAccAddr);
    const count = await smartAcc.count(); //checking whether userOp was executed successfully
    console.log(count);

    // console.log("Smart account balance:", await hre.ethers.provider.getBalance(smartAcc));
    // const epContract = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
    // console.log("EntryPoint balance:", await epContract.balanceOf(EP_ADDRESS));
    // console.log("Paymaster Balance:", await epContract.balanceOf(PM_ADDRESS));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})