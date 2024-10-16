import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, Input, Button } from "@rneui/themed";
import { useContext, useState } from "react";
import { UserDetailsDefault } from "../types/user";
import UserContext from "../contexts/user-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../styles/global.styles";
import { useRouter } from "expo-router";

/*
Notes:
    With extra time this would include:
    - forgot password
    - use a proper sign in api which would pass the username/email and password and receive a jwt back to manager user session
    - all placeholders would be injected from a config to easily handle multi-language

*/
export default function SignInScreen() {
  const router = useRouter();
  const [signInError, setSignInError] = useState<undefined | string>(undefined);
  const [loginDetails, setLoginDetails] = useState(UserDetailsDefault);
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const handleTextChange = (field: string, value: string) => {
    setLoginDetails({ ...loginDetails, [field]: value });
  };
  const submitLogin = () => {
    if (
      userDetails?.userName === loginDetails?.userName &&
      userDetails?.password === loginDetails?.password
    ) {
      const activeUserDetails = { ...loginDetails, sessionActive: true };
      updateUserDetails(activeUserDetails);

      return;
    }
    setSignInError("Username not found please try again!");
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text h4 style={styles.text}>
        Welcome Back!
      </Text>
      <Image
        source={require("../../assets/images/cat-logo.png")}
        onError={(e) => console.log(e)}
        style={styles.logo}
        resizeMode="contain"
      />
      <Input
        placeholder="User Name"
        onChangeText={(text) => handleTextChange("userName", text)}
        onBlur={() => setSignInError(undefined)}
      />
      <Input
        placeholder="Password"
        onChangeText={(text) => handleTextChange("password", text)}
        onBlur={() => setSignInError(undefined)}
        errorMessage={signInError ? signInError : undefined}
        secureTextEntry
      />

      <Button title="Submit" onPress={submitLogin} />
      <TouchableOpacity onPress={() => router.replace("/(login)/sign-up")}>
        <Text style={[styles.text, styles.signUpText]}>
          {`Don't have an account yet?`}{" "}
          <Text style={styles.underline}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 200,
    alignSelf: "center",
    marginVertical: 20,
  },
  text: {
    textAlign: "center",
  },
  underline: { textDecorationLine: "underline" },
  signUpText: {
    marginTop: 20,
  },
});
