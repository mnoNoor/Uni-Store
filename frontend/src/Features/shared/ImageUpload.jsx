import { useRef } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function ImageUpload({ image, setImage }) {
  const inputRef = useRef();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const removeImage = () => {
    setImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        Book Image <span className="text-red-600 text-lg">*</span>
      </label>

      <div className="border-2 border-dashed rounded-lg p-4 hover:border-green-500 transition">
        {image?.preview ? (
          <div className="relative">
            <img
              src={image.preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Click to upload or drag & drop
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full mt-3 cursor-pointer"
        />
      </div>
    </div>
  );
}
