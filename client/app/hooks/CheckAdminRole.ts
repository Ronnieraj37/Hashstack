import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";
import { DIAMOND_ADDRESS } from "../constants";
import { ContractAUpgraded } from "@/abi/ContractAUpgraded";
export const GetAdminRole = ({
  address,
}: {
  address: `0x${string}` | undefined;
}) => {
  const { data: value, isLoading } = useReadContract({
    chainId: sepolia.id,
    abi: ContractAUpgraded,
    address: DIAMOND_ADDRESS,
    functionName: "checkAdminRole",
    account: address,
  });

  return { value, isLoading };
};
