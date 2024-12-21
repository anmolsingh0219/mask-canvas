import PropTypes from "prop-types";
import { uploadImage } from "../services/api";

const ImageUpload = ({ onImageUpload }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      try {
        const result = await uploadImage(file);
        onImageUpload({
          id: result.id,
          url: result.url
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      }
    } else {
      alert("Please upload a valid JPEG or PNG file.");
    }
  };

  return (
    <div className="flex gap-6 items-start">
      <div className="w-[800px] h-[500px] bg-black rounded-3xl border-2 border-[#1a1a27] flex flex-col items-center justify-center relative">
        <div 
          onClick={() => document.getElementById("fileInput").click()}
          className="cursor-pointer flex flex-col items-center"
        >
          <p className="text-white font-poppins mb-4">
            Drag and Drop an image here or select a file
          </p>
          <button className="px-6 py-2 rounded-full border border-gray-300 bg-[#2a2a37] text-white font-poppins hover:bg-[#3a3a47]">
            Click here to Upload
          </button>
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="w-[300px] h-[500px] bg-[#1a1a27] rounded-3xl border-2 border-[#2a2a37]"></div>
    </div>
  );
};

ImageUpload.propTypes = {
  onImageUpload: PropTypes.func.isRequired
};

export default ImageUpload;