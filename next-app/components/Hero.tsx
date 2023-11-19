import { keystorePairs } from "@/config/keystores";
import { useWeb3Modal } from "@/context/Web3Context";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CenterCard() {
  const { connect, isConnected, address } = useWeb3Modal();
  const [newWallet, setNewWallet] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (
      isConnected &&
      keystorePairs.findIndex(
        (v) => v.owner.toLowerCase() == address.toLowerCase()
      ) == -1
    ) {
      setNewWallet(true);
    } else if (
      isConnected &&
      keystorePairs.findIndex(
        (v) => v.owner.toLowerCase() == address.toLowerCase()
      ) != -1
    ) {
      // TODO: Redirect
      router.push("/dashboard");
    } else {
    }
  }, [isConnected, address]);
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Mehraba!</h1>
          <br />
          {isConnected ? null : (
            <button className="btn btn-primary" onClick={connect}>
              Connect Wallet
            </button>
          )}
          {newWallet ? (
            // <button className="btn btn-primary" onClick={connect}>
            //   Create New Mehraba Wallet
            // </button>
            <p className="text-md text-gray-500 mb-2">
              This wallet currently does not have any keystore associated with
              it.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
