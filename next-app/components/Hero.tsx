import { keystorePairs } from "@/config/keystores";
import { useWeb3Modal } from "@/context/Web3Context";
import { useEffect, useState } from "react";

export default function CenterCard() {
  const { connect, isConnected, address } = useWeb3Modal();
  const [newWallet, setNewWallet] = useState(false);
  useEffect(() => {
    if (
      isConnected &&
      keystorePairs.findIndex(
        (v) => v.owner.toLowerCase() == address.toLowerCase()
      ) == -1
    ) {
      setNewWallet(true);
    } else {
      // TODO: Redirect
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
            <button className="btn btn-primary" onClick={connect}>
              Create New Mehraba Wallet
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
