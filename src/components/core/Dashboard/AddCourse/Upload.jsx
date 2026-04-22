
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || ""
  )

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]

    if (file) {
      setValue(name, file, { shouldValidate: true }) 
      previewFile(file)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  })

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  useEffect(() => {
    register(name, { required: true })
  }, [register, name])

  return (
    <div className="flex flex-col space-y-2 w-full max-w-full ">
      <label className="text-sm text-richblack-5">
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div
        {...getRootProps()}
        className="bg-richblack-700 flex min-h-[200px] w-full cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500 overflow-hidden"
      >
        <input {...getInputProps()} />

        {previewSource ? (
          <div className="w-full p-4">
            {!video ? (
              <img
                src={previewSource}
                alt="preview"
                className="w-full h-auto max-h-[300px] object-contain rounded-md"
              />
            ) : (
              <video src={previewSource} controls className="w-full" />
            )}

            <button
              type="button"
              onClick={() => {
                setPreviewSource("")
                setValue(name, null)
              }}
              className="mt-2 text-sm text-red-400 underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center p-6 text-center">
            <FiUploadCloud className="text-3xl text-yellow-50" />
            <p className="text-sm text-richblack-200 mt-2">
              Drag & drop or click to upload
            </p>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="text-xs text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}