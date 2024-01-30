const hre = require("hardhat");

async function main() {
    const EP_ADDRESS = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";
    const AF_ADDRESS = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
    const PM_ADDRESS = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";

    const FACTORY_NONCE = 1;

    const epContract = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
    const afContract = await hre.ethers.getContractFactory("AccountFactory");
    const accountContract = await hre.ethers.getContractFactory("Account");

    const sender = hre.ethers.getCreateAddress({
        from: AF_ADDRESS,
        nonce: FACTORY_NONCE
    })

    console.log(sender);

    await epContract.depositTo(PM_ADDRESS, {
        value: hre.ethers.parseEther("100")
    })

    const [signer0] = await hre.ethers.getSigners();
    const address0 = await signer0.getAddress();
    const initCode = AF_ADDRESS + afContract.interface.encodeFunctionData("createAccount", [address0]).slice(2);


    const userOp = {
        sender, //smart account address
        nonce: await epContract.getNonce(sender, 0),
        initCode,
        callData: accountContract.interface.encodeFunctionData("execute"), //calldata inside the userOps
        callGasLimit: 500_000,
        verificationGasLimit: 500_000,
        preVerificationGas: 120_000,
        maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
        paymasterAndData: PM_ADDRESS,
        signature: signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("wee"))),
    }

    const tx = await epContract.handleOps([userOp], address0);
    const receipt = await tx.wait();
    console.log(receipt);

}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})