const hre = require("hardhat");

async function main() {
    const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const AF_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const FACTORY_NONCE = 1;

    const epContract = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
    const afContract = await hre.ethers.getContractFactory("AccountFactory");
    const accountContract = await hre.ethers.getContractFactory("Account");

    const sender = hre.ethers.getCreateAddress({
        from: AF_ADDRESS,
        nonce: FACTORY_NONCE
    })

    console.log(sender);

    // await epContract.depositTo(PM_ADDRESS, {
    //     value: hre.ethers.parseEther("100")
    // })

    const [signer0, signer1] = await hre.ethers.getSigners();
    const address0 = await signer0.getAddress();
    const initCode = "0x";
    AF_ADDRESS + afContract.interface.encodeFunctionData("createAccount", [address0]).slice(2);


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
        signature: "0x"
    }
    const userOpHash = await epContract.getUserOpHash(userOp);
    userOp.signature = signer0.signMessage(hre.ethers.getBytes(userOpHash));


    const tx = await epContract.handleOps([userOp], address0);
    const receipt = await tx.wait();
    console.log(receipt);

}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})