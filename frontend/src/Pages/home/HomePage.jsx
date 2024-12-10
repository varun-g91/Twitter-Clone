import { useState } from "react";
import Posts from "../../components/common/Posts";
import Sidebar from "../../components/common/Sidebar";
import RightPanel from "../../components/common/RightPanel";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "./CreatePost";
// import  CreatePost from "../../components/common/CreatePost";

const HomePage = () => {
const [feedType, setFeedType] = useState("forYou");

const {data: authUser} = useQuery({
    queryKey: ["authUser"],
})

return (
    <>
        <div className="flex max-w-6xl mx-auto">
            {authUser && <Sidebar />}

            <div className="flex-[4_4_0] mr-auto border-r border-gray-700 h-screen flex flex-col">
                {/* Header */}
                <div className="flex w-full border-b border-gray-700">
                    <div
                        className={
                            "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                        }
                        onClick={() => setFeedType("forYou")}
                    >
                        For you
                        {feedType === "forYou" && (
                            <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
                        )}
                    </div>
                    <div
                        className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                        onClick={() => setFeedType("following")}
                    >
                        Following
                        {feedType === "following" && (
                            <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
                        )}
                    </div>
                </div>

                {/* CREATE POST INPUT */}
                <CreatePost />

                {/* POSTS */}
                <div className="flex-1 overflow-y-auto">
                    <Posts
                        feedType={feedType}
                        username={authUser?.userName}
                        userId={authUser?._id}
                    />
                </div>
            </div>

            {authUser && <RightPanel />}
        </div>
    </>
);
};
export default HomePage;
