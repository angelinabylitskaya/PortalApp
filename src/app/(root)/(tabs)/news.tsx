import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useHeaderContext } from "@/components/NavigationHeader";
import NewsCard from "@/components/NewsCard";
import Text from "@/components/Text";

import colors from "@/constants/colors";
import { headerHeight, tabsHeight } from "@/constants/sizes";
import { News, NewsType } from "@/models/news";

const height = Dimensions.get("screen").height;

const mockNews: News[] = [
  {
    id: "0",
    title: "SUMMER PARRTY FOLLOW-UP (CL)",
    description:
      "We are excited to share photos from our incredible HiQo summer parties! We look forward to the upcoming celebrations! HiQo Summer Party 2024",
    images: ["", "", "", "", "", "", "", "", "", "", "", "", ""],
    dateCreated: Date.now(),
    creatorName: "Oksana Borisenko",
    creatorId: "0",
    likes: 3,
    isLiked: true,
    type: NewsType.CompanyLife,
  },
  {
    id: "1",
    title: "BA SUMMER CAMP 2024 (EC)",
    description: `Dear Colleagues,
Following the success of the previous camps in 2022 and 2023, and in response to your requests, we are delighted to announce the Business Analysis Summer Camp 2024! We are excited to offer another opportunity this summer to enhance your knowledge and skills in business analysis and requirements engineering through practical exercises and interactive workshops.
This camp is an opportunity to connect with fellow professionals, exchange ideas, and learn in a supportive environment. We look forward to your participation in the Business Analysis Summer Camp 2024!
If you're interested in joining the camp, please reach out to Olga Orlenok.`,
    images: [""],
    dateCreated: Date.now(),
    creatorName: "Oksana Borisenko",
    creatorId: "0",
    likes: 2,
    isLiked: false,
    type: NewsType.EventCoverage,
  },
  {
    id: "2",
    title: "SAY HELLO TO OUR NEW EMBEDDED TRAINER - WOJCIECH NOWORYTA (NC)",
    description: `Dear colleagues! Wojciech Noworyta has joined HiQo Solutions as an Embedded Trainer! Here is what he has written about himself: My name is Wojciech. I graduated from Technical University of Wroclaw, the Faculty of Electronic. I worked as an academic teacher, dealing mainly with computer architecture and embedded programming. Then I worked in a private company as a hardware and firmware designer. I remain passionate about the intersection of electronics and embedded code. Beyond my professional interests I enjoy some activities like sailing, scuba diving, dancing and skiing.
Please, join us in welcoming!`,
    images: [""],
    dateCreated: Date.now(),
    creatorName: "Oksana Borisenko",
    creatorId: "0",
    likes: 2,
    isLiked: false,
    type: NewsType.Newcomers,
  },
];

const hasSearchString = ({ title, description }: News, search: string) =>
  search
    ? title.toLowerCase().includes(search.toLocaleLowerCase()) ||
      description.toLowerCase().includes(search.toLocaleLowerCase())
    : true;

const getNews = (type: NewsType, search: string) =>
  type === NewsType.All
    ? search
      ? mockNews.filter((news) => hasSearchString(news, search))
      : mockNews
    : mockNews.filter(
        (news) => news.type === type && hasSearchString(news, search),
      );

interface NewsTab {
  name: string;
  key: NewsType;
}

const tabs: NewsTab[] = [
  { name: "All News", key: NewsType.All },
  { name: "Event Coverage", key: NewsType.EventCoverage },
  { name: "Newcomers", key: NewsType.Newcomers },
  { name: "Company's life", key: NewsType.CompanyLife },
];

export default function NewsList() {
  const router = useRouter();
  const [data, setData] = useState<News[]>([]);
  const [filterKey, setFilterKey] = useState<NewsType>(NewsType.All);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { search, closeSearch } = useHeaderContext();
  const newsRef = useRef<FlatList>(null);
  const tabsRef = useRef<FlatList>(null);
  const { top } = useSafeAreaInsets();
  const listHeight = height - headerHeight - tabsHeight - top;

  let timeoutId: ReturnType<typeof setTimeout>;

  useEffect(() => {
    setLoading(true);
    if (!search.trim()) {
      setData(getNews(filterKey, ""));
      setLoading(false);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        setData(getNews(filterKey, search));
        setLoading(false);
      }, 500);
    }
  }, [search, filterKey]);

  const handleTabChange = (item: NewsTab, index: number) => {
    if (item.key === filterKey) return;

    setFilterKey(item.key);
    closeSearch();
    tabsRef.current?.scrollToIndex({ index });
  };

  const renderItem: ListRenderItem<News> = useCallback(
    ({ item }) => (
      <NewsCard
        news={item}
        onPress={() => router.navigate(`/(root)/news/${item.id}`)}
      />
    ),
    [router],
  );

  const renderTabItem: ListRenderItem<NewsTab> = ({ item, index }) => (
    <Pressable
      className="px-4 items-center justify-center relative"
      onPress={() => handleTabChange(item, index)}
    >
      <Text
        className={`${item.key === filterKey ? "text-brand-100" : ""}`}
        subtitle2
      >
        {item.name}
      </Text>
      {item.key === filterKey && (
        <View className="h-[3px] bg-brand-100 absolute bottom-0 left-4 right-4"></View>
      )}
    </Pressable>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View className="flex relative">
      <View className="shrink-0 bg-secondary-50">
        <FlatList
          horizontal
          ref={tabsRef}
          extraData={filterKey}
          data={tabs}
          keyExtractor={({ key }) => key}
          showsHorizontalScrollIndicator={false}
          renderItem={renderTabItem}
          contentContainerStyle={{
            height: tabsHeight,
          }}
        />
      </View>

      {loading ? (
        <View
          className="flex items-center justify-center"
          style={{ height: listHeight }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          ref={newsRef}
          style={{ height: listHeight }}
          data={data}
          renderItem={renderItem}
          keyExtractor={({ id }) => id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{
            paddingBottom: 24,
          }}
          ItemSeparatorComponent={() => (
            <View className="border-2 border-secondary-50"></View>
          )}
          ListEmptyComponent={() => (
            <View
              className="flex min-h-full items-center justify-center"
              style={{ height: listHeight }}
            >
              <Text h3 className="text-secondary-400">
                No News
              </Text>
            </View>
          )}
        />
      )}

      <Pressable
        className="rounded-full p-2 absolute right-4 bottom-4 bg-brand-200 shadow"
        onPress={() => newsRef.current?.scrollToIndex({ index: 0 })}
      >
        <MaterialCommunityIcons
          color={colors.brand["400"]}
          size={24}
          name="arrow-up"
        />
      </Pressable>
    </View>
  );
}
