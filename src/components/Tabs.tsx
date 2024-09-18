import { useRef, useState } from "react";
import { FlatList, ListRenderItem, View, Pressable } from "react-native";

import Text from "@/components/Text";

import { tabsHeight } from "@/constants/sizes";

type TabsProps<T> = {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderTabItemLabel: (item: T, index: number) => string;
  onTabChange?: (item: T, index: number) => void;
};

export default function Tabs<T>({
  data,
  keyExtractor,
  renderTabItemLabel,
  onTabChange,
}: TabsProps<T>) {
  const tabsRef = useRef<FlatList>(null);
  const [tabIndex, setTabIndex] = useState(0);

  const renderTabItem: ListRenderItem<T> = ({ item, index }) => (
    <Pressable
      className="px-4 items-center justify-center relative"
      onPress={() => {
        setTabIndex(index);
        onTabChange?.(item, index);
      }}
    >
      <Text
        className={`${index === tabIndex ? "text-brand-100" : ""}`}
        subtitle2
      >
        {renderTabItemLabel(item, index)}
      </Text>
      {index === tabIndex && (
        <View className="h-[3px] bg-brand-100 absolute bottom-0 left-4 right-4"></View>
      )}
    </Pressable>
  );

  return (
    <FlatList
      horizontal
      ref={tabsRef}
      extraData={tabIndex}
      data={data}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      renderItem={renderTabItem}
      contentContainerStyle={{
        height: tabsHeight,
      }}
    />
  );
}
