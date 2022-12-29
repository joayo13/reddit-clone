/* eslint-disable react/prop-types */
import React from 'react'

function AddLinkPopUp (props) {
  return (
    <div className='absolute z-20 -top-20 py-2 px-2 w-72 left-16 border bg-white dark:bg-neutral-800 rounded-md dark:border-neutral-700 shadow-md'>
        <form onSubmit={(e) => { e.preventDefault(); props.setLink({ title: e.target.elements.title.value, link: e.target.elements.link.value }) }} className=''>
            <div className='flex gap-2 items-center py-2'>
            <label className='text-xs'>Text:</label>
            <input placeholder={'Title of Link (optional)'} name='title' className='text-xs bg-inherit border border-opacity-50 w-full py-1 px-1 rounded-sm'></input>
            </div>
            <div className='flex gap-2 items-center py-2'>
            <label className='text-xs'>Link:</label>
            <input placeholder='Paste or type a link' name='link' className='text-xs bg-inherit w-full border border-opacity-50 py-1 px-1 rounded-sm'></input>
            </div>
            <button type='submit' className='bg-blue-500 px-4 font-bold rounded-full block text-white ml-auto'>Insert</button>
        </form>
    </div>
  )
}

export default AddLinkPopUp
