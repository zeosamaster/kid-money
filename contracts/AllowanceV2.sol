// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AllowanceV2 is KeeperCompatibleInterface {
    struct Allowance {
        address payer;
        address payee;
        uint256 amount;
        address token;
        uint256 period;
        uint256 nextTimestamp;
    }

    mapping(address => mapping(address => Allowance)) public allowances;
    mapping(address => mapping(address => uint256)) public payerBalances;

    uint256 public payerCount;
    address[] public payers;
    mapping(address => bool) public registeredPayers;

    mapping(address => uint256) public payerPayeeCount;
    mapping(address => address[]) public payerPayees;
    mapping(address => mapping(address => bool)) public payerRegisteredPayees;

    /**
     * Events
     */

    event AllowanceCreated(
        address indexed payer,
        address indexed payee,
        uint256 amount,
        address token,
        uint256 period,
        uint256 nextTimestamp
    );

    event AllowanceUpdated(
        address indexed payer,
        address indexed payee,
        uint256 amount,
        address token,
        uint256 period,
        uint256 nextTimestamp
    );

    event AllowancePaused(address indexed payer, address indexed payee);

    event AllowanceCancelled(address indexed payer, address indexed payee);

    event AllowancePaid(
        address indexed payer,
        address indexed payee,
        uint256 amount,
        address token
    );

    event TopUp(address indexed payer, address indexed token, uint256 amount);
    event Withdrawal(
        address indexed payer,
        address indexed token,
        uint256 amount
    );

    /**
     * Modifiers
     */

    modifier hasAllowanceWith(address _payee) {
        require(
            allowances[msg.sender][_payee].payee == _payee,
            "Trying to update a non-existing allowance"
        );
        _;
    }

    /**
     * Keepers compatibility
     */

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = false; // TODO
        performData = getOutstandingAllowancesData();
    }

    function performUpkeep(bytes calldata performData) external override {
        performAllowances(performData);
    }

    /**
     * Internal functions
     */

    function getOutstandingAllowancesData()
        internal
        view
        returns (bytes memory)
    {
        uint256 count = 0;
        bytes[] memory outstandingPairs;

        for (uint256 i = 0; i <= payerCount; i++) {
            address payer = payers[i];

            for (uint256 j = 0; j <= payerPayeeCount[payer]; j++) {
                address payee = payerPayees[payer][j];

                if (isOutstanding(payer, payee)) {
                    outstandingPairs[count] = abi.encode(payer, payee);
                    count++;
                }
            }
        }
        return abi.encode(count, outstandingPairs);
    }

    function performAllowances(bytes memory _data) internal {
        (uint256 count, bytes[] memory pairs) = abi.decode(
            _data,
            (uint256, bytes[])
        );

        for (uint256 i = 0; i < count; i++) {
            bytes memory pair = pairs[i];
            (address payer, address payee) = abi.decode(
                pair,
                (address, address)
            );

            if (isOutstanding(payer, payee)) {
                payAllowance(payer, payee);
            }
        }
    }

    function isOutstanding(address _payer, address _payee)
        internal
        view
        returns (bool)
    {
        Allowance memory allowance = allowances[_payer][_payee];
        return
            allowance.nextTimestamp > 0 &&
            allowance.nextTimestamp < block.timestamp &&
            allowance.amount <= payerBalances[_payer][allowance.token];
    }

    function payAllowance(address _payer, address _payee) internal {
        require(
            isOutstanding(_payer, _payee) == true,
            "Allowance isn't outstanding"
        );

        Allowance memory allowance = allowances[_payer][_payee];
        payerBalances[_payer][allowance.token] -= allowance.amount;
        allowance.nextTimestamp += allowance.period;
        IERC20(allowance.token).transferFrom(_payer, _payee, allowance.amount);
    }

    /**
     * Public functions - Bulk
     */

    function settleOutstandingAllowances() public {
        performAllowances(getOutstandingAllowancesData());
    }

    /**
     * Public functions - Allowance management
     */

    function setAllowance(
        address _payee,
        uint256 _amount,
        address _token,
        uint256 _period,
        uint256 _nextTimestamp
    ) public {
        bool isNewAllowance = allowances[msg.sender][_payee].period > 0;

        allowances[msg.sender][_payee] = Allowance(
            msg.sender,
            _payee,
            _amount,
            _token,
            _period,
            _nextTimestamp
        );

        if (!registeredPayers[msg.sender]) {
            payers.push(msg.sender);
            payerCount++;
            registeredPayers[msg.sender] = true;
        }

        if (!payerRegisteredPayees[msg.sender][_payee]) {
            payerPayees[msg.sender].push(_payee);
            payerPayeeCount[msg.sender]++;
            payerRegisteredPayees[msg.sender][_payee] = true;
        }

        if (isNewAllowance) {
            emit AllowanceCreated(
                msg.sender,
                _payee,
                _amount,
                _token,
                _period,
                _nextTimestamp
            );
        } else {
            emit AllowanceUpdated(
                msg.sender,
                _payee,
                _amount,
                _token,
                _period,
                _nextTimestamp
            );
        }
    }

    function pauseAllowance(address _payee) public hasAllowanceWith(_payee) {
        allowances[msg.sender][_payee].nextTimestamp = 0;

        emit AllowancePaused(msg.sender, _payee);
    }

    function cancelAllowance(address _payee) public hasAllowanceWith(_payee) {
        delete allowances[msg.sender][_payee];

        emit AllowanceCancelled(msg.sender, _payee);
    }

    function pauseOwnAllowances() public {
        for (uint256 i = 0; i < payerPayeeCount[msg.sender]; i++) {
            pauseAllowance(payerPayees[msg.sender][i]);
        }
    }

    function cancelOwnAllowances() public {
        for (uint256 i = 0; i < payerPayeeCount[msg.sender]; i++) {
            cancelAllowance(payerPayees[msg.sender][i]);
        }
    }

    /**
     * Public functions - Balance management
     */
    function topUp(address _token, uint256 _amount) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        payerBalances[msg.sender][_token] += _amount;

        emit TopUp(msg.sender, _token, _amount);
    }

    function withdraw(address _token, uint256 _amount) public {
        require(
            _amount <= payerBalances[msg.sender][_token],
            "Not enough funds to withdraw"
        );
        payerBalances[msg.sender][_token] -= _amount;
        IERC20(_token).transfer(msg.sender, _amount);

        emit Withdrawal(msg.sender, _token, _amount);
    }
}
