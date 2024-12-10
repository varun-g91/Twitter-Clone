import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";
import ImageEditor from "../../components/common/image_editor/ImageEditor";

const CreatePost = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();

    const {
        mutate: createPost,
        isPending,  
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ text, image }) => {
            try {
                const formData = new FormData();
                formData.append("text", text);
                if (image) formData.append("image", image);
                const response = await axios.post(
                    "/api/posts/create",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(
                        response.data.error || "Something went wrong"
                    );
                }
                return response.data;
            } catch (err) {
                throw new Error(
                    err.response?.data?.error || "Something went wrong"
                );
            }
        },

        onSuccess: () => {
            setText("");
            setImage(null);
            setPreviewImage(null);
            toast.success("Post created successfully");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },

        onError: (err) => {
            console.error(err);
            toast.error(err.message);
        },
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(file);
                setPreviewImage(reader.result); // Set preview image for cropping
                setIsEditing(true); // Open ImageEditor
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApplyCrop = (croppedImageData) => {
        setPreviewImage(croppedImageData); // Update preview with cropped image
        setIsEditing(false); // Close ImageEditor
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewImage(null);
        setIsEditing(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear file input value
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text && !image) {
            return toast.error("Please enter some text or upload an image");
        }

        const processedImage = previewImage || image; // Use cropped image if available
        createPost({ text, image: processedImage });
    };

    return (
        <div className="flex p-4 items-start gap-4 border-b border-gray-700">
            <div className="avatar">
                <div className="w-8 rounded-full">
                    <img
                        src={
                            authUser?.profileImage || "/avatar-placeholder.png"
                        }
                        alt="Profile"
                    />
                </div>
            </div>
            {isEditing ? (
                <ImageEditor
                    imageSrc={previewImage}
                    onApply={(croppedImageData) =>
                        handleApplyCrop(croppedImageData)
                    }
                />
            ) : (
                <form
                    className="flex flex-col gap-2 w-full"
                    onSubmit={handleSubmit}
                >
                    <textarea
                        className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
                        placeholder="What is happening?!"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    {previewImage && (
                        <div className="relative w-72 mx-auto">
                            <IoCloseSharp
                                className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                                onClick={handleRemoveImage}
                            />
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-72 object-contain rounded"
                            />
                        </div>
                    )}

                    <div className="flex justify-between border-t py-2 border-t-gray-700">
                        <div className="flex gap-1 items-center">
                            <CiImageOn
                                className="fill-primary w-6 h-6 cursor-pointer"
                                onClick={() => fileInputRef.current.click()}
                            />
                            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            className="btn btn-primary rounded-full btn-sm text-white px-4"
                            disabled={isPending}
                        >
                            {isPending ? "Posting..." : "Post"}
                        </button>
                    </div>
                    {isError && (
                        <div className="text-red-500">{error.message}</div>
                    )}
                </form>
            )}
        </div>
    );
};

export default CreatePost;
