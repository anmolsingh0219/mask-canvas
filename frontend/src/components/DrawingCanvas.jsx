// DrawingCanvas.jsx
import { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import PropTypes from "prop-types";
import { Pencil, Trash2, Download, ImagePlus } from "lucide-react";
import { uploadMask } from '../services/api';

const DrawingCanvas = ({ image, onChangeImage }) => {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#FFFFFF");
  const [currentMask, setCurrentMask] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isOverCanvas, setIsOverCanvas] = useState(false);


  const colors = [
    { color: "#FFFFFF", name: "White" },
    { color: "#000000", name: "Black" },
    { color: "#FF0000", name: "Red" },
    { color: "#00FF00", name: "Green" },
    { color: "#0000FF", name: "Blue" },
    { color: "#FFFF00", name: "Yellow" },
  ];

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const boundingRect = container.getBoundingClientRect();
      // Calculate position relative to canvas container
      setCursorPosition({
        x: e.clientX - boundingRect.left, // Adjust x position relative to container
        y: e.clientY - boundingRect.top   // Adjust y position relative to container
      });
    };

    const handleMouseEnter = () => setIsOverCanvas(true);
    const handleMouseLeave = () => setIsOverCanvas(false);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleStrokeEnd = async () => {
    try {
      const dataUrl = await canvasRef.current.exportImage("png");
      setCurrentMask(dataUrl);
    } catch (error) {
      console.error('Error updating mask preview:', error);
    }
  };

  const handleStroke = async () => {
    try {
      const dataUrl = await canvasRef.current.exportImage("png");
      setCurrentMask(dataUrl);
    } catch (error) {
      console.error('Error updating mask preview:', error);
    }
  };



  const exportMask = async () => {
    try {
      const dataUrl = await canvasRef.current.exportImage("png");
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const result = await uploadMask(image.id, blob);
      console.log('Mask uploaded:', result);

      const now = new Date();
      const dateString = now.toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .slice(0, 19);

      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `mask_${dateString}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      alert('Mask exported and downloaded successfully!');
    } catch (error) {
      console.error('Error handling mask:', error);
      alert('Failed to export mask');
    }
  };

  const clearCanvas = () => {
    canvasRef.current.clearCanvas();
    setCurrentMask(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6 items-start">
        {/* Canvas Area */}
        <div
          ref={canvasContainerRef}
          className="w-[800px] h-[500px] bg-black rounded-3xl border-2 border-[#1a1a27] relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10">
            <img
              src={image.url}
              alt="Uploaded"
              className="w-full h-full object-contain"
            />
          </div>
          <ReactSketchCanvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            strokeColor={brushColor}
            strokeWidth={brushSize}
            canvasColor="transparent"
            onStrokeEnd={handleStrokeEnd}
            onChange={handleStroke}
          />
          {isOverCanvas && (
            <div
              className="pointer-events-none absolute transform -translate-x-1/2 -translate-y-1/2 z-50 mix-blend-difference"
              style={{
                width: `${brushSize}px`,
                height: `${brushSize}px`,
                backgroundColor: brushColor,
                opacity: 0.5,
                borderRadius: '50%',
                border: '2px solid white',
                left: `${cursorPosition.x}px`,
                top: `${cursorPosition.y}px`
              }}
            />
          )}
        </div>

        {/* Controls Panel */}
        <div className="w-[300px] h-[500px] bg-[#1a1a27] rounded-3xl border-2 border-[#2a2a37] p-6 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Pencil className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white font-poppins">
                Brush Size
              </h3>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full accent-blue-400"
            />
            <p className="text-sm text-white font-poppins mt-2">
              Size: {brushSize}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white font-poppins mb-4">
              Brush Color
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((c) => (
                <button
                  key={c.color}
                  onClick={() => setBrushColor(c.color)}
                  className={`w-full h-10 rounded-full ${brushColor === c.color
                    ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#1a1a27]'
                    : 'hover:scale-105'
                    } transition-all duration-200`}
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <button
              onClick={clearCanvas}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2a2a37] text-white rounded-full font-poppins hover:bg-[#3a3a47] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Canvas
            </button>
            <button
              onClick={exportMask}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2a2a37] text-white rounded-full font-poppins hover:bg-[#3a3a47] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Mask
            </button>
            <button
              onClick={onChangeImage}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2a2a37] text-white rounded-full font-poppins hover:bg-[#3a3a47] transition-colors"
            >
              <ImagePlus className="w-4 h-4" />
              Change Image
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 border-t-2 border-[#2a2a37] pt-8">
        <h2 className="text-2xl font-bold text-white font-poppins mb-6 text-center">
          Image Preview
        </h2>
        <div className="flex gap-6 justify-center">
          <div className="w-[400px] bg-black rounded-3xl border-2 border-[#1a1a27] overflow-hidden">
            <h3 className="text-white font-poppins text-center py-2 bg-[#2a2a37]">
              Original Image
            </h3>
            <div className="p-4">
              <img
                src={image.url}
                alt="Original"
                className="w-full h-[300px] object-contain"
              />
            </div>
          </div>

          <div className="w-[400px] bg-black rounded-3xl border-2 border-[#1a1a27] overflow-hidden">
            <h3 className="text-white font-poppins text-center py-2 bg-[#2a2a37]">
              Generated Mask
            </h3>
            <div className="p-4">
              {currentMask ? (
                <img
                  src={currentMask}
                  alt="Mask"
                  className="w-full h-[300px] object-contain"
                />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center text-white font-poppins">
                  Start drawing to see mask preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DrawingCanvas.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  onChangeImage: PropTypes.func.isRequired,
  onMaskGenerated: PropTypes.func.isRequired
};

export default DrawingCanvas;