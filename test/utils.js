const { expectRevert } = require("@openzeppelin/test-helpers");

function assertOnlyOwner(fn, owner, user, methodName) {
  describe("when called by the owner", () => {
    const from = owner;

    it("succeeds", async () => {
      let error;
      try {
        await fn(from);
      } catch (e) {
        error = e;
      }

      assert.notExists(
        error,
        `.${methodName} can be called by the contract owner`
      );
    });
  });

  describe("when called by a non-owner", () => {
    it("fails", async () => {
      await expectRevert(fn(user), "Caller is not owner");
    });
  });
}

module.exports = { assertOnlyOwner };
