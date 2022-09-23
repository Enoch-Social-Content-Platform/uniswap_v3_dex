import React from 'react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PageButton from './PageButton';
import ConnectButton from './ConnectButton';
import ConfigModal from './ConfigModal';
import CurrencyField from './CurrencyField'
import { GearFill } from 'react-bootstrap-icons';
import BeatLoader from "react-spinners/BeatLoader";
import { getWethContract, getDaiContract, getPrice, runSwap } from '../services/AlphaRouterService'

function Main() {

  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);

    const [provider, setProvider] = useState(undefined)
    // const [signer, setSigner] = useState(undefined)
    const [signerAddress, setSignerAddress] = useState(undefined)

    const [slippageAmount, setSlippageAmount] = useState(2)
    const [deadlineMinutes, setDeadlineMinutes] = useState(10)
    const [showModal, setShowModal] = useState(undefined)

    const [inputAmount, setInputAmount] = useState(undefined)
    const [outputAmount, setOutputAmount] = useState(undefined)
    const [transaction, setTransaction] = useState(undefined)
    const [loading, setLoading] = useState(undefined)
    const [ratio, setRatio] = useState(undefined)
    const [wethContract, setWethContract] = useState(undefined)
    const [daiContract, setDaiContract] = useState(undefined)
    const [wethAmount, setWethAmount] = useState(undefined)
    const [daiAmount, setDaiAmount] = useState(undefined)


    useEffect(() => {
      const init = async () => {
        if (typeof window.ethereum !== "undefined") {
          console.log("**@ useeffect 1 ")
          setHasMetamask(true);
        }
        console.log("**@ useeffect 2 ")


        // const provider = await new ethers.providers.Web3Provider(window.ethereum)
        // setProvider(provider)
  
        const wethContract = getWethContract()
        setWethContract(wethContract)
  
        const daiContract = getDaiContract()
        setDaiContract(daiContract)
      }
      init()
    }, [])

    async function connect() {
      console.log("**@ connect function called")
      if (typeof window.ethereum !== "undefined") {
        try {
          await ethereum.request({ method: "eth_requestAccounts" });
          const provider =await  new ethers.providers.Web3Provider(window.ethereum);
          const signer =await  provider.getSigner();
          console.log("**@ connect signer is , ",signer);
    
         const address = await signer.getAddress()
         console.log("**@ connect signer address  is , ",address);
         setSigner(signer)

         setSignerAddress(address)
         setIsConnected(true);


            // todo: connect weth and dai contracts
           await  wethContract.balanceOf(address)
              .then(res => {
                setWethAmount( Number(ethers.utils.formatEther(res)) )
              })
    
           await  daiContract.balanceOf(address)
              .then(res => {
                setDaiAmount( Number(ethers.utils.formatEther(res)) )
              })
        } catch (e) {
          console.log("**@ connection error , ",e);
        }
      } else {
        setIsConnected(false);
      }
    }
  
    const getSigner = async provider => {
      console.log("**@ getSigner called with provider , ",provider);
      provider.send("eth_requestAccounts", []);
      const signer =await  provider.getSigner();
      setSigner(signer)

      signer.getAddress()
      .then(address => {  
        // todo: connect weth and dai contracts
        wethContract.balanceOf(address)
          .then(res => {
            setWethAmount( Number(ethers.utils.formatEther(res)) )
          })

        daiContract.balanceOf(address)
          .then(res => {
            setDaiAmount( Number(ethers.utils.formatEther(res)) )
          })

      })
    }
    // const isConnected = () => signer !== undefined


    const getWalletAddress = () => {
      signer.getAddress()
        .then(address => {  
          // todo: connect weth and dai contracts
          wethContract.balanceOf(address)
            .then(res => {
              setWethAmount( Number(ethers.utils.formatEther(res)) )
            })

          daiContract.balanceOf(address)
            .then(res => {
              setDaiAmount( Number(ethers.utils.formatEther(res)) )
            })
  
        })
    }
  
    if (signer !== undefined) {
      // getWalletAddress()
    }

  
    const getSwapPrice = (inputAmount,signerAddress) => {
      setLoading(true)
      setInputAmount(inputAmount);

      getWalletAddress();

      console.log("**@ about to call swap price , signerAddress is , ",signerAddress)
  
      const swap = getPrice(
        inputAmount,
        slippageAmount,
        Math.floor(Date.now()/1000 + (deadlineMinutes * 60)),
        signerAddress
      ).then(data => {
        setTransaction(data[0])
        setOutputAmount(data[1])
        setRatio(data[2])
        setLoading(false)
      })
    }

    return (
        <div className="App">
          <div className="appNav">
            <div className="my-2 buttonContainer buttonContainerTop">
              <PageButton name={"Swap"} isBold={true} />
              <PageButton name={"Pool"} />
              <PageButton name={"Vote"} />
              <PageButton name={"Charts"} />
            </div>
    
            <div className="rightNav">
              <div className="connectButtonContainer">
                <ConnectButton
                  provider={provider}
                  isConnected={isConnected}
                  signerAddress={signerAddress}
                  connect={connect}
                />
              </div>
              <div className="my-2 buttonContainer">
                <PageButton name={"..."} isBold={true} />
              </div>
            </div>
          </div>

          <div className="appBody">
          <div className="swapContainer">
              <div className="swapHeader">
                <span className="swapText">Swap</span>
                <span className="gearContainer" onClick={() => setShowModal(true)}>
                  <GearFill />
                </span>
                {showModal && (
                  <ConfigModal
                    onClose={() => setShowModal(false)}
                    setDeadlineMinutes={setDeadlineMinutes}
                    deadlineMinutes={deadlineMinutes}
                    setSlippageAmount={setSlippageAmount}
                    slippageAmount={slippageAmount} />
                )}
              </div>
    
               
              <div className="swapBody">
                <CurrencyField
                  field="input"
                  tokenName="WETH"
                  getSwapPrice={getSwapPrice}
                  signer={signer}
                  balance={wethAmount}
                  signerAddress={signerAddress} />
                <CurrencyField
                  field="output"
                  tokenName="DAI"
                  value={outputAmount}
                  signer={signer}
                  balance={daiAmount}
                  Spinner={BeatLoader}
                  loading={loading} />
              </div>
    
              <div className="ratioContainer">
                {ratio && (
                  <>
                    {`1 DAI = ${ratio} WETH`}
                  </>
                )}
              </div>
    
              <div className="swapButtonContainer">
                {isConnected ? (
                  <div
                    onClick={() => runSwap(transaction, signer)}
                    className="swapButton"
                  >
                    Swap
                  </div>
                ) : (
                  <div
                    onClick={() => getSigner(provider)}
                    className="swapButton"
                  >
                    Connect Wallet
                  </div>
                )}
              </div>
    

    
            </div>
          </div>
    
        </div>
      );

 
}

export default Main