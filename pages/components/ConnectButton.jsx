import React from 'react';
import PageButton from './PageButton'


function ConnectButton({ isConnected, signerAddress, getSigner, provider }) {
    const displayAddress = `${signerAddress?.substring(0,10)}...`
  
    return (
      <>
        {isConnected() ? (
          <div className="buttonContainer">
            <PageButton name={displayAddress} />
          </div>
        ) : (
          <div
            className="btn my-2 connectButton"
            onClick={() => getSigner(provider)}
          >
            Connect Wallet
          </div>
        )}
      </>
    )
}

export default ConnectButton