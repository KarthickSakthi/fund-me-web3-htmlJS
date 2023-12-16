
import { ethers } from "./ethers-5.1.esm.min";
import { FundMeContractAddress, ABI } from "./constants";

const connectButton=document.getElementById("connectButton");
const fundButton=document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connectToMetamask;
fundButton.onclick = fund;
balanceButton.onclick= getBalance;
withdrawButton.onclick = withdraw;


async function getBalance(){
    if(window.ethereum !== undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(FundMeContractAddress);
        console.log(`balance is: ${ethers.utils.formatEther(balance)}`)
    }
}

async function connectToMetamask(){
    if(window.ethereum !== undefined){
        console.log("Connected to metamask");
        await window.ethereum.request({method: "eth_requestAccounts"})
        document.getElementById("connectButton").innerHTML = "Connected!"
    }else{
        console.log("Connected to metamask");
        document.getElementById("connectButton").innerHTML = "Not Connected!"
    }
}

async function fund(){
    console.log("Funding..")
    let etherAmount = document.getElementById("ethAmount").value
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(FundMeContractAddress, ABI, signer)
    try{
        const tx = await contract.fund({value: ethers.utils.parseEther(etherAmount)})
        await listenForTransactionMine(trandsactionResonse,provider)
    }
    catch(error){
        console.error(`Fund Error:: ${error}`)
    }
}

async function withdraw(){
    console.log("Funding..")
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(FundMeContractAddress, ABI, signer)
    try{
        const tx = await contract.withdraw()
        await listenForTransactionMine(trandsactionResonse,provider)
    }
    catch(error){
        console.error(`Withdraw Error:: ${error}`)
    }
}

function listenForTransactionMine(transactionResponse){
    console.log(`Mining ${transactionResponse.hash}...`)
    //listen for the transaction to finish
   return new Promise((resolve,reject)=>{ provider.once(trandsactionResonse.hash,(trnasactionReceipt)=>{
    console.log(`Completed with ${transactionResponse.confirmations} confirmations`)
    resolve()
    })
    })
}