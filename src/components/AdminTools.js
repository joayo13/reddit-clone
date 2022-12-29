import React from 'react'

function AdminTools () {
  return (
    <div className='flex flex-col px-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 className='text-xs dark:text-white font-semibold'>ADMIN TOOLS</h2>
                        <button className='text-xs w-fit'>Change Display Picture</button>
                        <button className='text-xs w-fit'>Delete Community</button>
                    </div>
  )
}

export default AdminTools
