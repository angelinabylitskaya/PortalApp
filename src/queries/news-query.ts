import { DocumentData } from "firebase/firestore";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createNews,
  getAllNews,
  getNews,
  updateNews,
} from "@/services/news-service";

import { QueryKeys } from "./keys";

export const useAllNewsQuery = () =>
  useQuery({
    queryKey: [QueryKeys.News],
    queryFn: getAllNews,
  });

export const useNewsQuery = (newsId: string) => {
  return useQuery({
    queryKey: [QueryKeys.News, { id: newsId }],
    queryFn: () => getNews(newsId),
  });
};

export const useUpdateNewsQuery = (newsId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (update: DocumentData) => updateNews(newsId, update),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.News],
      });
    },
  });
};

export const useCreateNewsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DocumentData) => createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.News],
      });
    },
  });
};
