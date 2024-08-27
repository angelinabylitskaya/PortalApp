import { FlatList, View } from "react-native";

import NewsCard from "@/components/NewsCard";
import { News } from "@/types/news";
import { useRouter } from "expo-router";

const mockNews: News[] = [
  {
    id: "2",
    title: "SUMMER PARRTY FOLLOW-UP",
    description:
      "We are excited to share photos from our incredible HiQo summer parties! We look forward to the upcoming celebrations! HiQo Summer Party 2024",
    images: ["", "", "", "", "", "", "", "", "", "", "", "", ""],
    dateCreated: Date.now(),
    creatorName: "Oksana Borisenko",
    likes: 3,
    isLiked: true,
  },
  {
    id: "1",
    title: "BA SUMMER CAMP 2024",
    description: `Dear Colleagues,
Following the success of the previous camps in 2022 and 2023, and in response to your requests, we are delighted to announce the Business Analysis Summer Camp 2024! We are excited to offer another opportunity this summer to enhance your knowledge and skills in business analysis and requirements engineering through practical exercises and interactive workshops.
This camp is an opportunity to connect with fellow professionals, exchange ideas, and learn in a supportive environment. We look forward to your participation in the Business Analysis Summer Camp 2024!
If you're interested in joining the camp, please reach out to Olga Orlenok.`,
    images: [""],
    dateCreated: Date.now(),
    creatorName: "Oksana Borisenko",
    likes: 2,
    isLiked: false,
  },
];

export default function NewsList() {
  const router = useRouter();
  return (
    <FlatList
      data={mockNews}
      renderItem={({ item, index }) => (
        <View className={index ? "border-t-8 border-secondary-50" : ""}>
          <NewsCard
            news={item}
            onPress={() => router.navigate(`/(root)/news/${item.id}`)}
          />
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{}}
      ListEmptyComponent={() => <></>}
      ListHeaderComponent={<></>}
    />
  );
}
