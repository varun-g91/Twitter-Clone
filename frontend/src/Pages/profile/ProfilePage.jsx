        import { useEffect, useRef, useState } from "react";
        import { Link, useParams } from "react-router-dom";

        import Posts from "../../components/common/Posts";
        import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
        import EditProfileModal from "./EditProfileModal";

        import { POSTS } from "../../utils/db/dummy";

        import { FaArrowLeft } from "react-icons/fa6";
        import { IoCalendarOutline } from "react-icons/io5";
        import { FaLink } from "react-icons/fa";
        import { MdEdit } from "react-icons/md";
        import { useQuery } from "@tanstack/react-query";
        import { formatMemberSinceDate } from "../../utils/date";

        import useFollow from "../../hooks/useFollow";
        import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
        import axios from "axios";
        import Sidebar from "../../components/common/Sidebar";

        const ProfilePage = () => { 
            const { data: authUser } = useQuery({
                queryKey: ["authUser"],
            })

            const [coverImage, setCoverImage] = useState(null);
            const [profileImage, setProfileImage] = useState(null);
            const [feedType, setFeedType] = useState("user");

            const coverImageRef = useRef(null);
            const profileImageRef = useRef(null);

            const { userName } = useParams();

            const { follow, isPending } = useFollow();

            const {
                data: user,
                isLoading,
                refetch,
                isRefetching,
            } = useQuery({
                queryKey: ["userProfile"],
                queryFn: async () => {
                    try {
                        console.log("userName:", userName);
                        const response = await axios.get(`/api/users/profile/${userName}`);

                        console.log("user: ", response.data);
                        console.log("user id:", response.data?._id, "auth user id:", authUser?._id);

                        if (response.status !== 200) {
                            throw new Error(response.data.error || "Something went wrong");
                        }
                        return response.data;
                    } catch (error) {
                        throw new Error(error);
                    }
                },
            });

            const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

            const isMyProfile = authUser._id === user?._id;
            const memberSinceDate = formatMemberSinceDate(user?.createdAt);
            const amIFollowing = authUser?.following.includes(user?._id);

            const handleImageChange = (e, state) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        state === "coverImg" && setCoverImage(reader.result);
                        state === "profileImage" && setProfileImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                }
            };

            useEffect(() => {
                refetch();
            }, [userName, refetch]);

            return (
                <>
                    <div className="flex min-h-screen overflow-y-auto">
                        <div className="flex-[1] sticky top-0 h-screen hidden lg:block">
                            {authUser && <Sidebar />}
                        </div>
                        <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
                            {/* HEADER */}
                            {(isLoading || isRefetching) && (
                                <ProfileHeaderSkeleton />
                            )}
                            {!isLoading && !isRefetching && !user && (
                                <p className="text-center text-lg mt-4">
                                    User not found
                                </p>
                            )}
                            <div className="flex flex-col">
                                {!isLoading && !isRefetching && user && (
                                    <>
                                        <div className="flex gap-10 px-4 py-2 items-center">
                                            <Link to="/">
                                                <FaArrowLeft className="w-4 h-4" />
                                            </Link>
                                            <div className="flex flex-col">
                                                <p className="font-bold text-lg">
                                                    {user?.fullName}
                                                </p>
                                                <span className="text-sm text-slate-500">
                                                    {POSTS?.length} posts
                                                </span>
                                            </div>
                                        </div>
                                        {/* COVER IMG */}
                                        <div className="relative group/cover">
                                            <img
                                                src={
                                                    coverImage ||
                                                    user?.coverImage ||
                                                    "frontend/public/avatars/cover-placeholder.jpg"
                                                }
                                                className="h-52 w-full object-cover"
                                                alt="cover image"
                                            />
                                            {isMyProfile && (
                                                <div
                                                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                                                    onClick={() =>
                                                        coverImageRef.current.click()
                                                    }
                                                >
                                                    <MdEdit className="w-5 h-5 text-white" />
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                ref={coverImageRef}
                                                onChange={(e) =>
                                                    handleImageChange(
                                                        e,
                                                        "coverImage"
                                                    )
                                                }
                                            />
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                ref={profileImageRef}
                                                onChange={(e) =>
                                                    handleImageChange(
                                                        e,
                                                        "profileImage"
                                                    )
                                                }
                                            />
                                            {/* USER AVATAR */}
                                            <div className="avatar absolute -bottom-16 left-4">
                                                <div className="w-32 rounded-full relative group/avatar">
                                                    <img
                                                        src={
                                                            profileImage ||
                                                            user?.profileImage ||
                                                            "/avatar-placeholder.png"
                                                        }
                                                    />
                                                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                                                        {isMyProfile && (
                                                            <MdEdit
                                                                className="w-4 h-4 text-white"
                                                                onClick={() =>
                                                                    profileImageRef.current.click()
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end px-4 mt-5">
                                            {isMyProfile && (
                                                <EditProfileModal
                                                    authUser={authUser}
                                                />
                                            )}
                                            {!isMyProfile && (
                                                <button
                                                    className="btn btn-outline rounded-full btn-sm"
                                                    onClick={() =>
                                                        follow(user?._id)
                                                    }
                                                >
                                                    {isPending && "Loading..."}
                                                    {!isPending &&
                                                        amIFollowing &&
                                                        "Unfollow"}
                                                    {!isPending &&
                                                        !amIFollowing &&
                                                        "Follow"}
                                                </button>
                                            )}
                                            {(coverImage || profileImage) && (
                                                <button
                                                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                                                    onClick={async () => {
                                                        await updateProfile({
                                                            coverImage,
                                                            profileImage,
                                                        });
                                                        setProfileImage(null);
                                                        setCoverImage(null);
                                                    }}
                                                >
                                                    {isUpdatingProfile
                                                        ? "Updating..."
                                                        : "Update"}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-4 mt-14 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg">
                                                    {user?.fullName}
                                                </span>
                                                <span className="text-sm text-slate-500">
                                                    @{user?.userName}
                                                </span>
                                                <span className="text-sm my-1">
                                                    {user?.bio}
                                                </span>
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                {user?.link && (
                                                    <div className="flex gap-1 items-center ">
                                                        <>
                                                            <FaLink className="w-3 h-3 text-slate-500" />
                                                            <a
                                                                href="https://youtube.com/@asaprogrammer_"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-sm text-blue-500 hover:underline"
                                                            >
                                                                {/* Updated this after recording the video. I forgot to update this while recording, sorry, thx. */}
                                                                {user?.link}
                                                            </a>
                                                        </>
                                                    </div>
                                                )}
                                                <div className="flex gap-2 items-center">
                                                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                                                    <span className="text-sm text-slate-500">
                                                        {memberSinceDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex gap-1 items-center">
                                                    <span className="font-bold text-xs">
                                                        {user?.following.length}
                                                    </span>
                                                    <span className="text-slate-500 text-xs">
                                                        Following
                                                    </span>
                                                </div>
                                                <div className="flex gap-1 items-center">
                                                    <span className="font-bold text-xs">
                                                        {user?.followers.length}
                                                    </span>
                                                    <span className="text-slate-500 text-xs">
                                                        Followers
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full border-b border-gray-700 mt-4">
                                            <div
                                                className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                                                onClick={() => setFeedType("posts")}
                                            >
                                                Posts
                                                {feedType === "user" && (
                                                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <div
                                                className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                                                onClick={() => setFeedType("likes")}
                                            >
                                                Likes
                                                {feedType === "likes" && (
                                                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex-1 overflow-y-auto">
                                    <Posts
                                        feedType={feedType}
                                        username={userName}
                                        userId={user?._id}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        };
        export default ProfilePage; 