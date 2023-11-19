// Import Push SDK & Ethers
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ethers } from "ethers";

export const sendNotification = async ({
  recoveryWallet,
  guardianWallet,
}: {
  recoveryWallet: string;
  guardianWallet: string;
}) => {
  try {
    // Using random signer from a wallet, ideally this is the wallet you will connect
    const signer = new ethers.Wallet(
      process.env.NEXT_PUBLIC_PRIVATE_KEY_FOR_PUSH ?? ""
    );

    // Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
    const merhabaAdmin = await PushAPI.initialize(signer, { env: ENV.STAGING });

    // Send a notification to users of your protocol
    // const apiResponse = await PushAPI.payloads.sendNotification({
    //     signer,
    //     type: 3, // target
    //     identityType: 2, // direct payload
    //     notification: {
    //       title: `Merhaba Wallet`,
    //       body: `Wallet ${recoveryWallet} wishes to initiate their recovery mechanism. You are the guardian for the same, please contact the owner! Best wishes, Merhaba Wallet Team.`,
    //     },
    //     payload: {
    //       title: `Merhaba wallet`,
    //       body: `Wallet ${recoveryWallet} wishes to initiate their recovery mechanism. You are the guardian for the same, please contact the owner! Best wishes, Merhaba Wallet Team.`,
    //       cta: "",
    //       img: "",
    //     },
    //     recipients: "eip155:5:" + gu,
    //     channel: "eip155:5:0x79e9E4c26E9620E1de5Dce23F73336456ea5E782",
    //     env: "staging",
    //   });
    const apiResponse = await merhabaAdmin.channel.send([guardianWallet], {
      channel: "eip155:2357:0x79e9E4c26E9620E1de5Dce23F73336456ea5E782",
      payload: {
        title: `Merhaba wallet`,
        body: `Wallet ${recoveryWallet} wishes to initiate their recovery mechanism. You are the guardian for the same, please contact the owner! Best wishes, Merhaba Wallet Team.`,
        cta: "",
      },
      notification: {
        title: "Merhaba Recovery Notification",
        body: `Wallet ${recoveryWallet} wishes to initiate their recovery mechanism. You are the guardian for the same, please contact the owner! Best wishes, Merhaba Wallet Team.`,
      },
    });
    console.log({ apiResponse });
  } catch (error) {
    console.error(error);
  }
};
