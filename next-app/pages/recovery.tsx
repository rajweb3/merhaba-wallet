import { Inter } from "next/font/google";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useWeb3Modal } from "@/context/Web3Context";
import publicClient, { hashAddress } from "@/utils/publicClient";
import { fromHex, getContract, isAddress } from "viem";
import { ABSOLUTE_KEYSTORE, keystorePairs } from "@/config/keystores";
import { keyStoreAbi } from "@/config/abi/keyStoreAbi";
import { goerli } from "viem/chains";
import { waitForTransaction, watchAccount } from "wagmi/actions";
import { write } from "fs";
import { sendNotification } from "@/utils/pushProtocol";

const inter = Inter({ subsets: ["latin"] });

export default function Recovery() {
  const { wallet, isConnected, address, walletClient, openWeb3Modal, connect } =
    useWeb3Modal();

  const [verificationKey, setVerificationKey] = useState("");
  const [newVerificationKey, setNewVerificationKey] = useState("");
  const [currentWallet, setCurrentWallet] = useState("");
  const [threshold, setThreshold] = useState(0);
  const [isVerificationKeyRecovery, setIsVerificationKeyRecovery] =
    useState("");
  const [isConnectedAccountGuardian, setIsConnectedAccountGuardian] =
    useState("");

  const unWatchaccount = watchAccount(async () => {
    const walletClient = await wallet();
    if (walletClient == undefined) {
      return;
    }
    const [account] = await walletClient.getAddresses();
    setCurrentWallet(account);
    console.log({ account, currentWallet });
    const { goerliClient } = await publicClient();
    const contract = getContract({
      address: ABSOLUTE_KEYSTORE,
      abi: keyStoreAbi,
      publicClient: goerliClient,
    });
    const isGuardian: any = await contract.read.isGuardian([
      hashAddress(account as string),
    ]);
    setIsConnectedAccountGuardian(isGuardian);
  });

  useEffect(() => {
    // Setup code (e.g., add event listener, start timer, etc.)

    return () => {
      // Clean-up code
      unWatchaccount();
    };
  }, []);

  const [counter, setCounter] = useState(0);
  const [addresses, setAddresses] = useState<
    { address: string; hash: string }[]
  >([]);

  const readData = async () => {
    const { goerliClient } = await publicClient();
    const contract = getContract({
      address: ABSOLUTE_KEYSTORE,
      abi: keyStoreAbi,
      publicClient: goerliClient,
    });
    const threshold: any = await contract.read.threshold();
    const verificationKeyFromContract: any =
      await contract.read.verificationKey();
    const isVerificationKeyInRecovery: any =
      await contract.read.isVerificationKeyInRecovery();
    console.log({
      isVerificationKeyInRecovery,
      threshold,
      verificationKeyFromContract,
    });
    setVerificationKey(verificationKeyFromContract);
    setThreshold(fromHex(threshold, "number"));
    setIsVerificationKeyRecovery(isVerificationKeyInRecovery);
  };
  const writeToContract = async () => {
    try {
      if (newVerificationKey.length != 42 || !isAddress(newVerificationKey)) {
        console.error("Not a valid verification key");
        return;
      }
      setCounter(counter + 1);
      console.log(counter);
      const walletClient = await wallet();
      console.log({ walletClient });
      if (walletClient == undefined) {
        return;
      }

      const [account] = await walletClient.getAddresses();

      // sendNotification({
      //   recoveryWallet: keystorePairs[0].owner,
      //   guardianWallet: account,
      // });

      console.log({ account });

      const mintResult = await walletClient?.writeContract({
        account: account,
        address: ABSOLUTE_KEYSTORE,
        abi: keyStoreAbi,
        functionName:
          counter <= 0
            ? "initiateRecovery"
            : counter === 1
            ? "supportRecovery"
            : "executeRecovery",
        args:
          counter <= 0
            ? [newVerificationKey]
            : counter === 1
            ? [newVerificationKey]
            : [newVerificationKey, addresses.map((v) => v.address)],
        chain: goerli,
      });

      const txnData = await waitForTransaction({
        chainId: 5001,
        confirmations: 1,
        hash: mintResult ?? `0x`,
      });
      console.log({ txnData: txnData.transactionHash });
      setAddresses([
        { address: account as string, hash: txnData.transactionHash },
        ...addresses,
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    readData();
  });
  const concatAddress = (address: string) => {
    return address.slice(0, 9) + "..." + address.slice(33);
  };
  return (
    <>
      <nav>
        <HeaderNav />
      </nav>
      <main>
        <div className="container mx-auto py-8">
          <div className="flex justify-center mb-4">
            <h2 className="text-white text-2xl font-semibold mb-5">
              Recovery Process
            </h2>
          </div>
          <div className="flex items-center justify-center mb-5">
            {/* Transaction Sub-Section */}
            <div className="w-full pr-4 items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Key Store Info</h2>

              <p className="text-sm text-gray-500 mb-2">
                Threshold: {threshold}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Verification Key: {verificationKey}
              </p>
              <button
                className=" bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={readData}
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-gray-800 text-lg font-semibold mb-2">
                  Wallet: {concatAddress(currentWallet)}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Guardian:
                  {isConnectedAccountGuardian ? "Yes" : "No"}{" "}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  Status:{" "}
                  {isVerificationKeyRecovery
                    ? "In Recovery"
                    : "Not in recovery"}{" "}
                  {counter <= 0
                    ? "(Initiate Recovery)"
                    : counter === 1
                    ? "(Support Recovery)"
                    : "(Execute Recovery"}
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={() => {
                    if (counter <= 0) {
                      const mod = document?.getElementById(
                        "ver_key_modal"
                      ) as HTMLDialogElement;
                      mod.showModal();
                    } else {
                      writeToContract();
                    }
                  }}
                >
                  Sign & Submit
                </button>
                <dialog id="ver_key_modal" className="modal">
                  <div className="modal-box text-center">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <h3 className="font-bold text-lg">New Verification Key!</h3>
                    <input
                      type="text"
                      placeholder="key"
                      onChange={(e) => {
                        setNewVerificationKey(e.target.value);
                      }}
                      className="input input-bordered w-full max-w-xs"
                      maxLength={42}
                      minLength={42}
                    />
                    <br />
                    <button
                      className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded mt-4"
                      onClick={() => {
                        writeToContract();
                        //TODO: Push logic
                        sendNotification({
                          recoveryWallet: keystorePairs[0].owner,
                          guardianWallet: address,
                        });
                      }}
                    >
                      Sign & Submit
                    </button>
                  </div>
                </dialog>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {addresses.map((v) => {
              return (
                <div className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-gray-800 text-lg font-semibold mb-2">
                    Guardian Signed
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Guardian: {concatAddress(v.address)}{" "}
                  </p>
                  <p className="text-gray-500 text-sm mb-2">
                    Tx Link:{" "}
                    <a href={`https://goerli.etherscan.io/tx/${v.hash}`}>
                      Link
                    </a>{" "}
                  </p>
                  <p className="text-gray-500 text-sm mb-2">Status: Signed</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
