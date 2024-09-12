import { ContractA } from "@/abi/ContractA";
import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";
import { DIAMOND_ADDRESS } from "../constants";
export const GetValueDetails = ({
  address,
}: {
  address: `0x${string}` | undefined;
}) => {
  const {
    data: value,
    isLoading,
    error,
  } = useReadContract({
    chainId: sepolia.id,
    abi: ContractA,
    address: DIAMOND_ADDRESS,
    functionName: "getValue",
    account: address,
  });

  return { value, isLoading, error };
};
