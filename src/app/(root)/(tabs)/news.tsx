import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Button from "@/components/Button";
import { useHeaderContext } from "@/components/NavigationHeader";
import NewsCard from "@/components/NewsCard";
import Text from "@/components/Text";
import { useAuthContext } from "@/contexts/AuthContext";

import { useAllNewsQuery } from "@/queries/news-query";
import { filterNews } from "@/utils/news-utils";

import colors from "@/constants/colors";
import { headerHeight, tabsHeight } from "@/constants/sizes";
import { News, NewsType } from "@/models/news";

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
  const [filterKey, setFilterKey] = useState<NewsType>(NewsType.All);
  const { search, closeSearch } = useHeaderContext();
  const { isAdmin } = useAuthContext();

  const newsRef = useRef<FlatList>(null);
  const tabsRef = useRef<FlatList>(null);
  const { top } = useSafeAreaInsets();
  const height = Dimensions.get("screen").height;
  const listHeight = height - headerHeight - tabsHeight - top;

  const { data, isPending, refetch, isRefetching } = useAllNewsQuery();
  const news = filterNews(data || [], filterKey, search);

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

      {isPending ? (
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
          data={news}
          renderItem={renderItem}
          keyExtractor={({ id }) => id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={5}
          refreshing={isRefetching}
          onRefresh={refetch}
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
                {search.trim().length ? "RESULTS NOT FOUND" : "No News"}
              </Text>
            </View>
          )}
          ListHeaderComponent={() =>
            isAdmin && (
              <View className="items-end">
                <Button
                  secondary
                  title="Add News"
                  Prefix={(props) => <MaterialIcons name="add" {...props} />}
                  onPress={() => router.navigate("/(root)/add-news")}
                />
              </View>
            )
          }
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
