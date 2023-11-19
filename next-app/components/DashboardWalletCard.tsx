import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardWalletCard({
  chainId,
  chainName,
  walletAddress,
}: {
  chainId: number;
  chainName: string;
  walletAddress: string;
}) {
  const router = useRouter();
  useEffect(() => {}, []);
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-gray-800 text-lg font-semibold mb-2">{chainName}</h3>
      <p className="text-gray-500 text-sm mb-2">
        Wallet Address: {walletAddress}
      </p>
      <p className="text-gray-500 text-sm mb-2">Wallet Balance: </p>
      {/* <p className="text-gray-500 text-sm mb-2">Creation Tx: </p> */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => {
          router.push(`/wallet/${chainId}`);
        }}
      >
        Open
      </button>
    </div>
  );
}
