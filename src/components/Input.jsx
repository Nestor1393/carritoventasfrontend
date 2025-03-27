import React from 'react'

const Input = ({type, icon, placeholder, name, id, value, className, required, isFocused, handleChangeInput, readOnly}) => {


  return (
    <div className='input-group mb-3'>
        {/*<span className='input-group-text'>
            <i className={'fa-solid '+icon}></i>
        </span> */}
        <input type={type} placeholder={placeholder} name={name}
        id={id} value={value} className={className} required={required} 
        onChange={(e) => handleChangeInput(e)} readOnly={readOnly? true : false} 
        min={type==="number"? "0": undefined} />
      
    </div>
  )
}

export default Input
