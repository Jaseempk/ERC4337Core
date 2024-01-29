const hre = require("hardhat");

async function main() {
    const smartAccAddr = "0x75537828f2ce51be7289709686A69CbFDbB714F1";

    const smartAcc = await hre.ethers.getContractAt("Account", smartAccAddr);
    const count = await smartAcc.count();
    console.log(count);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})