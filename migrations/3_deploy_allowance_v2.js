const AllowanceV2 = artifacts.require("AllowanceV2");

module.exports = async function (deployer, _network, accounts) {
  const owner = accounts[0];

  await deployer.deploy(AllowanceV2, { from: owner });

  console.log("AllowanceV2 contract:", AllowanceV2.address);
};
