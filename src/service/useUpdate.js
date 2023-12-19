import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "./api"; // Assuming the axios instance is in a separate file

export function useUpdate(endpoint, Key) {
  const queryClient = useQueryClient();
  const configHeader = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("access_token")} `,
    },
  };

  return useMutation({
    // eslint-disable-next-line consistent-return
    mutationFn: async (newUserInfo) => {
      try {
        const response = await api.put(
          `${endpoint}`,
          newUserInfo,
          configHeader
        );
        if (response.status === 200) {
          toast.success(`Successfully Done!`, {
            position: toast.POSITION.TOP_CENTER,
          });
        }

        return response.data;
      } catch (error) {
      

        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    },
    onMutate: async () => {
      await queryClient.prefetchQuery({ Key });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: Key }),
    
  });
}
