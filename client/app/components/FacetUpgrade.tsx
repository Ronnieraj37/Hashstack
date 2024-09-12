import React from "react";
import { useAccount, useWriteContract } from "wagmi";
import { upgradeDiamond } from "../helpers/upgrade";
import { CONTRACTA_ADDRESS, DIAMOND_ADDRESS } from "../constants";
import { DiamondCut } from "@/abi/DiamondCut";
import { sepolia } from "viem/chains";
import { GetContractAUpgradedAdmin } from "../hooks/GetAdminDetails";
import { GetUpgradeDetails } from "../hooks/GetUpgradeDetails";

const FacetUpgrade = () => {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const { contractAdmin } = GetContractAUpgradedAdmin();
  const { facetAddress } = GetUpgradeDetails();
  console.log("Facet address - ", contractAdmin);
  //facetAddress
  const updateFacet = async () => {
    const cut = await upgradeDiamond();
    console.log("Cut : ", cut, DIAMOND_ADDRESS, "0x");
    await writeContractAsync({
      address: DIAMOND_ADDRESS,
      abi: DiamondCut,
      functionName: "diamondCut",
      chain: sepolia,
      args: [cut, DIAMOND_ADDRESS, "0x"],
      account: address,
    });
    // toast.success(`Removed Candidate ${candidate.name}`);
  };
  return (
    <div>
      <button
        onClick={updateFacet}
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
      >
        Update Facet
      </button>
    </div>
  );
};

export default FacetUpgrade;
