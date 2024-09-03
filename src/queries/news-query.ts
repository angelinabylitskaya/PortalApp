import { DocumentData } from "firebase/firestore";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllNews, updateNews } from "@/services/news-service";

import { News } from "@/models";

import { QueryKeys } from "./keys";

export const useAllNewsQuery = () =>
  useQuery({
    queryKey: [QueryKeys.News],
    queryFn: getAllNews,
  });

export const useNewsQuery = (newsId: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [QueryKeys.News, { id: newsId }],
    queryFn: () => {
      const news = queryClient.getQueryData<News[]>([QueryKeys.News]) || [];
      return news.find(({ id }) => id === newsId);
    },
    enabled: !!queryClient.getQueryData([QueryKeys.News]),
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
