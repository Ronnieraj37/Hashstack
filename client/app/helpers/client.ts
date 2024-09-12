"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";
import { http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { darkTheme } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "HashStack",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains: [sepolia],
  ssr: true,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
  },
});

export const queryClient = new QueryClient();

export const dark = darkTheme();
