import React from 'react'

function CurrencyField({getSwapPrice,loading,value,tokenName,field,balance}) {
    const getPrice = (value) => {
        getSwapPrice(value)
      }
    
      return (
        <div className="row currencyInput">
          <div className="col-md-6 numberContainer">
            {loading ? (
              <div className="spinnerContainer">
                <props.spinner />
              </div>
            ) : (
              <input
                className="currencyInputField"
                placeholder="0.0"
                value={value}
                onBlur={e => (field === 'input' ? getPrice(e.target.value) : null)}
              />
            )}
          </div>
          <div className="col-md-6 tokenContainer">
            <span className="tokenName">{tokenName}</span>
            <div className="balanceContainer">
              <span className="balanceAmount">Balance: {balance?.toFixed(3)}</span>
            </div>
          </div>
        </div>
      )
}

export default CurrencyField