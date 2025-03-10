// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakeX is ERC20 {
    constructor() ERC20("StakeX", "STX") {
        _mint(msg.sender, 5000_000 * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 8;
    }
}
