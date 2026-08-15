import { useEffect, useState } from 'react'

const MAX_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

export default function PhotoUpload({ file, onFileChange }) {
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!file) {
      setPreview('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleChange = (event) => {
    const selected = event.target.files?.[0]
    setError('')
    if (!selected) {
      onFileChange(null)
      return
    }
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('Only jpg, jpeg, or png images are allowed')
      onFileChange(null)
      event.target.value = ''
      return
    }
    if (selected.size > MAX_SIZE) {
      setError('Image must be 2MB or smaller')
      onFileChange(null)
      event.target.value = ''
      return
    }
    onFileChange(selected)
  }

  return (
    <div className="photo-upload">
      {preview ? (
        <img className="photo-preview" src={preview} alt="Preview" />
      ) : (
        <span className="photo-preview photo-placeholder" />
      )}
      <input
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        onChange={handleChange}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
