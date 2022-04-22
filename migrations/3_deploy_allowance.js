var Allowance = artifacts.require("Allowance");

module.exports = async function (deployer, network, accounts) {
  const tokenAddress = "";
  const recipientAddress = "";

  if (!tokenAddress || !recipientAddress) {
    throw Error("Invalid parameters");
  }

  const amount = web3.utils.toBN(web3.utils.toWei("10"));

  const period = 60 * 60 * 24 * 7; // 7 days

  const date = new Date();
  date.setHours(24, 0, 0, 0);

  await deployer.deploy(
    Allowance,
    tokenAddress,
    recipientAddress,
    amount,
    period,
    date,
    { from: owner }
  );

  console.log("Allowance contract:", Allowance.address);
};
