import { useLocalSearchParams } from "expo-router";

import LoadingView from "@/components/LoadingView";
import NewsEditor from "@/components/NewsEditor";

import { useNewsQuery } from "@/queries/news-query";

export default function EditNews() {
  const { id } = useLocalSearchParams();
  const { data: news, isLoading } = useNewsQuery(id as string);

  if (isLoading) {
    return <LoadingView />;
  }

  return <NewsEditor news={news} />;
}
