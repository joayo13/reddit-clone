import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

export async function uploadImage (fileSelected, setImageURL) {
  const storage = getStorage()
  const storageRef = ref(storage, `images/${fileSelected?.name}`)
  uploadBytes(storageRef, fileSelected).then((snapshot) => {
    console.log('Uploaded a blob or file!')
    console.log(snapshot)
    getDownloadedImageURL(fileSelected, setImageURL).then(() => {
      console.log(fileSelected)
    })
  })
}
export async function getDownloadedImageURL (fileSelected, setImageURL) {
  const storage = getStorage()
  getDownloadURL(ref(storage, `images/${fileSelected?.name}`))
    .then((url) => {
      setImageURL(url)
    })
    .catch((error) => {
      console.log(error)
    })
}
