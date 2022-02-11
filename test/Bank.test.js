const { assertOnlyOwner } = require("./utils");
const {
  BN,
  constants,
  expectEvent,
  expectRevert,
  snapshot,
  time,
} = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const Token = artifacts.require("Token");
const Bank = artifacts.require("Bank");

contract("Bank", (accounts) => {
  let bank;
  let [owner, testUser] = accounts;

  // helper methods
  function numberToWeiBN(num) {
    return new BN(web3.utils.toWei(num.toString()));
  }

  function approveToken(account) {
    return token.approve(bank.address, constants.MAX_UINT256, {
      from: account,
    });
  }

  // contract view methods callers
  function callGetAccount(account) {
    return bank.getAccount({ from: account });
  }

  function callGetBalance(account) {
    return bank.getBalance({ from: account });
  }

  function callGetSavings(account) {
    return bank.getSavings({ from: account });
  }

  function callGetSavingsDate(account) {
    return bank.getSavingsDate({ from: account });
  }

  // contract user methods callers
  function callDeposit(account, amount) {
    return bank.deposit(numberToWeiBN(amount), { from: account });
  }

  function callWithdraw(account, amount) {
    return bank.withdraw(numberToWeiBN(amount), { from: account });
  }

  function callSave(account, amount) {
    return bank.save(numberToWeiBN(amount), { from: account });
  }

  function callUnsave(account, amount) {
    return bank.unsave(numberToWeiBN(amount), { from: account });
  }

  function callCompoundAndSave(account) {
    return bank.compoundAndSave({ from: account });
  }

  function callCompoundAndWithdrawReturns(account) {
    return bank.compoundAndWithdrawReturns({ from: account });
  }

  function callCompoundAndWithdrawAll(account) {
    return bank.compoundAndWithdrawAll({ from: account });
  }

  // setup tests
  let testSnapshot;

  before(async () => {
    token = await Token.deployed();
    bank = await Bank.deployed();

    // transfer tokens to contract
    await token.transfer(bank.address, numberToWeiBN(500_000), { from: owner });

    // transfer tokens to test account
    await token.transfer(testUser, numberToWeiBN(100_000), { from: owner });

    // save blockchain snapshot for restoring
    testSnapshot = await snapshot();
  });

  // reset blockchain
  beforeEach(async () => {
    await testSnapshot.restore();
  });

  // Public values
  describe(".owner", () => {
    it("returns the current contract owner", async () => {
      assert.equal(
        await bank.owner(),
        owner,
        "The correct owner should be returned"
      );
    });
  });

  describe(".tokenAddress", () => {
    it("returns the contract's token address", async () => {
      assert.equal(
        await bank.tokenAddress(),
        token.address,
        "The correct token address should be returned"
      );
    });
  });

  describe(".compoundPercentage", () => {
    it("returns the current compound percentage on savings", async () => {
      assert.equal(
        await bank.compoundPercentage(),
        20,
        "The correct compound percentage should be returned"
      );
    });
  });

  describe(".compoundPeriod", () => {
    it("returns the current savings lock period", async () => {
      assert.equal(
        await bank.compoundPeriod(),
        7 * 24 * 60 * 60,
        "The correct compound period should be returned"
      );
    });
  });

  describe(".maxCompoundReturn", () => {
    it("returns the maximum return for compounding", async () => {
      assert.equal(
        (await bank.maxCompoundReturn()).toJSON(),
        numberToWeiBN(10).toJSON(),
        "The correct max compound return should be returned"
      );
    });
  });

  // Owner functions
  describe(".setOwner", () => {
    assertOnlyOwner(
      async (from) => {
        await bank.setOwner(owner, { from });
      },
      owner,
      testUser,
      "setOwner"
    );

    describe("when called by the owner", () => {
      it("sets the contract owner", async () => {
        await bank.setOwner(testUser, { from: owner });

        assert.equal(
          await bank.owner(),
          testUser,
          "The contract owner should be testUser."
        );

        await bank.setOwner(owner, { from: testUser });

        assert.equal(
          await bank.owner(),
          owner,
          "The contract owner should be owner."
        );
      });
    });
  });

  describe(".setCompoundPercentage", () => {
    assertOnlyOwner(
      async (from) => {
        await bank.setCompoundPercentage(15, { from });
      },
      owner,
      testUser,
      "setCompoundPercentage"
    );

    describe("when called by the owner", () => {
      it("sets the compound percentage", async () => {
        await bank.setCompoundPercentage(15, { from: owner });

        assert.equal(
          await bank.compoundPercentage(),
          15,
          "The compound percentage should be updated to 15."
        );
      });
    });
  });

  describe(".setCompoundPeriod", () => {
    const twoDays = 2 * 24 * 60 * 60;

    assertOnlyOwner(
      async (from) => {
        await bank.setCompoundPeriod(twoDays, { from });
      },
      owner,
      testUser,
      "setCompoundPeriod"
    );

    describe("when called by the owner", () => {
      it("sets the compound period", async () => {
        await bank.setCompoundPeriod(twoDays, { from: owner });

        assert.equal(
          await bank.compoundPeriod(),
          twoDays,
          "The compound period should be updated to 2 days."
        );
      });
    });
  });

  // View functions
  describe(".getAccount", () => {
    beforeEach(async () => {
      await approveToken(testUser);

      await callDeposit(testUser, 15);
      // balance = 15, savings = 0

      await callSave(testUser, 5);
      // balance = 10, savings = 5, savingsDate = now
    });

    it("returns the caller's account details", async () => {
      const result = await bank.getAccount({ from: testUser });
      const { balance, savings, savingsDate } = result;

      assert.equal(
        balance,
        numberToWeiBN(10),
        `.getAccount should return the caller's balance`
      );

      assert.equal(
        savings,
        numberToWeiBN(5),
        `.getAccount should return the caller's savings`
      );

      assert.equal(
        savingsDate,
        (await time.latest()).toString(),
        `.getAccount should return the caller's savings date`
      );
    });
  });

  describe(".getBalance", () => {
    beforeEach(async () => {
      await approveToken(testUser);

      await callDeposit(testUser, 15);
      // balance = 15, savings = 0
    });

    it("returns the balance of the caller's account", async () => {
      assert.equal(
        (await bank.getBalance({ from: testUser })).toJSON(),
        numberToWeiBN(15).toJSON(),
        `.getBalance should return the caller's balance`
      );
    });
  });

  describe(".getSavings", () => {
    beforeEach(async () => {
      await approveToken(testUser);

      await callDeposit(testUser, 15);
      // balance = 15, savings = 0

      await callSave(testUser, 5);
      // balance = 10, savings = 5, savingsDate = now
    });

    it("returns the savings of the caller's account", async () => {
      assert.equal(
        (await bank.getSavings({ from: testUser })).toJSON(),
        numberToWeiBN(5).toJSON(),
        `.getSavings should return the caller's savings`
      );
    });
  });

  describe(".getSavingsDate", () => {
    beforeEach(async () => {
      await approveToken(testUser);

      await callDeposit(testUser, 15);
      // balance = 15, savings = 0

      await callSave(testUser, 5);
      // balance = 10, savings = 5, savingsDate = now
    });

    it("returns the savings of the caller's account", async () => {
      assert.equal(
        (await bank.getSavingsDate({ from: testUser })).toJSON(),
        (await time.latest()).toJSON(),
        `.getSavingsDate should return the caller's savings date`
      );
    });
  });

  // User functions
  describe(".deposit", () => {
    describe("when the caller has not set approval for token spending", () => {
      it("fails", async () => {
        await expectRevert(
          callDeposit(testUser, 10),
          "transfer amount exceeds allowance"
        );
      });
    });

    describe("when the caller has set approval for token spending", () => {
      beforeEach(async () => {
        await approveToken(testUser);
      });

      it("transfers tokens from the caller to the contract", async () => {
        const callerBalance = await token.balanceOf(testUser);
        const bankBalance = await token.balanceOf(bank.address);

        await callDeposit(testUser, 10);

        assert.equal(
          (await token.balanceOf(testUser)).toJSON(),
          callerBalance.sub(numberToWeiBN(10)).toJSON(),
          `.deposit should subtract tokens from caller`
        );

        assert.equal(
          (await token.balanceOf(bank.address)).toJSON(),
          bankBalance.add(numberToWeiBN(10)).toJSON(),
          `.deposit should add tokens to bank`
        );
      });

      it("increments the caller's account balance", async () => {
        const balance = await callGetBalance(testUser);

        await callDeposit(testUser, 10);

        assert.equal(
          (await callGetBalance(testUser)).toJSON(),
          balance.add(numberToWeiBN(10)).toJSON(),
          `.deposit add to caller's balance`
        );
      });

      it("emits a Deposit event", async () => {
        const tx = await callDeposit(testUser, 10);

        expectEvent(tx, "Deposit", {
          account: testUser,
          amount: numberToWeiBN(10),
        });
      });
    });
  });

  describe(".withdraw", () => {
    describe("when the caller doesn't have enough balance", () => {
      it("fails", async () => {
        await expectRevert(callWithdraw(testUser, 10), "Balance too low");
      });
    });

    describe("when the caller has enough balance", () => {
      beforeEach(async () => {
        await approveToken(testUser);
        await callDeposit(testUser, 20);
      });

      it("transfers tokens from the contract to the caller", async () => {
        const callerBalance = await token.balanceOf(testUser);
        const bankBalance = await token.balanceOf(bank.address);

        await callWithdraw(testUser, 10);

        assert.equal(
          (await token.balanceOf(testUser)).toJSON(),
          callerBalance.add(numberToWeiBN(10)).toJSON(),
          `.withdraw should add tokens to caller`
        );

        assert.equal(
          (await token.balanceOf(bank.address)).toJSON(),
          bankBalance.sub(numberToWeiBN(10)).toJSON(),
          `.withdraw should subtract tokens from bank`
        );
      });

      it("decrements the caller's account balance", async () => {
        const balance = await callGetBalance(testUser);

        await callWithdraw(testUser, 10);

        assert.equal(
          (await callGetBalance(testUser)).toJSON(),
          balance.sub(numberToWeiBN(10)).toJSON(),
          `.withdraw should decrement the caller's balance`
        );
      });

      it("emits a Withdraw event", async () => {
        const tx = await callWithdraw(testUser, 10);

        expectEvent(tx, "Withdraw", {
          account: testUser,
          amount: numberToWeiBN(10),
        });
      });
    });
  });

  describe(".save", () => {
    describe("when the caller doesn't have enough balance", () => {
      it("fails", async () => {
        await expectRevert(callSave(testUser, 10), "Balance too low");
      });
    });

    describe("when the caller has enough balance", () => {
      beforeEach(async () => {
        await approveToken(testUser);
        await callDeposit(testUser, 50);
      });

      it("decrements the caller's balance", async () => {
        const balance = await callGetBalance(testUser);

        await callSave(testUser, 10);

        assert.equal(
          (await callGetBalance(testUser)).toJSON(),
          balance.sub(numberToWeiBN(10)).toJSON(),
          `.save should decrement the caller's balance`
        );
      });

      it("increments the caller's savings", async () => {
        const savings = await callGetSavings(testUser);

        await callSave(testUser, 10);

        assert.equal(
          (await callGetSavings(testUser)).toJSON(),
          savings.add(numberToWeiBN(10)).toJSON(),
          `.save should increment the caller's savings`
        );
      });

      it("sets the caller's savings date", async () => {
        await callSave(testUser, 10);

        assert.equal(
          (await callGetSavingsDate(testUser)).toJSON(),
          (await time.latest()).toJSON(),
          `.save should set the savings date`
        );
      });

      it("emits a Save event", async () => {
        const tx = await callSave(testUser, 10);

        expectEvent(tx, "Save", {
          account: testUser,
          amount: numberToWeiBN(10),
        });
      });
    });
  });

  describe(".unsave", () => {
    describe("when the caller doesn't have enough savings", () => {
      it("fails", async () => {
        await expectRevert(callUnsave(testUser, 10), "Savings too low");
      });
    });

    describe("when the caller has enough savings", () => {
      beforeEach(async () => {
        await approveToken(testUser);

        await callDeposit(testUser, 50);
        // balance = 50, savings = 0

        await callSave(testUser, 40);
        // balance = 10, savings = 40, savingsDate = now
      });

      describe("when the lock period has not finished yet", () => {
        it("fails", async () => {
          await expectRevert(
            callUnsave(testUser, 10),
            "Savings lock period not over yet"
          );
        });
      });

      describe("when the lock period is finished", () => {
        beforeEach(async () => {
          await time.increase(time.duration.days(8));
        });

        it("increments the caller's balance", async () => {
          await callUnsave(testUser, 10);
          // balance = 20, savings = 30

          assert.equal(
            (await callGetBalance(testUser)).toJSON(),
            numberToWeiBN(20).toJSON(),
            `.unsave should decrement the caller's balance`
          );
        });

        it("decrements the caller's savings", async () => {
          await callUnsave(testUser, 10);
          // balance = 20, savings = 30

          assert.equal(
            (await callGetSavings(testUser)).toJSON(),
            numberToWeiBN(30).toJSON(),
            `.unsave should increment the caller's savings`
          );
        });

        it("emits a Unsave event", async () => {
          const tx = await callUnsave(testUser, 10);

          expectEvent(tx, "Unsave", {
            account: testUser,
            amount: numberToWeiBN(10),
          });
        });
      });
    });
  });

  describe(".compoundAndSave", () => {
    beforeEach(async () => {
      await approveToken(testUser);

      await callDeposit(testUser, 80);
      // balance = 80, savings = 0

      await callSave(testUser, 40);
      // balance = 40, savings = 40, savingsDate = now
    });

    describe("when the lock period has not finished yet", () => {
      it("fails", async () => {
        await expectRevert(
          callCompoundAndSave(testUser),
          "Savings lock period not over yet"
        );
      });
    });

    describe("when the lock period is finished", () => {
      beforeEach(async () => {
        await time.increase(time.duration.days(8));
      });

      describe("when the expected compound return is <= than the maximum", () => {
        it("increments the caller's savings by the expected compound return", async () => {
          await callCompoundAndSave(testUser);
          // balance = 40, savings = 48

          assert.equal(
            (await callGetSavings(testUser)).toJSON(),
            numberToWeiBN(48).toJSON(),
            `.compoundAndSave should increment the caller's savings`
          );
        });

        it("keeps the same caller's balance", async () => {
          await callCompoundAndSave(testUser);
          // balance = 40, savings = 48

          assert.equal(
            (await callGetBalance(testUser)).toJSON(),
            numberToWeiBN(40).toJSON(),
            `.compoundAndSave should keep the caller's balance`
          );
        });
      });

      describe("when the expected compound return is > than the maximum", () => {
        beforeEach(async () => {
          await callSave(testUser, 30);
          // balance = 10, savings = 70, savingsDate = now

          await time.increase(time.duration.days(8));
        });

        it("increments the caller's savings by the maximum compound return", async () => {
          await callCompoundAndSave(testUser);
          // balance = 10, savings = 80

          assert.equal(
            (await callGetSavings(testUser)).toJSON(),
            numberToWeiBN(80).toJSON(),
            `.compoundAndSave should increment the caller's savings`
          );
        });

        it("keeps the same caller's balance", async () => {
          await callCompoundAndSave(testUser);
          // balance = 10, savings = 80

          assert.equal(
            (await callGetBalance(testUser)).toJSON(),
            numberToWeiBN(10).toJSON(),
            `.compoundAndSave should keep the caller's balance`
          );
        });
      });

      it("sets the caller's savings date", async () => {
        await callCompoundAndSave(testUser);

        assert.equal(
          (await callGetSavingsDate(testUser)).toJSON(),
          (await time.latest()).toJSON(),
          `.compoundAndSave should set the savings date`
        );
      });

      it("emits a Compound event", async () => {
        const tx = await callCompoundAndSave(testUser);

        expectEvent(tx, "Compound", {
          account: testUser,
          compoundType: web3.utils.keccak256("Save"),
          amount: numberToWeiBN(8),
        });
      });
    });
  });

  describe(".compoundAndWithdrawReturns", () => {
    beforeEach(async () => {
      await approveToken(testUser);

      await callDeposit(testUser, 80);
      // balance = 80, savings = 0

      await callSave(testUser, 40);
      // balance = 40, savings = 40, savingsDate = now
    });

    describe("when the lock period has not finished yet", () => {
      it("fails", async () => {
        await expectRevert(
          callCompoundAndWithdrawReturns(testUser),
          "Savings lock period not over yet"
        );
      });
    });

    describe("when the lock period is finished", () => {
      beforeEach(async () => {
        await time.increase(time.duration.days(8));
      });

      describe("when the expected compound return is <= than the maximum", () => {
        it("increments the caller's balance by the expected compound returns", async () => {
          await callCompoundAndWithdrawReturns(testUser);
          // balance = 48, savings = 40

          assert.equal(
            (await callGetBalance(testUser)).toJSON(),
            numberToWeiBN(48).toJSON(),
            `.compoundAndWithdrawReturns should increment the caller's balance`
          );
        });

        it("keeps the same caller's savings", async () => {
          await callCompoundAndWithdrawReturns(testUser);
          // balance = 48, savings = 40

          assert.equal(
            (await callGetSavings(testUser)).toJSON(),
            numberToWeiBN(40).toJSON(),
            `.compoundAndWithdrawReturns should keep the caller's savings`
          );
        });
      });

      describe("when the expected compound return is > than the maximum", () => {
        beforeEach(async () => {
          await callSave(testUser, 30);
          // balance = 10, savings = 70, savingsDate = now

          await time.increase(time.duration.days(8));
        });

        it("increments the caller's balance by the maximum compound returns", async () => {
          await callCompoundAndWithdrawReturns(testUser);
          // balance = 20, savings = 70

          assert.equal(
            (await callGetBalance(testUser)).toJSON(),
            numberToWeiBN(20).toJSON(),
            `.compoundAndWithdrawReturns should increment the caller's balance`
          );
        });

        it("keeps the same caller's savings", async () => {
          await callCompoundAndWithdrawReturns(testUser);
          // balance = 20, savings = 70

          assert.equal(
            (await callGetSavings(testUser)).toJSON(),
            numberToWeiBN(70).toJSON(),
            `.compoundAndWithdrawReturns should keep the caller's savings`
          );
        });
      });

      it("sets the caller's savings date", async () => {
        await callCompoundAndWithdrawReturns(testUser);

        assert.equal(
          (await callGetSavingsDate(testUser)).toJSON(),
          (await time.latest()).toJSON(),
          `.compoundAndWithdrawReturns should set the savings date`
        );
      });

      it("emits a Compound event", async () => {
        const tx = await callCompoundAndWithdrawReturns(testUser);

        expectEvent(tx, "Compound", {
          account: testUser,
          compoundType: web3.utils.keccak256("WithdrawReturns"),
          amount: numberToWeiBN(8),
        });
      });
    });
  });

  describe(".compoundAndWithdrawAll", () => {
    beforeEach(async () => {
      await approveToken(testUser);

      await callDeposit(testUser, 80);
      // balance = 80, savings = 0

      await callSave(testUser, 40);
      // balance = 40, savings = 40, savingsDate = now
    });

    describe("when the lock period has not finished yet", () => {
      it("fails", async () => {
        await expectRevert(
          callCompoundAndWithdrawAll(testUser),
          "Savings lock period not over yet"
        );
      });
    });

    describe("when the lock period is finished", () => {
      beforeEach(async () => {
        await time.increase(time.duration.days(8));
      });

      describe("when the expected compound return is <= than the maximum", () => {
        it("increments the caller's balance by the expected compound returns + savings", async () => {
          await callCompoundAndWithdrawAll(testUser);
          // balance = 88, savings = 0

          assert.equal(
            (await callGetBalance(testUser)).toJSON(),
            numberToWeiBN(88).toJSON(),
            `.compoundAndWithdrawAll should increment the caller's balance`
          );
        });

        it("set the caller's savings to zero", async () => {
          await callCompoundAndWithdrawAll(testUser);
          // balance = 88, savings = 0

          assert.equal(
            (await callGetSavings(testUser)).toJSON(),
            numberToWeiBN(0).toJSON(),
            `.compoundAndWithdrawAll should set the caller's savings to zero`
          );
        });
      });

      describe("when the expected compound return is > than the maximum", () => {
        beforeEach(async () => {
          await callSave(testUser, 30);
          // balance = 10, savings = 70, savingsDate = now

          await time.increase(time.duration.days(8));
        });

        it("increments the caller's balance by the maximum compound returns + savings", async () => {
          await callCompoundAndWithdrawAll(testUser);
          // balance = 90, savings = 0

          assert.equal(
            (await callGetBalance(testUser)).toJSON(),
            numberToWeiBN(90).toJSON(),
            `.compoundAndWithdrawAll should increment the caller's balance`
          );
        });

        it("sets the caller's savings to zero", async () => {
          await callCompoundAndWithdrawAll(testUser);
          // balance = 90, savings = 0

          assert.equal(
            (await callGetSavings(testUser)).toJSON(),
            numberToWeiBN(0).toJSON(),
            `.compoundAndWithdrawAll should set the caller's savings to zero`
          );
        });
      });

      it("sets the caller's savings date", async () => {
        await callCompoundAndWithdrawAll(testUser);

        assert.equal(
          (await callGetSavingsDate(testUser)).toJSON(),
          (await time.latest()).toJSON(),
          `.compoundAndWithdrawAll should set the savings date`
        );
      });

      it("emits a Compound event", async () => {
        const tx = await callCompoundAndWithdrawAll(testUser);

        expectEvent(tx, "Compound", {
          account: testUser,
          compoundType: web3.utils.keccak256("WithdrawAll"),
          amount: numberToWeiBN(8),
        });
      });
    });
  });
});
