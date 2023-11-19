import { Inter } from "next/font/google";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  const [enableNewWalletForm, setEnableNewWalletForm] = useState(false);
  const [newWalletNetwork, setNewWalletNetwork] = useState("");
  return (
    <>
      <nav>
        <HeaderNav />
      </nav>
      <main>
        <div className="container mx-auto py-8">
          <div className="flex justify-end mb-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Initiate Recovery
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-gray-800 text-lg font-semibold mb-2">
                Network Name
              </h3>
              <p className="text-gray-500 text-sm mb-2">Wallet Address</p>
              <p className="text-gray-500 text-sm mb-2">Wallet Balance: </p>
              {/* <p className="text-gray-500 text-sm mb-2">Creation Tx: </p> */}
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
                Open
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-gray-800 text-lg font-semibold mb-2">
                Network Name
              </h3>
              <p className="text-gray-500 text-sm mb-2">Wallet Address</p>
              <p className="text-gray-500 text-sm mb-2">Wallet Balance: </p>
              {/* <p className="text-gray-500 text-sm mb-2">Creation Tx: </p> */}
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
                Open
              </button>
            </div>
            <div className=" rounded-lg p-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  const mod = document?.getElementById(
                    "my_modal_3"
                  ) as HTMLDialogElement;
                  mod.showModal();
                }}
              >
                New Wallet
              </button>
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box text-center">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-lg">New Wallet Creation!</h3>
                  <p className="py-4">Select the network</p>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    defaultValue={"Which network?"}
                    onChange={(v) => {
                      console.log({ network: v.target.value });
                      setNewWalletNetwork(v.target.value)
                      setEnableNewWalletForm(true);
                    }}
                  >
                    <option>Gnosis</option>
                    <option>zkSync</option>
                  </select>
                  <br />
                  <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded mt-4" disabled={!enableNewWalletForm}>
                    Create
                  </button>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
