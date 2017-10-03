var Casino = artifacts.require('./Casino.sol');

module.exports = function(deployer) {
  deployer.deploy(Casino, web3.toWei(0.1, 'ether'));
};
