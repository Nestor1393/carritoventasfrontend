import React from 'react'

const Card = ({children, col, texto, alineacion}) => {
  return (
    <div className={'col-'+col}>
        <div className='card'>
            <h5 className={`card-header bg-dark text-white ${alineacion}`}>{texto}</h5>
            <div className='card-body'>
                {children}
            </div>
        </div>
      
    </div>
  )
}

export default Card
