import { ContractA } from "@/abi/ContractA";
import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";
import { DIAMOND_ADDRESS } from "../constants";
import { OwnershipFacet } from "@/abi/OwnershipFacet";
export const GetContractAOwner = () => {
  const {
    data: contractAdmin,
    isLoading,
    error,
  } = useReadContract({
    chainId: sepolia.id,
    abi: ContractA,
    address: DIAMOND_ADDRESS,
    functionName: "contractAdmin",
  });
  return { contractAdmin, isLoading, error };
};

export const GetDiamondOwner = () => {
  const { data: diamondAdmin, isLoading } = useReadContract({
    chainId: sepolia.id,
    abi: OwnershipFacet,
    address: DIAMOND_ADDRESS,
    functionName: "owner",
  });
  return { diamondAdmin, isLoading };
};
