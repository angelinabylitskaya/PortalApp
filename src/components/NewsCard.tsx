import { dateToLongString } from "@/utils/date";

import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PressableProps,
  Pressable,
  Dimensions,
  Image,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { News } from "@/models/news";

import newsImage from "@/assets/images/icon.png";

import Carousel from "./Carousel";
import Text from "./Text";

const maxLinesCount = 3;
const width = Dimensions.get("window").width;

type NewsCardProps = { news: News; full?: boolean } & PressableProps;

export default function NewsCard({ news, full, onPress }: NewsCardProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View className="bg-brand-200 pt-6 pb-4">
          <View className="pb-4 px-4">
            <Text
              h5Medium
              className={`pb-2 ${!!onPress && pressed ? "text-brand-100" : ""}`}
            >
              {news.title}
            </Text>
            <View className="flex-row items-center">
              <Text helperText className="text-secondary-400">
                Written by{" "}
              </Text>
              <TouchableWithoutFeedback>
                <TouchableOpacity className="grow">
                  <Text
                    helperText
                    className="text-secondary-400 underline h-[14px]"
                  >
                    {news.creatorName}
                  </Text>
                </TouchableOpacity>
              </TouchableWithoutFeedback>
            </View>
            <Text helperText className="text-secondary-400">
              {dateToLongString(news.dateCreated)}
            </Text>
          </View>
          <View>
            {news.images.length > 1 ? (
              <Carousel
                data={news.images}
                renderItem={() => (
                  <Image
                    source={newsImage}
                    className="w-full"
                    style={{ height: width * 0.6 }}
                  />
                )}
              />
            ) : (
              <Image
                source={newsImage}
                className="w-full"
                style={{ height: width * 0.6 }}
              />
            )}
          </View>
          <View className="px-4 py-2">
            <Text
              body2
              {...(full
                ? {}
                : { numberOfLines: maxLinesCount, ellipsizeMode: "tail" })}
              className="pb-2"
            >
              {news.description}
            </Text>
            {!full && (
              <TouchableWithoutFeedback>
                <TouchableOpacity className="flex flex-row gap-1 items-center">
                  <Text subtitle1 className="text-secondary-300">
                    {news.likes}
                  </Text>
                  <MaterialCommunityIcons
                    name="cards-heart"
                    size={24}
                    color={
                      news.isLiked
                        ? colors.brand["100"]
                        : colors.secondary["300"]
                    }
                  />
                </TouchableOpacity>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}
