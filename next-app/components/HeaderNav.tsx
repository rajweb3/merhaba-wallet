import { useWeb3Modal } from "@/context/Web3Context";
import { ChainConfig, chainConfig } from "@/config/wagmi";

export default function HeaderNav() {
  const { connect, disconnect, address, isConnected, chainId } = useWeb3Modal();

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Mehraba</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {isConnected ? (
            <button className="btn btn-neutral btn-sm">{address}</button>
          ) : null}
          <li></li>
          {chainId === 0 || chainId == undefined ? null : (
            <li>
              <button className="btn btn-neutral  btn-sm">
                {" "}
                {chainId !== 0 && chainConfig[chainId].name}
              </button>
            </li>
          )}
          <li></li>

          <li>
            {!isConnected ? (
              <button
                className="btn btn-active btn-accent btn-sm"
                onClick={connect}
              >
                Connect
              </button>
            ) : (
              <button
                className="btn btn-active btn-error btn-sm"
                onClick={disconnect}
              >
                Disconnect
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
