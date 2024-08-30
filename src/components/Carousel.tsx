import React from "react";
import { Dimensions, TouchableWithoutFeedback, View } from "react-native";
import RNRC from "react-native-reanimated-carousel";

import Text from "./Text";

const width = Dimensions.get("window").width;
const maxDotsCount = 5;

export type CarouselRenderItem = <T>(info: {
  item: T;
  index: number;
}) => React.ReactElement;

type CarouselProps<T> = {
  data: T[];
  renderItem: CarouselRenderItem;
};

export default function Carousel<T>({ data, renderItem }: CarouselProps<T>) {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const slidesCount = data.length;
  const maxDots = slidesCount > maxDotsCount ? maxDotsCount : slidesCount;

  return (
    <TouchableWithoutFeedback>
      <View className="flex flex-column items-center relative">
        <RNRC
          loop
          pagingEnabled
          width={width}
          height={width * 0.6}
          data={data}
          scrollAnimationDuration={300}
          onSnapToItem={setActiveIndex}
          renderItem={renderItem}
        />
        <View className="rounded absolute bg-brand-700/50 px-1 py-0.5 right-2 top-2">
          <Text helperTextMedium className="text-brand-200">
            {activeIndex + 1}/{slidesCount}
          </Text>
        </View>
        <View className="flex flex-row gap-1 items-center p-2">
          {Array.from(new Array(maxDots)).map((_, index) => {
            const activeDotIndex =
              activeIndex > 1
                ? activeIndex < slidesCount - 2
                  ? 2
                  : maxDots - slidesCount + activeIndex
                : activeIndex;
            const isSmall =
              slidesCount > maxDotsCount &&
              ((index === 0 && activeIndex > 1) ||
                (index === maxDots - 1 && activeDotIndex < maxDots - 2));
            return (
              <View
                key={index}
                className={`${isSmall ? "h-1 w-1" : "h-1.5 w-1.5"} rounded ${
                  activeDotIndex === index ? "bg-brand-100" : "bg-secondary-300"
                }`}
              ></View>
            );
          })}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
