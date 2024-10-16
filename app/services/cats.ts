import { Cat } from "@/app/types/cats";
import Axios from "./axios";
import { Platform } from "react-native";

export const uploadCat = async ({
  userId,
  file,
}: {
  userId: string;
  file: string;
}): Promise<Cat> => {
  var bodyFormData = new FormData();
  //@ts-ignore
  bodyFormData.append("file", {
    uri: Platform.OS === "android" ? file : file.replace("file://", ""),
    name: file.split("/").pop(),
    type: "image/jpg",
  });
  bodyFormData.append("sub_id", userId);
  return Axios.post("/images/upload", bodyFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => {
    return res.data;
  });
};

export const getMyCats = (
  userId: string,
  page: number,
  limit: number
): Promise<Cat[]> => {
  return Axios.get(
    `/images/?sub_id=${userId}&page=${page}&limit=${limit}&order=DESC`
  ).then((res) => {
    return res.data;
  });
};
