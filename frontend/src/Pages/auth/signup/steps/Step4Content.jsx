    import { useContext, useRef, useState } from "react";
    import { TbCameraStar } from "react-icons/tb";
    import { FaUser } from "react-icons/fa6";
    import { IoMdClose } from "react-icons/io";
    import ImageEditor from "../../../../components/common/image_editor/ImageEditor";
    import { SignupContext } from "../SignupContext";
    import { useMutation } from "@tanstack/react-query";
    import axios from "axios";
    import toast from "react-hot-toast";

    const Step4Content = () => {
        const { identifier, setErrorMessage, setStep, setIsLoading, errorMessage } =
            useContext(SignupContext);

        const [image, setImage] = useState(null);
        const [previewImage, setPreviewImage] = useState(null);
        const [isEditing, setIsEditing] = useState(false);
        const fileInputRef = useRef(null);

        // React Query mutation for uploading the profile image
        const { mutate: uploadProfileImage} = useMutation({
            mutationFn: async (formData) => {
                const response = await axios.post(
                    `/api/users/profile/${identifier}/set-profile-image`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (!response.data) {
                    throw new Error(
                        response?.data?.message ||
                            "Failed to upload profile image"
                    );
                }
                return response.data;
            },
            
                onSuccess: () => {
                    console.log("Profile image uploaded successfully");
                    setErrorMessage("");
                    toast.success("Profile image uploaded successfully");
                    setStep(5); // Move to the next step
                },
                onError: (error) => {
                    setErrorMessage(
                        error.response?.data?.message ||
                            "An error occurred while uploading the profile image."
                    );
                    toast.error(errorMessage);
                },
                onSettled: () => {
                    setIsLoading(false); // Stop loading after request completion
                },
            
    });


        const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(file);
                    setPreviewImage(reader.result); // Set the preview for editing
                    setIsEditing(true); // Open ImageEditor
                };
                reader.readAsDataURL(file);
            }
        };

        const handleRemoveImage = () => {
            setImage(null);
            setPreviewImage(null);
            setIsEditing(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the input value
            }
        };

        const handleApplyCrop = (croppedImageData) => {
            setPreviewImage(croppedImageData); // Set cropped image as preview
            setIsEditing(false); // Close ImageEditor
        };

        const handleSubmit = (e) => {
            e.preventDefault();

            if (!image) {
                console.error("No image selected");
                return;
            }

            setIsLoading(true);

            const formData = new FormData();
            formData.append("profileImage", image);
            formData.append("identifier", identifier);

            uploadProfileImage(formData);
        };

        return (
            <>
                {isEditing ? (
                    <ImageEditor
                        imageSrc={previewImage}
                        onApply={(croppedImageData) => {
                            handleApplyCrop(croppedImageData);
                        }}
                    />
                ) : (
                    <>
                        <p className="text-[#71767B] font-custom2 font-thin leading-5 text-[0.938rem] mb-3 relative bottom-3">
                            Have a favorite selfie? Upload it now.
                        </p>

                        <div className="flex flex-col items-center justify-center">
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
                                                onClick={() => setIsEditing(true)} // Open ImageEditor
                                            />
                                        </div>
                                    </div>
                                ) : null}
                                <label
                                    htmlFor="profile-pic"
                                    className="cursor-pointer"
                                >
                                    <div className="flex flex-col items-stretch bottom-4 overflow-hidden justify-center w-full h-full bg-[#8E959A] rounded-full relative">
                                        <div className="absolute inset-0 border-[3.5px] border-black rounded-full z-20"></div>
                                        <div className="absolute inset-0 border-[2px] border-white rounded-full z-20"></div>
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
                                                <FaUser className="text-[#47535E]" />
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
                                        className="hidden"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                    />
                                </label>
                            </div>
                        </div>

                        <span className="text-red-500 text-xs mt-0 mb-0">
                            {errorMessage || "\u00A0"}
                        </span>

                        <div className="flex items-stretch flex-col justify-center mt-16">
                            <button
                                className={`h-[3.25rem] rounded-full ${
                                    image
                                        ? "bg-[#D7DBDC] text-[#0f1419]"
                                        : "bg-[#787a7a] text-[#5b5e5e]"
                                }`}
                                type="submit"
                                onClick={image ? handleSubmit : undefined}
                            >
                                <span className="font-bold text-[1.063rem]">
                                    {image ? "Next" : "Skip for now"}
                                </span>
                            </button>
                        </div>
                    </>
                )}
            </>
        );
    };

    export default Step4Content;
