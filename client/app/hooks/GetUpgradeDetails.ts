import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";
import { DIAMOND_ADDRESS } from "../constants";
import { DiamondFacet } from "@/abi/DiamondFacet";
export const GetUpgradeDetails = () => {
  const {
    data: facetAddress,
    isLoading,
    error,
  } = useReadContract({
    chainId: sepolia.id,
    abi: DiamondFacet,
    address: DIAMOND_ADDRESS,
    functionName: "facetAddress",
    args: ["0x55241077"],
  });
  return { facetAddress, isLoading, error };
};
