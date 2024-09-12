/* global ethers */

async function deployUpgraded() {
  // deploy DiamondCutFacet
  const ContractAUpgraded = await ethers.getContractFactory(
    "ContractAUpgraded"
  );
  const contractAUpgraded = await ContractAUpgraded.deploy();
  await contractAUpgraded.deployed();
  console.log("contractAUpgraded deployed:", contractAUpgraded.address);

  return contractAUpgraded.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployUpgraded()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

exports.deployUpgraded = deployUpgraded;
