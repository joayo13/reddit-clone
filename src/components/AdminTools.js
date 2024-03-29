/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { changeCommunityProfilePicture } from '../helpers/editSubredditFunctions'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

function AdminTools (props) {
  const storage = getStorage()
  const [fileInputFocused, setFileInputFocused] = useState(false)
  async function uploadImage (fileSelected) {
    const storageRef = ref(storage, `images/${fileSelected?.name}`)
    uploadBytes(storageRef, fileSelected).then((snapshot) => {
      getDownloadURL(ref(storage, `images/${fileSelected?.name}`))
        .then((url) => {
          props.setImageURL(url)
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }
  return (
    <div className='flex flex-col px-4 py-4 bg-white dark:bg-neutral-900 relative border border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 className='text-xs dark:text-white font-semibold'>ADMIN TOOLS</h2>
                        <div className='flex items-center gap-4'>
                        <label style={fileInputFocused ? { outlineWidth: '3px' } : { outlineWidth: '0px' }} className='w-fit text-xs cursor-pointer outline outline-blue-500' htmlFor='changePicture'>Change Icon</label>
                        <input type="file" tabIndex={0} name='changePicture' onFocus={() => setFileInputFocused(true)} onBlur={() => setFileInputFocused(false)} accept="image/png, image/jpeg" className='w-20 absolute top-12 opacity-0 cursor-pointer'
                         onChange={(file) => {
                           uploadImage(file.target.files[0])
                         } }></input>
                         <button className='w-fit text-xs dark:bg-neutral-800 dark:text-white border dark:border-neutral-700 px-2' onClick={ () => changeCommunityProfilePicture(props.subredditMetaData, props.imageURL, props.setChangesSaved)}>{props.changesSaved ? 'Saved' : 'Save Changes'}</button>
                         </div>
                        <button className='text-xs text-red-600 w-fit'>Delete Community</button>
                    </div>
  )
}

export default AdminTools
