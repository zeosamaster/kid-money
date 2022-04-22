// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Allowance is KeeperCompatibleInterface, Ownable {
    IERC20 public token;
    address public recipient;
    uint256 public amount;
    uint256 public period;
    uint256 public nextTimestamp;

    constructor(
        address _token,
        address _recipient,
        uint256 _amount,
        uint256 _period,
        uint256 _nextTimestamp
    ) {
        token = IERC20(_token);
        recipient = _recipient;
        amount = _amount;
        period = _period;
        nextTimestamp = _nextTimestamp;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        return (block.timestamp > nextTimestamp, bytes(""));
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        require(
            block.timestamp > nextTimestamp,
            "Next allowance timestamp not reached"
        );
        nextTimestamp = block.timestamp + period;
        token.transfer(recipient, amount);
    }

    // Admin functions
    function setRecipient(address _recipient) public onlyOwner {
        recipient = _recipient;
    }

    function setAmount(uint256 _amount) public onlyOwner {
        amount = _amount;
    }

    function setPeriod(uint256 _period) public onlyOwner {
        period = _period;
    }
}
