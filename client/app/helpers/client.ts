"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";
import { avalancheFuji } from "wagmi/chains";
import { darkTheme } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "HashStack",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains: [avalancheFuji],
  ssr: true,
});

export const queryClient = new QueryClient();

export const dark = darkTheme();
