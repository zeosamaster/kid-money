// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Bank
 * @dev Store tokens and compound savings
 */
contract Bank {
    // ------------------------------------------------------------------
    // config

    address public owner;
    address public tokenAddress;
    uint256 public compoundPercentage;
    uint256 public compoundPeriod;
    uint256 public maxCompoundReturn;

    /**
     * @dev Set contract deployer as owner
     * @param _tokenAddress ERC20 token address
     * @param _compoundPercentage savings compounding percentage
     * @param _compoundPeriod seconds since last savings before compounding
     * @param _maxCompoundReturn maximum amount of compounding on savings
     */
    constructor(
        address _tokenAddress,
        uint256 _compoundPercentage,
        uint256 _compoundPeriod,
        uint256 _maxCompoundReturn
    ) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
        compoundPercentage = _compoundPercentage;
        compoundPeriod = _compoundPeriod;
        maxCompoundReturn = _maxCompoundReturn;
    }

    // ------------------------------------------------------------------
    // structs

    struct Account {
        uint256 balance;
        uint256 savings;
        uint256 savingsDate;
    }

    // ------------------------------------------------------------------
    // state

    mapping(address => Account) private accounts;

    // ------------------------------------------------------------------
    // owner events

    event OwnerChanged(address indexed previousOwner, address indexed newOwner);
    event TokenChanged(address indexed previousToken, address indexed newToken);
    event CompoundPercentageChanged(
        uint256 previousPercentage,
        uint256 newPercentage
    );
    event CompoundPeriodChanged(uint256 previousPeriod, uint256 newPeriod);

    // ------------------------------------------------------------------
    // user events

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event Save(address indexed account, uint256 amount);
    event Unsave(address indexed account, uint256 amount);
    event Compound(address indexed account, uint256 amount);

    // ------------------------------------------------------------------
    // modifiers

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier hasBalance(uint256 _amount) {
        require(accounts[msg.sender].balance >= _amount, "Balance too low");
        _;
    }

    modifier hasSavings(uint256 _amount) {
        require(accounts[msg.sender].savings >= _amount, "Savings too low");
        _;
    }

    modifier isLockPeriodPast() {
        require(
            block.timestamp > accounts[msg.sender].savingsDate + compoundPeriod,
            "Savings lock period not over yet"
        );
        _;
    }

    // ------------------------------------------------------------------
    // Helper functions

    /**
     * @dev Returns the token implementation
     * @return _token ERC-20 token
     */
    function getToken() internal view returns (IERC20 _token) {
        return IERC20(tokenAddress);
    }

    // ------------------------------------------------------------------
    // Owner functions

    /**
     * @dev Set owner
     * @param _owner new owner address
     */
    function setOwner(address _owner) public isOwner {
        emit OwnerChanged(owner, _owner);
        owner = _owner;
    }

    /**
     * @dev Set compound percentage
     * @param _compoundPercentage savings compounding percentage
     */
    function setCompoundPercentage(uint256 _compoundPercentage) public isOwner {
        emit CompoundPercentageChanged(compoundPercentage, _compoundPercentage);
        compoundPercentage = _compoundPercentage;
    }

    /**
     * @dev Set compound period
     * @param _compoundPeriod seconds since last savings before compounding
     */
    function setCompoundPeriod(uint256 _compoundPeriod) public isOwner {
        emit CompoundPeriodChanged(compoundPeriod, _compoundPeriod);
        compoundPeriod = _compoundPeriod;
    }

    // ------------------------------------------------------------------
    // User functions

    /**
     * @dev Deposit to caller's balance
     * @param _amount amount of tokens to deposit
     */
    function deposit(uint256 _amount) public {
        IERC20 token = getToken();
        token.transferFrom(msg.sender, address(this), _amount);

        accounts[msg.sender].balance += _amount;

        emit Deposit(msg.sender, _amount);
    }

    /**
     * @dev Withdraw from caller's balance
     * @param _amount amount of tokens to withdraw
     */
    function withdraw(uint256 _amount) public hasBalance(_amount) {
        IERC20 token = getToken();
        token.transfer(msg.sender, _amount);

        accounts[msg.sender].balance -= _amount;

        emit Withdraw(msg.sender, _amount);
    }

    /**
     * @dev Move tokens from balance to savings
     * @param _amount amount of tokens to transfer
     */
    function save(uint256 _amount) public hasBalance(_amount) {
        accounts[msg.sender].balance -= _amount;
        accounts[msg.sender].savings += _amount;
        accounts[msg.sender].savingsDate = block.timestamp;

        emit Save(msg.sender, _amount);
    }

    /**
     * @dev Move tokens from savings to balance
     * @dev Only allowed when savings lock period is past
     * @param _amount amount of tokens to transfer
     */
    function unsave(uint256 _amount)
        public
        hasSavings(_amount)
        isLockPeriodPast
    {
        accounts[msg.sender].balance += _amount;
        accounts[msg.sender].savings -= _amount;

        emit Unsave(msg.sender, _amount);
    }

    /**
     * @dev Compound savings
     * @dev Only allowed when savings lock period is past
     * @dev Compound value capped to maxCompoundReturn
     */
    function compound() public isLockPeriodPast {
        uint256 compoundValue = (accounts[msg.sender].savings / 100) *
            compoundPercentage;
        uint256 valueWithCap = compoundValue > maxCompoundReturn
            ? maxCompoundReturn
            : compoundValue;
        accounts[msg.sender].savings += valueWithCap;
        accounts[msg.sender].savingsDate = block.timestamp;

        emit Compound(msg.sender, valueWithCap);
    }

    // ------------------------------------------------------------------
    // View functions

    /**
     * @dev Return account
     * @return _account account
     */
    function getAccount() external view returns (Account memory _account) {
        return accounts[msg.sender];
    }

    /**
     * @dev Return account balance
     * @return _balance account balance
     */
    function getBalance() external view returns (uint256 _balance) {
        return accounts[msg.sender].balance;
    }

    /**
     * @dev Return account savings
     * @return _savings account savings
     */
    function getSavings() external view returns (uint256 _savings) {
        return accounts[msg.sender].savings;
    }

    /**
     * @dev Return savings timestamp
     * @return _date savings timestamp
     */
    function getSavingsDate() external view returns (uint256 _date) {
        return accounts[msg.sender].savingsDate;
    }
}
