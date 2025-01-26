const {task} = require("hardhat/config");
const ethers = require("ethers");

// hardhat runtime env
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task("balance", "Prints an account's balance")
    .addParam('address', 'The address to check')
    .setAction(async (taskArgs, hre) => {
    // 1. usage of default ether library, not via hre from hardhat
    // 2. ignore the provider from hardhat.config.js
    // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    const provider = hre.ethers.provider; // use the provider from hardhat.config.js
    const result = await provider.getBalance(taskArgs.address);

    console.log(result);
    console.log("Result in ETH is " + ethers.formatEther(result));
})

task("send", "Send EHT to given address")
    .addParam('address', 'the address to send to')
    .addParam('amount', 'the amount to send to')
    .setAction(async (taskParams, hre) => {
          // with hardhat network
          const [signer] = await hre.ethers.getSigners(); //first element of the array
          const transaction = await signer.sendTransaction({
              // from is set automatic, signer is usage
              to: taskParams.address,
              value: ethers.parseEther(taskParams.amount),
          });

          console.log('Transaction is send!');
          console.log(transaction);

          const receipt = await transaction.wait(); // wait the transaction to enter on block-chain and will return the result
          console.log('Transaction is mined!');
          console.log(receipt);
          // status 1 - success
          // logsBloom = 0 - no logs
    }
);

task("contract", "Send EHT to given address")
    .setAction(async (taskParams, hre) => {
        // getContractFactory from ethers
        const ContractFactory = await hre.ethers.getContractFactory('Lock');
        const contract = await ContractFactory.deploy(1797897353);
        console.log('Contract deployd to: ', await contract.getAddress());

        const transaction = await contract.
        withdraw().
        catch((err) => console.log(err.message));

        console.log('Transaction end');
        console.log(transaction);
    }
);
