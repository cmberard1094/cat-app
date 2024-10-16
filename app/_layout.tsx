import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { ThemeProvider, createTheme } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDetails, UserDetailsDefault } from "./types/user";
import { UserProvider } from "./contexts/user-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loginDetails, setLoginDetails] = useState<UserDetails | undefined>();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const theme = createTheme({
    lightColors: {
      primary: "#1e2749",
    },
    darkColors: {
      primary: "#000",
    },
    mode: "light",
  });

  useEffect(() => {
    if (loaded && loginDetails) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loginDetails]);

  useEffect(() => {
    const checkUserDetails = async () => {
      try {
        // await AsyncStorage.removeItem("sign-in-details");
        const userDetailsStr = await AsyncStorage.getItem("sign-in-details");
        if (!userDetailsStr) {
          setLoginDetails(UserDetailsDefault);
          return;
        }
        const userDetails = JSON.parse(userDetailsStr);
        setLoginDetails(userDetails as UserDetails);
      } catch (err) {}
    };
    checkUserDetails();
  }, []);

  if (!loaded && !loginDetails) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <UserProvider initialUserDetails={loginDetails}>
        <Stack>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen name="(login)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </UserProvider>
    </ThemeProvider>
  );
}
