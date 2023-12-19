import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      
    },
    // client side optimistic update
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
   
  });
}