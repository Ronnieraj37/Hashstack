import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { GetValueDetails } from "../hooks/GetValueDetails";
import { useAccount, useWriteContract } from "wagmi";
import { DIAMOND_ADDRESS } from "../constants";
import { ContractA } from "@/abi/ContractA";
import { sepolia } from "viem/chains";
import FacetUpgrade from "./FacetUpgrade";
const ValueCard = () => {
  const { address } = useAccount();
  const { value, error } = GetValueDetails({ address });
  const { writeContractAsync } = useWriteContract();
  const [newValue, setnewValue] = useState<number>(0);
  const updateValue = async () => {
    console.log("Account : ", address);
    await writeContractAsync({
      address: DIAMOND_ADDRESS,
      abi: ContractA,
      functionName: "setValue",
      chain: sepolia,
      args: [BigInt(newValue)],
      account: address,
    });
    // toast.success(`Removed Candidate ${candidate.name}`);
  };
  if (error) console.log("err:", error);
  return (
    <div>
      <div className="flex gap-4 flex-col items-center ">
        <div className="flex gap-x-4 items-center">
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
        <FacetUpgrade />
      </div>
    </div>
  );
};

export default ValueCard;
