import React from 'react'

function PageButton({name,isBold}) {
    return (
        <div className="btn">
          <span className={isBold ? "pageButtonBold hoverBold" : "hoverBold"}>
            {name}
          </span>
        </div>
      )
}

export default PageButton