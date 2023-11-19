import { Inter } from "next/font/google";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Recovery() {
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

              <p className="text-sm text-gray-500 mb-2">Threshold:</p>
              <p className="text-sm text-gray-500 mb-2">Verification Key</p>
              <button className=" bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-gray-800 text-lg font-semibold mb-2">
                Guardian Wallet 1
              </h3>
              <p className="text-gray-500 text-sm mb-2">Wallet Address</p>
              <p className="text-gray-500 text-sm mb-2">Status: </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
                Sign & Submit
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-gray-800 text-lg font-semibold mb-2">
                Guardian Wallet 1
              </h3>
              <p className="text-gray-500 text-sm mb-2">Wallet Address</p>
              <p className="text-gray-500 text-sm mb-2">Status: </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
                Sign & Submit
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
