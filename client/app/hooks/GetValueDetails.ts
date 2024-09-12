import { ContractA } from "@/abi/ContractA";
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
    isError,
  } = useReadContract({
    abi: ContractA,
    address: DIAMOND_ADDRESS,
    functionName: "getValue",
    account: address,
  });
  return { value, isLoading, isError };
};
