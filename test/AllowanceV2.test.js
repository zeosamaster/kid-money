const {
  constants,
  expectEvent,
  snapshot
} = require("@openzeppelin/test-helpers");

const Token = artifacts.require("Token");
const AllowanceV2 = artifacts.require("AllowanceV2");

const TEST_AMOUNT = 2; // seconds
const TEST_PERIOD = 5; // seconds
const NEXT_TIMESTAMP = new Date().getTime();

contract.only("AllowanceV2", (accounts) => {
  let token, contract;
  let [account1, account2] = accounts;

  // setup tests
  let testSnapshot;

  before(async () => {
    console.log("0");

    token = await Token.deployed();
    contract = await AllowanceV2.deployed();

    console.log("1");

    // approve token spending
    await token.approve(contract.address, constants.MAX_UINT256, {
      from: account1
    });

    console.log("2");

    // save blockchain snapshot for restoring
    testSnapshot = await snapshot();
    console.log("3");
  });

  // reset blockchain
  beforeEach(async () => {
    await testSnapshot.restore();
  });

  // Owner functions
  describe(".setAllowance", () => {
    describe("when the payer has no allowance for the payee", () => {
      it("creates an allowance", async () => {
        await contract.setAllowance(
          account2,
          TEST_AMOUNT,
          token.address,
          TEST_PERIOD,
          NEXT_TIMESTAMP,
          { from: account1 }
        );

        const expectedAllowance = {
          payer: account1,
          payee: account2,
          amount: TEST_AMOUNT,
          token: token.address,
          period: TEST_PERIOD,
          nextTimestamp: NEXT_TIMESTAMP
        };

        assert.equal(
          await contract.allowances(account1, account2),
          expectedAllowance,
          "Created allowance should match the expected allowance."
        );

        expectEvent(tx, "AllowanceCreated", expectedAllowance);
      });
    });
  });
});
