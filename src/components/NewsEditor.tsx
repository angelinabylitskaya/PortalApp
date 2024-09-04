import { useEffect, useState } from "react";
import { View, Image, FlatList, TouchableWithoutFeedback } from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import LoadingView from "@/components/LoadingView";
import Text from "@/components/Text";

import { useCreateNewsQuery, useUpdateNewsQuery } from "@/queries/news-query";
import { getBlobFromUri } from "@/utils/get-blob-from-uri";

import colors from "@/constants/colors";
import { News } from "@/models";

type NewsEditorProps = {
  news?: News;
};

export default function NewsEditor({ news }: NewsEditorProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const createMutation = useCreateNewsQuery();
  const updateMutation = useUpdateNewsQuery(news?.id || "");

  const router = useRouter();

  const isEdit = !!news?.id;

  useEffect(() => {
    if (!news) return;

    setTitle(news.title);
    setDescription(news.description);
    setImages(news.images);
  }, [news]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImages([...images, ...result.assets.map(({ uri }) => uri)]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const uploadImages = async () => {
    const imagesToUpload = isEdit
      ? images.filter((image) => !news!.images.includes(image))
      : images;
    const storage = getStorage();

    return await Promise.all(
      imagesToUpload.map(async (uri) => {
        const filename = uri.substring(uri.lastIndexOf("/") + 1);
        const fileRef = ref(storage, filename);

        const imageBlob = await getBlobFromUri(uri);
        const { ref: imageRef } = await uploadBytes(fileRef, imageBlob);
        const res = await getDownloadURL(imageRef);
        return res;
      }),
    );
  };

  const removeImage = (uri: string) =>
    setImages(images.filter((image) => image !== uri));

  const createNews = async () => {
    setUploading(true);
    const urls = await uploadImages();

    const changes = {
      title,
      description,
      images: urls,
    };

    const onError = (error: Error) => {
      setError(error.message);
      setUploading(false);
    };

    if (isEdit) {
      updateMutation.mutate(changes, {
        onError,
        onSuccess: router.back,
      });
    } else {
      createMutation.mutate(changes, {
        onError,
        onSuccess: (newsId: string) => {
          router.back();
          router.navigate(`/(root)/news/${newsId}`);
        },
      });
    }
  };

  if (uploading) {
    return <LoadingView />;
  }

  return (
    <View className="flex-1 p-4">
      <InputField
        autoFocus
        value={title}
        placeholder="Title"
        label="Title"
        onChangeText={setTitle}
      />
      <InputField
        multiline
        numberOfLines={5}
        value={description}
        placeholder="Description"
        label="Description"
        onChangeText={setDescription}
      />

      <GestureHandlerRootView className="grow-0">
        <FlatList
          horizontal
          data={["", ...images]}
          stickyHeaderIndices={[0]}
          className="my-4"
          renderItem={({ item, index }) =>
            index ? (
              <TouchableWithoutFeedback>
                <TouchableOpacity
                  onPress={() => removeImage(item)}
                  className="relative"
                >
                  <Image className="w-24 h-24 rounded" source={{ uri: item }} />
                  <Button
                    outline
                    title=""
                    Prefix={() => (
                      <MaterialIcons
                        name="close"
                        size={32}
                        color={colors.brand[100]}
                      />
                    )}
                    className="h-24 w-24 absolute top-0 right-0 left-0 bottom-0 border-brand-100 bg-brand-200/50"
                    onPress={pickImage}
                  />
                </TouchableOpacity>
              </TouchableWithoutFeedback>
            ) : (
              <Button
                outline
                title="Pick images"
                className="h-24 w-24"
                onPress={pickImage}
              />
            )
          }
          contentContainerStyle={{
            gap: 16,
          }}
        />
      </GestureHandlerRootView>

      <View className="grow">
        <Button
          title={`${isEdit ? "Update" : "Create"} News`}
          onPress={createNews}
          disabled={!title.trim() || !description.trim || !images.length}
        />

        {error && (
          <Text helperText className="text-brand-100 mt-4">
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}
