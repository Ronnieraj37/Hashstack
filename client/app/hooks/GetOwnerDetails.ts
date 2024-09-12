import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";
import { DIAMOND_ADDRESS } from "../constants";
import { OwnershipFacet } from "@/abi/OwnershipFacet";

export const GetDiamondOwner = () => {
  const { data: diamondAdmin, isLoading } = useReadContract({
    chainId: sepolia.id,
    abi: OwnershipFacet,
    address: DIAMOND_ADDRESS,
    functionName: "owner",
  });
  return { diamondAdmin, isLoading };
};
