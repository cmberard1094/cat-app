import React, { useContext, useState } from "react";
import {
  View,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Button, Text, Overlay } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { uploadCat } from "@/app/services/cats";
import UserContext from "../contexts/user-context";
import { useRouter } from "expo-router";
import { AxiosError } from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../styles/global.styles";

export default function UploadScreen() {
  const imageSize = Dimensions.get("screen").width - 40;
  const { userDetails } = useContext(UserContext);
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (result?.assets?.length) {
        setImageUri(result.assets[0]?.uri);
      }
    } catch (err) {
      Alert.alert("An unexepected error occurred");
    }
  };

  const saveImage = async () => {
    if (!userDetails?.userName || !imageUri) {
      return;
    }
    try {
      setLoading(true);
      const result = await uploadCat({
        userId: userDetails?.userName,
        file: imageUri,
      });
      setImageUri(undefined);
      router.navigate({
        pathname: "/(home)",
        params: { uploadedCat: JSON.stringify(result) },
      });
    } catch (err: any | AxiosError) {
      if (err?.response?.data) {
        Alert.alert(err?.response?.data);
        return;
      }
      Alert.alert("An unexpected error occurred. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    setImageUri(undefined);
  };

  if (imageUri) {
    return (
      <>
        <Overlay isVisible={loading} overlayStyle={styles.overlay}>
          <ActivityIndicator size={"large"} />
        </Overlay>
        <SafeAreaView style={[styles.container, globalStyles.container]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: imageSize,
                height: imageSize,
                marginTop: 20,
              }}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.saveContainer}>
              <Button title="Save" onPress={saveImage} />
            </View>
            <View style={styles.cancelContainer}>
              <Button title="Cancel" onPress={cancel} color="secondary" />
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
  return (
    <SafeAreaView style={[styles.container, globalStyles.container]}>
      <View style={styles.noImageContainer}>
        <Text h2 style={styles.noImageText}>
          No image selected
        </Text>
      </View>
      <View style={styles.pickImageContainer}>
        <Button title="Pick an image" onPress={pickImage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,.4)",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  imageContainer: { flex: 1, justifyContent: "center", paddingTop: 10 },
  buttonsContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "space-between",
    flex: 1,
    width: "100%",
  },
  saveContainer: { flex: 0.5, justifyContent: "center", paddingRight: 5 },
  cancelContainer: { flex: 0.5, justifyContent: "center", paddingLeft: 5 },
  noImageContainer: { flex: 1, justifyContent: "flex-end" },
  noImageText: { marginVertical: 20 },
  pickImageContainer: { flex: 1, justifyContent: "center", paddingTop: 10 },
});
