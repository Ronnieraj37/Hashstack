import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";
import { CONTRACTA_UPGRADED_ADDRESS } from "../constants";
import { ContractAUpgraded } from "@/abi/ContractAUpgraded";
export const GetContractAUpgradedAdmin = () => {
  const {
    data: contractAdmin,
    isLoading,
    error,
  } = useReadContract({
    chainId: sepolia.id,
    abi: ContractAUpgraded,
    address: CONTRACTA_UPGRADED_ADDRESS,
    functionName: "superAdmin",
  });
  return { contractAdmin, isLoading, error };
};
