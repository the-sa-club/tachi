import { IPayoutDetails } from "../models/IPayoutDetails";

const cidScript: HTMLScriptElement = document.getElementById(
  "cid_theclub"
) as HTMLScriptElement;

const cid = cidScript.getAttribute("cid");
cidScript.setAttribute("cid", "");

(window as any).theClub = {
  payout: (batchDetails: IPayoutDetails[] = [], cb: (v: any) => void) => {
    chrome.runtime.sendMessage(
      cid,
      { message: "tx_signing_!@#", data: JSON.stringify(batchDetails) },
      (res) => {
        cb(res);
      }
    );
  },
  sync: (cb: (addresses: any[]) => void) => {
    chrome.runtime.sendMessage(cid, { message: "sync_!@#" }, (res) => {
      cb(res);
    });
  },
  claim: (addresses: string[] = [], cb: (v: any) => void) => {
    chrome.runtime.sendMessage(
      cid,
      { message: "claim_!@#", data: JSON.stringify(addresses) },
      (res) => {
        cb(res);
      }
    );
  },
};

document.querySelector("body").removeChild(cidScript);
console.log("Page Script end");
