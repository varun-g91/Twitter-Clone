import React, { useRef, useState } from "react";
import Cropper from "react-cropper"; // Using Cropper.js for image cropping
import "cropperjs/dist/cropper.css";
import "./custom.css";
import { set } from "mongoose";

const ImageEditor = ({ imageSrc, onApply }) => {
    const cropperRef = useRef(null);
    const [cropData, setCropData] = useState("");
    const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
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
        setCropData("");
        setIsImagePreviewVisible(false);
    };

    const applyChanges = () => {
        // Call the onApply function passed as a prop with the cropped image data
        if (onApply) {
            onApply(cropData);
        }
        
    };

    return (
        <>
            <div className="image-editor-container">
                {!isImagePreviewVisible && (
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
                )}

                {cropData && (
                    <div className="cropped-image-preview backdrop-blur-lg h-[5rem]">
                        <div className="shadow-black">
                            <img src={cropData} alt="Cropped" />
                        </div>
                    </div>
                )}
                <div className="crop-buttons">
                    <button onClick={onCrop}>Crop</button>
                    <button onClick={resetEditor}>Reset</button>
                    <button disabled={!cropData} onClick={applyChanges} className={`${!cropData ? "" : "crop-buttons"}`}>
                        Apply Changes
                    </button>
                </div>
            </div>
        </>
    );
};

export default ImageEditor;
    