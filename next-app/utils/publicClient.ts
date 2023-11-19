import { createPublicClient, http } from "viem";
import { celoAlfajores, gnosis, goerli, scrollSepolia } from "viem/chains";
import { keccak256, defaultAbiCoder } from "ethers/lib/utils";

export const hashAddress = (address: string): string => {
  // ABI encode the address
  const encodedAddress = defaultAbiCoder.encode(["address"], [address]);

  // Apply keccak256 hashing
  const hash = keccak256(encodedAddress);

  console.log({ hash });

  return hash;
};

const publicClient = async () => {
  const goerliClient = createPublicClient({
    chain: goerli,
    transport: http(`https://rpc.ankr.com/eth_goerli`),
  });
  const gnosisClient = createPublicClient({
    chain: gnosis,
    transport: http(`https://rpc.ankr.com/gnosis`),
  });
  const celoAlfajoresClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(`https://alfajores-forno.celo-testnet.org`),
  });
  const scrollClient = createPublicClient({
    chain: scrollSepolia,
    transport: http(`https://rpc.ankr.com/scroll_sepolia_testnet`),
  });

  return { goerliClient, gnosisClient, celoAlfajoresClient, scrollClient };
};
export default publicClient;
