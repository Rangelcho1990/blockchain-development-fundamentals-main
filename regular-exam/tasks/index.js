const { task } = require("hardhat/config");

task("deploy", "Deploys StakeX and StakingPool contracts")
  .addParam("owner", "Initial owner of StakeX contract")
  .setAction(async (taskArgs, hre) => {
    // const [deployer] = await hre.ethers.getSigners();
    // console.log("Deploying contracts with account:", deployer.address);

    // // StakeX
    // const StakeX = await hre.ethers.getContractFactory("StakeX");
    // const stakeX = await StakeX.deploy(taskArgs.owner);

    // await stakeX.waitForDeployment();

    // console.log("StakeX deployed to:", await stakeX.getAddress());

    // StakingPool
    const StakingPool = await hre.ethers.getContractFactory("StakingPool");
    const stakingPool = await StakingPool.deploy();
    await stakingPool.waitForDeployment();
    console.log("StakingPool deployed to:", await stakingPool.getAddress());

    // Verify contracts if on Sepolia
    if (hre.network.name === "sepolia") {
      console.log("\nVerifying contracts on Sepolia...");

      // Wait for a few block confirmations
      console.log("Waiting for block confirmations...");
      // await stakeX.deploymentTransaction().wait(5);
      await stakingPool.deploymentTransaction().wait(5);

      // // Verify StakeX
      // try {
      //   await hre.run("verify:verify", {
      //     address: await stakeX.getAddress(),
      //     constructorArguments: [taskArgs.owner],
      //   });
      //   console.log("StakeX verified successfully");
      // } catch (error) {
      //   console.log("StakeX verification failed:", error.message);
      // }

      // Verify StakingPool
      try {
        await hre.run("verify:verify", {
          address: await stakingPool.getAddress(),
          constructorArguments: [],
        });
        console.log("stakingPool verified successfully");
      } catch (error) {
        console.log("stakingPool verification failed:", error.message);
      }
    }

    console.log("\nDeployment Summary:");
    console.log("-------------------");
    // console.log("StakeX:", await stakeX.getAddress());
    console.log("stakingPool:", await stakingPool.getAddress());
  });