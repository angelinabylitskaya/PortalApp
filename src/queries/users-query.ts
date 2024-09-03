import { DocumentData } from "firebase/firestore";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getUser, createUser } from "@/services/users-service";

import { UserInfo } from "@/models";

import { QueryKeys } from "./keys";

export const useUserQuery = (userId: string | undefined) =>
  useQuery({
    queryKey: [QueryKeys.Users, { userId }],
    queryFn: async () => userId && getUser(userId),
  });

export const useCreateUserQuery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, ...data }: DocumentData) =>
      await createUser(uid, data),
    onSuccess: (user: UserInfo) => {
      queryClient.setQueryData([QueryKeys.Users, { userId: user.uid }], user);
    },
  });
};
