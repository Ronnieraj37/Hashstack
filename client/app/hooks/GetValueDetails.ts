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
    error,
  } = useReadContract({
    abi: ContractA,
    address: DIAMOND_ADDRESS,
    functionName: "getValue",
    account: address,
  });
  console.log("data : ", value, error);
  return { value, isLoading, isError };
};
