import React,{ useContext, useState }  from "react";
import { AiFillAlipayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import Loader from "./Loader";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

function Input(props) {
  return <input {...props} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"/>
}

export default function Welcome() {
  const {connectWallet, currentAccount, sendTransaction} = useContext(TransactionContext) 

  const [formData, setFormData] = useState({addressTo:"", amount:"", keyword:"", message:""})

  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e) {
    const {target:{name, value}} = e
    console.log("value:",value, "name:",name)

    setFormData({...formData, [name]:value})
  }

  async function handleSubmit(e) {
    const {addressTo, amount, keyword, message } = formData

    e.preventDefault()

    console.log({addressTo, amount, keyword, message })

    if (!addressTo || !amount || !keyword || !message) return

    setIsLoading(true)
    await sendTransaction(formData)
    setIsLoading(false)
  }

  console.log("Welcome render")
 
  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto
            <br />
            Accross the world
          </h1>
          <p className="text-left mt-5 text-white font-light mf:w-9/12 w-11/12 text-base">Explore the crypto world. Buy and sell cryptocurrencies on MyKrypto.</p>
          
          {!currentAccount && <button className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]" type="button" onClick={connectWallet}>
            <p className="text-white text-base font-semibold">Connect Wallet</p>
          </button>}

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${commonStyles}`}>Reliability</div>
            <div className={commonStyles}>Security</div>
            <div className={`rounded-tr-2xl ${commonStyles}`}>Ethereum</div>
            <div className={`rounded-bl-2xl ${commonStyles}`}>Web 3.0</div>
            <div className={commonStyles}>Low Fees</div>
            <div className={`rounded-br-2xl ${commonStyles}`}>Blockchain</div>
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72  w-full my-5 eth-card white-glassmorphism">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">{currentAccount ? shortenAddress(currentAccount) : "..."}</p>
                <p className="text-white font-semibold text-lg">Ethereum</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input placeholder="Address To" name="addressTo" type="text" onChange={(e)=>{handleChange(e)}} value={formData.addressTo} />
            <Input placeholder="Amount (ETH)" name="amount" type="text" onChange={(e)=>{handleChange(e)}} value={formData.amount} />
            <Input placeholder="Keyword" name="keyword" type="text" onChange={(e)=>{handleChange(e)}} value={formData.keyword} />
            <Input placeholder="Message" name="message" type="text" onChange={(e)=>{handleChange(e)}} value={formData.message} />

            <div className="h-[1px] w-full bg-gray-400 my-2"></div>

            {
              isLoading ?
                <Loader/>
                :
                <button type="button" onClick={handleSubmit} className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer">
                  Send Now
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
