/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { changeCommunityProfilePicture } from '../helpers/editSubredditFunctions'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

function AdminTools (props) {
  const [imageURL, setImageURL] = useState('')
  const storage = getStorage()
  async function uploadImage (fileSelected) {
    const storageRef = ref(storage, `images/${fileSelected?.name}`)
    uploadBytes(storageRef, fileSelected).then((snapshot) => {
      getDownloadURL(ref(storage, `images/${fileSelected?.name}`))
        .then((url) => {
          setImageURL(url)
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }
  return (
    <div className='flex flex-col px-4 py-4 bg-white dark:bg-neutral-900 relative border border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 className='text-xs dark:text-white font-semibold'>ADMIN TOOLS</h2>
                        <input type="file" accept="image/png, image/jpeg" className='w-20 absolute top-10 opacity-50'
                         onChange={(file) => {
                           uploadImage(file.target.files[0])
                         } }></input>
                         <button onClick={ () => changeCommunityProfilePicture(props.subredditMetaData, imageURL)}>SUBMIT</button>
                        <button className='text-xs w-fit'>Delete Community</button>
                    </div>
  )
}

export default AdminTools
