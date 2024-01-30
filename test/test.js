const hre = require("hardhat");

async function main() {
    const smartAccAddr = "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be";
    const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const smartAcc = await hre.ethers.getContractAt("Account", smartAccAddr);
    const count = await smartAcc.count(); //checking whether userOp was executed successfully
    console.log(count);

    console.log("Smart account balance:", await hre.ethers.provider.getBalance(smartAcc));
    const epContract = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
    console.log("EntryPoint balance:", await epContract.balanceOf(EP_ADDRESS));
    console.log("Paymaster Balance:", await epContract.balanceOf(PM_ADDRESS));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})