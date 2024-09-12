import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { upgradeDiamond } from "../helpers/upgrade";
import { DIAMOND_ADDRESS } from "../constants";
import { DiamondCut } from "@/abi/DiamondCut";
import { GetContractAUpgradedAdmin } from "../hooks/GetAdminDetails";
import { zeroAddress } from "viem";
import { ContractAUpgraded } from "@/abi/ContractAUpgraded";

const FacetUpgrade = ({ isUpgraded }: { isUpgraded: boolean }) => {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [roleAddress, setroleAddress] = useState<string>("");
  const { contractAdmin: adminAddress } = GetContractAUpgradedAdmin();

  const initializeUpgraded = async () => {
    try {
      await writeContractAsync({
        address: DIAMOND_ADDRESS,
        abi: ContractAUpgraded,
        functionName: "initialize",
        account: address,
      });
    } catch (error) {
      console.log("Error", error);
    }
    //
  };
  const updateFacet = async () => {
    try {
      const cut = await upgradeDiamond();

      await writeContractAsync({
        address: DIAMOND_ADDRESS,
        abi: DiamondCut,
        functionName: "diamondCut",
        args: [cut, DIAMOND_ADDRESS, "0x"],
      });
    } catch (error) {
      console.log("Error", error);
    }
  };
  const addAdminToContract = async () => {
    try {
      await writeContractAsync({
        address: DIAMOND_ADDRESS,
        abi: ContractAUpgraded,
        functionName: "grantRole",
        args: [
          "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
          roleAddress as `0x${string}`,
        ],
      });
    } catch (error) {
      console.log("Error", error);
    }
    //
  };
  return (
    <div>
      <p>SuperAdmin : {adminAddress}</p>
      {!isUpgraded ? (
        <button
          onClick={updateFacet}
          disabled={isUpgraded}
          className="rounded-full disabled:hover:bg-transparent disabled:hover:cursor-not-allowed border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          Update Facet
        </button>
      ) : adminAddress == zeroAddress ? (
        <button
          onClick={initializeUpgraded}
          className="rounded-full disabled:hover:bg-transparent disabled:hover:cursor-not-allowed border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          Initialize the Facet
        </button>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-around">
          <p className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
            Facet Updated
          </p>
          <div className="flex items-center gap-x-4">
            <input
              placeholder="0x..."
              type="text"
              className="rounded-full focus:outline-none transition-colors flex items-center justify-center bg-foreground text-background gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 w-32"
              onChange={(e) => {
                setroleAddress(e.target.value);
              }}
            />
            <button
              onClick={addAdminToContract}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-3"
            >
              Grant Admin Role
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacetUpgrade;
