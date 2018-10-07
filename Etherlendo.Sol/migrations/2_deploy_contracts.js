var contract = artifacts.require("ProjectContract");

module.exports = function(deployer) {
  deployer.deploy(contract);
}
