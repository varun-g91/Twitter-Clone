import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const response = await axios.post(`/api/users/follow/${userId}`);

                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.data.error || "Something went wrong!");
                } 

                return;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
            ]);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { follow, isPending };
};

export default useFollow;
