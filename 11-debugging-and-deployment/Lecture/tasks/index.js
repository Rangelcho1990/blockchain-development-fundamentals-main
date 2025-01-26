task('deploy', 'Deploy contract', async (_, hre) => {
    const ContractFatory = await hre.ethers.getContractFactory('Lock');
    const contract = await ContractFatory.deploy(1737994992);

    console.log('Contract deployed to: ', contract.target);
});
