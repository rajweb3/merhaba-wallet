import { wagmiSetup } from "@/config/wagmi";
import { Web3Context } from "@/context/Web3Context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";

import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={wagmiSetup}>
        <Web3Context>
          <SessionProvider>
            <Component {...pageProps} />
          </SessionProvider>
        </Web3Context>
      </WagmiConfig>
    </>
  );
}
