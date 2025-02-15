const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock", function () {
  const ONE_WEEK = 7 * 24 * 60 * 60;
  const TOKEN_ID = 0;

  async function initialDeployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [seller, bidder] = await ethers.getSigners();

    const NFTFactory = await ethers.getContractFactory("NFT");
    const nftContract = await NFTFactory.deploy(seller.address);

    const AuctionHouseFactory = await ethers.getContractFactory("AuctionHouse");
    const auctionContract = await AuctionHouseFactory.deploy();

    return {
      nftContract,
      auctionContract,
      seller,
      bidder,
    };
  }

  describe("Create Auction", function () {
    it("Should revert if min price < 0 ", async function () {
      const { auctionContract, seller, nftContract } =
        await loadFixture(initialDeployFixture);

      await expect(
        auctionContract
          .connect(seller)
          .createAuction(
            TOKEN_ID,
            await nftContract.getAddress(),
            0,
            0,
            0,
            0,
            0,
            0,
          ),
      ).to.be.revertedWithCustomError(auctionContract, "CannotBeZero");
    });

    it("Should revert if start time < block.timestamp ", async function () {
      const { auctionContract, seller, nftContract } =
        await loadFixture(initialDeployFixture);

      const latest = await time.latest();
      const next = latest + 2;
      time.setNextBlockTimestamp(next);

      await expect(
        auctionContract
          .connect(seller)
          .createAuction(
            TOKEN_ID,
            await nftContract.getAddress(),
            1,
            next - 1,
            0,
            0,
            0,
            0,
          ),
      ).to.be.revertedWithCustomError(auctionContract, "InvalidStartTime");
    });

    it("Should revert if end time too low ", async function () {
      const { auctionContract, seller, nftContract } =
        await loadFixture(initialDeployFixture);

      const latest = await time.latest();
      const next = latest + 2;
      time.setNextBlockTimestamp(next);
      const ONE_DAY = 24 * 60 * 60;

      await expect(
        auctionContract
          .connect(seller)
          .createAuction(
            TOKEN_ID,
            await nftContract.getAddress(),
            1,
            next,
            next + ONE_DAY - 1,
            0,
            0,
            0,
          ),
      )
        .to.be.revertedWithCustomError(auctionContract, "InvalidEndTime")
        .withArgs("TOO_LOW");
    });

    it("Should revert if end time too high ", async function () {
      const { auctionContract, seller, nftContract } =
        await loadFixture(initialDeployFixture);

      const latest = await time.latest();
      const next = latest + 2;
      time.setNextBlockTimestamp(next);
      const SIXTY_DAY = 24 * 60 * 60 * 60;

      await expect(
        auctionContract
          .connect(seller)
          .createAuction(
            TOKEN_ID,
            await nftContract.getAddress(),
            1,
            next,
            next + SIXTY_DAY + 1,
            0,
            0,
            0,
          ),
      )
        .to.be.revertedWithCustomError(auctionContract, "InvalidEndTime")
        .withArgs("TOO_HIGH");
    });

    it("Should properly transfer NFT", async function () {
      const { auctionContract, seller, nftContract } =
        await loadFixture(initialDeployFixture);

      const nftContractAddress = await nftContract.getAddress();
      const auctionContractAddress = await auctionContract.getAddress();

      await nftContract
        .connect(seller)
        .approve(auctionContractAddress, TOKEN_ID);

      expect(await nftContract.ownerOf(TOKEN_ID)).to.equal(seller.address);

      const latest = await time.latest();
      const next = latest + 2;
      const SIXTY_DAY = 24 * 60 * 60 * 60;
      time.setNextBlockTimestamp(next);

      await expect(
        auctionContract
          .connect(seller)
          .createAuction(
            TOKEN_ID,
            nftContractAddress,
            1,
            next,
            next + SIXTY_DAY,
            1,
            1,
            1,
          ),
      ).to.emit(auctionContract, "AuctionCreated").withArgs(0);

      expect(await nftContract.ownerOf(TOKEN_ID)).to.equal(
        auctionContractAddress,
      );

      const auction = await auctionContract.auctions(0);
      expect(auction.tokenId).to.equal(TOKEN_ID);
      expect(auction.nftAddress).to.equal(nftContractAddress);
      expect(auction.minPrice).to.equal(1);
      expect(auction.startTime).to.equal(next);
      expect(auction.endTime).to.equal(next + SIXTY_DAY);
      expect(auction.minBidIncr).to.equal(1);
      expect(auction.timeExtensionWindow).to.equal(1);
      expect(auction.timeExtensionIncr).to.equal(1);
      expect(auction.seller).to.equal(seller.address);
      expect(auction.nftClaimed).to.equal(false);
      expect(auction.rewardClaimed).to.equal(false);
    });
  });
});
