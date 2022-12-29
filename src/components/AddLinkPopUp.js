/* eslint-disable react/prop-types */
import React from 'react'

function AddLinkPopUp (props) {
  return (
    <div className='absolute z-20 -top-20 py-2 px-2 w-72 left-16 border border-black bg-white shadow-md'>
        <form className=''>
            <div className='flex gap-2 items-center py-2'>
            <label className='text-xs'>Text:</label>
            <input placeholder={'Title of Link (optional)'} className='text-xs w-full'></input>
            </div>
            <div className='flex gap-2 items-center py-2'>
            <label className='text-xs'>Link:</label>
            <input placeholder='Paste or type a link' className='w-full text-xs'></input>
            </div>
            <button className='bg-blue-500 px-4 font-bold rounded-full block text-white ml-auto'>Insert</button>
        </form>
    </div>
  )
}

export default AddLinkPopUp
