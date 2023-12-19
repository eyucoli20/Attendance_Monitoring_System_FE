// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from "react-toastify";

// eslint-disable-next-line import/no-extraneous-dependencies, perfectionist/sort-imports
import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "./api";

export function usePost(endpoint) {
  const queryClient = useQueryClient();

  const configHeader = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")} `,
    },
  };

  return useMutation({
    // eslint-disable-next-line consistent-return
    mutationFn: async (credentials) => {
      try {
        const response = await api.post(
          `${endpoint}`,
          credentials,
          configHeader
        );

        if (response.status === 200) {
          toast.success(`Successfull!`, {
            position: toast.POSITION.TOP_CENTER,
          });
          return response.data;
        }
       
        if (response.status === 201) {
          toast.success(`Successfull Added!`, {
            position: toast.POSITION.TOP_CENTER,
          });
          return response.data;
        } 
        
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid credentials");
        } else {
          throw new Error(`Server Error: ${response.status}`);
        }
        
      } catch (error) {
      
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("userData"); // Optionally, refetch user data
    },
  });
}