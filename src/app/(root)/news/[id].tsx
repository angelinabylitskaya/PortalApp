import { useNewsQuery, useUpdateNewsQuery } from "@/queries/news-query";

import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, ScrollView } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { arrayRemove, arrayUnion } from "firebase/firestore";

import LoadingView from "@/components/LoadingView";
import NewsCard from "@/components/NewsCard";
import { useAuthContext } from "@/contexts/AuthContext";

import colors from "@/constants/colors";

export default function NewsPage() {
  const { id } = useLocalSearchParams();
  const { data: news, isLoading } = useNewsQuery(id as string);
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const userId = user!.uid;
  const newsMutation = useUpdateNewsQuery(id as string);

  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    setIsLiked(!!news?.likes?.includes(userId));
  }, [news?.likes]);

  const toggleLike = () => {
    setIsLiked(!isLiked);

    const dbValue = isLiked ? arrayRemove(userId) : arrayUnion(userId);
    newsMutation.mutate({
      likes: dbValue,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity className="pr-2" onPress={toggleLike}>
          <MaterialCommunityIcons
            name={isLiked ? "cards-heart" : "cards-heart-outline"}
            size={24}
            color={colors.secondary["300"]}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isLiked]);

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <ScrollView className="flex-1 bg-brand-200">
      <NewsCard full news={news!} />
    </ScrollView>
  );
}
