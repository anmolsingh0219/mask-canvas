import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import DrawingCanvas from "../components/DrawingCanvas";
import imagepipelineLogo from "../assets/imagepipeline_logo.webp";

const Homepage = () => {
  const [image, setImage] = useState(null);

  const handleChangeImage = () => {
    setImage(null);
  };


  return (
    <div className="min-h-screen bg-[#1a1a27] p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white font-poppins">
          Mask Drawing App
        </h1>
        <img 
          src={imagepipelineLogo} 
          alt="Image Pipeline Logo" 
          className="h-12 object-contain"
        />
      </div>

      {!image && (
        <p className="text-center text-blue-400 mb-4 font-poppins">
          Drag and Drop an image here or select a file
        </p>
      )}
      
      <div className="flex justify-center">
        {!image ? (
          <ImageUpload onImageUpload={setImage} />
        ) : (
          <DrawingCanvas 
            image={image} 
            onChangeImage={handleChangeImage}
            onMaskGenerated={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default Homepage;