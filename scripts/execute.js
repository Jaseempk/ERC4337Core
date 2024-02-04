const hre = require("hardhat");

async function main() {
    const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const AF_ADDRESS = "0xf4501CDba636FaA0B43B44f0304Bbd085d567893";
    const PM_ADDRESS = "0x887203128f054d41e8919a9f609C66E8E6B4356D";


    const epContract = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
    const afContract = await hre.ethers.getContractFactory("AccountFactory");
    const accountContract = await hre.ethers.getContractFactory("Account");




    // await epContract.depositTo(PM_ADDRESS, {
    //     value: hre.ethers.parseEther("100")
    // })

    const [signer0, signer1] = await hre.ethers.getSigners();
    const address0 = await signer0.getAddress();

    let initCode = AF_ADDRESS + afContract.interface.encodeFunctionData("createAccount", [address0]).slice(2);
    let sender;
    try {

        await epContract.getSenderAddress(initCode);
    }
    catch (ex) {
        console.log(ex.data);
        sender = "0x" + ex.data.slice(-40);
    }
    console.log({ sender });
    const code = await hre.ethers.provider.getCode(sender);
    if (code !== "0x") {
        initCode = "0x";
    }
    //{ callGasLimit, verificationGasLimit, preVerificationGas } 


    const userOp = {
        sender, //smart account address
        nonce: "0x" + (await epContract.getNonce(sender, 0)).toString(16),
        initCode,
        callData: accountContract.interface.encodeFunctionData("execute"), //calldata inside the userOps
        paymasterAndData: PM_ADDRESS,
        signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c"
    }

    const { preVerificationGas, verificationGasLimit, callGasLimit } = await hre.ethers.provider.send("eth_estimateUserOperationGas", [userOp, EP_ADDRESS]);
    const { maxFeePerGas } = await hre.ethers.provider.getFeeData();

    const maxPriorityFeePerGas = await hre.ethers.provider.send("rundler_maxPriorityFeePerGas");

    userOp.preVerificationGas = preVerificationGas;
    userOp.verificationGasLimit = verificationGasLimit;
    userOp.callGasLimit = callGasLimit;

    userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

    const userOpHash = await epContract.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));
    // console.log(userOp);

    const opHash = await hre.ethers.provider.send("eth_sendUserOperation", [userOp, EP_ADDRESS]);

    setTimeout(async () => {

        const { transactionHash } = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHash]);
        console.log(transactionHash);

    }, 5000)

}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})