import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { PRIMARY_COLOR } from "../styles/global.styles";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Cats",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/cat-logo.png")}
              onError={(e) => console.log(e)}
              style={{ height: 40, width: 40 }}
              resizeMode="contain"
            />
          ),
          tabBarLabel(props) {
            return null;
          },
        }}
      />
      <Tabs.Screen
        options={{
          title: "Upload",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              color={PRIMARY_COLOR}
              size={40}
              name="plus"
            />
          ),
          tabBarLabel(props) {
            return null;
          },
        }}
        name="upload-cats"
      />
    </Tabs>
  );
}
