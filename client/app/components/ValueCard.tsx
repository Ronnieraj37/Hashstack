import React, { useEffect, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { GetValueDetails } from "../hooks/GetValueDetails";
import { useAccount, useWriteContract } from "wagmi";
import { CONTRACTA_UPGRADED_ADDRESS, DIAMOND_ADDRESS } from "../constants";
import { ContractA } from "@/abi/ContractA";
import FacetUpgrade from "./FacetUpgrade";
import { GetUpgradeDetails } from "../hooks/GetUpgradeDetails";
import { CheckIfAdmin } from "../hooks/GetAdminDetails";
const ValueCard = ({ isDAdmin }: { isDAdmin: boolean }) => {
  const [isUpgraded, setisUpgraded] = useState(false);
  const { address } = useAccount();
  const { value, isError } = GetValueDetails({ address });
  const { isAdmin } = CheckIfAdmin({
    address: address!,
  });
  const { writeContractAsync } = useWriteContract();
  const { facetAddress } = GetUpgradeDetails();
  const [newValue, setnewValue] = useState<number>(0);
  const updateValue = async () => {
    try {
      await writeContractAsync({
        address: DIAMOND_ADDRESS,
        abi: ContractA,
        functionName: "setValue",
        args: [BigInt(newValue)],
        account: address,
      });
    } catch (error) {
      console.log("Error", error);
    }
    //
  };
  useEffect(() => {
    if (facetAddress == CONTRACTA_UPGRADED_ADDRESS) {
      setisUpgraded(true);
    }
  }, [facetAddress]);
  return (
    <div>
      <div className="flex gap-4 flex-col items-center ">
        <div className="flex gap-x-4 items-center">
          {isUpgraded ? (
            !isAdmin ? (
              <p>Unauthorized to Get/Edit Value, Get Added by SuperAdmin</p>
            ) : (
              <div className="flex items-center flex-row gap-x-4">
                <p>Value : {Number(value)}</p>
                <div className="rounded-full transition-colors flex items-center justify-center bg-foreground text-background gap-2 text-sm sm:text-base h-10 sm:h-12 w-36 px-1">
                  <input
                    onChange={(e) => {
                      setnewValue(Number(e.target.value));
                    }}
                    placeholder="Value.."
                    type="number"
                    className="rounded-l-full focus:outline-none transition-colors flex items-center justify-center bg-foreground text-background gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 w-[75%]"
                  />
                  <button
                    onClick={updateValue}
                    className="w-[25%] rounded-full hover:bg-[#383838] dark:hover:bg-[#ccc]"
                  >
                    <PaperAirplaneIcon className="w-6" />
                  </button>
                </div>
              </div>
            )
          ) : isError ? (
            <p>Unauthorized to Get/Edit Value, Claim Ownership to access</p>
          ) : (
            <div className="flex items-center flex-row gap-x-4">
              <p>Value : {Number(value)}</p>
              <div className="rounded-full transition-colors flex items-center justify-center bg-foreground text-background gap-2 text-sm sm:text-base h-10 sm:h-12 w-36 px-1">
                <input
                  onChange={(e) => {
                    setnewValue(Number(e.target.value));
                  }}
                  placeholder="Value.."
                  type="number"
                  className="rounded-l-full focus:outline-none transition-colors flex items-center justify-center bg-foreground text-background gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 w-[75%]"
                />
                <button
                  onClick={updateValue}
                  className="w-[25%] rounded-full hover:bg-[#383838] dark:hover:bg-[#ccc]"
                >
                  <PaperAirplaneIcon className="w-6" />
                </button>
              </div>
            </div>
          )}
        </div>
        {isDAdmin ? (
          <FacetUpgrade isUpgraded={isUpgraded} />
        ) : (
          <p>Claim Ownership to Upgrade Facet</p>
        )}
      </div>
    </div>
  );
};

export default ValueCard;
