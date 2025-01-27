task("deploy", "Deploy contract", async (taskArgs, hre) => {
  if (taskArgs.unlockTime === undefined) {
    throw new Error("Please provide the unlockTime");
  }

  const ContractFatory = await hre.ethers.getContractFactory("Lock");
  const contract = await ContractFatory.deploy(taskArgs.unlockTime);

  console.log("Contract deployed to: ", contract.target);

  await contract.waitForDeployment();

  const unlockTime = await contract.unlockTime();
  if (unlockTime.toString() !== taskArgs.unlockTime) {
    throw new Error("Unlock time is not set correctly");
  }
}).addParam(
  "unlockTime",
  "The unix timestamp after which the contract will be unlocked.",
);

task("test", "Deploy contract", async (taskArgs, hre) => {
  const ContractFatory = await hre.ethers.getContractFactory("Lock");
  const contract = await ContractFatory.attach(
    "0x347Db52A49409cF09328a0C57D2E8709aEd964a2",
  );
  const unlockTime = await contract.unlockTime();
  console.log("unlockTime set", unlockTime.toString());
});
