import React, { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";
import { Bell } from "@web3uikit/icons";

const LotteryEntrance = () => {
  //moralis ce detektovati mrezu na koju je metamask konektovana
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  //try to read raffle entrance fee
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  //try to read raffle entrance fee
  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = await getRecentWinner();

    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = function () {
    dispatch({
      type: "success",
      message: "Transaction complete",
      title: "Tx Notification",
      position: "topR",
      icon: <Bell fontSize={20} />,
    });
  };

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl py-4 px-4 font-bold text-3xl text-slate-900 dark:text-white mt-5">
        Lottery
      </h1>
      {raffleAddress ? (
        <div>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Lottery entrance Fee is:{" "}
            {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </p>
          <br></br>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Number Of Players: {numPlayers}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Reccent Winner: {recentWinner}
          </p>
        </div>
      ) : (
        <h3 className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Please connect to a supported chain{" "}
        </h3>
      )}
    </div>
  );
};

export default LotteryEntrance;
