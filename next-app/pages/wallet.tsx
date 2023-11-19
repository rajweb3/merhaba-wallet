import { Inter } from "next/font/google";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

const inter = Inter({ subsets: ["latin"] });

export default function Wallet() {
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

                <p className="text-sm text-gray-500 mb-2">Address</p>
                <p className="text-sm text-gray-500 mb-2">Wallet Balance</p>
                {/* <p className="text-sm text-gray-500 mb-2">github username</p> */}

                {/* TODO: CELO check */}
                <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Social Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
