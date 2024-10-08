/* global ethers */
/* eslint prefer-const: "off" */

const {
  getContractFactory,
} = require("@nomiclabs/hardhat-ethers/types/index.js");
const { getSelectors, FacetCutAction } = require("./libraries/diamond.js");
const { ethers } = require("hardhat");

async function upgradeDiamond() {
  const accounts = await ethers.getSigners();
  const owner = accounts[0];
  const notOwner = accounts[1];
  const { address, facetA } = await deployDiamond();
  // deploy Diamond
  console.log("Address , facetA", address, facetA);
  const diamond = await ethers.getContractAt("Diamond", address);
  console.log("Diamond deployed:", diamond.address);
  console.log("");
  console.log("Deploying facets");
  const FacetNames = ["ContractAUpgraded"];
  const cut = [];
  const selectorsToReplace = ["0x55241077", "0x20965255"];
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName);
    const facet = await Facet.deploy();
    await facet.deployed();
    console.log(`${FacetName} deployed: ${facet.address}`);
    const allSelectors = getSelectors(facet);

    // Filter selectors to replace
    const selectorsForReplace = allSelectors.filter((selector) =>
      selectorsToReplace.includes(selector)
    );

    // Push the replace action for setValue and getValue
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Replace,
      functionSelectors: selectorsForReplace,
    });

    // Filter out selectors for add, excluding setValue and getValue
    const selectorsForAdd = allSelectors.filter(
      (selector) =>
        !selectorsToReplace.includes(selector) && selector !== "0x01ffc9a7"
    );

    // Push the add action for other functions
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: selectorsForAdd,
    });
    //0x55241077 && 0x20965255 , 0x01ffc9a7
  }

  //   upgrade diamond with facets
  console.log("cut : ", cut);
  const diamondCutFacet = await ethers.getContractAt(
    "DiamondCutFacet",
    diamond.address
  );
  // call to init function
  tx = await diamondCutFacet.diamondCut(cut, diamond.address, "0x", {
    gasLimit: 800000,
  });
  console.log("Diamond cut tx: ", tx.hash);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  try {
    const contractUpgraded = await ethers.getContractAt(
      "ContractAUpgraded",
      diamond.address
    );
    await contractUpgraded.initialize();

    // console.log("What is value ? : ", await contractUpgraded.getValue());
    // await contractUpgraded.addAdmin(owner.address);
    const res = await contractUpgraded.getValue();
    console.log("changed Value : ", Number(res));
    console.log(
      "IsAdmin ? : ",
      await contractUpgraded.checkAdminRole(accounts[0].address)
    );
  } catch (error) {
    console.log("Error", error);
  }
  console.log("Completed diamond cut", diamond.address);

  return diamond.address;
}

async function deployDiamond() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.deployed();

  // deploy Diamond
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(
    contractOwner.address,
    diamondCutFacet.address
  );
  await diamond.deployed();

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  const DiamondInit = await ethers.getContractFactory("DiamondInit");
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();

  const FacetNames = ["DiamondLoupeFacet", "OwnershipFacet", "ContractA"];
  const cut = [];
  let facetA;
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName);
    const facet = await Facet.deploy();
    if (FacetName == "ContractA") facetA = facet.address;
    await facet.deployed();
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
  }
  console.log("Cut : ", cut);

  const diamondCut = await ethers.getContractAt("IDiamondCut", diamond.address);
  let tx;
  let receipt;
  // call to init function
  let functionCall = diamondInit.interface.encodeFunctionData("init");
  tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  const contractA = await ethers.getContractAt("ContractA", diamond.address);
  const val = await contractA.getValue();
  console.log("Value : ", Number(val));
  await contractA.setValue(10);
  const res = await contractA.getValue();
  console.log("changed Value : ", Number(res));
  return { address: diamond.address, facetA };
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  upgradeDiamond()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

exports.upgradeDiamond = upgradeDiamond;
