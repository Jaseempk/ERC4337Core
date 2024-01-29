const hre = require("hardhat");

async function main() {
    const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const AF_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const FACTORY_NONCE = 1;

    const epContract = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
    const afContract = await hre.ethers.getContractFactory("AccountFactory");
    const accountContract = await hre.ethers.getContractFactory("Account");

    const sender = hre.ethers.getCreateAddress({
        from: AF_ADDRESS,
        nonce: FACTORY_NONCE
    })

    console.log(sender);

    await epContract.depositTo(sender, {
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
        callGasLimit: 200_000,
        verificationGasLimit: 200_000,
        preVerificationGas: 50_000,
        maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
        paymasterAndData: "0x",
        signature: "0x",
    }

    const tx = await epContract.handleOps([userOp], address0);
    const receipt = await tx.wait();
    console.log(receipt);

}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})