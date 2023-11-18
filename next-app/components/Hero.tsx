import { useWeb3Modal } from "@/context/Web3Context";

export default function CenterCard() {
  const { connect, isConnected } = useWeb3Modal();
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
        </div>
      </div>
    </div>
  );
}
