// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IStakeX} from "./IStakeX.sol";
import "hardhat/console.sol";

struct MinterAccounts {
    address account;
    bool isMinter;
}

struct UsersDeposits {
    address userAddress;
    uint256 tokens;
    uint256 reward;
    uint256 stakingStartTime;
}

error AddressIsAlreadyMinter();
error AccountDoesNotExist();
error AddressIsAlreadyNotMinter();
error OnlyOwnerAddress();
error InvalidAmount();
error SupplyIsReach();

contract StakingPool is Ownable {
    uint256 STAKED_PERIOD = 365 days;

    uint256 public initialSupply = 5000000;
    uint256 public totalSupply;

    mapping(address => MinterAccounts) public minterAccounts;

    mapping(address => UsersDeposits) public usersDeposits;

    event TokensDeposited(address indexed user, uint256 tokens);

    event ClaimReward(address indexed user, uint256 reward);

    event UsersWithdrawTokens(address indexed user, uint256 tokens);

    constructor() Ownable(msg.sender) {}

    function addMinter(address account) external onlyOwner {
        MinterAccounts storage minterAccount = minterAccounts[account];

        // check for onlyOwner
        if (minterAccount.isMinter) {
            revert AddressIsAlreadyMinter();
        }

        minterAccounts[account] = MinterAccounts({
            account: account,
            isMinter: true
        });
    }

    function revokeMinter(address account) external onlyOwner {
        MinterAccounts storage minterAccount = minterAccounts[account];

        // check for onlyOwner
        if (minterAccount.account == address(0)) {
            revert AccountDoesNotExist();
        }

        if (!minterAccount.isMinter) {
            revert AddressIsAlreadyNotMinter();
        }

        minterAccounts[account].isMinter = false;
    }

    function depositTokens(uint256 tokens) external payable {
        if (totalSupply == initialSupply) {
            revert SupplyIsReach();
        }

        address onlyOwner = owner();

        if (msg.sender == onlyOwner) {
            revert OnlyOwnerAddress();
        }

        if (tokens == 0) {
            revert InvalidAmount();
        }

        UsersDeposits storage userDeposit = usersDeposits[msg.sender];

        totalSupply += tokens;

        // @TODO: got error message during calculation in IStakeX!
        uint256 amount = (tokens *
            totalSupply *
            (10 ** IStakeX(onlyOwner).decimals())) / 1 ether;
        console.log("amount: %s", amount);

        if (userDeposit.userAddress == address(0)) {
            usersDeposits[msg.sender] = UsersDeposits({
                userAddress: msg.sender,
                tokens: tokens,
                reward: amount,
                stakingStartTime: block.timestamp
            });
        } else {
            usersDeposits[msg.sender].tokens += tokens;
            usersDeposits[msg.sender].reward = amount;
            usersDeposits[msg.sender].stakingStartTime = block.timestamp;
        }

        // @TODO: got error message!
        IStakeX(onlyOwner).transferFrom(msg.sender, address(this), tokens);

        emit TokensDeposited(msg.sender, tokens);
    }

    function claimAward() external payable {
        address onlyOwner = owner();

        if (msg.sender == onlyOwner) {
            revert OnlyOwnerAddress();
        }

        UsersDeposits storage userDeposit = usersDeposits[msg.sender];

        if (userDeposit.userAddress == address(0)) {
            revert AccountDoesNotExist();
        }

        uint256 reward = userDeposit.reward;

        userDeposit.reward = 0;
        userDeposit.stakingStartTime = block.timestamp;

        // @TODO: got error message!
        IStakeX(onlyOwner).transfer(userDeposit.userAddress, reward);

        emit ClaimReward(userDeposit.userAddress, reward);
    }

    function withdrawTokens(uint256 tokens) external payable {
        address onlyOwner = owner();

        if (msg.sender == onlyOwner) {
            revert OnlyOwnerAddress();
        }

        if (tokens == 0) {
            revert InvalidAmount();
        }

        UsersDeposits storage userDeposit = usersDeposits[msg.sender];
        if (userDeposit.userAddress == address(0)) {
            revert AccountDoesNotExist();
        }

        if (userDeposit.tokens < tokens) {
            revert InvalidAmount();
        }

        userDeposit.tokens = userDeposit.tokens - tokens;

        // @TODO: got error message!
        IStakeX(onlyOwner).transferFrom(address(this), msg.sender, tokens);

        emit UsersWithdrawTokens(userDeposit.userAddress, tokens);
    }
}
