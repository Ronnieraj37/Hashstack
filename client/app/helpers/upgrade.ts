import { ContractAUpgraded } from "@/abi/ContractAUpgraded";
import { getSelectors, FacetCutAction } from "./libraries/diamond";
import { ethers } from "ethers";

import { CONTRACTA_UPGRADED_ADDRESS } from "../constants";

export const upgradeDiamond = async () => {
  const FacetNames = ["ContractAUpgraded"];
  const cut = [];
  const selectorsToReplace = ["0x55241077", "0x20965255"];
  for (const FacetName of FacetNames) {
    // const Facet = await ethers.getContractFactory(FacetName);
    // const facet = await Facet.deploy();
    //   await facet.deployed();
    const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY!; // Replace with your actual private key
    const signer = new ethers.Wallet(privateKey, provider);
    const facet = new ethers.Contract(
      CONTRACTA_UPGRADED_ADDRESS,
      ContractAUpgraded,
      signer
    );
    console.log(`${FacetName} deployed: ${facet.address}`);

    const allSelectors = getSelectors(facet);

    // Filter selectors to replace
    const selectorsForReplace = allSelectors.filter((selector) =>
      selectorsToReplace.includes(selector)
    );

    // Push the replace action for setValue and getValue
    cut.push({
      facetAddress: facet.address as `0x${string}`,
      action: FacetCutAction.Replace,
      functionSelectors: selectorsForReplace as `0x${string}`[],
    });

    // Filter out selectors for add, excluding setValue and getValue
    const selectorsForAdd = allSelectors.filter(
      (selector) =>
        !selectorsToReplace.includes(selector) && selector !== "0x01ffc9a7"
    );

    // Push the add action for other functions
    cut.push({
      facetAddress: facet.address as `0x${string}`,
      action: FacetCutAction.Add,
      functionSelectors: selectorsForAdd as `0x${string}`[],
    });
    //0x55241077 && 0x20965255 , 0x01ffc9a7
  }

  //   // upgrade diamond with facets
  //   console.log("");
  //   const diamondCutFacet = await ethers.getContractAt(
  //     "DiamondCutFacet",
  //     diamond.address
  //   );
  //   // call to init function
  //   tx = await diamondCutFacet.diamondCut(cut, diamond.address, "0x", {
  //     gasLimit: 800000,}

  return cut;
};
