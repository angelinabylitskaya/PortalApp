import { Pressable, ScrollView } from "react-native";

import NewsCard from "@/components/NewsCard";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { News, NewsType } from "@/models/news";

const mockNews: News = {
  id: "1",
  title: "BA SUMMER CAMP 2024",
  description: `Dear Colleagues,
Following the success of the previous camps in 2022 and 2023, and in response to your requests, we are delighted to announce the Business Analysis Summer Camp 2024! We are excited to offer another opportunity this summer to enhance your knowledge and skills in business analysis and requirements engineering through practical exercises and interactive workshops.
This camp is an opportunity to connect with fellow professionals, exchange ideas, and learn in a supportive environment. We look forward to your participation in the Business Analysis Summer Camp 2024!
If you're interested in joining the camp, please reach out to Olga Orlenok.`,
  images: ["", "", "", "", "", "", "", "", "", ""],
  dateCreated: Date.now(),
  creatorName: "Oksana Borisenko",
  creatorId: "0",
  likes: 2,
  isLiked: false,
  type: NewsType.EventCoverage,
};

export default function NewsPage() {
  const [liked, setLiked] = useState<boolean>(false);
  const navigation = useNavigation();

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

  return (
    <ScrollView className="flex-1 bg-brand-200">
      <NewsCard full news={mockNews} />
    </ScrollView>
  );
}
