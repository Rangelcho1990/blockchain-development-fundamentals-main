const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdsale", function () {
  const ONE_WEEK = 7 * 24 * 60 * 60;

  async function initialDeployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, feeReceiver] = await ethers.getSigners();

    const CustomTokenFactory = await ethers.getContractFactory("CustomToken");
    const customToken = await CustomTokenFactory.deploy();

    const CrowdsaleFactory = await ethers.getContractFactory("Crowdsale");
    const crowdsale = await CrowdsaleFactory.deploy(owner);

    const latestTimestamp = await time.latest();
    const nextBlockTimestamp = latestTimestamp + 10;
    await time.setNextBlockTimestamp(nextBlockTimestamp);

    const startTime = nextBlockTimestamp + 1000;
    const endTime = startTime + ONE_WEEK;
    const tokensToSale = ethers.parseUnits("50000", 8);

    await customToken.approve(crowdsale.getAddress(), tokensToSale);

    await crowdsale.initialize(
      startTime,
      endTime,
      50,
      feeReceiver.address,
      await customToken.getAddress(),
      tokensToSale
    );

    return {
      crowdsale,
      customToken,
      owner,
      otherAccount,
      feeReceiver,
      startTime,
      endTime,
      tokensToSale,
    };
  }

  describe("Buy token", function () {
    it("Should revert if sale ended", async function () {
      const { crowdsale, endTime, otherAccount } = await loadFixture(
        initialDeployFixture
      );

      await time.increaseTo(endTime + 1);

      await expect(
        crowdsale.connect(otherAccount).buyShares(otherAccount.address)
      ).to.be.revertedWithCustomError(crowdsale, "OutOfSalePeriod");
    });

    it("Should send ether on success", async function () {
      const { crowdsale, startTime, otherAccount } = await loadFixture(
        initialDeployFixture
      );

      await time.increaseTo(startTime + 1000);
      const amount = ethers.parseEther("0.5"); 

      await expect(
        crowdsale.connect(otherAccount).buyShares(otherAccount.address, {
          value: amount,
        })
      ).to.changeEtherBalances([otherAccount, crowdsale], [-amount, amount]);
    });
  });

  describe("Finalize sale", function () {
    it("Should revert alredy fineshed", async function () {
      const { crowdsale, owner, endTime} = await loadFixture(
        initialDeployFixture
      );

       // start set isFinished to true
      await time.increaseTo(endTime + 1);
      await crowdsale.connect(owner).finalizeSale();
       // end set isFinished to true

      await expect(
        crowdsale.connect(owner).finalizeSale()
      ).to.be.revertedWithCustomError(crowdsale, "AlreadyFinished");
    });
  });
});
