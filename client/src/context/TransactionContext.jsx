import React, { createContext, useEffect, useState } from "react";

import { contractABI, contractAddress } from "../utils/constants";

import { ethers } from "ethers";

export const TransactionContext = createContext();

const { ethereum } = window;

function getEthereumContract() {
  const provider = new ethers.providers.Web3Provider(ethereum);

  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

  console.log({ provider, contractAddress, contractABI, signer, transactionContract });

  return transactionContract;
}
const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export function TransactionProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState();
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  async function checkIfWalletConnected() {
    try {
      if (!ethereum) return alert("Please install Metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      console.log("accounts:", accounts);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        await getAllTransactions();
      } else {
        console.log("No accounts");
      }
    } catch (error) {
      console.log("error:", error);
      console.log("No ethereum object");
    }
  }

  async function sendTransaction(formData) {
    try {
      if (!ethereum) return alert("Please install Metamask");

      const { addressTo, amount, keyword, message } = formData;

      const transactionContract = getEthereumContract();

      const parsedAmount = ethers.utils.parseEther(amount);

      const sendTransactionResult = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          },
        ],
      });

      console.log("sendTransactionResult:", sendTransactionResult);

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log("error:", error);
    }
  }

  async function getAllTransactions() {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletConnected();
    checkIfTransactionsExists();

    return () => {};
  }, []);

  async function connectWallet() {
    try {
      if (!ethereum) return alert("Please install Metamask");

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("error:", error);
      console.log("No ethereum object");
    }
  }

  return <TransactionContext.Provider value={{ connectWallet, currentAccount, sendTransaction, getAllTransactions, transactions }}>{children}</TransactionContext.Provider>;
}
