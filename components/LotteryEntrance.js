// have a function to enter the lottery
import { useWeb3Contract } from "react-moralis";
const { contractAddresses, abi } = require("../constants");
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [entranceFee, setEntranceFeee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentwinner, setRecentWinner] = useState("0");

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        // abi still the same
        //contractAddress change
        abi: abi,
        contractAddress: raffleAddress, // we have to specify the netork id
        functionName: "enterRaffle",
        prams: {}, // there is no prams
        msgValue: entranceFee,
    });

    const {
        runContractFunction: getEntranceFee,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        // abi still the same
        //contractAddress change
        abi: abi,
        contractAddress: raffleAddress, // we have to specify the netork id
        functionName: "getEntranceFee",
        prams: {}, // there is no prams
    });
    // isweb3enabled starts with false then turn to true
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

    // updateUI
    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumberOfPlayers()).toString();
        const recentWinnerFromCall = await getRecentWinner();
        setEntranceFeee(entranceFeeFromCall);
        setNumPlayers(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
        console.log(entranceFeeFromCall);
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    // useNotification
    const dispatch = useNotification();
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        });
    };
    const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    };
    return (
        <div className="p-5">
            Hi from Lottery !
            {raffleAddress ? (
                <div className="">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({ onSuccess: handleSuccess });
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>
                        Entrance Fee :
                        {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    </div>
                    <div>Number of players : {numPlayers}</div>
                    <div>Recent winner : {recentwinner}</div>
                </div>
            ) : (
                <div>No Raffle Address detected</div>
            )}
        </div>
    );
}
