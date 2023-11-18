/* eslint-disable no-mixed-spaces-and-tabs */
import React, {
  useContext,
  useRef,
  useState,
  useCallback,
  createContext,
} from "react";
import { useRouter } from "next/router";

import { Chain, useDisconnect } from "wagmi";
import {
  disconnect as wagmiDisconnect,
  getWalletClient,
  watchAccount,
  watchNetwork,
  GetWalletClientResult,
} from "wagmi/actions";
import ConnectWalletModal from "../components/ConnectWalletModal";

export interface IVerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
  blockchainAccountId: string;
}

export interface IComputeWallet {
  vMd: IVerificationMethod;
  controller: boolean;
  chainData: any;
}

// add types
export interface Web3ModalContextValue {
  connect: () => Promise<void>; // needed
  disconnect: () => Promise<void>; // needed
  openWeb3Modal: () => void; // needed
  closeWeb3Modal: () => void; // needed
  setIsOpenLoader: (isOpenLoader: boolean) => void; // needed
  setWalletClient: (data: any) => void;
  wallet: () => Promise<GetWalletClientResult | undefined>; // needed
  switchToRequiredNetwork: (selectedNetwork: Chain) => Promise<void>;

  isOpenLoader: boolean;
  isOpenWeb3Modal: boolean;
  isOpenSwitchModal: boolean;
  chainId?: number;
  address: string;
  isConnected: boolean;
  isLoading: boolean;
  error?: Error;
  walletClient: any;
}

const Web3ModalContext = createContext<Web3ModalContextValue>(null as any);

export const Web3Context = ({ children }: { children: React.ReactNode }) => {
  const [chainId, setChainId] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const [isOpenLoader, setIsOpenLoader] = useState<boolean>(false);
  const [isOpenSwitchModal, setIsOpenSwitchModal] = useState<boolean>(false);
  const [isOpenWeb3Modal, setIsOpenWeb3Modal] = useState<boolean>(false);
  const [switchModalMessage, setSwitchModalMessage] = useState<string>("");
  const [walletClient, setWalletClient] = useState<GetWalletClientResult>();
  const [modalCallbacks, setModalCallbacks] = useState<{
    resolve: (data: { accountAddress: string; chainId: number }) => void;
    reject: () => void;
  }>({
    resolve: (data: { accountAddress: string; chainId: number }) => {
      return;
    },
    reject: () => {
      return;
    },
  });
  // const queryClient = useQueryClient();

  const [watchers, setWatchers] = useState({
    unwatchAccountChange: () => {
      return;
    },
    unwatchNetworkChange: () => {
      return;
    },
  });

  const hasFired = useRef(false);
  const router = useRouter();
  const wagmiDisconnectHook = useDisconnect();

  const closeWeb3Modal = () => {
    setIsOpenWeb3Modal(false);
    return;
  };
  const openWeb3Modal = () => {
    setIsOpenWeb3Modal(true);
    return;
  };

  const completeWalletConnection = async (): Promise<{
    accountAddress: string;
    chainId: number;
  }> => {
    return new Promise((resolve, reject) => {
      setModalCallbacks({ reject, resolve });
    });
  };

  const handleAccountChange = async () => {
    const path = window.location.href;
    // switch wallet page will be happening here
    if (path.includes("/recover-wallet")) {
      return;
    } else {
      await disconnect();
      connect();
      return;
    }
  };

  const connect = async () => {
    try {
      openWeb3Modal();
      const dataHere = await completeWalletConnection();
      // setIsOpenLoader(true);
      setAddress(dataHere.accountAddress);
      setChainId(dataHere.chainId);
      const unWatchaccount = watchAccount(handleAccountChange);
      const unWatchNetwork = watchNetwork((network: any) => {
        setChainId(network.chain?.id ?? chainId);
      });
      setWatchers({
        unwatchAccountChange: unWatchaccount,
        unwatchNetworkChange: unWatchNetwork,
      });
      const walletClientFromWagmi = await getWalletClient();
      setWalletClient(walletClientFromWagmi);
    } catch (error: any) {
      console.error(error);
    }
  };

  const disconnect = async () => {
    wagmiDisconnectHook.disconnect();
    setAddress("");
    setLoading(false);
    setChainId(0);
    setWalletClient(undefined);
    // queryClient.removeQueries(["resolveDID"]);
    hasFired.current = false;
    watchers.unwatchAccountChange();
    watchers.unwatchNetworkChange();
    setWatchers({
      unwatchAccountChange: () => {
        return;
      },
      unwatchNetworkChange: () => {
        return;
      },
    });
    router.push("/");
    return;
  };

  const wallet = async () => {
    const walletClient = await getWalletClient();
    return walletClient;
  };

  const triggerWalletModal = async (message: string) => {
    setSwitchModalMessage(message);
    setIsOpenSwitchModal(true);
    setTimeout(() => {
      setIsOpenSwitchModal(false);
    }, 3500);
    return new Promise((resolve) => setTimeout(resolve, 2600));
  };

  const switchToRequiredNetwork = async (selectedNetwork: Chain) => {
    try {
      await walletClient?.switchChain({
        id: selectedNetwork.id,
      });
    } catch (error: any) {
      console.log(error.code);
      if (error.code === 4902) {
        try {
          await walletClient?.addChain({
            chain: selectedNetwork,
          });
          await walletClient?.switchChain({
            id: selectedNetwork.id,
          });
          return;
        } catch (err: any) {
          if (err.code == -32002) {
            return;
          }
          console.error(`Could not switch to ${selectedNetwork.name}.`);
          return;
        }
      } else {
        console.error(`Could not switch to ${selectedNetwork.name}.`);
        return;
      }
    }
  };

  const value: Web3ModalContextValue = {
    connect,
    disconnect,
    switchToRequiredNetwork,
    setWalletClient,
    openWeb3Modal,
    closeWeb3Modal,
    setIsOpenLoader,
    wallet,
    isOpenLoader,
    isOpenWeb3Modal,
    isOpenSwitchModal,
    chainId,
    address,
    isConnected: address.length > 0,
    isLoading: loading,
    error,
    walletClient,
  };

  return (
    <Web3ModalContext.Provider value={value}>
      <ConnectWalletModal
        callbackForData={modalCallbacks}
        isOpen={isOpenWeb3Modal}
        onModalClose={closeWeb3Modal}
      />
      {children}{" "}
    </Web3ModalContext.Provider>
  );
};

export const useWeb3Modal = () => useContext(Web3ModalContext);
