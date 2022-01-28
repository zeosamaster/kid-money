var Token = artifacts.require("Token");
var Bank = artifacts.require("Bank");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];

  // deploy Token
  const initialSupply = 1_000_000;
  const initialSupplyBN = web3.utils.toBN(
    web3.utils.toWei(initialSupply.toString())
  );
  await deployer.deploy(Token, initialSupplyBN, { from: owner });

  console.log("Token contract:", Token.address);

  // deploy Bank
  const tokenAddress = Token.address;
  const compoundPercentage = 20;
  const compoundPeriod = 7 * 24 * 60 * 60;
  const maxCompoundReturn = 10;
  const maxCompoundReturnBN = web3.utils.toBN(
    web3.utils.toWei(maxCompoundReturn.toString())
  );

  await deployer.deploy(
    Bank,
    tokenAddress,
    compoundPercentage,
    compoundPeriod,
    maxCompoundReturnBN,
    { from: owner }
  );

  console.log("Bank contract:", Bank.address);
};
