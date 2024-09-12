import { useReadContract } from "wagmi";
import { DIAMOND_ADDRESS } from "../constants";
import { ContractAUpgraded } from "@/abi/ContractAUpgraded";
export const GetContractAUpgradedAdmin = () => {
  const {
    data: contractAdmin,
    isLoading,
    error,
  } = useReadContract({
    abi: ContractAUpgraded,
    address: DIAMOND_ADDRESS,
    functionName: "superAdmin",
  });
  return { contractAdmin, isLoading, error };
};

export const CheckIfAdmin = ({ address }: { address: `0x${string}` }) => {
  const {
    data: isAdmin,
    isLoading,
    isError,
  } = useReadContract({
    abi: ContractAUpgraded,
    address: DIAMOND_ADDRESS,
    functionName: "checkAdminRole",
    args: [address],
  });
  return { isAdmin, isLoading, isError };
};
