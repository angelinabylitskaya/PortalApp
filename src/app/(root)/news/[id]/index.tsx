import { useEffect, useState } from "react";
import { TouchableOpacity, ScrollView, View } from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

import { arrayRemove, arrayUnion } from "firebase/firestore";

import LoadingView from "@/components/LoadingView";
import NewsCard from "@/components/NewsCard";
import { useAuthContext } from "@/contexts/AuthContext";

import { useNewsQuery, useUpdateNewsQuery } from "@/queries/news-query";

import colors from "@/constants/colors";

export default function NewsPage() {
  const { id } = useLocalSearchParams();
  const { data: news, isLoading } = useNewsQuery(id as string);
  const navigation = useNavigation("../../..");
  const { user, isAdmin } = useAuthContext();
  const userId = user!.uid;
  const newsMutation = useUpdateNewsQuery(id as string);
  const router = useRouter();
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
      headerRight: () =>
        news?.id && (
          <View className="flex-row">
            <TouchableOpacity className="pr-2" onPress={toggleLike}>
              <MaterialCommunityIcons
                name={isLiked ? "cards-heart" : "cards-heart-outline"}
                size={24}
                color={colors.secondary["300"]}
              />
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                className="pr-2"
                onPress={() => router.navigate(`/(root)/news/${news!.id}/edit`)}
              >
                <MaterialIcons
                  name="edit"
                  size={24}
                  color={colors.secondary["300"]}
                />
              </TouchableOpacity>
            )}
          </View>
        ),
    });
  }, [navigation, isLiked, news?.id]);

  if (isLoading || !news?.id) {
    return <LoadingView />;
  }

  return (
    <ScrollView className="flex-1 bg-brand-200">
      <NewsCard full news={news!} />
    </ScrollView>
  );
}
