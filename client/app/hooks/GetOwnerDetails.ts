import { useReadContract } from "wagmi";
import { DIAMOND_ADDRESS } from "../constants";
import { OwnershipFacet } from "@/abi/OwnershipFacet";

export const GetDiamondOwner = () => {
  const { data: diamondAdmin, isLoading } = useReadContract({
    abi: OwnershipFacet,
    address: DIAMOND_ADDRESS,
    functionName: "owner",
  });
  return { diamondAdmin, isLoading };
};
