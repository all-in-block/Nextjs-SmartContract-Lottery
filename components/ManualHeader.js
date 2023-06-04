// to give other application to use this componenent we use export default
// we import it in index.js import {Header} from "../components/Header";
// add it as tag <Heder/>
// hook = its a way to keep track of state;

import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function ManualHeader(){
    const {enableWeb3, account, isWeb3Enabled,Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis();
    // useEffect() is constantely running
    //automatically run on load;
    // then it will run checking the value
    // anytime the dependcy between [], the hook will be runned;
    // no dependency array : it will run (on mounting + updating)
    //anytime something re-renders
    // blank dependency array : run once on load
    useEffect(()=>{
        console.log("hi");
        if(isWeb3Enabled) return;
        if(typeof window !== "undefined"){
            if(window.localStorage.getItem("connected")){
                // if that key "connected" exist ===> enableweb3()
                enableWeb3();
            }
        }
    }, [isWeb3Enabled]);
    useEffect(()=>{
        Moralis.onAccountChanged((account)=>{
            console.log(`account changed to ${account}`);
            if(account == null){ 
                // if account == null / we assume that the account is deconnected
                window.localStorage.removeItem("connected");
                deactivateWeb3();// isWeb3Enabled == false
                console.log("null account found");
            }
        })
    }, [])
    return(
    <div>
        {account? (<div>connected to {account.slice(0,6)}...{account.slice(account.length-4,)}</div>):(
        <button onClick={async ()=>{
        await enableWeb3();
        if(typeof(window!=="undefined")){
            // we want our application to remember that some one is connected
        window.localStorage.setItem("connected", "injected");
        }
        }} disabled={isWeb3EnableLoading}>connect
        </button>)}
    </div>)
}