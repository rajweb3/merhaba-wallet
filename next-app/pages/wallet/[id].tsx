import { Inter } from "next/font/google";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
import { wallets } from "@/config/keystores";
import { useWeb3Modal } from "@/context/Web3Context";
import { walletAbi } from "@/config/abi/walletAbi";
import { celoAlfajores } from "viem/chains";
import { waitForTransaction } from "wagmi/actions";
import SocialConnectUI from "@/components/SocialConnectUI";
import { useSocialConnect } from "@/SocialConnect/useSocialConnect";

const inter = Inter({ subsets: ["latin"] });

export default function Wallet() {
  const { wallet } = useWeb3Modal();
  const [isOpen, setIsOpen] = useState(false);
  const { account, connected, lookupAddress } = useSocialConnect();

  const [paramsChainId, setParamsChainId] = useState(0);
  const [chainInfoSet, setChainInfoSet] = useState<{
    wallet: string;
    chainName: string;
    chainId: number;
  }>();
  const router = useRouter();
  useEffect(() => {
    console.log({ id: router.asPath.split("/").findLast((v) => true) });
    const chainId = parseInt(
      router.asPath.split("/").findLast((v) => true) as string
    );
    setParamsChainId(chainId);

    const chainInfo = wallets[
      "0x824d4f8299B9495BD1B145C5b95aB1530220Ce8F"
    ].filter((v) => v.chainId == chainId);
    setChainInfoSet(chainInfo[0]);
  });

  const writeToContract = async () => {
    try {
      const walletClient = await wallet();
      if (walletClient == undefined) {
        return;
      }
      const [account] = await walletClient.getAddresses();
      const mintResult = await walletClient?.writeContract({
        account: account,
        address: (chainInfoSet?.wallet as `0x${string}`) ?? account,
        abi: walletAbi,
        functionName: "executeExternalTx",
        args: ["0x5E873A671cC73ac1fD30E5Fb66E646a34A175baB", 1, ""],
        chain: celoAlfajores,
      });

      const txnData = await waitForTransaction({
        chainId: celoAlfajores.id,
        confirmations: 1000000000000000,
        hash: mintResult ?? `0x`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav>
        <HeaderNav />
      </nav>
      <main>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-gray-800 w-full sm:w-3/4 md:w-1/2 lg:w-2/5 p-8 shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold text-center mb-4">
              Smart Contract Wallet
            </h1>

            <div className="flex">
              {/* Transaction Sub-Section */}
              <div className="w-9/12 pr-4">
                <h2 className="text-lg font-semibold mb-2">Transaction</h2>

                <div className="mb-4">
                  <label className="block text-white mb-2">FROM</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Enter 42-character wallet address"
                    readOnly
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-white mb-2">TO</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Enter 42-character wallet address"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-white mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Enter amount"
                  />
                </div>

                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Transact
                </button>
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-gray-300 mx-4"></div>

              {/* Info Sub-Section */}
              <div className="w-1/2 pl-4">
                <h2 className="text-lg font-semibold mb-2">Info</h2>

                <p className="text-sm text-gray-500 mb-2">
                  Network: {chainInfoSet?.chainName}{" "}
                  {"(" + chainInfoSet?.chainId + ")"}
                </p>
                <p className="text-sm text-gray-500 mb-2">Address</p>
                <p className="text-sm text-gray-500 mb-2">Wallet Balance</p>
                {/* <p className="text-sm text-gray-500 mb-2">github username</p> */}

                {/* TODO: CELO check */}
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setIsOpen(true)}
                >
                  Social Connect
                </button>
                <SocialConnectUI
                  isOpen={isOpen}
                  closeModal={() => {
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
