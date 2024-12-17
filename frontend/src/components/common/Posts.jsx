import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";

const Posts = ({ feedType, userName, userId }) => {
    const getPostEndpoint = () => {
        switch (feedType) {
            case "forYou": 
                return "/api/posts/all";
            case "following":
                return "/api/posts/following";
            case "posts":
                return `/api/posts/user/${userName}`;
            case "likes":
                return `/api/posts/likes/${userId}`;
            default:
                return "/api/posts/all";
        }
    };

    const POST_ENDPOINT = getPostEndpoint();

    const {
        data: posts,
        isLoading,
        isRefetching,
    } = useQuery({
        queryKey: ["posts", feedType, userName, userId],
        queryFn: async () => {
            const response = await axios.get(POST_ENDPOINT);
            console.log("response:",response.data);  
            if (response.status !== 200) {
                throw new Error(
                    response?.data?.message || "Something went wrong"
                );
            }
            return response.data?.posts;
        },

        onError: (err) => {
            console.error("Error fetching posts:", err.message);
        },
    });


    return (
        <>
            {(isLoading || isRefetching) && (
                <div className="flex flex-col justify-center">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && !isRefetching && posts?.length === 0 && (
                <p className="text-center my-4">
                    No posts in this tab. Switch 👻
                </p>
            )}
            {!isLoading && !isRefetching && posts && (
                <div className="flex flex-col overflow-y-scroll h-[70vh] scrollbar-daisy ">
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;
