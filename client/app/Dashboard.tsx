"use client";

import React from "react";
import { useAccount, useWriteContract } from "wagmi";
import { GetDiamondOwner } from "./hooks/GetOwnerDetails";
import { useEffect, useState } from "react";
import ValueCard from "./components/ValueCard";
import { DIAMOND_ADDRESS } from "./constants";
import { OwnershipFacet } from "@/abi/OwnershipFacet";

const Dashboard = () => {
  const { diamondAdmin } = GetDiamondOwner();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isDAdmin, setisDAdmin] = useState(false);
  const claimOwnership = async () => {
    try {
      await writeContractAsync({
        address: DIAMOND_ADDRESS,
        abi: OwnershipFacet,
        functionName: "transferOwnership",
        args: [address!],
      });
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    setisDAdmin(address == diamondAdmin);
  }, [diamondAdmin, address]);
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <p className=" text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        Admin of Contract : {diamondAdmin}
      </p>
      <ValueCard isDAdmin={isDAdmin} />
      {!isDAdmin && (
        <footer className=" flex gap-6 flex-wrap items-center justify-center">
          <button
            onClick={claimOwnership}
            disabled={isDAdmin}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Claim Diamond Ownership
          </button>
          <p>** Allowed only for testing </p>
        </footer>
      )}
    </main>
  );
};

export default Dashboard;
