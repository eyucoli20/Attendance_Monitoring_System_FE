// useGet.js
// import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import api from "./api";

export function useGet(endpoint) {
  return useQuery({
    queryKey: [endpoint],
    // eslint-disable-next-line consistent-return
    queryFn: async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")} `,
          },
        };

        const response = await api.get(`${endpoint}`, config);

        if (response.status === 200) {
          return response.data;
        } if (response.status === 401) {
          throw new Error("Unauthorized: Invalid credentials");
        } else {
          throw new Error(`Server Error: ${response.status}`);
        }
      } catch (error) {
        console.log(error)
        // toast.error(error.message, {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
      }
    },
    refetchOnWindowFocus: false,
  });
}