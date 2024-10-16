import { Image, StyleSheet, TouchableOpacity } from "react-native";
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
    - would expect to collect more fields, better validations
    - use an api to store the users details and expect a jwt session token to continue through the app
    - all placeholders would be injected from a config to easily handle multi-language
*/

interface DefaultErrors {
  userName: string | undefined;
  password: string | undefined;
}

const defaultErrors: DefaultErrors = {
  userName: undefined,
  password: undefined,
};

export default function SignUpScreen() {
  const router = useRouter();
  const [signUpError, setSignUpError] = useState<DefaultErrors>(defaultErrors);
  const [signUpDetails, setSignUpDetails] = useState(UserDetailsDefault);
  const { updateUserDetails } = useContext(UserContext);

  const handleTextChange = (field: string, value: string) => {
    setSignUpDetails({ ...signUpDetails, [field]: value });
  };

  const submitSignUp = async () => {
    let error = { ...defaultErrors };
    if (signUpDetails.userName.length === 0) {
      error.userName = "Username is required";
    }
    if (signUpDetails.password.length === 0) {
      error.password = "Password is required";
    }

    if (error?.password || error?.userName) {
      setSignUpError(error);
      return;
    }
    updateUserDetails({
      userName: signUpDetails.userName,
      password: signUpDetails.password,
      sessionActive: true,
    });
    router.replace("/(home)");
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text h4 style={styles.text}>
        Sign Up!
      </Text>
      <Image
        source={require("../../assets/images/cat-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Input
        placeholder="User Name"
        onChangeText={(text) => handleTextChange("userName", text)}
        onBlur={() => setSignUpError(defaultErrors)}
        errorMessage={signUpError.userName}
      />
      <Input
        placeholder="Password"
        onChangeText={(text) => handleTextChange("password", text)}
        onBlur={() => setSignUpError(defaultErrors)}
        errorMessage={signUpError.password}
        secureTextEntry
      />

      <Button title="Submit" onPress={submitSignUp} />
      <TouchableOpacity onPress={() => router.replace("/(login)/sign-in")}>
        <Text style={[styles.text, styles.signUpText]}>
          {`Already have an account?`}{" "}
          <Text style={styles.underline}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
  },
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
