import { useContext, useRef, useState } from "react";
import { TbCameraStar } from "react-icons/tb";
import { FaUser } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { SignupContext } from "../SignupContext";

const Step4Content = () => {
    const {
    identifier,
    setErrorMessage,
    setStep,
    setIsLoading,

    } = useContext(SignupContext);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const handleImageUpload = () => {
        // Programmatically trigger the file input
        if (fileInputRef.current) {
            fileInputRef.current.click(); // This will open the file chooser dialog
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file); // Store the actual file

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);

        const file = fileInputRef.current.files[0]; // Get the actual file from the input
        if (!file) {
            console.error("No file selected");
            return; // Ensure a file is selected before proceeding
        }

        const formData = new FormData();
        formData.append("profileImage", file); // Append the file
        formData.append("identifier", identifier);

        try {
            const response = await axios.post(
                `http://localhost:5005/api/users/profile/${identifier}/set-profile-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                console.log("Profile image uploaded successfully");
                setIsLoading(false);
                setStep(5);
            }
        } catch (error) {
            console.error("Profile image upload error:", error);
            setIsLoading(false);
            const errorMessage =
                error.response?.data?.message ||
                "An error occurred while uploading the profile image.";
            setErrorMessage(errorMessage);
        } finally {
            setIsLoading(false);    
        }
    };


    const handleRemoveImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the input value to allow re-upload
        }
    };

    return (
        <>
            <p className="text-[#71767B] font-custom2 font-thin leading-5 text-[0.938rem] mb-6 relative bottom-3">
                Have a favorite selfie? Upload it now.
            </p>
            <div className="flex flex-col items-center justify-center">
                {/* Profile Picture Upload */}
                <div className="relative w-[12rem] h-[12rem] my-16 items-center justify-center">
                    {image ? (
                        <div className="flex gap-4 relative">
                            <div className="absolute top-[4.3rem] right-16 z-30 bg-[#0F1419]/[.57] rounded-full p-1">
                                <IoMdClose
                                    className="text-[1.3rem] text-white cursor-pointer"
                                    onClick={handleRemoveImage}
                                />
                            </div>
                            <div className="absolute top-[4.3rem] right-24 z-30 bg-[#0F1419]/[.57] rounded-full p-1">
                                <TbCameraStar
                                    className="text-[1.3rem] leading-5 text-white cursor-pointer z-100"
                                    onClick={handleImageUpload}
                                />
                            </div>
                        </div>
                    ) : null}
                    <label htmlFor="profile-pic" className="cursor-pointer">
                        <div className="flex flex-col items-stretch bottom-4 overflow-hidden justify-center w-full h-full bg-[#8E959A] rounded-full relative">
                            <div className="absolute inset-0 border-[3.5px] border-black rounded-full z-20"></div>{" "}
                            {/* Inner black border */}
                            <div className="absolute inset-0 border-[2px] border-white rounded-full z-20"></div>{" "}
                            {/* Outer white border */}
                            {image ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={previewImage}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover relative z-10"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col text-[9rem] top-12 items-center cursor-pointer justify-center text-gray-300 relative z-10">
                                    <FaUser className="text-[#47535E] " />
                                    <div className="flex cursor-pointer justify-center items-center rounded-full min-h-[2.75rem] min-w-[2.75rem] z-20 relative bottom-[7.45rem] bg-[#0F1419]/[.57]">
                                        <TbCameraStar className="text-[1.3rem] leading-5 text-white cursor-pointer z-100" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            id="profile-pic"
                            type="file"
                            accept="image/*"
                            name="profileImage"
                            className="hidden "
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </label>
                </div>
            </div>

            <div className="flex items-stretch flex-col justify-center mt-20 ">
                <button
                    className={`h-[3.25rem] rounded-full ${
                        image
                            ? "bg-[#D7DBDC] text-[#0f1419]" // Active styles for other steps
                            : "bg-[#787a7a] text-[#5b5e5e]" // Disabled state
                    }`}
                    type="submit"
                    onClick={image ? handleSubmit : undefined} // Changed to allow submission only if an image is selected
                >
                    <span className="font-bold text-[1.063rem]">
                        {image ? "Next" : "Skip for now"}{" "}
                        {/* Updated conditional text */}
                    </span>
                </button>
            </div>
        </>
    );
};

export default Step4Content;
