"use client";

import { useAccount } from "wagmi";
import Dashboard from "./Dashboard";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-semibold">Hashstack Assignment</h1>
      {isConnected ? (
        <Dashboard />
      ) : (
        <p className=" font-[family-name:var(--font-geist-mono)] text-xl">
          Please Connect to Proceed
        </p>
      )}
    </div>
  );
}
