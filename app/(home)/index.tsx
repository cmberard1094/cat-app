import {
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import UserContext from "../contexts/user-context";
import { useContext, useEffect, useState } from "react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { getMyCats } from "@/app/services/cats";
import { vote } from "@/app/services/votes";
import { Cat } from "../types/cats";
import { globalStyles, PRIMARY_COLOR } from "../styles/global.styles";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { Image, Text } from "@rneui/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { favorite, unfavorite } from "../services/favorite";

const LIMIT = 20;
const COLUMNS = 2;
export default function MyCats() {
  const { width } = Dimensions.get("screen");
  const imageSize = width / COLUMNS;
  const { userDetails } = useContext(UserContext);
  const [cats, setCats] = useState<Cat[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { uploadedCat } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    _getMyCats();
  }, []);

  useEffect(() => {
    if (!uploadedCat) {
      return;
    }
    try {
      const jsonParams = JSON.parse(uploadedCat as string);
      setCats((cats) => [jsonParams, ...cats]);
    } catch (err) {
      Alert.alert("An unexpected error occurred");
    }
  }, [uploadedCat]);

  const _getMyCats = async (pageOverride?: number) => {
    if (!userDetails?.sessionActive) {
      return;
    }
    try {
      setLoading(true);
      const result = await getMyCats(
        userDetails?.userName,
        pageOverride ? pageOverride : page,
        LIMIT
      );
      setCats((cats) => [...cats, ...result]);
      setPage(pageOverride ? pageOverride + 1 : page + 1);
    } catch (err) {
      Alert.alert("An Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const _vote = async (imageId: string, value: number) => {
    if (!userDetails?.sessionActive) {
      return;
    }
    try {
      const result = await vote(userDetails?.userName, imageId, value);
      const votedCat = cats.map((cat) => {
        if (cat.id === imageId) {
          return {
            ...cat,
            vote: {
              value,
              id: result.id,
            },
          } as Cat;
        }
        return cat;
      });
      setCats(votedCat);
    } catch (err) {
      Alert.alert("An Unexpected error occurred");
    }
  };

  const _favorite = async (imageId: string) => {
    if (!userDetails?.sessionActive) {
      return;
    }
    try {
      const result = await favorite(userDetails?.userName, imageId);
      const favortedCat = cats.map((cat) => {
        if (cat.id === imageId) {
          return {
            ...cat,
            favourite: {
              id: result.id,
            },
          } as Cat;
        }
        return cat;
      });
      setCats(favortedCat);
    } catch (err) {
      Alert.alert("An Unexpected error occurred");
    }
  };

  const _unfavorite = async (imageId: string, favouriteId: number) => {
    if (!userDetails?.sessionActive) {
      return;
    }
    try {
      setLoading(true);
      await unfavorite(favouriteId);
      const favortedCat = cats.map((cat) => {
        if (cat.id === imageId) {
          return {
            ...cat,
            favourite: {},
          } as Cat;
        }
        return cat;
      });
      setCats(favortedCat);
    } catch (err) {
      Alert.alert("An Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReload = (yOffset: number) => {
    if (yOffset > 0) {
      return;
    }
    _getMyCats(0);
  };

  if (!userDetails?.sessionActive) {
    return <Redirect href={"/(login)/sign-in"} />;
  }

  if (loading && cats?.length === 0) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Text h2 style={styles.bacicText}>
          Loading...
        </Text>
        <ActivityIndicator size={"large"} />
      </SafeAreaView>
    );
  }
  if (cats?.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={globalStyles.container}
        onScrollEndDrag={(e) => {
          handleReload(e.nativeEvent.contentOffset.y);
        }}
      >
        <SafeAreaView>
          <Text style={styles.bacicText} h3>
            No Cats Found!
          </Text>
          <TouchableOpacity onPress={() => router.push("/(home)/upload-cats")}>
            <Text style={[styles.bacicText, styles.textUnderline]}>
              Upload some cats to get started
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    );
  }

  const renderItem: FlashListProps<Cat>["renderItem"] = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemContainerBorder}>
          <TouchableOpacity
            onPress={() =>
              item?.favourite?.id
                ? _unfavorite(item.id, item.favourite.id)
                : _favorite(item.id)
            }
            style={styles.favoriteButton}
          >
            <MaterialCommunityIcons
              name={(item?.favourite?.id || 0) > 0 ? "heart" : "heart-outline"}
              size={30}
              color={PRIMARY_COLOR}
            />
          </TouchableOpacity>
          <Image
            source={{ uri: item?.url }}
            style={{
              width: imageSize - 8,
              height: imageSize,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderColor: "white",
            }}
          />
          <View style={styles.voteContainer}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => _vote(item?.id, 1)}
            >
              <MaterialCommunityIcons
                name={
                  (item?.vote?.value || 0) > 0 ? "thumb-up" : "thumb-up-outline"
                }
                size={30}
                color={PRIMARY_COLOR}
              />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ alignSelf: "center" }}>
                {item?.vote?.value ? item.vote.value : 0}
              </Text>
            </View>
            <TouchableOpacity
              style={{ flex: 1, alignItems: "flex-end" }}
              onPress={() => _vote(item?.id, -1)}
            >
              <MaterialCommunityIcons
                name={
                  (item?.vote?.value || 0) < 0
                    ? "thumb-down"
                    : "thumb-down-outline"
                }
                size={30}
                color={PRIMARY_COLOR}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={[styles.container]}>
      <FlashList
        data={cats}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        numColumns={COLUMNS}
        renderItem={renderItem}
        estimatedItemSize={200}
        onEndReached={() => {
          _getMyCats();
        }}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  itemContainer: {
    flexDirection: "column",
    display: "flex",
    zIndex: 9,
    overflow: "hidden",
    padding: 4,
  },
  itemContainerBorder: {
    flexDirection: "column",
    display: "flex",
    borderRadius: 10,
    borderWidth: 0,
    overflow: "hidden",
  },
  favoriteButton: { position: "absolute", zIndex: 10, top: 10, left: 10 },
  voteContainer: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "white",
  },
  bacicText: { textAlign: "center", marginBottom: 20 },
  textUnderline: { textDecorationLine: "underline" },
});
