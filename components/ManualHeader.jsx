import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ManualHeader = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
    console.log(isWeb3Enabled);
  }, [isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("disconencted");
      }
    });
  }, [Moralis, deactivateWeb3]);

  return (
    <div>
      {account ? (
        <div>
          Connected to ACCOUNT: {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            if (typeof window !== "undefined") {
              window.localStorage.setItem("connected", "injected");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          CONNECT
        </button>
      )}
    </div>
  );
};

export default ManualHeader;
