import React from 'react';
import PageButton from './PageButton'


function ConnectButton({ isConnected, signerAddress, provider,connect }) {
    const displayAddress = `${signerAddress?.substring(0,10)}...`;
    console.log("**@ connect button signer address is , ",signerAddress);
    console.log("**@ connect button signer displayAddress is , ",displayAddress);
    console.log("**@ connect button isConnected is , ",isConnected)

    return (
      <>
        {isConnected ? (
          <div className="buttonContainer">
            <PageButton name={displayAddress} />
          </div>
        ) : (
          <div
            className="btn my-2 connectButton"
            onClick={() => connect()}
          >
            Connect Wallet
          </div>
        )}
      </>
    )
}

export default ConnectButton