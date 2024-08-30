import React, { useEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";

import LoadingView from "@/components/LoadingView";
import NewsCard from "@/components/NewsCard";

import { getNews } from "@/services/news-service";

import colors from "@/constants/colors";
import { News, NewsType } from "@/models/news";

export default function NewsPage() {
  const [news, setNews] = useState<News | undefined>(undefined);
  const [liked, setLiked] = useState<boolean>(false);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    getNews(id as string).then((news) => {
      setNews(news!);
    });
  }, [id]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable className="pr-2" onPress={() => setLiked(!liked)}>
          <MaterialCommunityIcons
            name={liked ? "cards-heart" : "cards-heart-outline"}
            size={24}
            color={colors.secondary["300"]}
          />
        </Pressable>
      ),
    });
  }, [navigation, liked]);

  if (!news) {
    return <LoadingView />;
  }

  return (
    <ScrollView className="flex-1 bg-brand-200">
      <NewsCard full news={news} />
    </ScrollView>
  );
}
