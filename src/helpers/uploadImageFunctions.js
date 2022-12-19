import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

const storage = getStorage()

export async function uploadImage (fileSelected, setImageURL, setImageLoading) {
  setImageLoading(true)
  const storageRef = ref(storage, `images/${fileSelected?.name}`)
  uploadBytes(storageRef, fileSelected).then((snapshot) => {
    getDownloadedImageURL(fileSelected, setImageURL).then(() => {
      setImageLoading(false)
    })
  })
}
export async function getDownloadedImageURL (fileSelected, setImageURL) {
  getDownloadURL(ref(storage, `images/${fileSelected?.name}`))
    .then((url) => {
      setImageURL(url)
    })
    .catch((error) => {
      console.log(error)
    })
}

export async function deleteImage (fileSelected, setImageURL) {
  const storageRef = ref(storage, `images/${fileSelected?.name}`)
  deleteObject(storageRef).then(() => {
    setImageURL('')
  }).catch((e) => {
    console.log(e)
  })
}
