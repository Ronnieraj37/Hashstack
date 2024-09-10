/* global ethers */
/* eslint prefer-const: "off" */

const { getContractFactory } = require('@nomiclabs/hardhat-ethers/types/index.js')
const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')

async function upgradeDiamond () {
  const accounts = await ethers.getSigners()
    const notOwner = accounts[1];
    const address = await deployDiamond();
  // deploy Diamond
  const diamond = await ethers.getContractAt('Diamond',address)
  console.log('Diamond deployed:', diamond.address)
  console.log('')
  console.log('Deploying facets')
  const FacetNames = [
    'ContractB'
  ]
  const cut = []
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)
    const facet = await Facet.deploy()
    await facet.deployed()
    console.log(`${FacetName} deployed: ${facet.address}`)
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Replace,
      functionSelectors: getSelectors(facet)
    })
  }

//   upgrade diamond with facets
  console.log('')
  console.log('Diamond Cut:', cut)
  const diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamond.address)
  // call to init function
  tx = await diamondCutFacet.connect(notOwner).diamondCut(cut,diamond.address, '0x', { gasLimit: 800000 })
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut',diamond.address)

  return diamond.address
}

async function deployDiamond () {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet')
  const diamondCutFacet = await DiamondCutFacet.deploy()
  await diamondCutFacet.deployed()

  // deploy Diamond
  const Diamond = await ethers.getContractFactory('Diamond')
  const diamond = await Diamond.deploy(contractOwner.address, diamondCutFacet.address)
  await diamond.deployed()

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  const DiamondInit = await ethers.getContractFactory('DiamondInit')
  const diamondInit = await DiamondInit.deploy()
    await diamondInit.deployed()
    
  const FacetNames = [
    'DiamondLoupeFacet',
      'OwnershipFacet',
    'ContractA'
  ]
  const cut = []
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)
    const facet = await Facet.deploy()
    await facet.deployed()
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet)
    })
  }

  const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address)
  let tx
  let receipt
  // call to init function
  let functionCall = diamondInit.interface.encodeFunctionData('init')
  tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }

  console.log('Completed diamond cut')
  return diamond.address
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  upgradeDiamond()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

exports.upgradeDiamond = upgradeDiamond