export const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "";
export const alchemyProvideKey =
  process.env.NEXT_PUBLIC_ALCHEMY_PROVIDER_KEY ?? "";
export const infuraId = process.env.NEXT_PUBLIC_INFURA_ID ?? "";

import { Chain } from "@wagmi/core";
import {
  gnosisChiado,
  goerli,
  polygonMumbai,
  polygonZkEvmTestnet,
} from "viem/chains";
import { configureChains, createConfig } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

// Represents, active network
export const polygonAddress: any =
  process.env.NEXT_PUBLIC_POLYGON_ADDRESS ??
  "0x05870fA27656036ecD754667edD2e91f81590f39";

export const activeChain: Chain = polygonZkEvmTestnet;

export const activeChainRpc: string = "https://rpc.public.zkevm-test.net";

export const goerliAddress: any =
  process.env.NEXT_PUBLIC_GOERLI_ADDRESS ??
  "0x05870fA27656036ecD754667edD2e91f81590f39";

export const mantleKeystoreAddress =
  "0xA71217532eDecf0D2d50222B8066D0187a9eC869";

export type ChainConfig = {
  [networkId: number]: {
    name: string;
  };
};

export const chainConfig: ChainConfig = {
  1: {
    name: "Ethereum",
  },
  5: {
    name: "Goerli",
  },
  80001: {
    name: "Polygon Mumbai",
  },
  10200: {
    name: "Chiado",
  },
  44787: {
    name: "Alfajores",
  },
  280: {
    name: "zkSync Era",
  },
  534351: {
    name: "Scroll Seploia",
  },
  1442: {
    name: "Polygon zkEVM Testnet",
  },
  5001: {
    name: "Mantle",
  },
  59140: {
    name: "Linea",
  },
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli, polygonMumbai, gnosisChiado],
  [alchemyProvider({ apiKey: alchemyProvideKey }), publicProvider()]
);

console.log({ walletConnectProjectId });
export const wagmiSetup = createConfig({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains: chains,
      options: {
        projectId: walletConnectProjectId,
      },
    }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: "Injected",
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  publicClient,
  webSocketPublicClient,
});
