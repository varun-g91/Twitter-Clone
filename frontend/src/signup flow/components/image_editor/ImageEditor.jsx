import React, { useRef, useState } from "react";
import Cropper from "react-cropper"; // Using Cropper.js for image cropping
import "cropperjs/dist/cropper.css";
import "./custom.css";

const ImageEditor = ({ imageSrc, onApply }) => {
    const cropperRef = useRef(null);
    const [cropData, setCropData] = useState("");
    const [zoom, setZoom] = useState(1);

    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        setCropData(cropper.getCroppedCanvas().toDataURL()); // Get cropped image
    };

    const handleZoomChange = (e) => {
        const newZoom = parseFloat(e.target.value);
        setZoom(newZoom);
        cropperRef.current?.cropper.zoomTo(newZoom);
    };

    const resetEditor = () => {
        cropperRef.current?.cropper.reset(); // Reset image cropper
        setZoom(1); // Reset zoom
    };

    const applyChanges = () => {
        // Call the onApply function passed as a prop with the cropped image data
        if (onApply) {
            onApply(cropData);
        }
    };

    return (
        <div className="image-editor-container">
            <div className="image-editor-workspace">
                <Cropper
                    src={imageSrc}
                    style={{ height: 400, width: "100%" }}
                    // Cropper.js options
                    initialAspectRatio={1}
                    guides={false}
                    ref={cropperRef}
                    viewMode={1}
                    zoomOnWheel={true}
                    responsive={true}
                />
            </div>
            <div className="image-editor-controls">
                <div className="zoom-slider">
                    <label htmlFor="zoom">Zoom:</label>
                    <input
                        type="range"
                        id="zoom"
                        name="zoom"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={handleZoomChange}
                    />
                </div>
                <div className="crop-buttons">
                    <button onClick={onCrop}>Crop</button>
                    <button onClick={resetEditor}>Reset</button>
                    <button onClick={applyChanges}>Apply Changes</button>
                </div>
                {cropData && (
                    <div className="cropped-image-preview">
                        <h4>Cropped Image Preview:</h4>
                        <img src={cropData} alt="Cropped" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageEditor;
    